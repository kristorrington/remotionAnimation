import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A framing = a jump-cut on the talking head. The original shot is already a
// well-composed medium shot, so `scale: 1` IS a real framing — keep punches
// SUBTLE (cap ~1.12); anything tighter crops into the face. `y` nudges the
// eyeline up a touch on the larger punches (% of height; must stay 0 at scale 1
// or the edges expose black).
type Framing = { at: number; scale: number; y?: number };

// Jump-cut schedule. Each entry snaps the framing (a cut); within the segment a
// gentle push drifts it a hair so the shot never sits still. Cuts land inside the
// visible talking gaps between cutaways — under a cutaway the framing is hidden.
const FRAMING: Framing[] = [
  { at: 0,     scale: 1.05, y: -1 }, // cold open — barely punched
  { at: 1122,  scale: 1.12, y: -2 }, // gentle push for the point
  { at: 2186,  scale: 1.00, y: 0 },  // back to the full original framing
  { at: 2639,  scale: 1.07, y: -1 },
  { at: 3314,  scale: 1.12, y: -2 },
  { at: 4303,  scale: 1.00, y: 0 },
  { at: 4944,  scale: 1.06, y: -1 }, // big gap — two framings
  { at: 5150,  scale: 1.12, y: -2 },
  { at: 6090,  scale: 1.04, y: -1 },
  { at: 8878,  scale: 1.12, y: -2 },
  { at: 9523,  scale: 1.05, y: -1 }, // biggest gap — three framings
  { at: 9760,  scale: 1.00, y: 0 },
  { at: 10010, scale: 1.10, y: -2 },
  { at: 10728, scale: 1.06, y: -1 },
  { at: 11730, scale: 1.12, y: -2 },
  { at: 12630, scale: 1.05, y: -1 },
];

const PUSH = 0.02; // how much each segment drifts in over its length (subtle)

// Animated film-grain texture (inline SVG turbulence, so no external asset).
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// The talking-head footage, "directed": punch-in jump cuts + a slow push, a warm
// cinematic grade, a vignette and animated grain. Sits *under* the animation track
// so the cards keep their own palette; only the footage is treated.
export const FootageDirector: React.FC<{ footage: string; volume?: number }> = ({ footage, volume = 3 }) => {
  const frame = useCurrentFrame();

  // Which framing segment are we in, and how far through it?
  let i = 0;
  for (let k = 0; k < FRAMING.length; k++) {
    if (frame >= FRAMING[k].at) i = k;
  }
  const cur = FRAMING[i];
  const next = FRAMING[i + 1];
  const segEnd = next ? next.at : frame + 1;
  const t = interpolate(frame, [cur.at, segEnd], [0, 1], CLAMP);
  const scale = cur.scale + PUSH * t;
  const y = cur.y ?? 0;

  // Animated grain offset — jitter the texture each frame so it shimmers.
  const gx = ((frame * 7) % 18) - 9;
  const gy = ((frame * 13) % 18) - 9;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateY(${y}%)`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile(footage)}
          // Source VO is often recorded quiet; lift it so it leads the mix over
          // the SFX (per-video boost from the volumedetect probe — AGENTS §6).
          // Final loudness is set by a loudnorm master at export.
          volume={volume}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // Warm cinematic grade: a touch more contrast, richer color, lift.
            filter: "contrast(1.06) saturate(1.1) brightness(1.02)",
          }}
        />
      </AbsoluteFill>

      {/* warm wash */}
      <AbsoluteFill style={{ backgroundColor: "#FF7A1A", mixBlendMode: "soft-light", opacity: 0.06, pointerEvents: "none" }} />
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)", pointerEvents: "none" }} />
      {/* film grain */}
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundRepeat: "repeat",
          opacity: 0.08,
          mixBlendMode: "overlay",
          transform: `translate(${gx}px, ${gy}px)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
