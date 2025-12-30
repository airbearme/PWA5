export async function verifyCaptcha(token?:string){
  if(!process.env.CAPTCHA_SECRET) return true; // noop default
  // integrate provider here
  return Boolean(token);
}
