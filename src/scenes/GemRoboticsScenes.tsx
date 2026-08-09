import React from "react";
import { AbsoluteFill, interpolate, Loop, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { NEWS, DISPLAY, HERO, LabTile } from "./AiNews2Scenes";

// GemRoboticsScenes — FULL-BLEED footage kit (Kris, Aug 2026): the official
// DeepMind clips fill the ENTIRE frame on every footage beat; headlines, chips
// and diagrams sit on dark scrims OVER the footage. No bare white backdrop on
// any b-roll scene. Condensed-impact type (Anton/Oswald) in white-on-scrim.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const KICK = "#FF8A5C"; // brand kicker, brightened for dark scrims

const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

// looped muted clip element. B-ROLL TREATMENT (rights hygiene, Kris Aug 2026):
// 1.05x playback + mild grade — editorial motion that also shifts the clip
// fingerprint away from a verbatim copy. Loop window shrinks to match rate.
const BROLL_RATE = 1.05;
const ClipVid: React.FC<{ clip: string; clipDur?: number }> = ({ clip, clipDur }) => {
  const vid = <OffthreadVideo src={staticFile(clip)} muted playbackRate={BROLL_RATE} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(1.08) brightness(1.02)" }} />;
  const eff = clipDur ? Math.max(1, Math.floor(clipDur / BROLL_RATE)) : undefined;
  return eff ? <Loop durationInFrames={eff} layout="none">{vid}</Loop> : vid;
};

const FilmPill: React.FC = () => (
  <div style={{ position: "absolute", top: 22, left: 24, display: "flex", alignItems: "center", gap: 9, padding: "7px 14px", borderRadius: 8, background: "rgba(10,9,8,0.66)", border: `1px solid ${NEWS.brand}` }}>
    <div style={{ width: 9, height: 9, borderRadius: "50%", background: NEWS.red }} />
    <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>· Official footage</span>
  </div>
);
const SourceTag: React.FC<{ source: string }> = ({ source }) => (
  <div style={{ position: "absolute", bottom: 16, right: 22, fontFamily: DISPLAY, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.78)" }}>© {source} — commentary & criticism</div>
);

// The full-bleed stage: clip covers the frame; scrim carries the text.
const FullBleed: React.FC<{ clip: string; clipDur?: number; scrim?: string; children?: React.ReactNode; punchIn?: boolean }>
  = ({ clip, clipDur, scrim, children, punchIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { stiffness: 120, damping: 20, mass: 0.9 }, durationInFrames: 24 });
  const scale = punchIn ? interpolate(e, [0, 1], [0.72, 1]) : 1;
  const radius = punchIn ? interpolate(e, [0, 1], [30, 0]) : 0;
  const op = punchIn ? interpolate(frame, [0, 6], [0.55, 1], CLAMP) : 1;
  // documentary push-in + drift (also part of the b-roll treatment)
  const push = interpolate(frame, [0, 480], [1.04, 1.12], CLAMP);
  const driftX = Math.sin(frame * 0.008) * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A09" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, borderRadius: radius, overflow: "hidden", opacity: op }}>
        <AbsoluteFill style={{ transform: `scale(${push}) translateX(${driftX}px)` }}>
          <ClipVid clip={clip} clipDur={clipDur} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: scrim ?? "linear-gradient(180deg, rgba(10,9,8,0.74) 0%, rgba(10,9,8,0.28) 24%, rgba(10,9,8,0.12) 58%, rgba(10,9,8,0.62) 100%)", pointerEvents: "none" }} />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// White headline overlaid on the scrim (kicker + fitted Anton title + rule)
