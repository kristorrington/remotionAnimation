import { CAPTIONS, CaptionWord } from "./captionsData";
import { CAPTIONS_050726 } from "./captions-050726";
import { CAPTIONS_070726 } from "./captions-070726";
import { CAPTIONS_080726 } from "./captions-080726";
import { CAPTIONS_090726 } from "./captions-090726";
import { CAPTIONS_100726 } from "./captions-100726";
import { CAPTIONS_110726 } from "./captions-110726";

// Per-source caption lookup: captionsData.ts always holds the CURRENT footage
// (scripts/transcribe.mjs overwrites it); older videos keep a frozen copy here
// so their shorts/finals stay in sync forever. Add an entry when footage rotates.
const REGISTRY: Record<string, CaptionWord[]> = {
  "talking-head.mp4": CAPTIONS,
  "talking-head-050726.mp4": CAPTIONS_050726,
  "talking-head-070726.mp4": CAPTIONS_070726,
  "talking-head-080726.mp4": CAPTIONS_080726,
  "talking-head-090726.mp4": CAPTIONS_090726,
  "talking-head-100726.mp4": CAPTIONS_100726,
  "talking-head-110726.mp4": CAPTIONS_110726,
};

export const captionsFor = (source: string): CaptionWord[] => REGISTRY[source] ?? CAPTIONS;
