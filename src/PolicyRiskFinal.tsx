import React from "react";
import { AbsoluteFill } from "remotion";
import { PolicyRiskVideo, CUTAWAY_WINDOWS } from "./PolicyRiskVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";

// Final combined cut: the edited talking-head video with the PolicyRiskVideo
// animation track composited on top, rendered together to one MP4.
//
// Layer order (bottom → top):
//   1. FootageDirector — the graded, gently punched-in talking head
//   2. PolicyRiskVideo  — the animation cutaways (cover the footage) + gaps
//   3. CornerPip        — a small webcam of the presenter during each cutaway
//   4. CutFlash         — soft dip-to-white accents on the biggest turns
// Audio mixes automatically: footage VO (full) + SFX (0.3–0.5) + music (~0.07).
const FOOTAGE = "talking-head.mp4";

// Kept soft (peak ~0.5) so they punctuate the turn without a jarring strobe.
const FLASHES = [
  628,   // "both models went dark"
  2771,  // "a national-security issue" (the turn)
  5390,  // "strategic technology" (act boundary)
  10268, // "it may be quieter" (final act)
  13560, // outro / subscribe
];

export const PolicyRiskFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FootageDirector footage={FOOTAGE} />
      <PolicyRiskVideo />
      {CUTAWAY_WINDOWS.map((w) => (
        <CornerPip key={`pip-${w.from}`} footage={FOOTAGE} from={w.from} dur={w.dur} />
      ))}
      {FLASHES.map((f) => (
        <CutFlash key={f} at={f} peak={f === 13560 ? 0.6 : 0.5} />
      ))}
    </AbsoluteFill>
  );
};
