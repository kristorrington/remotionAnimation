import React from "react";
import { useCurrentFrame } from "remotion";
import { VOICE_LEVELS } from "./voiceLevels";

// ============================================================================
// VOICE REACTIVITY — precomputed per-frame VO loudness (scripts/voice-levels.mjs
// → voiceLevels.ts), so elements can breathe with the voice at ZERO render
// cost (no audio decode during rendering). Regenerate after new footage.
// ============================================================================

// Smoothed VO level 0..1 at an ABSOLUTE source frame.
export const voiceLevelAt = (absFrame: number): number => {
  if (VOICE_LEVELS.length === 0) return 0;
  const i = Math.max(0, Math.min(VOICE_LEVELS.length - 1, Math.round(absFrame)));
  const a = VOICE_LEVELS[Math.max(0, i - 1)];
  const b = VOICE_LEVELS[i];
  const c = VOICE_LEVELS[Math.min(VOICE_LEVELS.length - 1, i + 1)];
  return (a + b * 2 + c) / 4;
};

// Level for the current frame of a scene that starts at `clipFrom` in the
// SOURCE timeline (i.e. its Sequence `from`).
export const useVoiceLevel = (clipFrom: number): number => {
  const frame = useCurrentFrame();
  return voiceLevelAt(clipFrom + frame);
};

// Wraps a subject so its glow pulses WITH the voice — the cheapest way to make
// a "thinking"/"speaking" element feel alive and VO-synced.
export const VoiceGlow: React.FC<{ clipFrom: number; color?: string; maxGlow?: number; children: React.ReactNode }> = ({ clipFrom, color = "#D97757", maxGlow = 26, children }) => {
  const level = useVoiceLevel(clipFrom);
  return <div style={{ filter: `drop-shadow(0 0 ${4 + level * maxGlow}px ${color})` }}>{children}</div>;
};
