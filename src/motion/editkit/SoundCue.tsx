import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { SfxCue } from "../../components/Sfx";
import { MUSIC_VOL } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// SoundCue — a one-shot SFX at a frame. Thin alias over the project's SfxCue so
// the edit map speaks in edit-kit terms. Fire ONLY on important text entrances,
// model-card animations, price changes, benchmark reveals, section transitions
// and the final recommendation (AGENTS.md §6) — not on every animation.
export const SoundCue = SfxCue;

// MusicController — one of two energy beds with speech ducking (AGENTS.md §6).
//   state "main"  -> analytical bed (tension.MP3, low)
//   state "caveat"-> lower-energy safety bed (calm.MP3, lower)
// `duck` windows (ABSOLUTE frames) drop the music FURTHER under dense benchmark
// explanations, safety caveats and the final decision rule. Smooth, click-free.
export const MusicController: React.FC<{
  state: "main" | "caveat";
  from: number;
  durationInFrames: number;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  startFrom?: number;
  duck?: { from: number; to: number }[]; // absolute frames to duck further
  duckTo?: number; // dip factor (default 0.5)
}> = ({ state, from, durationInFrames, volume, fadeInFrames = 45, fadeOutFrames = 120, startFrom = 0, duck = [], duckTo = 0.5 }) => {
  const base = volume ?? (state === "main" ? MUSIC_VOL.main : MUSIC_VOL.caveat);
  const src = staticFile(state === "main" ? "music/tension.MP3" : "music/calm.MP3");
  const ramp = 12; // duck ramp frames
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Audio
        src={src}
        loop
        startFrom={startFrom}
        volume={(f) => {
          const abs = from + f;
          const fade = Math.min(
            interpolate(f, [0, fadeInFrames], [0, 1], CLAMP),
            interpolate(f, [durationInFrames - fadeOutFrames, durationInFrames], [1, 0], CLAMP),
          );
          // duck: dip to duckTo inside any window, with short in/out ramps
          let duckFactor = 1;
          for (const w of duck) {
            duckFactor = Math.min(
              duckFactor,
              interpolate(abs, [w.from - ramp, w.from, w.to, w.to + ramp], [1, duckTo, duckTo, 1], CLAMP),
            );
          }
          return base * fade * duckFactor;
        }}
      />
    </Sequence>
  );
};
