import fs from "fs";
import path from "path";

const bad = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|css|mjs)$/.test(name)) {
      try {
        fs.readFileSync(p, "utf8");
      } catch (e) {
        bad.push(p);
      }
    }
  }
}
walk("src");
console.log(bad.join("\n"));
