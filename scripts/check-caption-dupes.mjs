// Flags shorts beat labels that DUPLICATE the caption words shown during the
// same beat (Kris, July 2026: the BeatLabel must never echo the caption pill —
// captions narrate, labels punch). Prop/badge labels and pure-number labels
// are exempt. Run after editing specs.ts:  node scripts/check-caption-dupes.mjs
import { readFileSync } from "node:fs";

const specsSrc = readFileSync("src/shorts/specs.ts", "utf8");
const capSrc = readFileSync("src/shorts/captionsData.ts", "utf8");
const words = JSON.parse(capSrc.match(/CAPTIONS: CaptionWord\[\] = (\[.*\]);/s)[1]);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// crude stem so STRONG matches "strongly", RESET matches "reset,"
const stem = (t) => (t.length > 4 ? t.slice(0, 5) : t);
// grammar words never count as echoes ("SWITCH AT 2 OF 3" vs "at least two of")
const STOP = new Set(["a", "an", "the", "at", "of", "to", "in", "on", "and", "or", "for", "but", "is", "it", "its", "vs", "your", "my"]);

const specs = [];
for (const block of specsSrc.split(/\n  \{\n/).slice(1)) {
  const id = block.match(/id: "([^"]+)"/)?.[1];
  const from = Number(block.match(/from: (\d+)/)?.[1]);
  if (!id || Number.isNaN(from)) continue;
  const beats = [];
  for (const line of block.split("\n")) {
    const m = line.match(/\{ at: (\d+),.*?text: "([^"]+)"/);
    if (m) beats.push({ at: Number(m[1]), text: m[2] });
  }
  specs.push({ id, from, beats });
}

let flagged = 0;
for (const s of specs) {
  for (let i = 0; i < s.beats.length; i++) {
    const b = s.beats[i];
    const start = s.from + b.at;
    const end = s.from + (s.beats[i + 1]?.at ?? b.at + 120);
    const spoken = words.filter((w) => w.to > start && w.from < end).flatMap((w) => w.text.split(/\s+/)).map(norm).filter(Boolean);
    const spokenStems = new Set(spoken.map(stem));
    const tokens = b.text.split(/[^A-Za-z0-9¢$]+/).map(norm).filter((t) => t.length > 1 && !/^\d/.test(t) && !STOP.has(t));
    if (tokens.length === 0) continue; // pure numbers punch — allowed
    const hits = tokens.filter((t) => spokenStems.has(stem(t)));
    const ratio = hits.length / tokens.length;
    if ((ratio >= 0.6 && hits.length >= 2) || (tokens.length === 1 && ratio === 1)) {
      flagged++;
      console.log(`${s.id}  at ${b.at}  "${b.text}"  — echoes [${hits.join(", ")}] in: ${words.filter((w) => w.to > start && w.from < end).map((w) => w.text).join(" ")}`);
    }
  }
}
console.log(flagged ? `\n${flagged} duplicate-caption label(s) — rephrase them (payoff/verdict, not narration).` : "OK — no beat label duplicates its captions.");
process.exit(flagged ? 1 : 0);
