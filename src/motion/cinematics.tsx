import React from "react";
import { AbsoluteFill, Easing, getRemotionEnvironment, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../components/overlayUI";
import { ParallaxLayer } from "./primitives";

// ============================================================================
// CINEMATICS — camera feel, transitions, premium overlays, continuity and
// design-time debug tools. All frame-driven, render-safe, no deps.
// ============================================================================

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CYAN = "#D97757";
const BLUE = "#C15F3C";

// World shake on impacts: pass the frames where hits land; apply the returned
// offset to the scene content (SceneShell does this via its `impacts` prop).
// Impacts shake the OBJECT already — this makes the CAMERA feel it too.
export const useImpactShake = (hits: number[], strength = 4) => {
  const frame = useCurrentFrame();
  let x = 0;
  let y = 0;
  for (const at of hits) {
    const t = frame - at;
    if (t < 0 || t > 16) continue;
    const decay = Math.max(0, 1 - t / 16);
    x += Math.sin(t * 1.7) * strength * decay;
    y += Math.cos(t * 2.3) * strength * 0.6 * decay;
  }
  return { x, y };
};

// A cinematic light leak — warm blobs sweep across on a screen blend. Use ONCE
// per video on the premium moment (hero launch / final takeaway), never more.
export const LightLeak: React.FC<{ at?: number; dur?: number; warm?: boolean }> = ({ at = 0, dur = 70, warm = true }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], CLAMP);
  if (frame < at || frame > at + dur) return null;
  const op = interpolate(t, [0, 0.2, 0.75, 1], [0, 0.55, 0.4, 0]);
  const a = warm ? "rgba(255,150,60,0.9)" : "rgba(90,160,255,0.9)";
  const b = warm ? "rgba(255,60,120,0.7)" : "rgba(217,119,87,0.7)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: op }}>
      <div style={{ position: "absolute", top: "-20%", bottom: "-20%", left: `${-40 + t * 150}%`, width: "46%", background: `radial-gradient(ellipse at center, ${a}, transparent 70%)`, transform: "rotate(-18deg)" }} />
      <div style={{ position: "absolute", top: "-30%", bottom: "-10%", left: `${-70 + t * 190}%`, width: "30%", background: `radial-gradient(ellipse at center, ${b}, transparent 70%)`, transform: "rotate(-24deg)" }} />
    </AbsoluteFill>
  );
};

// Scene exit: wrap a scene's content to leave the frame in its final frames
// instead of hard-cutting. Kinds: "push" (slides + shrinks out), "fade",
// "puff" (scales up + fades — pair with a Puff), "drop" (falls with rotation).
export const ExitWrap: React.FC<{ dur: number; exit?: number; kind?: "push" | "fade" | "puff" | "drop"; children: React.ReactNode }> = ({ dur, exit = 14, kind = "push", children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [dur - exit, dur], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const style: React.CSSProperties =
    kind === "fade" ? { opacity: 1 - t } :
    kind === "puff" ? { opacity: 1 - t, transform: `scale(${1 + t * 0.25})` } :
    kind === "drop" ? { opacity: 1 - t, transform: `translateY(${t * 220}px) rotate(${t * 8}deg)` } :
    { opacity: 1 - t, transform: `translateX(${-t * 320}px) scale(${1 - t * 0.12})` };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

// Continuity helpers: carry a subject between adjacent scenes. Scene A ends
// with exitRight(...), scene B opens with enterLeft(...) — the character
// appears to WALK from one scene into the next.
export const exitRight = (frame: number, dur: number, restX: number, dist = 620, over = 24) =>
  restX + interpolate(frame, [dur - over, dur], [0, dist], CLAMP);
export const enterLeft = (frame: number, restX: number, dist = 620, over = 24, from = 0) =>
  restX - dist + interpolate(frame, [from, from + over], [0, dist], CLAMP);

// Dim background depth props: a perspective grid + drifting soft shapes behind
// the action (between the particle field and the content). Opt-in via
// SceneShell's `depth` prop.
export const DepthProps: React.FC<{ seed?: number }> = ({ seed = 3 }) => {
  const frame = useCurrentFrame();
  const shapes = [
    { x: 8, y: 18, s: 130, r: 26 },
    { x: 84, y: 12, s: 90, r: 18 },
    { x: 76, y: 72, s: 150, r: 30 },
    { x: 14, y: 70, s: 80, r: 16 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* faint floor grid */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "26%", opacity: 0.1, backgroundImage: `repeating-linear-gradient(90deg, ${CYAN} 0 1px, transparent 1px 120px), repeating-linear-gradient(0deg, ${CYAN} 0 1px, transparent 1px 44px)`, maskImage: "linear-gradient(180deg, transparent, black)", WebkitMaskImage: "linear-gradient(180deg, transparent, black)" }} />
      <ParallaxLayer depth={2.4}>
        {shapes.map((sh, i) => (
          <div key={i} style={{ position: "absolute", left: `${sh.x}%`, top: `${sh.y + Math.sin(frame * 0.014 + i + seed) * 2.5}%`, width: sh.s, height: sh.s, borderRadius: sh.r, border: `2px solid ${i % 2 ? CYAN : BLUE}`, opacity: 0.07 }} />
        ))}
      </ParallaxLayer>
    </AbsoluteFill>
  );
};

// Design-time layout guide: draws labeled bounding boxes for the zones a scene
// promises (action / headline / labels). NEVER renders in the final video —
// preview-only, and only when `on` is true. Catch overlaps in Studio, not in
// rendered stills.
export const DebugZones: React.FC<{ on?: boolean; zones: { label: string; x: number; y: number; w: number; h: number; color?: string }[] }> = ({ on = true, zones }) => {
  if (!on || getRemotionEnvironment().isRendering) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {zones.map((z) => (
        <div key={z.label} style={{ position: "absolute", left: z.x, top: z.y, width: z.w, height: z.h, border: `2px dashed ${z.color ?? "#FF5AF1"}`, borderRadius: 6 }}>
          <span style={{ position: "absolute", top: -24, left: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: z.color ?? "#FF5AF1" }}>{z.label}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};
