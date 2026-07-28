import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../components/overlayUI";

// ReframeDirector — reframes ONE ultra-wide composite (3840×1080, screen LEFT /
// talking-head RIGHT) into a produced 16:9 tutorial (CLAUDE.md §16, AGENTS.md
// §13). The VO is one continuous <Audio> (no per-cut clicks); every visual is a
// MUTED region crop of the same file, so a shot is just "which source rect fills
// which on-screen box". Layouts: full screen · full face · screen+PIP · split.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const SRC_W = 3840;
export const SRC_H = 1080;
export type Rect = { x: number; y: number; w: number; h: number };

// Source-region presets (px in the 3840×1080 file). CRITICAL: the screen recording
// ends at ~x1885 (the RODE mic / studio starts there — the split is NOT at 1920),
// so SCREEN stops at 1872 to keep the mic out. The screen is 1920 native, so
// SCREEN fills 16:9 at ~1:1 — sharp and readable WITHOUT zooming (Kris, July 2026:
// "just a full frame of the demo" — zooms upscaled + mis-centred, so they're gone).
export const R = {
  SCREEN: { x: 0, y: 0, w: 1872, h: 1080 } as Rect, // the whole demo (mic excluded)
  FACE: { x: 1920, y: 0, w: 1920, h: 1080 } as Rect, // full talking head (already framed)
  FACE_PIP: { x: 2120, y: 60, w: 1440, h: 810 } as Rect, // tighter face for the small PIP box
};

// A draw-on highlight pinned to a SCREEN-source rect, timed to the VO. `at`/`dur`
// are beat-local frames; rect is in screen-source px (0–1872). Boxes the UI
// element as the presenter talks about it (Kris, July 2026).
export type HL = { rect: Rect; at: number; dur?: number };

export type Layout = "screen" | "face" | "pip" | "split";
export type Shot = {
  from: number;
  to: number;
  layout: Layout;
  zoom?: Rect; // screen layouts: the source rect to fill (defaults to R.SCREEN)
  showFrame?: number; // trimBefore override (teaser = show a different moment); defaults to `from`
  pipCorner?: "tl" | "tr" | "bl" | "br";
  push?: boolean; // subtle documentary push-in (screen shots)
  label?: string; // viewer-facing chip (STARTING POINT / THE PROMPT / …)
  highlights?: HL[]; // draw-on boxes on the screen, timed to the VO
};

// One highlight box, drawn in the video's source-pixel space (so it tracks the crop).
const Highlight: React.FC<{ h: HL; scale: number; frame: number }> = ({ h, scale, frame }) => {
  const t = frame - h.at;
  const dur = h.dur ?? 85;
  if (t < -8 || t > dur + 14) return null;
  const draw = interpolate(t, [0, 10], [0, 1], CLAMP);
  const out = interpolate(t, [dur, dur + 14], [1, 0], CLAMP);
  const op = Math.min(draw, out);
  const s = interpolate(draw, [0, 1], [1.06, 1], CLAMP);
  return (
    <div style={{
      position: "absolute", left: h.rect.x * scale, top: h.rect.y * scale,
      width: h.rect.w * scale, height: h.rect.h * scale,
      border: "3px solid #D97757", borderRadius: 6,
      boxShadow: "0 0 22px rgba(217,119,87,0.65), inset 0 0 14px rgba(217,119,87,0.2)",
      background: "rgba(217,119,87,0.08)", opacity: op,
      transform: `scale(${s})`, transformOrigin: "center", pointerEvents: "none",
    }} />
  );
};

