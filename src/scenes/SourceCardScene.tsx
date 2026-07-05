import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT, MONO, CYAN, WHITE } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { FloatingPanel, HighlightSweep } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A "source / receipt" card — a faux document panel (window chrome + source name +
// lines) with a highlight sweep over the key line. For official claims / model
// cards ("same V4 checkpoint"), so a quoted fact reads as evidence, not a bullet.
export const SourceCardScene: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title: string;
  sourceName: string;
  lines: { text: string; highlight?: boolean }[];
  highlightAt?: number;
  accent?: string;
}> = ({ durationInFrames, kicker, title, sourceName, lines, highlightAt = 44, accent = CYAN }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x9d}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={80} accent={accent} />
        <FloatingPanel delay={16} accent={accent} style={{ width: 940, padding: 0, overflow: "hidden" }}>
          {/* window chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#34D399" }} />
            <span style={{ marginLeft: 14, fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 1, color: "rgba(255,255,255,0.65)" }}>{sourceName}</span>
          </div>
          {/* lines */}
          <div style={{ padding: "26px 34px", display: "flex", flexDirection: "column", gap: 18 }}>
            {lines.map((l, i) => {
              const op = interpolate(frame, [24 + i * 12, 24 + i * 12 + 10], [0, 1], CLAMP);
              return (
                <div key={i} style={{ position: "relative", opacity: op, padding: l.highlight ? "8px 14px" : 0, borderRadius: 8, background: l.highlight ? `${accent}18` : "transparent", border: l.highlight ? `1px solid ${accent}55` : "none", overflow: "hidden" }}>
                  <span style={{ fontFamily: FONT, fontWeight: l.highlight ? 800 : 600, fontSize: 36, color: l.highlight ? WHITE : "rgba(255,255,255,0.82)" }}>{l.text}</span>
                  {l.highlight && <HighlightSweep at={highlightAt} color={accent} />}
                </div>
              );
            })}
          </div>
        </FloatingPanel>
      </div>
    </SceneShell>
  );
};
