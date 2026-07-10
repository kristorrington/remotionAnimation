import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, MONO, PILL_BORDER, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const HERMES_LOGO = "hermes-agent.png";
const GMAIL_LOGO = "google-gmail-logo-symbol-design-illustration-free-vector.jpg";

// Premium white app-icon tile so each logo reads cleanly on the dark scene
// (the Gmail JPG's white bg becomes the tile; the Hermes line-art shows
// properly). A soft gradient, brand-coloured glow ring and drop shadow make the
// white read as an intentional icon tile rather than a flat box.
const LogoBadge: React.FC<{ src: string; size: number; glow?: string }> = ({ src, size, glow = "rgba(59,130,246,0.55)" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: "linear-gradient(160deg, #ffffff 0%, #e9eef5 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: size * 0.12,
      border: "1px solid rgba(255,255,255,0.6)",
      boxShadow: `0 18px 44px rgba(0,0,0,0.55), 0 0 ${size * 0.5}px ${glow}, inset 0 1px 2px rgba(255,255,255,0.9)`,
    }}
  >
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
  </div>
);

// BEAT 1 (f0–185) — "do more than just chat → connect Gmail"
const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = spring({ frame: frame - 6, fps, config: { stiffness: 300, damping: 26, mass: 0.6 }, durationInFrames: 12 });
  const ringD = interpolate(ring, [0, 1], [0, 1920]);
  const ringO = interpolate(frame, [6, 9, 16, 22], [0, 1, 1, 0], CLAMP);
  const flash = interpolate(frame, [15, 16, 18, 19], [0, 1, 1, 0], CLAMP);
  const slam = spring({ frame: frame - 20, fps, config: { stiffness: 400, damping: 30, mass: 0.9 }, durationInFrames: 24 });
  const tScale = interpolate(slam, [0, 1], [1.6, 1]);
  const tOp = interpolate(frame, [20, 28], [0, 1], CLAMP);
  const chroma = interpolate(frame, [20, 40], [1, 0], CLAMP);
  const off = 6 * chroma;
  const reveal = spring({ frame: frame - 85, fps, config: { stiffness: 200, damping: 16, mass: 0.8 }, durationInFrames: 18 });
  const revScale = interpolate(reveal, [0, 1], [0.4, 1]);
  const revOp = interpolate(frame, [85, 95], [0, 1], CLAMP);
  const out = interpolate(frame, [165, 180], [1, 0], CLAMP);
  const line: React.CSSProperties = { margin: 0, fontFamily: FONT, fontWeight: 800, fontSize: 86, letterSpacing: 4, lineHeight: 1.04, whiteSpace: "nowrap" };
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ position: "absolute", width: ringD, height: ringD, borderRadius: "50%", border: `3px solid ${BLUE}`, opacity: ringO, boxShadow: `0 0 30px ${BLUE}` }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", opacity: tOp, transform: `scale(${tScale})`, textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-off}px)`, opacity: 0.4 }}>
            <div style={{ ...line, color: CYAN }}>MORE THAN</div>
            <div style={{ ...line, color: CYAN }}>JUST CHAT</div>
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${off}px)`, opacity: 0.4 }}>
            <div style={{ ...line, color: BLUE }}>MORE THAN</div>
            <div style={{ ...line, color: BLUE }}>JUST CHAT</div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ ...line, color: WHITE, textShadow: "0 0 36px rgba(59,130,246,0.5)" }}>MORE THAN</div>
            <div style={{ ...line, color: WHITE, textShadow: "0 0 36px rgba(59,130,246,0.5)" }}>JUST CHAT</div>
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18, opacity: revOp, transform: `scale(${revScale})`, padding: "14px 26px 14px 16px", borderRadius: 16, background: "rgba(20,16,13,0.8)", border: PILL_BORDER }}>
          <LogoBadge src={GMAIL_LOGO} size={48} glow="rgba(234,67,53,0.5)" />
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: WHITE }}>connect Gmail</span>
        </div>
      </div>
      <AbsoluteFill style={{ backgroundColor: WHITE, opacity: flash }} />
    </AbsoluteFill>
  );
};

// BEAT 2 (f185–384) — "connect Hermes Agent to Gmail using MCP"
const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - 4, fps, config: { stiffness: 360, damping: 28, mass: 0.9 }, durationInFrames: 24 });
  const scale = interpolate(slam, [0, 1], [1.4, 1]);
  const op = interpolate(frame, [4, 14], [0, 1], CLAMP);
  const xSpring = spring({ frame: frame - 12, fps, config: { stiffness: 200, damping: 18 }, durationInFrames: 16 });
  const gmailX = interpolate(xSpring, [0, 1], [60, 0]);
  const hermesX = interpolate(xSpring, [0, 1], [-60, 0]);
  const mcp = interpolate(frame, [44, 56], [0, 1], CLAMP);
  const out = interpolate(frame, [180, 195], [1, 0], CLAMP);
  const label: React.CSSProperties = { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: WHITE };
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: `scale(${scale})`, opacity: op }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateX(${hermesX}px)` }}>
            <LogoBadge src={HERMES_LOGO} size={150} />
            <span style={label}>HERMES</span>
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: CYAN, textShadow: `0 0 24px ${CYAN}` }}>✕</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateX(${gmailX}px)` }}>
            <LogoBadge src={GMAIL_LOGO} size={150} glow="rgba(234,67,53,0.55)" />
            <span style={label}>GMAIL</span>
          </div>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 38, letterSpacing: 6, color: CYAN, opacity: mcp }}>via MCP</span>
      </div>
    </AbsoluteFill>
  );
};

// BEAT 3 (f384–584) — "a real AI agent working with your actual inbox"
const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { stiffness: 220, damping: 18, mass: 0.8 }, durationInFrames: 22 });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [4, 14], [0, 1], CLAMP);
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.12);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, transform: `scale(${scale})`, opacity: op }}>
        <LogoBadge src={GMAIL_LOGO} size={96} glow="rgba(234,67,53,0.5)" />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: CYAN }}>A REAL AI AGENT FOR</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 110, color: WHITE, textShadow: `0 0 ${40 + 30 * glow}px rgba(59,130,246,${0.5 + 0.3 * glow})` }}>YOUR INBOX</span>
        <div style={{ display: "flex", gap: 30, marginTop: 6 }}>
          {["Search", "Triage", "Draft replies"].map((t, i) => {
            const o = interpolate(frame, [40 + i * 16, 52 + i * 16], [0, 1], CLAMP);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, opacity: o }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.85)" }}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// GmailHook — 3-beat cinematic intro (f0–584) using the real logos.
export const GmailHook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020202" }}>
      <AnimatedBackground durationInFrames={584} />
      <Sequence  durationInFrames={185}>
        <Beat1 />
      </Sequence>
      <Sequence from={185} durationInFrames={199}>
        <Beat2 />
      </Sequence>
      <Sequence from={384} durationInFrames={200}>
        <Beat3 />
      </Sequence>
    </AbsoluteFill>
  );
};
