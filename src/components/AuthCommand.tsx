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

// The real Gmail MCP auth command. Each env path lights up + gets a label as the
// narrator describes it (L83–88). Sequence starts at f7250.
const LINES: { name: string | null; value: string; label: string | null; at: number }[] = [
  { name: "MCP_CONFIG_DIR", value: "/home/lko_8/.gmail-mcp \\", label: "config folder", at: 134 }, // L83 4:06
  { name: "GMAIL_OAUTH_PATH", value: "/home/lko_8/.gmail-mcp/gcp-oauth.keys.json \\", label: "OAuth key (Google Cloud)", at: 267 }, // L84-85 4:10
  { name: "GMAIL_CREDENTIALS_PATH", value: "/home/lko_8/.gmail-mcp/credentials.json \\", label: "credentials (after sign-in)", at: 409 }, // L86 4:15
  { name: null, value: "node …/@shinzolabs/gmail-mcp/dist/index.js auth", label: "runs the auth flow", at: 528 }, // L87-88 4:19
];

export const AuthCommand: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 180, damping: 20, mass: 0.8 }, durationInFrames: 16 });
  const scale = interpolate(enter, [0, 1], [0.88, 1]);
  const env = interpolate(frame, [0, 12, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], CLAMP);

  // Which line is currently being explained.
  let activeIndex = -1;
  LINES.forEach((l, i) => {
    if (frame >= l.at) activeIndex = i;
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: env }}>
      <div
        style={{
          transform: `scale(${scale})`,
          width: 1360,
          borderRadius: 16,
          overflow: "hidden",
          background: "rgba(6,9,14,0.95)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
          <span style={{ marginLeft: 10, fontFamily: MONO, fontSize: 19, color: "rgba(255,255,255,0.6)" }}>Gmail MCP — authenticate</span>
        </div>

        <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          {LINES.map((l, i) => {
            const reveal = 8 + i * 20;
            const lineOp = interpolate(frame, [reveal, reveal + 10], [0, 1], CLAMP);
            const active = activeIndex === i;
            const dim = activeIndex >= 0 && !active ? 0.4 : 1;
            const labelOp = active ? interpolate(frame, [l.at, l.at + 8], [0, 1], CLAMP) : 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: lineOp }}>
                <div
                  style={{
                    flexShrink: 0,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: active ? "rgba(6,182,212,0.16)" : "transparent",
                    boxShadow: active ? `0 0 22px rgba(6,182,212,0.35)` : "none",
                    opacity: dim,
                    fontFamily: MONO,
                    fontSize: 22,
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.name ? <span style={{ color: CYAN }}>{l.name}=</span> : null}
                  <span style={{ color: WHITE }}>{l.value}</span>
                </div>
                <span
                  style={{
                    opacity: labelOp,
                    transform: `translateX(${interpolate(labelOp, [0, 1], [-12, 0])}px)`,
                    fontFamily: MONO,
                    fontSize: 20,
                    color: CYAN,
                    whiteSpace: "nowrap",
                  }}
                >
                  ← {l.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
