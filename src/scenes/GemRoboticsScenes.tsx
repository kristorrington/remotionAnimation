import React from "react";
import { AbsoluteFill, interpolate, Loop, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NEWS, DISPLAY, HERO, NewsShell, NewsHeadline, LabTile } from "./AiNews2Scenes";

// GemRoboticsScenes — the FOOTAGE-FIRST kit for the Gemini Robotics 2 video
// (Kris: "use as much video footage as possible — EVEN ON THE ANIMATION
// SLIDES"). Official DeepMind demo clips ride play-framed film cards, and
// every diagram/takeaway scene carries a live SideClip panel so real footage
// never stops rolling. Bold-newsroom style shared with AiNews2.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

// film-card chrome (shared)
const FilmChrome: React.FC<{ source: string; small?: boolean }> = ({ source, small }) => (
  <>
    <div style={{ position: "absolute", top: small ? 10 : 16, left: small ? 10 : 16, display: "flex", alignItems: "center", gap: 8, padding: small ? "5px 10px" : "7px 14px", borderRadius: 8, background: "rgba(10,9,8,0.66)", border: `1px solid ${NEWS.brand}` }}>
      <div style={{ width: small ? 7 : 9, height: small ? 7 : 9, borderRadius: "50%", background: NEWS.red }} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: small ? 14 : 18, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>· Official footage</span>
    </div>
    <div style={{ position: "absolute", bottom: small ? 8 : 12, right: small ? 10 : 16, fontFamily: DISPLAY, fontWeight: 500, fontSize: small ? 13 : 17, color: "rgba(255,255,255,0.7)" }}>{source}</div>
  </>
);

// looped muted clip element
const ClipVid: React.FC<{ clip: string; clipDur?: number }> = ({ clip, clipDur }) => {
  const vid = <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return clipDur ? <Loop durationInFrames={clipDur} layout="none">{vid}</Loop> : vid;
};

// ── SideClip — the live footage panel that rides beside diagrams/takeaways ───
export const SideClip: React.FC<{ clip: string; clipDur?: number; w?: number; h?: number; at?: number; source?: string }>
  = ({ clip, clipDur, w = 720, h = 430, at = 6, source = "DeepMind" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 26);
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 14, overflow: "hidden", background: NEWS.dark, border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 18px 44px rgba(20,18,16,0.24)", transform: `scale(${interpolate(e, [0, 1], [0.92, 1])})`, opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP), flexShrink: 0 }}>
      <ClipVid clip={clip} clipDur={clipDur} />
      <FilmChrome source={source} small />
    </div>
  );
};

// ── MontageClipCard — one film card whose SOURCE switches at whisper anchors ──
export type MontagePart = { src: string; at: number; label?: string; clipDur?: number };
export const MontageClipCard: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; parts: MontagePart[]; source: string;
  chips?: { at: number; label: string }[]; punchIn?: boolean;
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, parts, source, chips, punchIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { stiffness: 120, damping: 20, mass: 0.9 }, durationInFrames: 24 });
  const scale = punchIn ? interpolate(e, [0, 1], [0.62, 1]) : interpolate(e, [0, 1], [0.92, 1]);
  const op = punchIn ? interpolate(frame, [0, 6], [0.55, 1], CLAMP) : interpolate(frame, [2, 12], [0, 1], CLAMP);
  const cardW = 1460, cardH = 700;
  const active = parts.filter((p) => frame >= p.at);
  const cur = active.length ? active[active.length - 1] : parts[0];
  const cutT = frame - cur.at;
  const flash = cur.at > 0 ? interpolate(cutT, [0, 5], [0.7, 0], CLAMP) : 0;
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={64} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 14, overflow: "hidden", background: NEWS.dark, border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 22px 54px rgba(20,18,16,0.28)", transform: `scale(${scale})`, opacity: op }}>
          {parts.map((p) => {
            const isCur = p.src === cur.src && p.at === cur.at;
            if (!isCur) return null;
            return (
              <Sequence key={`${p.src}-${p.at}`} from={p.at} layout="none">
                <div style={{ position: "absolute", inset: 0 }}>
                  <ClipVid clip={p.src} clipDur={p.clipDur} />
                </div>
              </Sequence>
            );
          })}
          {cur.label ? (
            <div style={{ position: "absolute", bottom: 14, left: 16, padding: "7px 16px", borderRadius: 8, background: "rgba(10,9,8,0.7)" }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff" }}>{cur.label}</span>
            </div>
          ) : null}
          <FilmChrome source={source} />
          <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
        </div>
        {chips ? <ChipRail chips={chips} /> : null}
      </div>
    </NewsShell>
  );
};

