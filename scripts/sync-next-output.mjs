import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "site", ".next");
const dest = path.join(root, ".next");

if (!fs.existsSync(src)) {
  console.error("Expected site/.next after build. Run: npm run build -w site");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("Synced site/.next -> .next (for Vercel project root)");
