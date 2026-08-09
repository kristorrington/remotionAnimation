import { CAPTIONS, CaptionWord } from "./captionsData";
import { CAPTIONS_050726 } from "./captions-050726";
import { CAPTIONS_070726 } from "./captions-070726";
import { CAPTIONS_080726 } from "./captions-080726";
import { CAPTIONS_090726 } from "./captions-090726";
import { CAPTIONS_100726 } from "./captions-100726";
import { CAPTIONS_110726 } from "./captions-110726";
import { CAPTIONS_120726 } from "./captions-120726";
import { CAPTIONS_130726 } from "./captions-130726";
import { CAPTIONS_140726 } from "./captions-140726";
import { CAPTIONS_150726 } from "./captions-150726";
import { CAPTIONS_160726 } from "./captions-160726";
import { CAPTIONS_170726 } from "./captions-170726";
import { CAPTIONS_180726 } from "./captions-180726";
import { CAPTIONS_190726 } from "./captions-190726";
import { CAPTIONS_210726 } from "./captions-210726";
import { CAPTIONS_220726 } from "./captions-220726";
import { CAPTIONS_240726 } from "./captions-240726";
import { CAPTIONS_260726 } from "./captions-260726";
import { CAPTIONS_HABITS } from "./captions-habits";
import { CAPTIONS_020826 } from "./captions-020826";
import { CAPTIONS_030826 } from "./captions-030826";
import { CAPTIONS_090826 } from "./captions-090826";

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
  "talking-head-120726.mp4": CAPTIONS_120726,
  "talking-head-130726.mp4": CAPTIONS_130726,
  "talking-head-140726.mp4": CAPTIONS_140726,
  "talking-head-150726.mp4": CAPTIONS_150726,
  "talking-head-160726.mp4": CAPTIONS_160726,
  "talking-head-170726.mp4": CAPTIONS_170726,
  "talking-head-180726.mp4": CAPTIONS_180726,
  "talking-head-190726.mp4": CAPTIONS_190726, // Agentic-pricing (rotated 2026-07-21)
  "talking-head-210726.mp4": CAPTIONS_210726, // Fable-permanent (rotated 2026-07-22)
  "talking-head-220726.mp4": CAPTIONS_220726, // Qwen-3.8-Max (rotated 2026-07-24)
  "talking-head-240726.mp4": CAPTIONS_240726, // OpenAI-rogue-agent (rotated 2026-07-26)
  "talking-head-260726.mp4": CAPTIONS_260726, // Claude-Opus-5 (rotated 2026-07-26)
  "talking-head-habits-260726.mp4": CAPTIONS_HABITS, // 5-habits (rotated 2026-07-27)
  "talking-head-020826.mp4": CAPTIONS_020826, // AI-news DeepSeek/OpenAI/Qwen (2026-08-02)
  "talking-head-030826.mp4": CAPTIONS_030826, // Gemini Robotics 2 (2026-08-03)
  "talking-head-090826.mp4": CAPTIONS_090826, // Astra ten-proofs fact-check (2026-08-09)
};

export const captionsFor = (source: string): CaptionWord[] => REGISTRY[source] ?? CAPTIONS;
