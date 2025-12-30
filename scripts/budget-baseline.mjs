import fs from "fs";
import path from "path";
const dir = path.join(process.cwd(), ".next", "static", "chunks");
if (!fs.existsSync(dir)) { console.error("missing .next; run build before baselining"); process.exit(1); }
const walk = (d) => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{
  const p=path.join(d,e.name); return e.isDirectory()?walk(p):[p];
});
const files = walk(dir).filter(f=>f.endsWith(".js"));
let total=0;
for (const f of files) total += fs.statSync(f).size;
fs.mkdirSync(".airbear",{recursive:true});
fs.writeFileSync(".airbear/budget-baseline.json", JSON.stringify({created_at:new Date().toISOString(), total_bytes: total}, null, 2));
console.log("wrote .airbear/budget-baseline.json", total);
