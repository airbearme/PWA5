import https from "https";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GITHUB_TOKEN || !REPO) {
  console.error("missing env SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY GITHUB_TOKEN GITHUB_REPOSITORY");
  process.exit(1);
}

function req(url, opts={}, body){
  return new Promise((resolve,reject)=>{
    const u=new URL(url);
    const r=https.request({
      method: opts.method||"GET",
      hostname: u.hostname,
      path: u.pathname+u.search,
      headers: opts.headers||{},
    }, res=>{
      let d=""; res.on("data",c=>d+=c);
      res.on("end",()=>resolve({status:res.status, text:d}));
    });
    r.on("error",reject);
    if(body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function supa(table){
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc&limit=25`;
  const r = await req(url, { headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "content-type":"application/json",
  }});
  if(r.status!==200) throw new Error(`supabase ${table} status=${r.status}`);
  return JSON.parse(r.text||"[]");
}

async function issueSearch(hash){
  const url = `https://api.github.com/search/issues?q=repo:${REPO}+label:hash:${hash}`;
  const r = await req(url, { headers:{
    authorization:`Bearer ${GITHUB_TOKEN}`,
    accept:"application/vnd.github+json",
    "user-agent":"airbear-triage-bot"
  }});
  if(r.status!==200) return null;
  const j=JSON.parse(r.text||"{}");
  return (j.items||[])[0]||null;
}

async function createIssue(title, body, hash, labels){
  const url = `https://api.github.com/repos/${REPO}/issues`;
  const r = await req(url, { method:"POST", headers:{
    authorization:`Bearer ${GITHUB_TOKEN}`,
    accept:"application/vnd.github+json",
    "content-type":"application/json",
    "user-agent":"airbear-triage-bot"
  }}, { title, body, labels:[...labels,`hash:${hash}`] });
  if(r.status!==201) throw new Error(`issue create status=${r.status}`);
  return JSON.parse(r.text);
}

(async()=>{
  const errs = await supa("client_error_reports");
  for(const e of errs){
    if(!e.hash) continue;
    const existing = await issueSearch(e.hash);
    if(existing) continue;
    const title = `[client-error] ${String(e.message||"error").slice(0,80)}`;
    const body = [`**url**: ${e.url||""}`,`**severity**: ${e.severity||""}`,`**hash**: ${e.hash}`,``,mdjson(e)].join("\n");
    await createIssue(title, body, e.hash, ["triage","auto","bug"]);
  }

  const sugg = await supa("user_suggestions");
  for(const s of sugg){
    if(!s.hash) continue;
    const existing = await issueSearch(s.hash);
    if(existing) continue;
    const title = `[suggestion] ${String(s.text||"suggestion").slice(0,80)}`;
    const body = [`**page**: ${s.page||""}`,`**hash**: ${s.hash}`,``,mdjson(s)].join("\n");
    await createIssue(title, body, s.hash, ["triage","auto","feature"]);
  }
})();
