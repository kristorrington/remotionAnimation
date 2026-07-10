import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, MONO, PILL_BORDER, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const WORKFLOWS = [
  { t: "Read a page title", at: 387 },
  { t: "Completed a live web-app task", at: 462 },
  { t: "Handled pop-ups & messy data", at: 540 },
  { t: "Inspected a live Amazon listing", at: 659 },
];

// f12604–13980 — recap. Three phases: what we built, four workflows, the takeaway.
export const HermesRecap: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p0 = interpolate(frame, [0, 14, 360, 384], [0, 1, 1, 0], CLAMP);
  const p1 = interpolate(frame, [384, 400, 820, 844], [0, 1, 1, 0], CLAMP);
  const p2 = interpolate(frame, [844, 862, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />

      {/* Phase 0 — what we built */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: p0 }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: CYAN }}>RECAP</span>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, color: WHITE, textShadow: "0 0 40px rgba(193,95,60,0.5)" }}>HERMES ✕ PLAYWRIGHT MCP</div>
          <span style={{ fontFamily: MONO, fontSize: 32, color: "rgba(255,255,255,0.78)" }}>inside WSL · on Windows</span>
        </div>
      </AbsoluteFill>

      {/* Phase 1 — four workflows */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: p1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, letterSpacing: 4, color: WHITE }}>4 BROWSER WORKFLOWS</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {WORKFLOWS.map((w, i) => {
              const e = spring({ frame: frame - w.at, fps, config: { stiffness: 160, damping: 18, mass: 0.7 }, durationInFrames: 14 });
              const x = interpolate(e, [0, 1], [-34, 0]);
              const op = interpolate(frame, [w.at, w.at + 8], [0, 1], CLAMP);
              return (
                <div key={w.t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: op, transform: `translateX(${x}px)` }}>
                  <span style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: WHITE }}>{i + 1}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 40, color: WHITE }}>{w.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* Phase 2 — the takeaway */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: p2 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: CYAN }}>THE TAKEAWAY</span>
          <div style={{ display: "flex", gap: 26 }}>
            {[
              { k: "Web search", v: "find & understand" },
              { k: "Playwright MCP", v: "act & verify" },
            ].map((c) => (
              <div key={c.k} style={{ padding: "26px 34px", borderRadius: 18, background: "rgba(20,16,13,0.8)", border: PILL_BORDER, textAlign: "center", boxShadow: "0 18px 44px rgba(0,0,0,0.45)" }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: WHITE }}>{c.k}</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 28, color: CYAN, marginTop: 8 }}>{c.v}</div>
              </div>
            ))}
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.82)" }}>research the web → act on live pages → verify in real time</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
