import React from "react";
import { Audio, interpolate, Sequence } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A soft background-music bed for one section of a video. Plays `src` over a
// frame range at a low volume, fading in and out at the edges so parts can hand
// off cleanly. `loop` repeats a short track to fill a long section.
//
// Usage (drop a track in public/music/ and reference it with staticFile):
//   <MusicBed src={staticFile("music/intro.mp3")} from={0} durationInFrames={520} />
export const MusicBed: React.FC<{
  src: string;
  from: number;
  durationInFrames: number;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  loop?: boolean;
  /** where to start inside the track, in frames */
  startFrom?: number;
}> = ({ src, from, durationInFrames, volume = 0.15, fadeInFrames = 30, fadeOutFrames = 45, loop = true, startFrom = 0 }) => {
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Audio
        src={src}
        loop={loop}
        startFrom={startFrom}
        volume={(f) =>
          volume *
          Math.min(
            interpolate(f, [0, fadeInFrames], [0, 1], CLAMP),
            interpolate(f, [durationInFrames - fadeOutFrames, durationInFrames], [1, 0], CLAMP),
          )
        }
      />
    </Sequence>
  );
};
