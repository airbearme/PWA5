type Bucket = { resetAt: number; count: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key) ?? { resetAt: now + windowMs, count: 0 };
  if (now > b.resetAt) { b.resetAt = now + windowMs; b.count = 0; }
  b.count++;
  buckets.set(key, b);
  return b.count <= limit;
}
