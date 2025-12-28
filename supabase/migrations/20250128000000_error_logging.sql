-- Error Logging System with User Consent
-- This migration creates tables for comprehensive error tracking

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component TEXT,
  route TEXT,
  user_agent TEXT,
  url TEXT,
  line_number INTEGER,
  column_number INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  consent_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Error consent tracking
CREATE TABLE IF NOT EXISTS error_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  consent_version TEXT DEFAULT '1.0',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Error patterns (for auto-resolution)
CREATE TABLE IF NOT EXISTS error_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern TEXT NOT NULL UNIQUE,
  error_type TEXT NOT NULL,
  solution TEXT,
  auto_resolve BOOLEAN DEFAULT FALSE,
  occurrence_count INTEGER DEFAULT 0,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  route TEXT,
  component TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_consent ON error_logs(consent_given);
CREATE INDEX IF NOT EXISTS idx_error_patterns_pattern ON error_patterns(pattern);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);

-- RLS Policies
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own error logs
CREATE POLICY "Users can view their own error logs"
  ON error_logs FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own error logs
CREATE POLICY "Users can insert their own error logs"
  ON error_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can manage their own consent
CREATE POLICY "Users can manage their own consent"
  ON error_consent FOR ALL
  USING (auth.uid() = user_id);

-- Admins can view all error logs
CREATE POLICY "Admins can view all error logs"
  ON error_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Service role can do everything (for API access)
CREATE POLICY "Service role full access"
  ON error_logs FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access consent"
  ON error_consent FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access patterns"
  ON error_patterns FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access metrics"
  ON performance_metrics FOR ALL
  USING (auth.role() = 'service_role');

-- Function to auto-resolve common errors
CREATE OR REPLACE FUNCTION auto_resolve_errors()
RETURNS void AS $$
BEGIN
  UPDATE error_logs
  SET resolved = TRUE, resolved_at = NOW()
  WHERE resolved = FALSE
  AND EXISTS (
    SELECT 1 FROM error_patterns
    WHERE error_patterns.auto_resolve = TRUE
    AND error_logs.error_message LIKE '%' || error_patterns.pattern || '%'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to track error patterns
CREATE OR REPLACE FUNCTION track_error_pattern()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO error_patterns (pattern, error_type, occurrence_count, last_seen)
  VALUES (NEW.error_message, NEW.error_type, 1, NOW())
  ON CONFLICT (pattern) DO UPDATE
  SET occurrence_count = error_patterns.occurrence_count + 1,
      last_seen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track patterns
CREATE TRIGGER track_error_pattern_trigger
  AFTER INSERT ON error_logs
  FOR EACH ROW
  EXECUTE FUNCTION track_error_pattern();