const OverlayHeadline: React.FC<{ kicker?: string; title: string; titleSize?: number }>
  = ({ kicker, title, titleSize = 74 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fitted = React.useMemo(
    () => Math.min(titleSize, fitText({ text: title, withinWidth: 1560, fontFamily: HERO, fontWeight: 400, letterSpacing: "1px" }).fontSize),
    [title, titleSize],
  );
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  return (
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
      {kicker ? <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: 5, textTransform: "uppercase", color: KICK, opacity: interpolate(frame, [0, 14], [0, 1], CLAMP) }}>{kicker}</span> : null}
      <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: fitted, letterSpacing: 1, color: "#fff", lineHeight: 0.98, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${interpolate(slam, [0, 1], [1.18, 1])})`, opacity: interpolate(frame, [6, 20], [0, 1], CLAMP), textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}>{title}</div>
      <div style={{ width: interpolate(slam, [0, 1], [40, 190], CLAMP), height: 6, background: NEWS.brand, borderRadius: 3 }} />
    </div>
  );
};

// timed sticker chips on the bottom scrim
const ChipRail: React.FC<{ chips: { at: number; label: string }[]; bottom?: number }> = ({ chips, bottom = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", bottom, left: 0, right: 0, display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
      {chips.map((c, i) => {
        const e = spr(frame, fps, c.at, 22);
        const tilt = [-2, 1.5, -1.5, 2][i % 4];
        return (
          <div key={c.label} style={{ padding: "12px 24px", borderRadius: 10, background: "rgba(16,14,12,0.92)", borderTop: `4px solid ${NEWS.brand}`, boxShadow: "0 10px 26px rgba(0,0,0,0.4)", transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [c.at, c.at + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 1, textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap" }}>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// kept for API compat (side panels) — no longer the primary treatment
export const SideClip: React.FC<{ clip: string; clipDur?: number; w?: number; h?: number; at?: number; source?: string }>
  = ({ clip, clipDur, w = 720, h = 430, at = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 26);
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 14, overflow: "hidden", background: NEWS.dark, boxShadow: "0 18px 44px rgba(20,18,16,0.24)", transform: `scale(${interpolate(e, [0, 1], [0.92, 1])})`, opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP), flexShrink: 0 }}>
      <ClipVid clip={clip} clipDur={clipDur} />
    </div>
  );
};

// ── MontageClipCard — FULL-BLEED montage; source switches at whisper anchors ──
export type MontagePart = { src: string; at: number; label?: string; clipDur?: number };
export const MontageClipCard: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; parts: MontagePart[]; source: string;
  chips?: { at: number; label: string }[]; punchIn?: boolean;
}> = ({ kicker, title, parts, source, chips, punchIn }) => {
  const frame = useCurrentFrame();
  const active = parts.filter((p) => frame >= p.at);
  const cur = active.length ? active[active.length - 1] : parts[0];
  const flash = cur.at > 0 ? interpolate(frame - cur.at, [0, 5], [0.7, 0], CLAMP) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A09" }}>
      {parts.map((p) => {
        const isCur = p.src === cur.src && p.at === cur.at;
        if (!isCur) return null;
        return (
          <Sequence key={`${p.src}-${p.at}`} from={p.at} layout="none">
            <FullBleed clip={p.src} clipDur={p.clipDur} punchIn={punchIn && p.at === 0} />
          </Sequence>
        );
      })}
      <OverlayHeadline kicker={kicker} title={title} />
      {cur.label ? (
        <div style={{ position: "absolute", bottom: 60, left: 28, padding: "9px 18px", borderRadius: 8, background: "rgba(16,14,12,0.9)", borderLeft: `5px solid ${NEWS.brand}` }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff" }}>{cur.label}</span>
        </div>
      ) : null}
      {chips ? <ChipRail chips={chips} bottom={130} /> : null}
      <FilmPill />
      <SourceTag source={source} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ── AnnotatedClipCard — FULL-BLEED single demo + timed annotations ───────────
export const AnnotatedClipCard: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; clip: string; source: string;
  chips: { at: number; label: string }[]; clipDur?: number;
}> = ({ kicker, title, clip, source, chips, clipDur }) => (
  <AbsoluteFill>
    <FullBleed clip={clip} clipDur={clipDur} />
    <OverlayHeadline kicker={kicker} title={title} />
    <ChipRail chips={chips} />
    <FilmPill />
    <SourceTag source={source} />
  </AbsoluteFill>
);

// ── ClipTakeaway — FULL-BLEED clip; text block on a left scrim ────────────────
export const ClipTakeaway: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; stamp?: string; stampAt?: number;
  clip: string; clipDur?: number; titleSize?: number;
}> = ({ kicker, title, stamp, stampAt = 60, clip, clipDur, titleSize = 72 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  return (
    <AbsoluteFill>
      <FullBleed clip={clip} clipDur={clipDur} scrim="linear-gradient(90deg, rgba(10,9,8,0.86) 0%, rgba(10,9,8,0.62) 38%, rgba(10,9,8,0.12) 68%), linear-gradient(180deg, rgba(10,9,8,0.3) 0%, transparent 30%)" />
      <div style={{ position: "absolute", left: 84, top: 0, bottom: 0, width: 880, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 20 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 27, letterSpacing: 5, textTransform: "uppercase", color: KICK, opacity: interpolate(frame, [0, 12], [0, 1], CLAMP) }}>{kicker}</span>
        <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: titleSize, letterSpacing: 1, color: "#fff", lineHeight: 1.02, textTransform: "uppercase", maxWidth: 860, transform: `scale(${interpolate(slam, [0, 1], [1.1, 1])})`, transformOrigin: "left center", opacity: interpolate(frame, [6, 20], [0, 1], CLAMP), textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{title}</div>
        <div style={{ width: interpolate(slam, [0, 1], [40, 190], CLAMP), height: 6, background: NEWS.brand, borderRadius: 3 }} />
        {stamp ? (
          <div style={{ marginTop: 10, padding: "13px 30px", borderRadius: 10, background: NEWS.brand, transform: `rotate(-1.5deg) scale(${interpolate(stampS, [0, 1], [1.5, 1])})`, transformOrigin: "left center", opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: "0 14px 36px rgba(0,0,0,0.4)" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{stamp}</span>
          </div>
        ) : null}
      </div>
      <FilmPill />
      <SourceTag source="DeepMind — Gemini Robotics 2" />
    </AbsoluteFill>
  );
};

// ── OneBrainScene — diagram ON dimmed full-bleed footage ─────────────────────
export const OneBrainScene: React.FC<{ durationInFrames: number; tint?: string; coreAt: number; partAts: number[]; tagAt: number; clip: string; clipDur?: number }>
  = ({ coreAt, partAts, tagAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const parts = ["Arms", "Hands", "Movement", "Balance"];
  const core = spr(frame, fps, coreAt, 26);
  const tag = spr(frame, fps, tagAt, 22);
  const pos = [{ x: -420, y: -130 }, { x: 420, y: -130 }, { x: -420, y: 130 }, { x: 420, y: 130 }];
  const cx = 960, cy = 590;
  return (
    <AbsoluteFill>
      <FullBleed clip={clip} clipDur={clipDur} scrim="linear-gradient(180deg, rgba(10,9,8,0.8) 0%, rgba(10,9,8,0.62) 30%, rgba(10,9,8,0.66) 100%)" />
      <OverlayHeadline kicker="Google's claim" title="ONE MODEL RUNS THE WHOLE BODY" titleSize={68} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {pos.map((p, i) => {
          const at = partAts[i] ?? 0;
          const d = interpolate(frame, [at, at + 14], [0, 1], CLAMP);
          return <line key={i} x1={cx + p.x * 0.78 * d} y1={cy + p.y * 0.78 * d} x2={cx + p.x * 0.3} y2={cy + p.y * 0.3} stroke="#7FB0FF" strokeWidth={3} opacity={d * 0.85} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 160, top: cy - 80, width: 320, height: 160, borderRadius: 16, background: "rgba(16,14,12,0.94)", borderTop: `5px solid ${NEWS.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 18px 44px rgba(0,0,0,0.4), 0 0 46px ${NEWS.blue}44`, transform: `scale(${interpolate(core, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [coreAt, coreAt + 8], [0, 1], CLAMP) }}>
        <LabTile logo="google" h={52} at={coreAt + 4} />
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 34, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One model</span>
      </div>
      {parts.map((p, i) => {
        const at = partAts[i] ?? 0;
        const e = spr(frame, fps, at, 24);
        return (
          <div key={p} style={{ position: "absolute", left: cx + pos[i].x - 125, top: cy + pos[i].y - 40, width: 250, height: 80, borderRadius: 12, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", transform: `scale(${interpolate(e, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink }}>{p}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: cx, bottom: 96, transform: `translateX(-50%) rotate(-1.5deg) scale(${interpolate(tag, [0, 1], [1.4, 1])})`, padding: "11px 28px", borderRadius: 10, background: NEWS.blue, opacity: interpolate(frame, [tagAt, tagAt + 8], [0, 1], CLAMP), boxShadow: "0 12px 30px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 34, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One connected behaviour</span>
      </div>
      <FilmPill />
    </AbsoluteFill>
  );
};

// ── HandoffsScene — system chain ON dimmed footage ───────────────────────────
export const HandoffsScene: React.FC<{ durationInFrames: number; tint?: string; rowAts: number[]; sparkAt: number; unifyAt: number; clip: string; clipDur?: number }>
  = ({ rowAts, sparkAt, unifyAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const systems = ["Movement system", "Arm system", "Hand system"];
  const uni = spr(frame, fps, unifyAt, 26);
  return (
    <AbsoluteFill>
      <FullBleed clip={clip} clipDur={clipDur} scrim="linear-gradient(180deg, rgba(10,9,8,0.76) 0%, rgba(10,9,8,0.3) 28%, rgba(10,9,8,0.24) 62%, rgba(10,9,8,0.6) 100%)" />
      <OverlayHeadline kicker="Why robots get messy" title="EVERY HANDOFF CAN BREAK" titleSize={68} />
      <div style={{ position: "absolute", bottom: 250, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
        {systems.map((s, i) => {
          const at = rowAts[i] ?? 0;
          const e = spr(frame, fps, at, 24);
          const sparkOn = frame >= sparkAt && i < systems.length - 1;
          const pulse = sparkOn ? 0.6 + 0.4 * Math.abs(Math.sin((frame - sparkAt) * 0.35)) : 0;
          return (
            <React.Fragment key={s}>
              <div style={{ width: 300, padding: "18px 14px", borderRadius: 12, background: "rgba(16,14,12,0.92)", borderTop: `4px solid ${NEWS.amber}`, textAlign: "center", boxShadow: "0 14px 34px rgba(0,0,0,0.4)", transform: `translateY(${interpolate(e, [0, 1], [34, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff" }}>{s}</span>
              </div>
              {i < systems.length - 1 && (
                <div style={{ width: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: interpolate(frame, [(rowAts[i + 1] ?? 0), (rowAts[i + 1] ?? 0) + 8], [0, 1], CLAMP) }}>
                  <span style={{ fontFamily: HERO, fontSize: 44, color: "rgba(255,255,255,0.85)" }}>→</span>
                  {sparkOn && <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: 1, color: "#FF6B5A", textTransform: "uppercase", opacity: pulse }}>⚠ risk</span>}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 110, width: 1040, marginLeft: -520, padding: "15px 0", borderRadius: 12, background: "rgba(16,14,12,0.94)", borderTop: `5px solid ${NEWS.green}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: `0 16px 44px rgba(0,0,0,0.45), 0 0 40px ${NEWS.green}44`, transform: `translateY(${interpolate(uni, [0, 1], [40, 0])}px) scale(${interpolate(uni, [0, 1], [0.94, 1])})`, opacity: interpolate(frame, [unifyAt, unifyAt + 8], [0, 1], CLAMP) }}>
        <LabTile logo="google" h={50} at={unifyAt + 4} />
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>Gemini Robotics 2 — one system, fewer handoffs</span>
      </div>
      <FilmPill />
    </AbsoluteFill>
  );
};

// ── HardwareVsAI — two cards ON dimmed garage footage ────────────────────────
export const HardwareVsAI: React.FC<{ durationInFrames: number; tint?: string; leftAt: number; rightAt: number; clip: string; clipDur?: number }>
  = ({ leftAt, rightAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eL = spr(frame, fps, leftAt, 26);
  const eR = spr(frame, fps, rightAt, 26);
  return (
    <AbsoluteFill>
      <FullBleed clip={clip} clipDur={clipDur} scrim="linear-gradient(180deg, rgba(10,9,8,0.8) 0%, rgba(10,9,8,0.55) 32%, rgba(10,9,8,0.6) 100%)" />
      <OverlayHeadline kicker="Worth separating" title="THE BODIES AREN'T THE STORY" titleSize={68} />
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 44 }}>
        <div style={{ width: 620, padding: "36px 34px", borderRadius: 12, background: "rgba(16,14,12,0.92)", borderTop: `5px solid rgba(255,255,255,0.4)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: "0 16px 44px rgba(0,0,0,0.4)", transform: `translateY(${interpolate(eL, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [leftAt, leftAt + 8], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The bodies</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 27, textAlign: "center", color: "rgba(255,255,255,0.85)" }}>Apollo & Duo — third-party humanoid platforms</span>
        </div>
        <div style={{ width: 620, padding: "36px 34px", borderRadius: 12, background: "rgba(16,14,12,0.92)", borderTop: `5px solid ${NEWS.brand}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: "0 16px 44px rgba(0,0,0,0.4)", transform: `translateY(${interpolate(eR, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [rightAt, rightAt + 8], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The brain</span>
          <LabTile logo="google" h={62} at={rightAt + 6} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 27, textAlign: "center", color: "rgba(255,255,255,0.85)" }}>Google's contribution: the intelligence</span>
        </div>
      </div>
      <FilmPill />
    </AbsoluteFill>
  );
};

// ── MissingProofScene — red-cross rows ON the dimmed reel ────────────────────
export const MissingProofScene: React.FC<{ durationInFrames: number; tint?: string; items: { at: number; label: string; sub?: string }[]; clip: string; clipDur?: number; kicker?: string; title?: string }>
  = ({ items, clip, clipDur, kicker = "What Google hasn't shown", title = "THE MISSING PROOF" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <FullBleed clip={clip} clipDur={clipDur} scrim="linear-gradient(180deg, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.62) 30%, rgba(10,9,8,0.66) 100%)" />
      <OverlayHeadline kicker={kicker} title={title} titleSize={72} />
      <div style={{ position: "absolute", top: 330, left: "50%", width: 1100, marginLeft: -550, display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((it) => {
          const e = spr(frame, fps, it.at, 24);
          return (
            <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 30px", borderRadius: 12, background: "rgba(16,14,12,0.92)", borderTop: `4px solid ${NEWS.red}`, boxShadow: "0 12px 32px rgba(0,0,0,0.4)", transform: `translateX(${interpolate(e, [0, 1], [-42, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
              <svg width={36} height={36} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.red} /><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 33, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", flex: 1 }}>{it.label}</span>
              {it.sub && <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 23, color: "rgba(255,255,255,0.7)" }}>{it.sub}</span>}
            </div>
          );
        })}
      </div>
      <FilmPill />
    </AbsoluteFill>
  );
};

// ── JointsStat — the 22 in white ON the dimmed packing close-up ──────────────
export const JointsStat: React.FC<{ durationInFrames: number; tint?: string; numAt: number; clip: string; clipDur?: number }>
  = ({ numAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, numAt, 26);
  const count = Math.round(interpolate(frame, [numAt, numAt + 22], [0, 22], CLAMP));
  return (
    <AbsoluteFill>
      <FullBleed clip={clip} clipDur={clipDur} scrim="linear-gradient(90deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.6) 40%, rgba(10,9,8,0.12) 70%)" />
      <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 27, letterSpacing: 5, textTransform: "uppercase", color: KICK }}>The benchmark is biology</span>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 64, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The human hand</span>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 300, lineHeight: 0.92, color: "#fff", transform: `scale(${interpolate(e, [0, 1], [0.8, 1])})`, transformOrigin: "left center", opacity: interpolate(frame, [numAt - 4, numAt + 6], [0, 1], CLAMP), textShadow: "0 6px 40px rgba(0,0,0,0.6)" }}>{count}</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 36, letterSpacing: 4, textTransform: "uppercase", color: KICK }}>Articulated joints</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 24, color: "rgba(255,255,255,0.8)" }}>the dexterity target Google is chasing</span>
      </div>
      <FilmPill />
      <SourceTag source="DeepMind — Gemini Robotics 2" />
    </AbsoluteFill>
  );
};
