import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CYAN, DROP_SHADOW, FONT, PILL_BORDER, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREEN = "#34D399";
const RED = "#EF4444";
const AMBER = "#F59E0B";

// Local sync points (Sequence starts at f1364, the "let's start with the timeline" beat).
const EVENTS = [
  { date: "JUN 9", text: "Fable 5 + Mythos 5 released", color: GREEN, at: 136 }, // L21-24
  { date: "JUN 12", text: "Taken offline — security & access", color: RED, at: 394 }, // L25-28
  { date: "JUN 30", text: "Restrictions lifted", color: GREEN, at: 772 }, // L31
  { date: "JUL 1", text: "Back — now with guardrails", color: AMBER, at: 900 }, // L32-33
];

export const Fable5Timeline: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);
  // Line grows from the first node to the last across the timeline's span.
  const LINE_LEFT = 180; // = node width (360) / 2
  const LINE_SPAN = 1280; // between first and last dot centres
  const fillW = interpolate(frame, [EVENTS[0].at, EVENTS[EVENTS.length - 1].at], [0, LINE_SPAN], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 70, width: 1640 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: CYAN, opacity: headOpacity, filter: DROP_SHADOW }}>
          THE TIMELINE
        </span>

        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "space-between" }}>
          {/* track + fill */}
          <div style={{ position: "absolute", top: 62, left: LINE_LEFT, width: LINE_SPAN, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
          <div style={{ position: "absolute", top: 62, left: LINE_LEFT, height: 4, borderRadius: 2, width: fillW, background: `linear-gradient(90deg, ${GREEN}, ${AMBER})`, boxShadow: `0 0 14px ${CYAN}` }} />

          {EVENTS.map((e) => {
            const enter = spring({ frame: frame - e.at, fps, config: { stiffness: 220, damping: 17, mass: 0.7 }, durationInFrames: 16 });
            const scale = interpolate(enter, [0, 1], [0.3, 1]);
            const op = interpolate(frame, [e.at, e.at + 8], [0, 1], CLAMP);
            return (
              <div key={e.date} style={{ width: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: op }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 2, color: WHITE }}>{e.date}</span>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: e.color, transform: `scale(${scale})`, boxShadow: `0 0 20px ${e.color}`, border: "3px solid rgba(2,6,14,0.9)" }} />
                <div style={{ transform: `scale(${scale})`, padding: "14px 18px", borderRadius: 12, background: "rgba(20,16,13,0.85)", border: PILL_BORDER, filter: DROP_SHADOW, textAlign: "center", maxWidth: 320 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,0.9)" }}>{e.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
