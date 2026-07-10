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

// Local sync points (Sequence starts at f4180):
//   "sends instruction to Playwright MCP"  f4187 -> 7
//   "Playwright controls the browser"      f4281 -> 101
//   "the browser opens the website"        f4339 -> 159
//   "Hermes reads the result back"         f4404 -> 224
const NODES = [
  { label: "HERMES", at: 0, mono: false },
  { label: "PLAYWRIGHT MCP", at: 72, mono: true }, // lands on "...to playwright MCP"
  { label: "BROWSER", at: 101, mono: false },
  { label: "WEBSITE", at: 159, mono: false },
  { label: "RESULT", at: 224, mono: false },
];

// f4180–4560 — the example.com round-trip, visualised as a pipeline.
export const FlowDiagram: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: CYAN, opacity: headOpacity, filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}>
          HOW IT WORKS
        </span>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, maxWidth: 1640 }}>
          {NODES.map((node, i) => {
            const e = spring({ frame: frame - node.at, fps, config: { stiffness: 220, damping: 18, mass: 0.7 }, durationInFrames: 14 });
            const scale = interpolate(e, [0, 1], [0.6, 1]);
            const op = interpolate(frame, [node.at, node.at + 8], [0, 1], CLAMP);
            const active = node.label === "RESULT";
            const draw = interpolate(spring({ frame: frame - node.at + 2, fps, config: { stiffness: 200, damping: 22 }, durationInFrames: 12 }), [0, 1], [0, 1]);
            return (
              <React.Fragment key={node.label}>
                {i > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", width: 58, flexShrink: 0 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`, transform: `scaleX(${draw})`, transformOrigin: "left center" }} />
                    <span style={{ marginLeft: 5, color: CYAN, fontWeight: 800, fontSize: 26, lineHeight: 1, opacity: draw }}>›</span>
                  </div>
                ) : null}
                <div
                  style={{
                    flexShrink: 0,
                    opacity: op,
                    transform: `scale(${scale})`,
                    padding: "16px 22px",
                    borderRadius: 12,
                    background: active ? `linear-gradient(135deg, ${BLUE}, ${CYAN})` : "rgba(20,16,13,0.9)",
                    border: active ? "none" : PILL_BORDER,
                    boxShadow: active ? `0 0 30px rgba(6,182,212,0.7)` : "0 14px 36px rgba(0,0,0,0.45)",
                    fontFamily: node.mono ? MONO : FONT,
                    fontWeight: node.mono ? 500 : 800,
                    fontSize: node.mono ? 23 : 27,
                    letterSpacing: 1,
                    color: WHITE,
                    whiteSpace: "nowrap",
                  }}
                >
                  {node.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
