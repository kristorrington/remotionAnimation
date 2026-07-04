import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

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
  durationInFrames: number;
};

// Reusable full-screen branded title/section card. Used for SETUP, the four
// TEST intros, and the conceptual beats ("THE BIG DIFFERENCE", etc.).
export const SectionCard: React.FC<Props> = ({ kicker, title, subtitle, items, itemDelays, icon, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 300, damping: 26, mass: 0.8 }, durationInFrames: 20 });
  const titleScale = interpolate(slam, [0, 1], [1.4, 1]);
  const titleOpacity = interpolate(frame, [6, 16], [0, 1], CLAMP);
  const kickerOpacity = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const underline = interpolate(slam, [0, 1], [0, 1]);
  const subOpacity = interpolate(frame, [20, 34], [0, 1], CLAMP);
  const iconOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const iconY = interpolate(spring({ frame, fps, config: { stiffness: 160, damping: 18 }, durationInFrames: 16 }), [0, 1], [18, 0]);
  // Gentle fade-out so the text never hard-pops at the cut.
  const contentOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center", opacity: contentOut }}>
        {icon ? (
          <div style={{ opacity: iconOpacity, transform: `translateY(${iconY}px)`, marginBottom: 6 }}>{icon}</div>
        ) : null}

        {kicker ? (
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: CYAN, opacity: kickerOpacity, filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}>
            {kicker}
          </span>
        ) : null}

        <div style={{ opacity: titleOpacity, transform: `scale(${titleScale})` }}>
          <div style={{ margin: 0, fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: 2, color: WHITE, lineHeight: 1.02, textShadow: "0 0 40px rgba(59,130,246,0.55)" }}>
            {title}
          </div>
        </div>

        <div style={{ width: 320, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`, transform: `scaleX(${underline})`, boxShadow: `0 0 16px ${CYAN}` }} />

        {subtitle ? (
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 36, color: "rgba(255,255,255,0.8)", opacity: subOpacity, marginTop: 4 }}>
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
              return (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 16, opacity: op, transform: `translateX(${x}px)` }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: CYAN }}>›</span>
                  <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 38, color: WHITE }}>{it}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
