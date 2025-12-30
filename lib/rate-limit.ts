const buckets = new Map<string,{c:number,t:number}>();
export function rateLimit(k:string,l=60,w=60000){
  const n=Date.now(); const b=buckets.get(k)||{c:0,t:n};
  if(n-b.t>w){b.c=0;b.t=n}
  b.c++; buckets.set(k,b); return b.c<=l;
}
