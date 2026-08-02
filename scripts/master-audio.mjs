// Two-pass LINEAR loudnorm master (transparent, no pumping) to ~-14 LUFS.
// Measures the input, then applies a single linear gain + true-peak limit.
//   node scripts/master-audio.mjs <in.mp4> <out.mp4>
import { execSync } from "node:child_process";

const IN = process.argv[2];
const OUT = process.argv[3];
if (!IN || !OUT) { console.error("usage: master-audio.mjs <in> <out>"); process.exit(1); }
const FF = "C:/ProgramData/chocolatey/bin/ffmpeg.exe";

let af = "loudnorm=I=-14:TP=-1.5:LRA=11";
try {
  const meas = execSync(`"${FF}" -hide_banner -i "${IN}" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`).toString();
  const j = JSON.parse(meas.slice(meas.lastIndexOf("{"), meas.lastIndexOf("}") + 1));
  af = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
} catch (e) {
  console.warn("measure failed, single-pass fallback:", e?.message ?? e);
}
execSync(`"${FF}" -y -hide_banner -loglevel error -i "${IN}" -c:v copy -af "${af}" -c:a aac -b:a 256k "${OUT}"`, { stdio: "inherit" });
console.log(`mastered -> ${OUT}`);
