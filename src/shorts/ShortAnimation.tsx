import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { CartoonBeat } from "./CartoonBeat";
import { BeatSceneView } from "./BeatScenes";
import { Beat } from "./types";

// The animation zone's content: a cinematic backdrop plus one tiny animated
// SCENE per beat (BeatScenes — a subject doing something), each held until the
// next beat so the zone is ALWAYS populated. Beats without a `scene` fall back
// to the legacy icon card (use sparingly — max ~1 per short).
export const ShortAnimation: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AnimatedBackground durationInFrames={durationInFrames} />
      {beats.map((b, i) => {
        const end = i + 1 < beats.length ? beats[i + 1].at : durationInFrames;
        const dur = Math.max(end - b.at, 1);
        return (
          <Sequence key={`${b.at}-${i}`} from={b.at} durationInFrames={dur} premountFor={14}>
            {b.scene ? <BeatSceneView beat={b} dur={dur} /> : <CartoonBeat icon={b.icon ?? "deepseek"} text={b.text} sub={b.sub} dur={dur} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
