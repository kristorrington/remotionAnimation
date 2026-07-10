import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedBackground } from "./AnimatedBackground";
import { Tape } from "./Tape";
import { TitleTokens, useTheme } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: string[];
  // Optional per-item entrance frames (local) so list items can be synced to the
  // narration. Falls back to a calm fixed stagger when omitted.
  itemDelays?: number[];
  // Optional animated "cartoon" icon shown above the kicker.
  icon?: React.ReactNode;
  // Optional tape banner below the title (bold style's "IS BACK" strip; renders
  // as a plain accent line in cinematic).
  tape?: string;
  // Optional faint scattered background words (bold style only).
  bgWords?: string[];
  durationInFrames: number;
};

// Reusable full-screen branded title/section card, themed via useTheme():
// cinematic = glowing Inter on the space backdrop; bold = chunky cream Anton on
// flat slate, boxed typewriter kicker, terracotta numerics, tape banner, ✓ chips.
export const SectionCard: React.FC<Props> = ({ kicker, title, subtitle, items, itemDelays, icon, tape, bgWords, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const bold = t.name === "bold";

  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 300, damping: 26, mass: 0.8 }, durationInFrames: 20 });
  const titleScale = interpolate(slam, [0, 1], [1.4, 1]);
  const titleOpacity = interpolate(frame, [6, 16], [0, 1], CLAMP);
  const kickerOpacity = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const underline = interpolate(slam, [0, 1], [0, 1]);
  const subOpacity = interpolate(frame, [20, 34], [0, 1], CLAMP);
  const iconOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const iconY = interpolate(spring({ frame, fps, config: { stiffness: 160, damping: 18 }, durationInFrames: 16 }), [0, 1], [18, 0]);
  const tapeIn = spring({ frame: frame - 14, fps, config: { stiffness: 240, damping: 18, mass: 0.7 }, durationInFrames: 16 });
  // Gentle fade-out so the text never hard-pops at the cut.
  const contentOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} words={bgWords} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center", opacity: contentOut }}>
        {icon ? (
          <div style={{ opacity: iconOpacity, transform: `translateY(${iconY}px)`, marginBottom: 6 }}>{icon}</div>
        ) : null}

        {kicker ? (
          bold ? (
            // Diamonds are CSS shapes, not "◆" glyphs. translateZ(0) forces a
            // compositing layer — without it the render browser can skip painting
            // plain text/borders inside these cards (§9 gotcha).
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, opacity: kickerOpacity, border: `2px solid ${t.accent}`, padding: "10px 22px", transform: "translateZ(0)" }}>
              <span style={{ width: 11, height: 11, background: t.accent, transform: "rotate(45deg)" }} />
              <span style={{ fontFamily: t.fontBody, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: t.accent, textTransform: "uppercase", transform: "translateZ(0)" }}>
                {kicker}
              </span>
              <span style={{ width: 11, height: 11, background: t.accent, transform: "rotate(45deg)" }} />
            </div>
          ) : (
            <span style={{ fontFamily: t.fontKicker, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: t.accent, opacity: kickerOpacity, filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}>
              {kicker}
            </span>
          )
        ) : null}

        <div style={{ opacity: titleOpacity, transform: `scale(${titleScale})` }}>
          <div
            style={{
              margin: 0,
              fontFamily: t.fontDisplay,
              fontWeight: t.titleWeight,
              fontSize: bold ? 132 : 104,
              letterSpacing: 2,
              color: t.text,
              lineHeight: 1.02,
              textTransform: bold ? "uppercase" : undefined,
              textShadow: t.glow ? "0 0 40px rgba(193,95,60,0.55)" : "0 6px 24px rgba(0,0,0,0.35)",
            }}
          >
            <TitleTokens text={title} />
          </div>
        </div>

        {tape ? (
          <div style={{ opacity: interpolate(frame, [14, 24], [0, 1], CLAMP), transform: `scale(${interpolate(tapeIn, [0, 1], [1.5, 1])})` }}>
            <Tape fontSize={bold ? 96 : 72}>{tape}</Tape>
          </div>
        ) : (
          <div
            style={{
              width: 320,
              height: bold ? 10 : 5,
              borderRadius: bold ? 0 : 3,
              background: bold ? t.accent : `linear-gradient(90deg, ${t.accent2}, ${t.accent})`,
              transform: `scaleX(${underline}) rotate(${bold ? -0.6 : 0}deg)`,
              boxShadow: t.glow ? `0 0 16px ${t.accent}` : undefined,
            }}
          />
        )}

        {subtitle ? (
          <span
            style={{
              // Inter at loaded weights only — see the §9 font-rendering gotcha
              fontFamily: t.fontBody,
              fontWeight: bold ? 700 : 600,
              fontSize: bold ? 30 : 36,
              letterSpacing: bold ? 5 : 0,
              textTransform: bold ? "uppercase" : undefined,
              color: t.textDim,
              opacity: subOpacity,
              marginTop: 4,
              transform: "translateZ(0)",
            }}
          >
            {subtitle}
          </span>
        ) : null}

        {items ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 22, alignItems: "flex-start" }}>
            {items.map((it, i) => {
              const at = itemDelays ? itemDelays[i] : 34 + i * 26;
              const e = spring({ frame: frame - at, fps, config: { stiffness: 160, damping: 18, mass: 0.7 }, durationInFrames: 14 });
              const x = interpolate(e, [0, 1], [-30, 0]);
              const op = interpolate(frame, [at, at + 12], [0, 1], CLAMP);
              return bold ? (
                <div
                  key={it}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: op,
                    transform: `translateX(${x}px)`,
                    border: "2px solid rgba(241,234,217,0.4)",
                    borderRadius: 10,
                    padding: "14px 26px",
                  }}
                >
                  <span style={{ fontFamily: t.fontBody, fontWeight: 800, fontSize: 30, color: t.accent }}>✓</span>
                  <span style={{ fontFamily: t.fontBody, fontWeight: 700, fontSize: 34, letterSpacing: 1, color: t.text, textTransform: "uppercase" }}>{it}</span>
                </div>
              ) : (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 16, opacity: op, transform: `translateX(${x}px)` }}>
                  <span style={{ fontFamily: t.fontBody, fontWeight: 800, fontSize: 30, color: t.accent }}>›</span>
                  <span style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: 38, color: t.text }}>{it}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
