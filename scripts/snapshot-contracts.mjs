import fs from "fs";
import path from "path";
fs.mkdirSync("contracts",{recursive:true});
const out = { generated_at: new Date().toISOString(), note: "Populate with OpenAPI/JSON schema snapshots." };
fs.writeFileSync(path.join("contracts","README.json"), JSON.stringify(out,null,2));
console.log("contracts snapshot stub written");
