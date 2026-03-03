## 2025-05-15 - Trust Proxy Requirement for Rate Limiting
**Vulnerability:** Incorrect client IP detection in proxied environments (Vercel, load balancers).
**Learning:** Without `app.set("trust proxy", 1)`, Express defaults to the proxy's IP for `req.ip`. This causes IP-based rate limiters to apply limits globally to all users, potentially resulting in a Denial of Service.
**Prevention:** Always configure `trust proxy` in Express when implementing IP-based security measures in deployments known to use reverse proxies.