// timed sticker chips beneath a film card (pop on their whisper word)
const ChipRail: React.FC<{ chips: { at: number; label: string }[] }> = ({ chips }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", minHeight: 64 }}>
      {chips.map((c, i) => {
        const e = spr(frame, fps, c.at, 22);
        const tilt = [-2, 1.5, -1.5, 2][i % 4];
        return (
          <div key={c.label} style={{ padding: "12px 24px", borderRadius: 10, background: NEWS.dark, borderTop: `4px solid ${NEWS.brand}`, boxShadow: "0 10px 26px rgba(20,18,16,0.2)", transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [c.at, c.at + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1, textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap" }}>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── AnnotatedClipCard — ONE long demo clip + a rail of timed annotations ─────
export const AnnotatedClipCard: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; clip: string; source: string;
  chips: { at: number; label: string }[]; clipDur?: number;
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, clip, source, chips, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, 4, 26);
  const cardW = 1460, cardH = 700;
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={64} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 14, overflow: "hidden", background: NEWS.dark, border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 22px 54px rgba(20,18,16,0.28)", transform: `scale(${interpolate(e, [0, 1], [0.92, 1])})`, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP) }}>
          <ClipVid clip={clip} clipDur={clipDur} />
          <FilmChrome source={source} />
        </div>
        <ChipRail chips={chips} />
      </div>
    </NewsShell>
  );
};

// ── ClipTakeaway — headline + stamp LEFT, live footage panel RIGHT ────────────
export const ClipTakeaway: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; stamp?: string; stampAt?: number;
  clip: string; clipDur?: number; titleSize?: number;
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, stamp, stampAt = 60, clip, clipDur, titleSize = 66 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  const kOp = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} impacts={stamp ? [stampAt] : undefined}>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18, width: 720 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 5, textTransform: "uppercase", color: NEWS.brand, opacity: kOp }}>{kicker}</span>
          <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: titleSize, letterSpacing: 1, color: NEWS.ink, lineHeight: 1.02, textTransform: "uppercase", transform: `scale(${interpolate(slam, [0, 1], [1.12, 1])})`, transformOrigin: "left center", opacity: interpolate(frame, [6, 20], [0, 1], CLAMP) }}>{title}</div>
          <div style={{ width: interpolate(slam, [0, 1], [40, 190]), height: 6, background: NEWS.brand, borderRadius: 3 }} />
          {stamp ? (
            <div style={{ marginTop: 8, padding: "12px 28px", borderRadius: 10, background: NEWS.dark, transform: `rotate(-1.5deg) scale(${interpolate(stampS, [0, 1], [1.5, 1])})`, transformOrigin: "left center", opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: "0 14px 36px rgba(20,18,16,0.24)" }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{stamp}</span>
            </div>
          ) : null}
        </div>
        <SideClip clip={clip} clipDur={clipDur} w={860} h={520} />
      </div>
    </NewsShell>
  );
};

