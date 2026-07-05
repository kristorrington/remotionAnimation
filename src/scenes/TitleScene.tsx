import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, CYAN } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { StatusChip, WarningBadge, ParallaxLayer } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FloatIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { stiffness: 180, damping: 16 }, durationInFrames: 16 });
  const op = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const y = Math.sin(frame * 0.06) * 8;
  return <div style={{ opacity: op, transform: `translateY(${y}px) scale(${interpolate(e, [0, 1], [0.5, 1.35])})`, marginBottom: 20 }}>{children}</div>;
};

// The de-slided title card: cinematic base (bg + particles + sweep + camera push),
// a floating animated icon, the glow headline, an optional subtitle, and optional
// chips (info = cyan, denied = red badge). Used for every headline-only beat, so a
// plain "centred title" always has depth + internal motion instead of a flat slide.
export const TitleScene: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  chips?: { label: string; at: number; danger?: boolean }[];
  accent?: string;
  titleSize?: number;
  seed?: number;
}> = ({ durationInFrames, kicker, title, subtitle, icon, chips, accent = CYAN, titleSize = 92, seed }) => {
  const frame = useCurrentFrame();
  const subOp = interpolate(frame, [20, 32], [0, 1], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={seed}>
      <ParallaxLayer depth={0.5} style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {icon ? <FloatIcon>{icon}</FloatIcon> : null}
          <SceneHeadline kicker={kicker} title={title} titleSize={titleSize} accent={accent} />
          {subtitle ? (
            <span style={{ marginTop: 18, fontFamily: FONT, fontWeight: 500, fontSize: 36, color: "rgba(255,255,255,0.8)", opacity: subOp }}>{subtitle}</span>
          ) : null}
          {chips && chips.length ? (
            <div style={{ marginTop: 30, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1200 }}>
              {chips.map((c) => (c.danger ? <WarningBadge key={c.label} label={c.label} delay={c.at} danger /> : <StatusChip key={c.label} label={c.label} delay={c.at} color={accent} />))}
            </div>
          ) : null}
        </div>
      </ParallaxLayer>
    </SceneShell>
  );
};
