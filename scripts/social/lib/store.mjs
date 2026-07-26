// The single source of truth: social-queue.json (gitignored local state).
// Every entry is one short; each has per-platform enabled/caption/publishAt/status.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const PLATFORMS = ["youtube", "tiktok", "instagram"];

function queuePath(root = process.cwd()) {
  return path.join(root, "social-queue.json");
}

export function loadQueue(root = process.cwd()) {
  const file = queuePath(root);
  if (!existsSync(file)) return { entries: [] };
  return JSON.parse(readFileSync(file, "utf8"));
}

export function saveQueue(queue, root = process.cwd()) {
  writeFileSync(queuePath(root), JSON.stringify(queue, null, 2) + "\n");
}

export function findEntry(queue, id) {
  return queue.entries.find((e) => e.id === id);
}

export function newEntry(id, file, caption) {
  const platforms = {};
  for (const p of PLATFORMS) {
    platforms[p] = { enabled: true, caption, publishAt: null, status: "pending", remoteId: null, error: null };
  }
  return { id, file, platforms };
}

export { PLATFORMS };
