export const scrub=(s:string)=>s
 .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[email]")
 .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,"[phone]");
