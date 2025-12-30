import crypto from "crypto";
export function verifyStripe(sig:string, body:string, secret:string){
  const h=crypto.createHmac("sha256",secret).update(body).digest("hex");
  return sig.includes(h);
}
