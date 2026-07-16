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
  // Synthesized pack (2026-07-16, ffmpeg-built, licence-clean — the palette
  // must ROTATE, CLAUDE.md §7 Sound):
  pop: staticFile("sfx/pop.wav"), // cartoon pop — doors/tiles/chips landing
  tick: staticFile("sfx/tick.wav"), // tiny UI tick — steps/runs under VO
  thud: staticFile("sfx/thud.wav"), // dull low landing — cards/pans dropping
  swish: staticFile("sfx/swish.wav"), // soft air sweep — receipt zoom settles
  pluck: staticFile("sfx/pluck.wav"), // warm marimba pluck — confirmations, alt-ding
  paperSlide: staticFile("sfx/paper-slide.wav"), // low paper drag — card slides / pans
  clickPop: staticFile("sfx/click-pop.wav"), // tiny click-pop — list items / counters
} as const;

// Subtle pitch variation so a repeated sample never sounds machine-gunned:
// rotate rates by index (`rate={vary(i)}`) — same file, three slightly
// different pitches. Drop extra samples into the arrays below to widen it.
export const vary = (i: number) => [1, 0.94, 1.07, 0.89, 1.13][i % 5];

// Sample pools per role — add files to a pool and pick(pool, i) rotates them.
export const SFX_POOLS = {
  whoosh: [SFX.whoosh],
  accent: [SFX.ding, SFX.whip, SFX.switch, SFX.pop, SFX.tick, SFX.thud],
  // rotating beat-entry textures for PiP beats — never the same sample twice
  // in a row (Kris, July 2026: "vary the audio effects more")
  entry: [SFX.pageTurn, SFX.swish, SFX.paperSlide, SFX.shutterOld],
  confirm: [SFX.ding, SFX.pluck, SFX.clickPop],
} as const;
export const pick = (pool: readonly string[], i: number) => pool[i % pool.length];

// A one-shot sound effect fired at an absolute frame. Wrapped in a short
// Sequence so the clip is trimmed to its trigger window. `rate` shifts the
// pitch/speed slightly (use vary(i) for repeated samples).
export const SfxCue: React.FC<{
  from: number;
  src: string;
  volume?: number;
  durationInFrames?: number;
  rate?: number;
}> = ({ from, src, volume = 0.5, durationInFrames = 30, rate }) => {
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Audio src={src} volume={volume} playbackRate={rate ?? 1} />
    </Sequence>
  );
};
