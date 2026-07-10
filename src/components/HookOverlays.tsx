import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, FONT, MONO, PILL_BORDER, RED, WHITE } from "./overlayUI";

// ── 0:06.3 "make me a cool remotion animation ... and hope for the best" ───
// A terminal types the naive prompt, then a red ✗ "the wrong way" stamp lands.
const TERMINAL_TEXT = "make me a cool remotion animation";
const TYPE_START = 64; // local frame the typing begins (VO @ 0:06.3)
const TYPE_END = 128;
const STAMP_AT = 130; // ✗ lands on "and hope for the best"

export const FakeTerminal: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame,
    fps,
    config: { stiffness: 160, damping: 18, mass: 0.7 },
    durationInFrames: 16,
  });
  const appearScale = interpolate(appear, [0, 1], [0.85, 1]);

  const chars = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, TERMINAL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typed = TERMINAL_TEXT.slice(0, chars);
  const doneTyping = chars >= TERMINAL_TEXT.length;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const stamp = spring({
    frame: frame - STAMP_AT,
    fps,
    config: { stiffness: 320, damping: 16, mass: 0.7 },
    durationInFrames: 16,
  });
  const stampScale = interpolate(stamp, [0, 1], [1.8, 1]);
  const stampOpacity = interpolate(frame, [STAMP_AT, STAMP_AT + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity,
          transform: `scale(${appearScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            width: 760,
            borderRadius: 14,
            background: "rgba(6,8,12,0.94)",
            border: PILL_BORDER,
            filter: DROP_SHADOW,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
          </div>
          <div style={{ padding: "26px 28px", fontFamily: MONO, fontSize: 28, color: WHITE, whiteSpace: "nowrap" }}>
            <span style={{ color: CYAN }}>❯ </span>
            {typed}
            <span style={{ opacity: doneTyping ? (cursorOn ? 1 : 0) : 1, color: BLUE }}>▋</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: stampOpacity,
            transform: `scale(${stampScale}) rotate(-8deg)`,
          }}
        >
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: RED, filter: DROP_SHADOW }}>✗</span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: WHITE, filter: DROP_SHADOW }}>
            the wrong way
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 0:09.7 "cinematic" / 0:11.5 "render safe" / 0:14.8 "best practices" ────
// Each word pops exactly on the spoken word (explicit per-word delays).
const POP_WORDS: { word: string; delay: number }[] = [
  { word: "CINEMATIC", delay: 0 }, // 0:09.7
  { word: "RENDER-SAFE", delay: 53 }, // 0:11.5
  { word: "BEST PRACTICES", delay: 152 }, // 0:14.8
];

export const WordPops: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 26, opacity: groupOpacity }}>
        {POP_WORDS.map(({ word, delay }, i) => {
          const pop = spring({
            frame: frame - delay,
            fps,
            config: { stiffness: 240, damping: 13, mass: 0.7 },
            durationInFrames: 18,
          });
          const scale = interpolate(pop, [0, 1], [0.3, 1]);
          const opacity = interpolate(pop, [0, 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(pop, [0, 1], [26, 0]);
          return (
            <div
              key={word}
              style={{
                transform: `translateY(${y}px) scale(${scale})`,
                opacity,
                padding: "16px 26px",
                borderRadius: 14,
                background: "rgba(8,10,14,0.74)",
                border: `1px solid ${i === 1 ? CYAN : BLUE}`,
                filter: DROP_SHADOW,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 40,
                letterSpacing: 2,
                color: WHITE,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── 0:15.7 "there's one thing you should install first" ────────────────────
// The payoff: a hard-hitting line with a pulsing glow + bouncing chevron that
// builds anticipation for the skill reveal.
export const InstallPayoff: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { stiffness: 360, damping: 22, mass: 0.8 },
    durationInFrames: 18,
  });
  const scale = interpolate(enter, [0, 1], [1.5, 1]);
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.3);
  const bounce = Math.abs(Math.sin(frame * 0.18)) * 10;
  const glow = 18 + 22 * pulse;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, letterSpacing: 8, color: CYAN, filter: DROP_SHADOW }}>
          BUT FIRST
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 72,
            letterSpacing: 2,
            color: WHITE,
            textShadow: `0 0 ${glow}px rgba(193,95,60,0.7)`,
            filter: DROP_SHADOW,
          }}
        >
          INSTALL THIS
        </span>
        <div
          style={{
            transform: `translateY(${bounce}px)`,
            width: 0,
            height: 0,
            borderLeft: "18px solid transparent",
            borderRight: "18px solid transparent",
            borderTop: `26px solid ${BLUE}`,
            filter: `drop-shadow(0 0 ${glow}px ${CYAN})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
