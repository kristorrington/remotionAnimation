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

// 4) mux + MASTER to ~-14 LUFS with TWO-PASS *linear* loudnorm (measure, then
// apply a single linear gain + true-peak limit). Single-pass loudnorm applies
// dynamic normalization that audibly PUMPS speech ("doesn't sound right", Kris
// Aug 2026); linear mode is transparent. TP=-1.5 leaves headroom so loud
// speech never near-clips. Must use SYSTEM ffmpeg — Remotion's bundled ffmpeg
// lacks the loudnorm filter, and a raw mux lands ~-23 LUFS (too quiet).
const SYS_FF = "C:/ProgramData/chocolatey/bin/ffmpeg.exe";
let af = "loudnorm=I=-14:TP=-1.5:LRA=11";
try {
  const meas = execSync(`"${SYS_FF}" -hide_banner -i "${audio}" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`, { cwd: ROOT }).toString();
  const j = JSON.parse(meas.slice(meas.lastIndexOf("{"), meas.lastIndexOf("}") + 1));
  af = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
  console.log(">>> loudnorm measured — applying transparent linear normalization");
} catch (e) {
  console.warn(">>> loudnorm measure failed, falling back to single-pass:", e?.message ?? e);
}
run(`"${SYS_FF}" -y -hide_banner -loglevel error -i "${videoOnly}" -i "${audio}" -c:v copy -af "${af}" -c:a aac -b:a 320k "${OUT}"`);

rmSync(TMP, { recursive: true, force: true });
console.log(`\ndone -> ${OUT}`);
