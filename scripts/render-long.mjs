// Long-video render pipeline — use this INSTEAD of a single `remotion render`
// for full-length Finals (AGENTS.md "render workarounds"). Single-pass renders
// of 10k+ frame comps pile up resources mid-render (the OffthreadVideo
// compositor cache hit 10GB+ on the side-hustles video; 100+ audio tags
// burst-spawn ffmpeg at the stitch) and stall or crash. This renders the video
// MUTED in chunks (fresh browser + compositor per chunk; a failed chunk can be
// re-run alone), concats them losslessly, renders the audio mix separately at
// low concurrency, then muxes.
//
//   node scripts/render-long.mjs [comp] [outFile] [totalFrames] [chunkSize]
//
// Defaults: SideHustleFinal out/side-hustles-final.mp4 13881 3500
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";

const COMP = process.argv[2] ?? "SideHustleFinal";
const OUT = process.argv[3] ?? "out/side-hustles-final.mp4";
const TOTAL = Number(process.argv[4] ?? 13881);
const CHUNK = Number(process.argv[5] ?? 3500);

const ROOT = process.cwd();
const TMP = path.join(ROOT, "out", "_render-long");
const run = (cmd) => {
  console.log(`\n>>> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
};

mkdirSync(TMP, { recursive: true });

// 1) video-only chunks (muted, inclusive --frames ranges)
const chunks = [];
for (let from = 0; from < TOTAL; from += CHUNK) {
  const to = Math.min(from + CHUNK - 1, TOTAL - 1);
  const file = path.join(TMP, `chunk-${from}.mp4`);
  chunks.push(file);
  if (existsSync(file)) {
    console.log(`\n>>> chunk ${from}-${to} already rendered, skipping`);
    continue;
  }
  run(`npx remotion render ${COMP} "${file}" --frames=${from}-${to} --muted --concurrency=8`);
}

// 2) lossless concat
const listFile = path.join(TMP, "concat.txt");
writeFileSync(listFile, chunks.map((c) => `file '${c.replace(/\\/g, "/")}'`).join("\n") + "\n");
const videoOnly = path.join(TMP, "video-only.mp4");
run(`npx remotion ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${videoOnly}"`);

// 3) audio mix alone at low concurrency (avoids the ffmpeg burst-spawn crash)
const audio = path.join(TMP, "audio.wav");
if (!existsSync(audio)) run(`npx remotion render ${COMP} "${audio}" --concurrency=4`);

// 4) mux
run(`npx remotion ffmpeg -y -i "${videoOnly}" -i "${audio}" -c:v copy -c:a aac -b:a 320k "${OUT}"`);

rmSync(TMP, { recursive: true, force: true });
console.log(`\ndone -> ${OUT}`);
