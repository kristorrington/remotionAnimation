import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NEWS, DISPLAY, HERO } from "./AiNews2Scenes";

// GraphEngScenes — the premium investigative kit for the "Graph Engineering"
// video (Aug 2026). Clean tech-doc language: near-black/charcoal, off-white,
// ONE brand accent, RED for debunks/dates/disputed claims. Every element pins
// to a whisper `at`. Reuses the NEWS palette (black/white/red/green/amber/blue).

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

// paper newsroom stage
const Stage: React.FC<{ tint?: string; children: React.ReactNode; header?: React.ReactNode }> = ({ tint = NEWS.brand, children, header }) => (
  <AbsoluteFill style={{ backgroundColor: NEWS.bg }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(20,18,16,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.7 }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 116%, ${tint}12, transparent 70%)` }} />
    {header}
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: header ? 120 : 0 }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

const Head: React.FC<{ kicker?: string; title: string; size?: number; accent?: string }> = ({ kicker, title, size = 62, accent = NEWS.brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  return (
    <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", zIndex: 5 }}>
      {kicker ? <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: 5, textTransform: "uppercase", color: accent, opacity: interpolate(frame, [0, 14], [0, 1], CLAMP) }}>{kicker}</span> : null}
      <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: size, letterSpacing: 1, color: NEWS.ink, lineHeight: 0.98, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${interpolate(slam, [0, 1], [1.14, 1])})`, opacity: interpolate(frame, [6, 20], [0, 1], CLAMP) }}>{title}</div>
      <div style={{ width: interpolate(slam, [0, 1], [40, 190], CLAMP), height: 6, background: accent, borderRadius: 3 }} />
    </div>
  );
};

