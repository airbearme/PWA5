const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
export function scrubPII(input: unknown) {
  let s: string;
  try { s = typeof input === "string" ? input : JSON.stringify(input); }
  catch { s = String(input); }
  return s.replace(EMAIL, "[email]").replace(PHONE, "[phone]");
}
