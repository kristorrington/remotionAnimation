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
export type Note = {
  at: number; // frame the marker draws on (the whisper word for this claim)
  rect: Rect; // image-space box around the claim line / number
  kind?: "underline" | "circle" | "box"; // default underline
  label?: string; // optional caption chip beside the marker (true screen size)
  labelPos?: "above" | "below"; // where the chip sits (default below)
  color?: string; // default terracotta
};

// transform that shows image-rect `r` inside a `w`×`h` viewport.
// contain: the whole rect fits (default). cover: the rect always FILLS the
// viewport (center slice crops) — bleed receipts use this so the page hits
// 100% of the zone at any aspect.
const rectTransform = (r: Rect, w: number, h: number, fit: "contain" | "cover" = "contain") => {
  const scale = fit === "cover" ? Math.max(w / r.w, h / r.h) : Math.min(w / r.w, h / r.h);
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
  // WAYPOINTS (Kris, July 2026 — "zoom into exactly what you're talking
  // about"): when a receipt proves SEVERAL spoken claims, pan/zoom through
  // them in order — each crop LANDS at its `at` (the frame the claim is
  // spoken), pans in over the preceding ~24f. Overrides from/to/zoomAt.
  // waypoints[0] is the opening view (its `at` is the hold-from, usually ~0).
  waypoints?: { rect: Rect; at: number }[];
  highlight?: Rect; // the exact line, in image pixels — gets a sweep
  highlightAt?: number;
  // NOTES (Kris, July 2026 — "add animation on top of the b-roll that aligns
  // to the transcript"): editor's-pen annotations pinned to the PAGE (image
  // pixels) that DRAW ON at their `at` (the whisper frame the claim is
  // spoken). Each is an underline/circle/box marker on the claim + an optional
  // label chip that pops beside it (rendered at true screen size regardless of
  // the page zoom). Multi-claim receipts get one note per waypoint landing.
  notes?: Note[];
  width?: number;
  height?: number;
  bleed?: boolean; // full-frame mode: no radius/border/glow — the page IS the frame
  fit?: "contain" | "cover"; // cover: the to-rect always fills the viewport
}> = ({ src, url, imageW, imageH, from, to, zoomAt = 20, waypoints, highlight, highlightAt = 52, notes, width = 1100, height = 640, bleed = false, fit = "contain" }) => {
  const frame = useCurrentFrame();
  const inner = height - 54;
  const useWaypoints = waypoints !== undefined && waypoints.length >= 1;
  let scale: number;
  let tx: number;
  let ty: number;
  let drift = 1;
  if (useWaypoints) {
    const wps = waypoints!;
    const T = wps.map((w) => rectTransform(w.rect, width, inner, fit));
    const PAN = 24;
    // the latest waypoint we've begun panning toward
    let i = 0;
    for (let k = 1; k < wps.length; k++) if (frame >= wps[k].at - PAN) i = k;
    const A = T[Math.max(0, i - 1)];
    const B = T[i];
    const p = i === 0 ? 1 : interpolate(frame, [wps[i].at - PAN, wps[i].at], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) * (1 - x) });
    scale = A.scale + (B.scale - A.scale) * p;
    tx = A.tx + (B.tx - A.tx) * p;
    ty = A.ty + (B.ty - A.ty) * p;
  } else {
    const a = rectTransform(from ?? { x: 0, y: 0, w: imageW, h: imageH }, width, inner, fit);
    const b = rectTransform(to, width, inner, fit);
    const t = interpolate(frame, [zoomAt, zoomAt + 26], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) * (1 - x) });
    scale = a.scale + (b.scale - a.scale) * t;
    tx = a.tx + (b.tx - a.tx) * t;
    ty = a.ty + (b.ty - a.ty) * t;
    // Ken Burns tail: once the zoom lands, keep a slow drift going so the
    // receipt never sits static (editing research: slow purposeful motion).
    // Bleed mode drifts the PAGE (frame-edge crop is fine full-screen); card
    // mode drifts the whole CARD outward instead — an inner drift would crop
    // the page at the card edge and nibble text (the "leclining" bug).
    drift = interpolate(frame, [zoomAt + 26, zoomAt + 26 + 260], [1, 1.05], CLAMP);
  }
  const op = interpolate(frame, [0, 12], [0, 1], CLAMP);
  return (
    <div style={{ width, borderRadius: bleed ? 0 : 18, overflow: "hidden", border: bleed ? "none" : `2px solid ${CYAN}55`, boxShadow: bleed ? "none" : `0 30px 80px rgba(0,0,0,0.55), 0 0 40px ${CYAN}22`, opacity: op, background: "#0B0F17", transform: bleed ? undefined : `scale(${drift})`, transformOrigin: "50% 50%" }}>
      {/* browser chrome */}
      <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {["#C65B52", "#C9913D", "#4FA98A"].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <div style={{ flex: 1, marginLeft: 12, padding: "7px 18px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: "rgba(255,255,255,0.75)" }}>{url}</span>
        </div>
      </div>
      {/* the page, panned + zoomed to the proof (outer div = the drift) */}
      <div style={{ position: "relative", width, height: inner, overflow: "hidden", transform: bleed ? `scale(${drift})` : undefined, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "top left" }}>
          {/* maxWidth:none — Tailwind preflight's img{max-width:100%} squishes pages wider than the card */}
          <Img src={staticFile(src)} style={{ width: imageW, height: imageH, maxWidth: "none", display: "block" }} />
          {highlight && (
            <div style={{ position: "absolute", left: highlight.x, top: highlight.y, width: highlight.w, height: highlight.h, borderRadius: 4, background: `${CYAN}10`, opacity: interpolate(frame, [highlightAt, highlightAt + 10], [0, 1], CLAMP), overflow: "hidden" }}>
              <HighlightSweep at={highlightAt + 6} />
              {/* editor's pen: the underline draws on (premium pass 13.26) */}
              <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, borderRadius: 2, background: CYAN, width: `${interpolate(frame, [highlightAt + 4, highlightAt + 24], [0, 100], CLAMP)}%` }} />
            </div>
          )}
          {notes?.map((n, i) => {
            const kind = n.kind ?? "underline";
            const col = n.color ?? CYAN;
            const draw = interpolate(frame, [n.at, n.at + 16], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) * (1 - x) });
            const sw = 5 / scale; // marker stroke ≈ 5 screen px at any page zoom
            const gap = sw * 2.4;
            const peri = Math.PI * (n.rect.w + n.rect.h);
            const below = n.labelPos !== "above";
            return (
              <div key={`note-${i}`} style={{ position: "absolute", left: n.rect.x, top: n.rect.y, width: n.rect.w, height: n.rect.h }}>
                {kind === "underline" && (
                  <div style={{ position: "absolute", left: 0, bottom: -gap, height: sw, borderRadius: sw / 2, background: col, width: `${draw * 100}%`, boxShadow: `0 0 ${sw * 2}px ${col}` }} />
                )}
                {kind === "box" && (
                  <div style={{ position: "absolute", inset: -sw, border: `${sw}px solid ${col}`, borderRadius: sw * 2.4, opacity: interpolate(frame, [n.at, n.at + 8], [0, 1], CLAMP), transform: `scale(${interpolate(draw, [0, 1], [1.05, 1])})`, boxShadow: `0 0 ${sw * 3}px ${col}55` }} />
                )}
                {kind === "circle" && (
                  <svg width={n.rect.w} height={n.rect.h} viewBox={`0 0 ${n.rect.w} ${n.rect.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                    <ellipse cx={n.rect.w / 2} cy={n.rect.h / 2} rx={n.rect.w / 2} ry={n.rect.h / 2} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeDasharray={peri} strokeDashoffset={(1 - draw) * peri} />
                  </svg>
                )}
                {n.label && (
                  <div style={{ position: "absolute", left: 0, right: 0, [below ? "top" : "bottom"]: n.rect.h + gap, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ transform: `scale(${1 / scale})`, transformOrigin: below ? "top center" : "bottom center", opacity: interpolate(frame, [n.at + 6, n.at + 16], [0, 1], CLAMP) }}>
                      <div style={{ whiteSpace: "nowrap", padding: "8px 18px", borderRadius: 10, background: col, boxShadow: "0 8px 22px rgba(0,0,0,0.45)", transform: `translateY(${interpolate(frame, [n.at + 6, n.at + 16], [below ? -8 : 8, 0], CLAMP)}px)` }}>
                        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 0.4, color: "#fff" }}>{n.label}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