// ── OneBrainScene — body systems wiring into ONE core, live clip beside ──────
export const OneBrainScene: React.FC<{ durationInFrames: number; tint?: string; coreAt: number; partAts: number[]; tagAt: number; clip: string; clipDur?: number }>
  = ({ durationInFrames, tint = NEWS.blue, coreAt, partAts, tagAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const parts = ["Arms", "Hands", "Movement", "Balance"];
  const core = spr(frame, fps, coreAt, 26);
  const tag = spr(frame, fps, tagAt, 22);
  const pos = [{ x: -250, y: -140 }, { x: 250, y: -140 }, { x: -250, y: 140 }, { x: 250, y: 140 }];
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="Google's claim" title="ONE MODEL RUNS THE WHOLE BODY" titleSize={64} accent={NEWS.brand} />}>
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <SideClip clip={clip} clipDur={clipDur} w={680} h={440} />
        <div style={{ position: "relative", width: 760, height: 440 }}>
          <svg width={760} height={440} style={{ position: "absolute", inset: 0 }}>
            {pos.map((p, i) => {
              const at = partAts[i] ?? 0;
              const d = interpolate(frame, [at, at + 14], [0, 1], CLAMP);
              return <line key={i} x1={380 + p.x * 0.8 * d} y1={200 + p.y * 0.8 * d} x2={380 + p.x * 0.3} y2={200 + p.y * 0.3} stroke={NEWS.blue} strokeWidth={3} opacity={d * 0.7} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: 380 - 150, top: 200 - 74, width: 300, height: 148, borderRadius: 16, background: NEWS.dark, borderTop: `5px solid ${NEWS.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 18px 44px rgba(20,18,16,0.25), 0 0 40px ${NEWS.blue}33`, transform: `scale(${interpolate(core, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [coreAt, coreAt + 8], [0, 1], CLAMP) }}>
            <LabTile logo="google" h={50} at={coreAt + 4} />
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 32, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One model</span>
          </div>
          {parts.map((p, i) => {
            const at = partAts[i] ?? 0;
            const e = spr(frame, fps, at, 24);
            return (
              <div key={p} style={{ position: "absolute", left: 380 + pos[i].x - 110, top: 200 + pos[i].y - 36, width: 220, height: 72, borderRadius: 12, background: "#FFFFFF", border: "1.5px solid rgba(20,18,16,0.16)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(20,18,16,0.14)", transform: `scale(${interpolate(e, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink }}>{p}</span>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 380, bottom: -14, transform: `translateX(-50%) rotate(-1.5deg) scale(${interpolate(tag, [0, 1], [1.4, 1])})`, padding: "9px 24px", borderRadius: 10, background: NEWS.blue, opacity: interpolate(frame, [tagAt, tagAt + 8], [0, 1], CLAMP), boxShadow: `0 12px 30px ${NEWS.blue}44`, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One connected behaviour</span>
          </div>
        </div>
      </div>
    </NewsShell>
  );
};

// ── HandoffsScene — stacked systems sparking at handoffs, live clip beside ────
export const HandoffsScene: React.FC<{ durationInFrames: number; tint?: string; rowAts: number[]; sparkAt: number; unifyAt: number; clip: string; clipDur?: number }>
  = ({ durationInFrames, tint = NEWS.amber, rowAts, sparkAt, unifyAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const systems = ["Movement system", "Arm system", "Hand system"];
  const uni = spr(frame, fps, unifyAt, 26);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} impacts={[sparkAt]} header={<NewsHeadline kicker="Why robots get messy" title="EVERY HANDOFF CAN BREAK" titleSize={64} accent={NEWS.brand} />}>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {systems.map((s, i) => {
            const at = rowAts[i] ?? 0;
            const e = spr(frame, fps, at, 24);
            const sparkOn = frame >= sparkAt && i < systems.length - 1;
            const pulse = sparkOn ? 0.6 + 0.4 * Math.abs(Math.sin((frame - sparkAt) * 0.35)) : 0;
            return (
              <React.Fragment key={s}>
                <div style={{ width: 460, padding: "18px 18px", borderRadius: 12, background: NEWS.dark, borderTop: `4px solid ${NEWS.amber}`, textAlign: "center", boxShadow: "0 14px 30px rgba(20,18,16,0.18)", transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff" }}>{s}</span>
                </div>
                {i < systems.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: interpolate(frame, [(rowAts[i + 1] ?? 0), (rowAts[i + 1] ?? 0) + 8], [0, 1], CLAMP) }}>
                    <span style={{ fontFamily: HERO, fontSize: 30, color: NEWS.inkDim }}>↓</span>
                    {sparkOn && <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, letterSpacing: 1, color: NEWS.red, textTransform: "uppercase", opacity: pulse }}>⚠ handoff risk</span>}
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <div style={{ width: 620, marginTop: 14, padding: "14px 0", borderRadius: 12, background: NEWS.dark, borderTop: `5px solid ${NEWS.green}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: `0 16px 40px rgba(20,18,16,0.22), 0 0 36px ${NEWS.green}33`, transform: `translateY(${interpolate(uni, [0, 1], [30, 0])}px) scale(${interpolate(uni, [0, 1], [0.94, 1])})`, opacity: interpolate(frame, [unifyAt, unifyAt + 8], [0, 1], CLAMP) }}>
            <LabTile logo="google" h={44} at={unifyAt + 4} />
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 27, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff" }}>One system — fewer handoffs</span>
          </div>
        </div>
        <SideClip clip={clip} clipDur={clipDur} w={720} h={470} />
      </div>
    </NewsShell>
  );
};

// ── HardwareVsAI — the bodies (live clip) vs the brain (Google) ──────────────
export const HardwareVsAI: React.FC<{ durationInFrames: number; tint?: string; leftAt: number; rightAt: number; clip: string; clipDur?: number }>
  = ({ durationInFrames, tint = NEWS.blue, leftAt, rightAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eL = spr(frame, fps, leftAt, 26);
  const eR = spr(frame, fps, rightAt, 26);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="Worth separating" title="THE BODIES AREN'T THE STORY" titleSize={66} accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
        <div style={{ width: 660, borderRadius: 12, background: NEWS.dark, borderTop: `5px solid ${NEWS.inkDim}`, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 40px rgba(20,18,16,0.2)", transform: `translateY(${interpolate(eL, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [leftAt, leftAt + 8], [0, 1], CLAMP) }}>
          <div style={{ position: "relative", width: "100%", height: 320 }}>
            <ClipVid clip={clip} clipDur={clipDur} />
          </div>
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The bodies</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 23, color: "rgba(255,255,255,0.8)" }}>Apollo & Duo — third-party humanoid platforms</span>
          </div>
        </div>
        <div style={{ width: 540, padding: "32px 30px", borderRadius: 12, background: NEWS.dark, borderTop: `5px solid ${NEWS.brand}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: "0 16px 40px rgba(20,18,16,0.2)", transform: `translateY(${interpolate(eR, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [rightAt, rightAt + 8], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 44, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The brain</span>
          <LabTile logo="google" h={64} at={rightAt + 6} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 25, textAlign: "center", color: "rgba(255,255,255,0.8)" }}>Google's contribution: the intelligence</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── MissingProofScene — red-cross checklist, the shiny reel rolling beside ────
export const MissingProofScene: React.FC<{ durationInFrames: number; tint?: string; items: { at: number; label: string; sub?: string }[]; clip: string; clipDur?: number }>
  = ({ durationInFrames, tint = NEWS.red, items, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="What Google hasn't shown" title="THE MISSING PROOF" titleSize={70} accent={NEWS.brand} />}>
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <div style={{ width: 780, display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it) => {
            const e = spr(frame, fps, it.at, 24);
            return (
              <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 18, padding: "15px 26px", borderRadius: 12, background: NEWS.dark, borderTop: `4px solid ${NEWS.red}`, boxShadow: "0 12px 28px rgba(20,18,16,0.18)", transform: `translateX(${interpolate(e, [0, 1], [-42, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
                <svg width={32} height={32} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.red} /><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 29, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", flex: 1 }}>{it.label}</span>
                {it.sub && <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 20, color: "rgba(255,255,255,0.65)" }}>{it.sub}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <SideClip clip={clip} clipDur={clipDur} w={640} h={400} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 21, letterSpacing: 2, textTransform: "uppercase", color: NEWS.inkDim }}>What we got instead: the reel</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── JointsStat — the 22-joint reference, bulb close-up rolling beside ─────────
export const JointsStat: React.FC<{ durationInFrames: number; tint?: string; numAt: number; clip: string; clipDur?: number }>
  = ({ durationInFrames, tint = NEWS.blue, numAt, clip, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, numAt, 26);
  const count = Math.round(interpolate(frame, [numAt, numAt + 22], [0, 22], CLAMP));
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="The benchmark is biology" title="THE HUMAN HAND" titleSize={68} accent={NEWS.brand} />}>
      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${interpolate(e, [0, 1], [0.8, 1])})`, opacity: interpolate(frame, [numAt - 4, numAt + 6], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 230, lineHeight: 0.9, color: NEWS.ink }}>{count}</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, letterSpacing: 4, textTransform: "uppercase", color: NEWS.brand }}>Articulated joints</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 22, color: NEWS.inkDim }}>the dexterity target Google is chasing</span>
        </div>
        <SideClip clip={clip} clipDur={clipDur} w={760} h={470} />
      </div>
    </NewsShell>
  );
};
