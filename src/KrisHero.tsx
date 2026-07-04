import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ShockwaveRing } from "./components/ShockwaveRing";
import { TitleReveal } from "./components/TitleReveal";
import { ScanLine } from "./components/ScanLine";
import { Particles } from "./components/Particles";
import { HUDGrid } from "./components/HUDGrid";

const BG = "#020202";

// KrisHero — a 5-second (150f @ 30fps) cinematic opener.
//
// Act 1  (0-30)   Signal detected   — black, then a dot expands into a
//                                      shockwave ring + camera flash.
// Act 2  (30-75)  Name hits hard    — "KRIS TORRINGTON" slams in with
//                                      chromatic aberration that locks in.
// Act 3  (75-105) Identity confirmed— "AI AUTOMATION" rises; radar scan sweep.
// Act 4  (105-135)System online     — particles + HUD grid; a single pulse.
// Act 5  (135-150)Hard cut ready    — everything holds sharp; glow surges.
//
// Every element lives in its own <Sequence> with explicit from/durationInFrames.
// No fade-out: the final frame is designed to hard-cut into footage.
export const KrisHero: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Act 4 — background HUD grid (fades in, holds to the end). */}
      <Sequence from={105} durationInFrames={45}>
        <HUDGrid />
      </Sequence>

      {/* Act 4 — drifting particle field (holds to the end). */}
      <Sequence from={105} durationInFrames={45}>
        <Particles />
      </Sequence>

      {/* Act 1 — shockwave ring, flash and glow bleed. */}
      <Sequence from={0} durationInFrames={45}>
        <ShockwaveRing />
      </Sequence>

      {/* Acts 2-5 — name, chromatic aberration, subtitle, pulse, glow surge. */}
      <Sequence from={30} durationInFrames={120}>
        <TitleReveal />
      </Sequence>

      {/* Act 3 — radar scan sweep. */}
      <Sequence from={75} durationInFrames={30}>
        <ScanLine />
      </Sequence>
    </AbsoluteFill>
  );
};
