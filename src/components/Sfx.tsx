import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

// Local sound effects (downloaded into public/sfx so Studio + render both work
// without fetching remote URLs).
export const SFX = {
  whoosh: staticFile("sfx/whoosh.wav"),
  click: staticFile("sfx/mouse-click.wav"),
  ding: staticFile("sfx/ding.wav"),
  switch: staticFile("sfx/switch.wav"),
  shutter: staticFile("sfx/shutter-modern.wav"),
  // Added for more variety:
  whip: staticFile("sfx/whip.wav"), // sharp swipe — fast transitions / list snaps
  pageTurn: staticFile("sfx/page-turn.wav"), // soft page flip — section changes
  boom: staticFile("sfx/boom.wav"), // deep impact — the biggest reveals only (use rarely)
  shutterOld: staticFile("sfx/shutter-old.wav"), // vintage camera flash — alt accent
} as const;

// A one-shot sound effect fired at an absolute frame. Wrapped in a short
// Sequence so the clip is trimmed to its trigger window.
export const SfxCue: React.FC<{
  from: number;
  src: string;
  volume?: number;
  durationInFrames?: number;
}> = ({ from, src, volume = 0.5, durationInFrames = 30 }) => {
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Audio src={src} volume={volume} />
    </Sequence>
  );
};
