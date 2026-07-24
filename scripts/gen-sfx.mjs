// Deterministic, royalty-free SFX synthesis for the model-review edit kit.
// No downloads, no Math.random — every effect is a fixed ffmpeg filtergraph
// (seeded noise + sine/aevalsrc + smooth envelopes), so re-runs are byte-stable.
//
//   node scripts/gen-sfx.mjs            # writes the 7-effect set
//   node scripts/gen-sfx.mjs --music    # also writes two ambient music beds
//
// Output: public/audio/sfx/<name>.wav  (48kHz mono s16, faded to avoid clicks).
// Keyed in src/components/Sfx.tsx (soft*, interfaceClick, …). AGENTS.md §6.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const FF = "C:/ProgramData/chocolatey/bin/ffmpeg.exe";
const ROOT = process.cwd();
const SFX_DIR = path.join(ROOT, "public", "audio", "sfx");
const MUSIC_DIR = path.join(ROOT, "public", "audio", "music");

// Each effect: a lavfi source expression + a post filter chain. `src` is the
// full `-f lavfi -i` argument; `af` shapes it. Envelopes keep attacks/decays
// smooth so nothing clicks. Restrained by design (no cinematic booms).
const SFX = [
  {
    name: "soft-whoosh", // air swoosh — text entrances / card animations
    src: "anoisesrc=d=0.42:c=pink:s=11:a=0.9",
    af: "bandpass=f=1100:width_type=h:w=1500,afade=t=in:d=0.09:curve=ipar,afade=t=out:st=0.12:d=0.30,volume=1.35",
  },
  {
    name: "interface-click", // short UI tick — chips / small confirms
    src: "aevalsrc='0.55*sin(2*PI*1750*t)*exp(-t*120)+0.30*sin(2*PI*3200*t)*exp(-t*170)':d=0.06",
    af: "highpass=f=700,afade=t=out:st=0.02:d=0.04,volume=1.1",
  },
  {
    name: "low-impact", // soft low thump — model-card lands / section starts
    src: "aevalsrc='0.85*sin(2*PI*66*t)*exp(-t*9)+0.15*sin(2*PI*132*t)*exp(-t*16)':d=0.38",
    af: "lowpass=f=220,afade=t=in:d=0.004,afade=t=out:st=0.26:d=0.12,volume=1.15",
  },
  {
    name: "short-riser", // rising sweep — into the main hook question
    src: "aevalsrc='0.34*sin(2*PI*(175+900*t)*t)':d=0.72",
    af: "highpass=f=120,afade=t=in:d=0.20,afade=t=out:st=0.60:d=0.12,volume=1.2",
  },
  {
    name: "transition-sweep", // brighter shwip — major section transitions
    src: "anoisesrc=d=0.36:c=white:s=23:a=0.7",
    af: "bandpass=f=2600:width_type=h:w=2400,afade=t=in:d=0.05:curve=ipar,afade=t=out:st=0.10:d=0.25,volume=1.25",
  },
  {
    name: "confirmation", // gentle two-tone — benchmark reveal / positive payoff
    src: "aevalsrc='0.42*sin(2*PI*659*t)*exp(-t*6)*lt(t,0.19)+0.42*sin(2*PI*988*(t-0.19))*exp(-(t-0.19)*6)*gte(t,0.19)':d=0.38",
    af: "lowpass=f=3500,afade=t=out:st=0.32:d=0.06,volume=1.15",
  },
  {
    name: "warning-pulse", // restrained pulsing mid tone — caveat/safety accent
    src: "aevalsrc='0.40*sin(2*PI*432*t)*(0.55+0.45*sin(2*PI*6.5*t))*exp(-t*2.6)':d=0.52",
    af: "lowpass=f=2200,afade=t=in:d=0.01,afade=t=out:st=0.44:d=0.08,volume=1.05",
  },
];

// Two minimal, non-melodic ambient beds (opt-in via --music). Warm pad + low
// pulse + light filtered texture — no melody, no drums. Loopable (12s).
const MUSIC = [
  {
    name: "analytical-bed", // main analytical energy
    // stacked detuned sines (warm pad) + a slow low pulse + faint airy noise
    filter:
      "aevalsrc='0.12*sin(2*PI*110*t)+0.09*sin(2*PI*164.8*t)+0.07*sin(2*PI*220*t)+0.05*sin(2*PI*55*t)*(0.6+0.4*sin(2*PI*0.5*t))':d=12:s=48000[a];" +
      "anoisesrc=d=12:c=pink:s=5:a=0.04,highpass=f=2000,lowpass=f=6000[n];" +
      "[a][n]amix=inputs=2:normalize=0,lowpass=f=3000,afade=t=in:d=1.5,afade=t=out:st=10.5:d=1.5,volume=0.9",
  },
  {
    name: "caveat-bed", // lower-energy caveat / safety
    filter:
      "aevalsrc='0.11*sin(2*PI*98*t)+0.08*sin(2*PI*146.8*t)+0.04*sin(2*PI*49*t)*(0.6+0.4*sin(2*PI*0.35*t))':d=12:s=48000[a];" +
      "anoisesrc=d=12:c=brown:s=8:a=0.03,lowpass=f=1400[n];" +
      "[a][n]amix=inputs=2:normalize=0,lowpass=f=2200,afade=t=in:d=2,afade=t=out:st=10:d=2,volume=0.85",
  },
];

const run = (args) => execFileSync(FF, args, { stdio: ["ignore", "ignore", "inherit"] });

mkdirSync(SFX_DIR, { recursive: true });
for (const fx of SFX) {
  const out = path.join(SFX_DIR, `${fx.name}.wav`);
  run(["-y", "-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", fx.src, "-af", fx.af, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", out]);
  console.log("sfx  ->", path.relative(ROOT, out));
}

if (process.argv.includes("--music")) {
  mkdirSync(MUSIC_DIR, { recursive: true });
  for (const m of MUSIC) {
    const out = path.join(MUSIC_DIR, `${m.name}.wav`);
    run(["-y", "-hide_banner", "-loglevel", "error", "-filter_complex", m.filter, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", out]);
    console.log("music->", path.relative(ROOT, out));
  }
}
console.log("done.");
