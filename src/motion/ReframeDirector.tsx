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

// Source-region presets (px in the 3840×1080 file). SCREEN region is x0–1920;
// EVERY screen rect stays inside [0,1920] or the studio (x>1920) bleeds in.
// Rects read off a 240px grid on the settled screen frames.
export const R = {
  SCREEN: { x: 0, y: 0, w: 1920, h: 1080 } as Rect, // whole demo
  PROMPT: { x: 460, y: 560, w: 840, h: 473 } as Rect, // Claude Code prompt box (below the promo notice)
  MODEL: { x: 740, y: 440, w: 760, h: 428 } as Rect, // the open model list (Default/Opus/Fable/Sonnet/Haiku)
  BUILD: { x: 200, y: 110, w: 1300, h: 731 } as Rect, // Claude output + files (left/centre)
  APP: { x: 820, y: 140, w: 1000, h: 563 } as Rect, // the whole app card in the browser preview
  APP_WIDE: { x: 760, y: 120, w: 1120, h: 630 } as Rect, // wider browser establish
  FACE: { x: 1920, y: 0, w: 1920, h: 1080 } as Rect, // full talking head (already framed)
  FACE_PIP: { x: 2120, y: 60, w: 1440, h: 810 } as Rect, // tighter face for the small PIP box
};

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
};

// Fill on-screen `box` with source-region `rect` (cover), from one muted decode.
const RegionView: React.FC<{ src: string; showFrame: number; rect: Rect; box: Rect; radius?: number; scaleBoost?: number }>
  = ({ src, showFrame, rect, box, radius = 0, scaleBoost = 1 }) => {
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
        <RegionView src={src} showFrame={show} rect={shot.zoom ?? R.SCREEN} box={FULL} scaleBoost={push} />
        <div style={{ position: "absolute", left: pb.x, top: pb.y, width: pb.w, height: pb.h, borderRadius: 16, overflow: "hidden", border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
          <RegionView src={src} showFrame={show} rect={R.FACE_PIP} box={{ x: 0, y: 0, w: pb.w, h: pb.h }} />
        </div>
      </>
    );
  } else {
    body = <RegionView src={src} showFrame={show} rect={shot.zoom ?? R.SCREEN} box={FULL} scaleBoost={push} />;
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
