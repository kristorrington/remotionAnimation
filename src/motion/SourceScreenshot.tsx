import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../components/overlayUI";
import { HighlightSweep } from "./primitives";

// ============================================================================
// SOURCE SCREENSHOT — the standard receipt treatment for ANY screenshot asset
// (docs, pricing, model cards). Browser-chrome card + pan/zoom from the full
// page INTO the crop that proves the claim + a highlight sweep on the line.
// Never dump raw screenshots full-screen (CLAUDE.md §10.7) — use this.
// ============================================================================

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CYAN = "#D97757";

type Rect = { x: number; y: number; w: number; h: number };

// transform that shows image-rect `r` inside a `w`×`h` viewport
const rectTransform = (r: Rect, w: number, h: number) => {
  const scale = Math.min(w / r.w, h / r.h);
  return {
    scale,
    tx: -r.x * scale + (w - r.w * scale) / 2,
    ty: -r.y * scale + (h - r.h * scale) / 2,
  };
};

export const SourceScreenshot: React.FC<{
  src: string; // path under public/, e.g. "assets/external/screenshots/deepseek-pricing.png"
  url: string; // shown in the browser bar — the receipt's provenance
  imageW: number; // the screenshot's natural pixel width
  imageH: number; // …and height
  from?: Rect; // start view (defaults to the full page)
  to: Rect; // the crop that proves the claim (zoomed into over `zoomAt..+26`)
  zoomAt?: number;
  highlight?: Rect; // the exact line, in image pixels — gets a sweep
  highlightAt?: number;
  width?: number;
  height?: number;
}> = ({ src, url, imageW, imageH, from, to, zoomAt = 20, highlight, highlightAt = 52, width = 1100, height = 640 }) => {
  const frame = useCurrentFrame();
  const inner = height - 54;
  const a = rectTransform(from ?? { x: 0, y: 0, w: imageW, h: imageH }, width, inner);
  const b = rectTransform(to, width, inner);
  const t = interpolate(frame, [zoomAt, zoomAt + 26], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) * (1 - x) });
  const scale = a.scale + (b.scale - a.scale) * t;
  const tx = a.tx + (b.tx - a.tx) * t;
  const ty = a.ty + (b.ty - a.ty) * t;
  const op = interpolate(frame, [0, 12], [0, 1], CLAMP);
  return (
    <div style={{ width, borderRadius: 18, overflow: "hidden", border: `2px solid ${CYAN}55`, boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 40px ${CYAN}22`, opacity: op, background: "#0B0F17" }}>
      {/* browser chrome */}
      <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {["#EF4444", "#F59E0B", "#34D399"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <div style={{ flex: 1, marginLeft: 12, padding: "7px 18px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: "rgba(255,255,255,0.75)" }}>{url}</span>
        </div>
      </div>
      {/* the page, panned + zoomed to the proof */}
      <div style={{ position: "relative", width, height: inner, overflow: "hidden" }}>
        <div style={{ position: "absolute", transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "top left" }}>
          {/* maxWidth:none — Tailwind preflight's img{max-width:100%} squishes pages wider than the card */}
          <Img src={staticFile(src)} style={{ width: imageW, height: imageH, maxWidth: "none", display: "block" }} />
          {highlight && (
            <div style={{ position: "absolute", left: highlight.x, top: highlight.y, width: highlight.w, height: highlight.h, borderRadius: 8, border: `3px solid ${CYAN}`, background: `${CYAN}1A`, opacity: interpolate(frame, [highlightAt, highlightAt + 10], [0, 1], CLAMP), overflow: "hidden" }}>
              <HighlightSweep at={highlightAt + 6} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