// Fill on-screen `box` with source-region `rect` (cover), from one muted decode.
const RegionView: React.FC<{ src: string; showFrame: number; rect: Rect; box: Rect; radius?: number; scaleBoost?: number; highlights?: HL[] }>
  = ({ src, showFrame, rect, box, radius = 0, scaleBoost = 1, highlights }) => {
  const frame = useCurrentFrame();
  const base = Math.max(box.w / rect.w, box.h / rect.h);
  const scale = base * scaleBoost;
  const vidW = SRC_W * scale;
  const vidH = SRC_H * scale;
  const offX = -rect.x * scale + (box.w - rect.w * scale) / 2;
  const offY = -rect.y * scale + (box.h - rect.h * scale) / 2;
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", borderRadius: radius }}>
      <div style={{ position: "absolute", width: vidW, height: vidH, left: offX, top: offY }}>
        <OffthreadVideo src={staticFile(src)} muted trimBefore={showFrame > 0 ? showFrame : undefined} style={{ width: "100%", height: "100%" }} />
        {highlights?.map((h, i) => <Highlight key={i} h={h} scale={scale} frame={frame} />)}
      </div>
    </div>
  );
};

const PIP_BOX: Record<NonNullable<Shot["pipCorner"]>, Rect> = {
  tl: { x: 40, y: 40, w: 384, h: 216 },
  tr: { x: 1920 - 40 - 384, y: 40, w: 384, h: 216 },
  bl: { x: 40, y: 1080 - 40 - 216, w: 384, h: 216 },
  br: { x: 1920 - 40 - 384, y: 1080 - 40 - 216, w: 384, h: 216 },
};

const TutorialLabel: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const op = Math.min(interpolate(frame, [6, 16], [0, 1], CLAMP), interpolate(frame, [90, 104], [1, 0], CLAMP));
  const x = interpolate(frame, [6, 16], [-16, 0], CLAMP);
  return (
    <div style={{ position: "absolute", left: 48, top: 46, opacity: op, transform: `translateX(${x}px)`, display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: 10, background: "rgba(20,18,16,0.82)", border: "1px solid rgba(217,119,87,0.5)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D97757" }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: "#fff", textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};

const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080 };

const ShotView: React.FC<{ src: string; shot: Shot }> = ({ src, shot }) => {
  const frame = useCurrentFrame();
  const dur = shot.to - shot.from;
  const show = shot.showFrame ?? shot.from;
  const push = shot.push ? interpolate(frame, [0, dur], [1, 1.035], CLAMP) : 1;

  let body: React.ReactNode;
  if (shot.layout === "face") {
    body = <RegionView src={src} showFrame={show} rect={R.FACE} box={FULL} scaleBoost={push} />;
  } else if (shot.layout === "split") {
    // 58/42 — screen larger, face clearly visible; each cover-fills its half
    body = (
      <>
        <RegionView src={src} showFrame={show} rect={R.SCREEN} box={{ x: 0, y: 0, w: 1114, h: 1080 }} />
        <RegionView src={src} showFrame={show} rect={R.FACE} box={{ x: 1114, y: 0, w: 806, h: 1080 }} />
      </>
    );
  } else if (shot.layout === "pip") {
    const pb = PIP_BOX[shot.pipCorner ?? "br"];
    body = (
      <>
        <RegionView src={src} showFrame={show} rect={shot.zoom ?? R.SCREEN} box={FULL} scaleBoost={push} highlights={shot.highlights} />
        <div style={{ position: "absolute", left: pb.x, top: pb.y, width: pb.w, height: pb.h, borderRadius: 16, overflow: "hidden", border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
          <RegionView src={src} showFrame={show} rect={R.FACE_PIP} box={{ x: 0, y: 0, w: pb.w, h: pb.h }} />
        </div>
      </>
    );
  } else {
    body = <RegionView src={src} showFrame={show} rect={shot.zoom ?? R.SCREEN} box={FULL} scaleBoost={push} highlights={shot.highlights} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {body}
      {shot.label && <TutorialLabel text={shot.label} />}
    </AbsoluteFill>
  );
};

// The whole reframed cut: continuous VO + one muted-crop Sequence per shot.
export const TutorialReframe: React.FC<{ src: string; shots: Shot[]; volume?: number }>
  = ({ src, shots, volume = 1 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile(src)} volume={volume} />
      {shots.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.to - s.from} premountFor={20}>
          <ShotView src={src} shot={s} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
