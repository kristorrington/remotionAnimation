import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { Odometer, GlowDivider, AnimatedCounter } from "../motion/primitives";
import { SourceChip } from "../motion/charts";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// STAT RECEIPT — one big cited number (mode E for a single statistic). The
// odometer rolls the value in, the divider draws, and the source chip anchors
// the claim. Between StatCountersScene (no source) and SourceCardScene (full
// doc card): use this when ONE number needs provenance.
export const StatReceiptScene: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title?: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number; // >0 switches to a smooth counter (odometer digits are integer columns)
  label: string;
  source: { name: string; url?: string };
}> = ({ durationInFrames, kicker, title, value, prefix, suffix, decimals = 0, label, source }) => {
  const frame = useCurrentFrame();
  const labelOp = interpolate(frame, [26, 38], [0, 1], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x127}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {title ? <SceneHeadline kicker={kicker} title={title} titleSize={72} /> : null}
        {decimals > 0 ? (
          <AnimatedCounter to={value} at={14} size={190} decimals={decimals} prefix={prefix} suffix={suffix} />
        ) : (
          <Odometer to={value} at={14} size={190} prefix={prefix} suffix={suffix} />
        )}
        <span style={{ opacity: labelOp, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", transform: "translateZ(0)" }}>{label}</span>
        <GlowDivider at={20} />
        <SourceChip name={source.name} url={source.url} at={34} />
      </div>
    </SceneShell>
  );
};