// node + arrow primitives ------------------------------------------------------
const Node: React.FC<{ x: number; y: number; label: string; at: number; color?: string; w?: number }>
  = ({ x, y, label, at, color = NEWS.ink, w = 190 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 22);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 40, width: w, height: 80, borderRadius: 14, background: NEWS.dark, borderTop: `4px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(20,18,16,0.18)", transform: `scale(${interpolate(e, [0, 1], [0.6, 1])})`, opacity: interpolate(frame, [at, at + 7], [0, 1], CLAMP) }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{label}</span>
    </div>
  );
};
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; color?: string; curve?: number }>
  = ({ x1, y1, x2, y2, at, color = NEWS.inkDim, curve = 0 }) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [at, at + 16], [0, 1], CLAMP);
  const mx = (x1 + x2) / 2 + curve, my = (y1 + y2) / 2;
  const ex = x1 + (x2 - x1) * d, ey = y1 + (y2 - y1) * d;
  const path = curve ? `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}` : `M ${x1} ${y1} L ${ex} ${ey}`;
  return (
    <g opacity={interpolate(frame, [at, at + 6], [0, 1], CLAMP)}>
      <path d={path} fill="none" stroke={color} strokeWidth={3.5} strokeDasharray={curve ? undefined : 1000} strokeDashoffset={curve ? 0 : 1000 - d * 1000} />
      {d > 0.9 && <circle cx={x2} cy={y2} r={5} fill={color} />}
    </g>
  );
};

// ── FlowScene — the prompt→loop→graph explainer (mode-driven, staged) ─────────
export const FlowScene: React.FC<{ durationInFrames: number; mode: "prompt" | "loop" | "graph"; ats: number[]; tint?: string }>
  = ({ mode, ats, tint = NEWS.blue }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const titleMap = { prompt: "PROMPT ENGINEERING", loop: "LOOP ENGINEERING", graph: "GRAPH ENGINEERING" };
  const kickMap = { prompt: "One instruction, one answer", loop: "Run until a check passes", graph: "Any step can point anywhere" };
  return (
    <Stage tint={tint} header={<Head kicker={kickMap[mode]} title={titleMap[mode]} accent={mode === "graph" ? NEWS.brand : NEWS.blue} />}>
      <svg width={1920} height={960} style={{ position: "absolute", inset: 0 }}>
        {mode === "prompt" && (<>
          <Arrow x1={cx} y1={330} x2={cx} y2={400} at={ats[0] + 20} />
          <Arrow x1={cx} y1={510} x2={cx} y2={580} at={ats[1] + 20} />
        </>)}
        {mode === "loop" && (<>
          <Arrow x1={cx} y1={330} x2={cx} y2={400} at={ats[0] + 20} />
          <Arrow x1={cx} y1={510} x2={cx} y2={580} at={ats[1] + 20} />
          <Arrow x1={cx + 110} y1={620} x2={cx + 360} y2={450} at={ats[2]} color={NEWS.brand} curve={200} />
          <Arrow x1={cx + 360} y1={430} x2={cx + 110} y2={300} at={ats[2] + 4} color={NEWS.brand} curve={200} />
        </>)}
        {mode === "graph" && (<>
          <Arrow x1={cx - 405} y1={520} x2={cx - 250} y2={520} at={ats[1]} />
          <Arrow x1={cx - 60} y1={510} x2={cx + 140} y2={430} at={ats[2]} color={NEWS.brand} />
          <Arrow x1={cx - 60} y1={530} x2={cx + 140} y2={610} at={ats[2] + 6} color={NEWS.brand} />
          <Arrow x1={cx + 320} y1={430} x2={cx + 430} y2={510} at={ats[3]} color={NEWS.green} />
          <Arrow x1={cx + 320} y1={610} x2={cx + 430} y2={530} at={ats[3] + 4} color={NEWS.green} />
          <Arrow x1={cx - 160} y1={575} x2={cx - 500} y2={575} at={ats[4]} color="#C9913D" curve={-220} />
        </>)}
      </svg>
      {mode === "prompt" && (<>
        <Node x={cx} y={410} label="Input" at={ats[0]} />
        <Node x={cx} y={570} label="AI" at={ats[1]} color={NEWS.blue} />
        <Node x={cx} y={730} label="Output" at={ats[2]} />
      </>)}
      {mode === "loop" && (<>
        <Node x={cx} y={410} label="Try" at={ats[0]} />
        <Node x={cx} y={570} label="Check" at={ats[1]} color={NEWS.blue} />
        <Node x={cx} y={730} label="Pass?" at={ats[2]} color={NEWS.green} />
        <div style={{ position: "absolute", left: cx + 300, top: 560, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1, color: NEWS.brand, textTransform: "uppercase", opacity: interpolate(frame, [ats[2] + 6, ats[2] + 16], [0, 1], CLAMP) }}>↺ try again</div>
      </>)}
      {mode === "graph" && (<>
        <Node x={cx - 500} y={520} label="Research" at={ats[0]} w={230} />
        <Node x={cx - 160} y={520} label="Dead end" at={ats[1]} color={NEWS.red} w={220} />
        <Node x={cx + 230} y={430} label="Tool A" at={ats[2]} color={NEWS.blue} w={200} />
        <Node x={cx + 230} y={610} label="Tool B" at={ats[2] + 6} color={NEWS.blue} w={200} />
        <Node x={cx + 540} y={520} label="Merge" at={ats[3]} color={NEWS.green} w={210} />
      </>)}
    </Stage>
  );
};

// ── TimelineScene — 2024 → 2026 with a highlight + a label near the new end ───
export const TimelineScene: React.FC<{ durationInFrames: number; leftYear: string; rightYear: string; leftLabel?: string; rightLabel?: string; highlightAt: number; labelAt: number; kicker?: string; title?: string; side?: "left" | "right" }>
  = ({ leftYear, rightYear, leftLabel, rightLabel, highlightAt, labelAt, kicker, title = "THE TIMELINE", side = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = interpolate(frame, [10, 40], [0, 1], CLAMP);
  const hl = spr(frame, fps, highlightAt, 22);
  const lab = spr(frame, fps, labelAt, 22);
  const y = 470, x1 = 360, x2 = 1560;
  return (
    <Stage tint={NEWS.blue} header={<Head kicker={kicker} title={title} accent={NEWS.blue} />}>
      <svg width={1920} height={400} style={{ position: "absolute", inset: 0, top: 260 }}>
        <line x1={x1} y1={y - 260} x2={x1 + (x2 - x1) * line} y2={y - 260} stroke={NEWS.inkDim} strokeWidth={4} />
      </svg>
      {[[x1, leftYear, leftLabel, false], [x2, rightYear, rightLabel, side === "right"]].map(([x, yr, lb, hot]: any, i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) - 130, top: 360, width: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: hot ? NEWS.red : NEWS.ink, transform: `scale(${hot ? interpolate(hl, [0, 1], [0, 1.4]) : interpolate(line, [0, 1], [0, 1])})`, boxShadow: hot ? `0 0 30px ${NEWS.red}` : "none" }} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 84, color: hot ? NEWS.red : NEWS.ink, lineHeight: 1, transform: hot ? `scale(${interpolate(hl, [0, 1], [0.7, 1])})` : "none", opacity: hot ? interpolate(frame, [highlightAt, highlightAt + 8], [0.3, 1], CLAMP) : 1 }}>{yr}</span>
          {lb ? <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: 1, textTransform: "uppercase", color: NEWS.inkDim, textAlign: "center", opacity: interpolate(frame, [labelAt, labelAt + 10], [0, 1], CLAMP), transform: `scale(${interpolate(lab, [0, 1], [1.3, 1])})` }}>{lb}</span> : null}
        </div>
      ))}
    </Stage>
  );
};

// ── DebunkStatScene — a credible-looking claim card, then a red DEBUNKED stamp ─
export const DebunkStatScene: React.FC<{ durationInFrames: number; sources: string[]; stats: { up?: string; down?: string }; sourceAt: number; statAt: number; debunkAt: number }>
  = ({ sources, stats, sourceAt, statAt, debunkAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spr(frame, fps, 6, 26);
  const stamp = spring({ frame: frame - debunkAt, fps, config: { stiffness: 200, damping: 12 }, durationInFrames: 22 });
  const debunked = frame >= debunkAt;
  return (
    <Stage tint={debunked ? NEWS.red : NEWS.blue}>
      <div style={{ position: "relative", width: 1120, padding: "56px 60px", borderRadius: 18, background: NEWS.dark, borderTop: `6px solid ${debunked ? NEWS.red : NEWS.green}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, boxShadow: "0 26px 64px rgba(20,18,16,0.28)", transform: `scale(${interpolate(card, [0, 1], [0.92, 1])}) rotate(${interpolate(stamp, [0, 1], [0, -1.5], CLAMP)}deg)`, filter: debunked ? "saturate(0.6) brightness(0.8)" : "none" }}>
        <div style={{ display: "flex", gap: 18, opacity: interpolate(frame, [sourceAt, sourceAt + 10], [0, 1], CLAMP) }}>
          {sources.map((s, i) => (
            <div key={s} style={{ padding: "10px 22px", borderRadius: 9, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", transform: `translateY(${interpolate(spr(frame, fps, sourceAt + i * 6, 18), [0, 1], [20, 0])}px)` }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 0.5, color: "#fff", textTransform: "uppercase" }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 70 }}>
          {stats.up && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(frame, [statAt, statAt + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, statAt, 20), [0, 1], [0.7, 1])})` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 150, color: NEWS.green, lineHeight: 1 }}>{stats.up}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>accuracy</span>
          </div>}
          {stats.down && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(frame, [statAt + 10, statAt + 18], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, statAt + 10, 20), [0, 1], [0.7, 1])})` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 150, color: NEWS.brand, lineHeight: 1 }}>{stats.down}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>cost</span>
          </div>}
        </div>
        {debunked && (
          <div style={{ position: "absolute", top: "42%", left: "50%", transform: `translate(-50%,-50%) rotate(-9deg) scale(${interpolate(stamp, [0, 1], [1.8, 1], CLAMP)})`, padding: "12px 40px", border: `6px solid ${NEWS.red}`, borderRadius: 12, opacity: interpolate(frame, [debunkAt, debunkAt + 6], [0, 1], CLAMP), background: "rgba(20,18,16,0.4)" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 76, letterSpacing: 4, color: NEWS.red, textTransform: "uppercase" }}>Debunked</span>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ── OriginTimelineScene — escalating dated events (July 4 quiet → July 18 viral)
export const OriginTimelineScene: React.FC<{ durationInFrames: number; events: { at: number; date: string; who: string; note: string; big?: boolean }[] }>
  = ({ events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage tint={NEWS.amber} header={<Head kicker="Where the phrase came from" title="JULY 2026" accent={NEWS.amber} />}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 70, height: 480 }}>
        {events.map((ev, i) => {
          const e = spr(frame, fps, ev.at, 24);
          const h = ev.big ? 360 : 170;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(frame, [ev.at, ev.at + 8], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1, color: ev.big ? NEWS.red : NEWS.inkDim, textTransform: "uppercase" }}>{ev.note}</span>
              <div style={{ width: 300, height: h * interpolate(e, [0, 1], [0, 1]), borderRadius: 12, background: NEWS.dark, borderTop: `5px solid ${ev.big ? NEWS.red : NEWS.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 0 18px", boxShadow: "0 14px 34px rgba(20,18,16,0.2)" }}>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, color: "#fff" }}>{ev.who}</span>
              </div>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, color: ev.big ? NEWS.red : NEWS.ink }}>{ev.date}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ── TwoColumnScene — flexible comparison (capability/commentary, verified/not) ─
export const TwoColumnScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[]; leftAt: number; rightAt: number; leftColor?: string; rightColor?: string; tint?: string }>
  = ({ kicker, title, leftTitle, leftItems, rightTitle, rightItems, leftAt, rightAt, leftColor = NEWS.green, rightColor = NEWS.brand, tint = NEWS.blue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Col: React.FC<{ at: number; t: string; items: string[]; color: string }> = ({ at, t, items, color }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 640, padding: "34px 36px", borderRadius: 16, background: NEWS.dark, borderTop: `6px solid ${color}`, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 18px 44px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(e, [0, 1], [42, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{t}</span>
        {items.map((it, i) => (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [at + 10 + i * 8, at + 18 + i * 8], [0, 1], CLAMP) }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,0.9)" }}>{it}</span>
          </div>
        ))}
      </div>
    );
  };
  return (
    <Stage tint={tint} header={<Head kicker={kicker} title={title} accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 44, alignItems: "flex-start" }}>
        <Col at={leftAt} t={leftTitle} items={leftItems} color={leftColor} />
        <div style={{ alignSelf: "center", fontFamily: HERO, fontSize: 60, color: NEWS.inkDim, opacity: interpolate(frame, [rightAt, rightAt + 8], [0, 1], CLAMP) }}>vs</div>
        <Col at={rightAt} t={rightTitle} items={rightItems} color={rightColor} />
      </div>
    </Stage>
  );
};

// ── ThreeDefsScene — AGENT / LOOP / MEMORY graphs, then "WHICH ONE?" ──────────
export const ThreeDefsScene: React.FC<{ durationInFrames: number; ats: number[]; whichAt: number }> = ({ ats, whichAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const defs = [
    { name: "Agent graphs", sub: "who does what" },
    { name: "Loop graphs", sub: "retry until right" },
    { name: "Memory graphs", sub: "what to recall" },
  ];
  const which = spr(frame, fps, whichAt, 22);
  return (
    <Stage tint={NEWS.brand} header={<Head kicker="One term, three meanings" title="GRAPH ENGINEERING?" accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 40 }}>
        {defs.map((d, i) => {
          const e = spr(frame, fps, ats[i], 24);
          return (
            <div key={d.name} style={{ width: 420, height: 360, borderRadius: 16, background: NEWS.dark, borderTop: `5px solid ${[NEWS.blue, NEWS.green, "#C9913D"][i]}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: "0 18px 44px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(e, [0, 1], [46, 0])}px)`, opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP) }}>
              <svg width={160} height={110}>
                {i === 0 && (<><circle cx={40} cy={30} r={14} fill={NEWS.blue} /><circle cx={120} cy={30} r={14} fill={NEWS.blue} /><circle cx={80} cy={85} r={14} fill="#fff" /><line x1={40} y1={30} x2={80} y2={85} stroke="#fff" strokeWidth={3} /><line x1={120} y1={30} x2={80} y2={85} stroke="#fff" strokeWidth={3} /></>)}
                {i === 1 && (<><circle cx={50} cy={55} r={14} fill={NEWS.green} /><circle cx={120} cy={55} r={14} fill="#fff" /><path d="M50 55 L120 55" stroke="#fff" strokeWidth={3} /><path d="M120 40 A 30 30 0 1 0 120 70" fill="none" stroke={NEWS.green} strokeWidth={3} /></>)}
                {i === 2 && (<><rect x={30} y={20} width={100} height={22} rx={5} fill="rgba(255,255,255,0.3)" /><rect x={30} y={50} width={70} height={22} rx={5} fill="rgba(255,255,255,0.3)" /><rect x={30} y={80} width={90} height={22} rx={5} fill="#C9913D" /></>)}
              </svg>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", textAlign: "center" }}>{d.name}</span>
              <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.65)" }}>{d.sub}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 70, transform: `rotate(-2deg) scale(${interpolate(which, [0, 1], [1.5, 1], CLAMP)})`, padding: "12px 34px", borderRadius: 10, background: NEWS.brand, opacity: interpolate(frame, [whichAt, whichAt + 8], [0, 1], CLAMP), boxShadow: "0 14px 36px rgba(20,18,16,0.24)" }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Which one?</span>
      </div>
    </Stage>
  );
};

// ── RecapScene — stacked rows with mixed verdict icons ───────────────────────
export const RecapScene: React.FC<{ durationInFrames: number; rows: { at: number; icon: "check" | "warn" | "cross"; title: string; sub: string }[]; kicker?: string; title?: string; accent?: string }>
  = ({ rows, kicker = "So, what is it really?", title = "THE VERDICT", accent = NEWS.brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = { check: NEWS.green, warn: "#C9913D", cross: NEWS.red } as const;
  return (
    <Stage tint={accent} header={<Head kicker={kicker} title={title} accent={accent} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {rows.map((r, i) => {
          const e = spr(frame, fps, r.at, 24);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, width: 1120, padding: "24px 34px", borderRadius: 14, background: NEWS.dark, borderTop: `5px solid ${col[r.icon]}`, boxShadow: "0 14px 34px rgba(20,18,16,0.2)", transform: `translateX(${interpolate(e, [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [r.at, r.at + 8], [0, 1], CLAMP) }}>
              <svg width={44} height={44} viewBox="0 0 24 24">
                {r.icon === "check" && (<><circle cx="12" cy="12" r="11" fill={col.check} /><path d="M6.5 12.5l3.5 3.5 7-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></>)}
                {r.icon === "warn" && (<><circle cx="12" cy="12" r="11" fill={col.warn} /><path d="M12 6.5v7M12 17h.01" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></>)}
                {r.icon === "cross" && (<><circle cx="12" cy="12" r="11" fill={col.cross} /><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></>)}
              </svg>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", flex: 1 }}>{r.title}</span>
              <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{r.sub}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ── BigStatScene — one large cited number (65M / month) ──────────────────────
export const BigStatScene: React.FC<{ durationInFrames: number; value: string; unit: string; label: string; at: number; tint?: string }>
  = ({ value, unit, label, at, tint = NEWS.green }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 26);
  return (
    <Stage tint={tint} header={<Head kicker={label} title="AND IT'S EVERYWHERE" accent={tint} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(e, [0, 1], [0.75, 1])})`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 300, lineHeight: 0.9, color: NEWS.ink }}>{value}</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 44, letterSpacing: 6, textTransform: "uppercase", color: tint }}>{unit}</span>
      </div>
    </Stage>
  );
};
