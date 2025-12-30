/**
 * Comprehensive Error Logging System with User Consent
 * Automatically logs errors and submits to database with user consent
 */

import { getSupabaseClient } from "./supabase/client";

export interface ErrorLogData {
  error_type: string;
  error_message: string;
  error_stack?: string;
  component?: string;
  route?: string;
  url?: string;
  line_number?: number;
  column_number?: number;
  severity?: "info" | "warning" | "error" | "critical";
  metadata?: Record<string, any>;
}

export interface ConsentState {
  consentGiven: boolean;
  consentVersion: string;
}

class ErrorLogger {
  private consentState: ConsentState | null = null;
  private sessionId: string;
  private initialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadConsentState();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadConsentState() {
    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("error_consent")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data) {
          this.consentState = {
            consentGiven: data.consent_given || false,
            consentVersion: data.consent_version || "1.0",
          };
        }
      }
    } catch (error) {
      console.warn("Failed to load consent state:", error);
    } finally {
      this.initialized = true;
    }
  }

  async requestConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      const consent = window.confirm(
        "AirBear would like to collect error logs to improve the app. " +
          "This helps us fix bugs faster. No personal information is shared. " +
          "Do you consent to error logging?"
      );

      this.setConsent(consent).then(() => resolve(consent));
    });
  }

  async setConsent(consent: boolean): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const consentData = {
        user_id: user?.id || null,
        consent_given: consent,
        consent_date: new Date().toISOString(),
        consent_version: "1.0",
      };

      if (user) {
        const { error } = await supabase.from("error_consent").upsert(
          {
            ...consentData,
            user_id: user.id,
          },
          { onConflict: "user_id" }
        );

        if (error) throw error;
      }

      this.consentState = {
        consentGiven: consent,
        consentVersion: "1.0",
      };

      // Store in localStorage as fallback
      localStorage.setItem(
        "error_logging_consent",
        JSON.stringify(this.consentState)
      );
    } catch (error) {
      console.error("Failed to save consent:", error);
    }
  }

  private async hasConsent(): Promise<boolean> {
    // Check localStorage first (faster)
    const stored = localStorage.getItem("error_logging_consent");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.consentGiven !== undefined) {
          return parsed.consentGiven;
        }
      } catch {
        // Invalid JSON, continue to check database
      }
    }

    // Wait for initialization
    if (!this.initialized) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return this.consentState?.consentGiven || false;
  }

  async logError(error: Error | ErrorLogData, context?: Record<string, any>) {
    try {
      const hasConsent = await this.hasConsent();

      // If no consent, still log locally but don't submit
      if (!hasConsent) {
        console.error("Error (not submitted - no consent):", error);
        return;
      }

      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let errorData: ErrorLogData;

      if (error instanceof Error) {
        errorData = {
          error_type: error.name || "Error",
          error_message: error.message,
          error_stack: error.stack,
          severity: "error",
        };
      } else {
        errorData = error;
      }

      // Extract component and route from stack trace
      if (errorData.error_stack) {
        const stackLines = errorData.error_stack.split("\n");
        const firstLine = stackLines[1] || "";
        const componentMatch = firstLine.match(/at\s+(\w+)/);
        if (componentMatch) {
          errorData.component = componentMatch[1];
        }
      }

      // Get current route
      if (typeof window !== "undefined") {
        errorData.route = window.location.pathname;
        errorData.url = window.location.href;
      }

      // Get user agent
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

      const logEntry = {
        user_id: user?.id || null,
        session_id: this.sessionId,
        ...errorData,
        user_agent: userAgent,
        metadata: {
          ...context,
          ...errorData.metadata,
        },
        consent_given: true,
      };

      const { error: insertError } = await supabase
        .from("error_logs")
        .insert(logEntry);

      if (insertError) {
        console.error("Failed to log error:", insertError);
      }
    } catch (err) {
      // Fail silently to avoid infinite loops
      console.error("Error logger failed:", err);
    }
  }

  async logPerformance(metricName: string, value: number, metadata?: Record<string, any>) {
    try {
      const hasConsent = await this.hasConsent();
      if (!hasConsent) return;

      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("performance_metrics").insert({
        user_id: user?.id || null,
        metric_name: metricName,
        metric_value: value,
        route: typeof window !== "undefined" ? window.location.pathname : null,
        metadata: metadata || {},
      });

      if (error) {
        console.error("Failed to log performance:", error);
      }
    } catch (err) {
      console.error("Performance logger failed:", err);
    }
  }

  // Global error handler
  setupGlobalErrorHandling() {
    if (typeof window === "undefined") return;

    // Unhandled errors
    window.addEventListener("error", (event) => {
      this.logError({
        error_type: "UnhandledError",
        error_message: event.message,
        error_stack: event.error?.stack,
        line_number: event.lineno,
        column_number: event.colno,
        severity: "error",
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError({
        error_type: "UnhandledRejection",
        error_message: event.reason?.message || String(event.reason),
        error_stack: event.reason?.stack,
        severity: "error",
      });
    });

    // React Error Boundary support
    if (typeof window !== "undefined") {
      (window as any).__AIRBEAR_ERROR_LOGGER__ = this;
    }
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// Initialize on client side
if (typeof window !== "undefined") {
  errorLogger.setupGlobalErrorHandling();

  // Request consent on first load
  setTimeout(async () => {
    const stored = localStorage.getItem("error_logging_consent");
    if (!stored) {
      const consent = await errorLogger.requestConsent();
      if (!consent) {
        console.log("Error logging disabled by user");
      }
    }
  }, 2000); // Wait 2 seconds after page load
}

export default errorLogger;




