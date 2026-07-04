import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CYAN, DROP_SHADOW, MONO, PILL_BORDER, WHITE } from "./overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type ConfigLine = { text: string; indent: number; at: number; accent?: boolean };

// Default: the Playwright YAML (used by HermesAnnotations).
const PLAYWRIGHT_LINES: ConfigLine[] = [
  { text: "playwright:", indent: 0, at: 26, accent: true }, // "a new MCP server called playwright"
  { text: "command: npx", indent: 1, at: 142 }, // "set the command to npx"
  { text: "args:", indent: 1, at: 215 }, // "then add these arguments"
  { text: '- "@playwright/mcp@latest"', indent: 2, at: 232 },
  { text: '- "--headless"', indent: 2, at: 252 },
  { text: '- "--browser=chrome"', indent: 2, at: 272 },
];

// Floating code panel whose lines appear in sync with the narration.
// Transparent track annotation.
export const ConfigCallout: React.FC<{ durationInFrames: number; title?: string; lines?: ConfigLine[]; width?: number }> = ({
  durationInFrames,
  title = "hermes-config.yaml",
  lines = PLAYWRIGHT_LINES,
  width = 660,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 180, damping: 20, mass: 0.8 }, durationInFrames: 16 });
  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const env = interpolate(frame, [0, 12, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end" }}>
      <div
        style={{
          margin: "0 90px 110px 0",
          opacity: env,
          transform: `scale(${scale})`,
          width,
          borderRadius: 16,
          overflow: "hidden",
          background: "rgba(6,9,14,0.94)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
          <span style={{ marginLeft: 10, fontFamily: MONO, fontSize: 18, color: "rgba(255,255,255,0.6)" }}>{title}</span>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {lines.map((l) => {
            const op = interpolate(frame, [l.at, l.at + 8], [0, 1], CLAMP);
            const x = interpolate(frame, [l.at, l.at + 8], [-12, 0], CLAMP);
            return (
              <div
                key={l.text}
                style={{
                  opacity: op,
                  transform: `translateX(${x}px)`,
                  paddingLeft: l.indent * 28,
                  fontFamily: MONO,
                  fontSize: 24,
                  color: l.accent ? CYAN : WHITE,
                  whiteSpace: "nowrap",
                }}
              >
                {l.text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
