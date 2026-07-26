// Minimal .env loader (no dependency). Reads repo-root .env into a plain object.
// Secrets NEVER get hardcoded or committed — .env is gitignored.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export function loadEnv(root = process.cwd()) {
  const env = { ...process.env };
  const file = path.join(root, ".env");
  if (!existsSync(file)) return env;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (env[key] === undefined) env[key] = val;
  }
  return env;
}
