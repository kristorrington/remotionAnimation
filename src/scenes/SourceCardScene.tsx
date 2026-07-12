import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MONO, CYAN, WHITE } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { FloatingPanel, HighlightSweep } from "../motion/primitives";
import { SourceScreenshot } from "../motion/SourceScreenshot";

type Rect = { x: number; y: number; w: number; h: number };

// SCREENSHOT RECEIPT — mode E full scene for a REAL page screenshot: short
// headline + the SourceScreenshot browser card panning/zooming into the crop
// that proves the claim (CLAUDE.md §10.7 — the only way screenshots appear).
export const ScreenshotReceiptScene: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title: string;
  tint?: string;
  src: string;
  url: string;
  imageW: number;
  imageH: number;
  from?: Rect;
  to: Rect;
  zoomAt?: number;
  highlight?: Rect;
  highlightAt?: number;
  cardW?: number;
  cardH?: number;
  fullBleed?: boolean;
  // Sticker slot: "center" only when the page's top-center is EMPTY —
  // over a headline/hero it covers the page text (Kris, July 2026); dock
  // it "right"/"left" into the page's whitespace instead, and lower it
  // with titleTop when even the top corner holds text.
  titlePos?: "center" | "right" | "left";
  titleTop?: number;
}> = ({ durationInFrames, kicker, title, tint, src, url, imageW, imageH, from, to, zoomAt, highlight, highlightAt, cardW = 1700, cardH = 840, fullBleed = true, titlePos = "center", titleTop = 88 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // FULL-BLEED trial (Kris, July 2026): the page fills the whole frame; the
  // chrome/URL bar spans the top (credibility stays) and the title rides a
  // white sticker pill over the page. Set fullBleed={false} for the 90% card.
  if (fullBleed) {
    const pop = spring({ frame: frame - 8, fps, config: { stiffness: 240, damping: 14 }, durationInFrames: 18 });
    const slot = titlePos === "right" ? { right: 60 } : titlePos === "left" ? { left: 60 } : { left: "50%" };
    return (
      <AbsoluteFill>
        <SourceScreenshot src={src} url={url} imageW={imageW} imageH={imageH} from={from} to={to} zoomAt={zoomAt} highlight={highlight} highlightAt={highlightAt} width={1920} height={1080} bleed />
        <div style={{ position: "absolute", top: titleTop, ...slot, transform: `${titlePos === "center" ? "translateX(-50%) " : ""}rotate(-1.5deg) scale(${interpolate(pop, [0, 1], [1.18, 1])})`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "14px 34px", borderRadius: 18, background: "rgba(255,255,255,0.96)", boxShadow: "0 18px 50px rgba(31,30,29,0.35)" }}>
            {kicker ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: CYAN }}>{kicker}</span> : null}
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 0.5, color: "#1F1E1D", whiteSpace: "nowrap" }}>{title}</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x77} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={46} />
        <SourceScreenshot src={src} url={url} imageW={imageW} imageH={imageH} from={from} to={to} zoomAt={zoomAt} highlight={highlight} highlightAt={highlightAt} width={cardW} height={cardH} />
      </div>
    </SceneShell>
  );
};

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
