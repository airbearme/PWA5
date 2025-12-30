import fs from "fs";
import path from "path";
const basePath = path.join(process.cwd(), ".airbear", "budget-baseline.json");
if (!fs.existsSync(basePath)) { console.error("missing baseline"); process.exit(2); }
const base = JSON.parse(fs.readFileSync(basePath,"utf8"));
const dir = path.join(process.cwd(), ".next", "static", "chunks");
if (!fs.existsSync(dir)) { console.error("missing .next; run build"); process.exit(1); }
const walk = (d) => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{
  const p=path.join(d,e.name); return e.isDirectory()?walk(p):[p];
});
const files = walk(dir).filter(f=>f.endsWith(".js"));
let total=0;
for (const f of files) total += fs.statSync(f).size;
const maxPct = Number(process.env.BUDGET_MAX_GROWTH_PCT || "5");
const max = Math.floor(base.total_bytes * (1 + maxPct/100));
console.log(`baseline=${base.total_bytes} current=${total} max=${max} (+${maxPct}%)`);
if (total > max) process.exit(3);
