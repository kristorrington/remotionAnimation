import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { CAPTIONS } from "../shorts/captionsData";

// ============================================================================
// WORD POP — pop exactly ONE spoken word as an emphasis punch, timed from the
// whisper data (word-level ground truth). Long-form has no captions; this is
// how a single word syncs to the VO without narrating the transcript.
// ============================================================================

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9%]/g, "");

// Absolute source frame where `word` is first SPOKEN at/after `fromAbs`.
// Returns null when not found — callers should render nothing in that case.
export const findSpoken = (word: string, fromAbs = 0): number | null => {
  const target = norm(word);
  for (const w of CAPTIONS) {
    if (w.from >= fromAbs && norm(w.text) === target) return w.from;
  }
  return null;
};

// The pop itself: slams in oversized, settles, glows, exits with a whip.
export const WordPop: React.FC<{ text: string; at: number; hold?: number; color?: string; size?: number }> = ({ text, at, hold = 34, color = "#D97757", size = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame > at + hold) return null;
  const e = spring({ frame: frame - at, fps, config: { stiffness: 280, damping: 14, mass: 0.7 }, durationInFrames: 14 });
  const op = interpolate(frame, [at, at + 4, at + hold - 8, at + hold], [0, 1, 1, 0], CLAMP);
  const exitX = interpolate(frame, [at + hold - 8, at + hold], [0, -60], CLAMP);
  return (
    <div style={{ opacity: op, transform: `translateX(${exitX}px) scale(${interpolate(e, [0, 1], [2, 1])}) rotate(-2deg) translateZ(0)`, display: "inline-block" }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 1, color: "#FFFFFF", textShadow: `0 0 34px ${color}`, WebkitTextStroke: `2px ${color}55` }}>{text}</span>
    </div>
  );
};

// Whisper-synced variant: pops `text` (default = the word itself) exactly when
// `word` is spoken. `clipFrom` = the Sequence's start in SOURCE frames (the
// golden rule's `from`), so the pop lands inside the scene's local timeline.
export const SpokenWordPop: React.FC<{ word: string; clipFrom: number; searchFrom?: number; text?: string; color?: string; size?: number; hold?: number }> = ({ word, clipFrom, searchFrom, text, color, size, hold }) => {
  const abs = findSpoken(word, searchFrom ?? clipFrom);
  if (abs === null) return null;
  const at = abs - clipFrom - 4; // land a touch before the word peaks
  if (at < 0) return null;
  return <WordPop text={text ?? word.toUpperCase()} at={at} color={color} size={size} hold={hold} />;
};
