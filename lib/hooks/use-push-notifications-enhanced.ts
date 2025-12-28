/**
 * Enhanced Push Notifications Hook
 * Handles driver availability notifications and ride updates
 */

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient } from "../supabase/client";
import { useToast } from "@/hooks/use-toast";
import errorLogger from "../error-logger";

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
}

export function usePushNotificationsEnhanced() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window,
    isSubscribed: false,
    permission: typeof window !== "undefined" ? Notification.permission : "default",
    subscription: null,
  });

  const { toast } = useToast();

  // Check subscription status
  useEffect(() => {
    if (!state.isSupported) return;

    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        setState((prev) => ({
          ...prev,
          isSubscribed: !!subscription,
          subscription,
          permission: Notification.permission,
        }));
      } catch (error) {
        errorLogger.logError(error as Error, {
          component: "usePushNotificationsEnhanced",
          action: "checkSubscription",
        });
      }
    };

    checkSubscription();
  }, [state.isSupported]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return false;
    }

    if (state.permission === "granted") {
      return true;
    }

    const permission = await Notification.requestPermission();
    setState((prev) => ({ ...prev, permission }));

    if (permission !== "granted") {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications to receive driver availability alerts.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [state.isSupported, state.permission, toast]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      return false;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return false;

    try {
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from environment or use a default
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

      if (!vapidPublicKey) {
        console.warn("VAPID public key not configured");
        return false;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      // Save subscription to database
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("push_subscriptions").upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys,
          preferences: {
            driverAvailability: true,
            rideUpdates: true,
          },
        });

        if (error) throw error;
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
      }));

      toast({
        title: "Notifications Enabled",
        description: "You'll receive alerts when drivers become available!",
      });

      return true;
    } catch (error) {
      errorLogger.logError(error as Error, {
        component: "usePushNotificationsEnhanced",
        action: "subscribe",
      });

      toast({
        title: "Subscription Failed",
        description: "Failed to enable push notifications.",
        variant: "destructive",
      });

      return false;
    }
  }, [state.isSupported, requestPermission, toast]);

  // Unsubscribe
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) return false;

    try {
      await state.subscription.unsubscribe();

      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", state.subscription.endpoint);
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
      }));

      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive push notifications.",
      });

      return true;
    } catch (error) {
      errorLogger.logError(error as Error, {
        component: "usePushNotificationsEnhanced",
        action: "unsubscribe",
      });
      return false;
    }
  }, [state.subscription, toast]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

