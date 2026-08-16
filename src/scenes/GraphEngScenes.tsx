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

// red-box slam chip (shared payoff sticker)
const StampChip: React.FC<{ at: number; text: string; color?: string; bottom?: number; size?: number }> = ({ at, text, color = NEWS.brand, bottom = 70, size = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 22);
  return (
    <div style={{ position: "absolute", bottom, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ transform: `rotate(-2deg) scale(${interpolate(e, [0, 1], [1.5, 1], CLAMP)})`, padding: "12px 34px", borderRadius: 10, background: color, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP), boxShadow: "0 14px 36px rgba(20,18,16,0.24)" }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: size, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>{text}</span>
      </div>
    </div>
  );
};

// node + arrow primitives ------------------------------------------------------
const Node: React.FC<{ x: number; y: number; label: string; at: number; color?: string; w?: number; pulseAt?: number }>
  = ({ x, y, label, at, color = NEWS.ink, w = 230, pulseAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 22);
  const pulse = pulseAt !== undefined ? interpolate(frame, [pulseAt, pulseAt + 10, pulseAt + 26], [0, 1, 0], CLAMP) : 0;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 48, width: w, height: 96, borderRadius: 14, background: NEWS.dark, borderTop: `4px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 30px rgba(20,18,16,0.18)${pulse > 0 ? `, 0 0 ${30 * pulse}px ${color}` : ""}`, transform: `scale(${interpolate(e, [0, 1], [0.6, 1]) + pulse * 0.05})`, opacity: interpolate(frame, [at, at + 7], [0, 1], CLAMP) }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{label}</span>
    </div>
  );
};
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; color?: string; curve?: number; curveY?: number; width?: number; dashed?: boolean }>
  = ({ x1, y1, x2, y2, at, color = NEWS.inkDim, curve = 0, curveY = 0, width = 3.5, dashed }) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [at, at + 16], [0, 1], CLAMP);
  const mx = (x1 + x2) / 2 + curve, my = (y1 + y2) / 2 + curveY;
  const ex = x1 + (x2 - x1) * d, ey = y1 + (y2 - y1) * d;
  const path = curve || curveY ? `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}` : `M ${x1} ${y1} L ${ex} ${ey}`;
  return (
    <g opacity={interpolate(frame, [at, at + 6], [0, 1], CLAMP)}>
      <path d={path} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "10 10" : curve ? undefined : 1000} strokeDashoffset={dashed || curve ? 0 : 1000 - d * 1000} />
      {d > 0.9 && <circle cx={x2} cy={y2} r={5} fill={color} />}
    </g>
  );
};

// ── FlowScene — prompt / loop / web / graph, every element whisper-pinned ─────
// prompt: ats=[input, ai, output], doneAt = the "done." chip
// loop:   ats=[try, check, pass], circleAt = chain REARRANGES into a circle,
//         retryAt = orbit dot + "try again"
// web:    ats=[anyArrows, branch, loop, revisit, paths] — the abstract concept
// graph:  ats=[research, deadEnd, LOOPBACK, tools, merge] (VO order)
export const FlowScene: React.FC<{ durationInFrames: number; mode: "prompt" | "loop" | "web" | "graph"; ats: number[]; doneAt?: number; circleAt?: number; retryAt?: number; tint?: string }>
  = ({ mode, ats, doneAt, circleAt = 99999, retryAt = 99999, tint = NEWS.blue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 960;
  const titleMap = { prompt: "PROMPT ENGINEERING", loop: "LOOP ENGINEERING", web: "ANY STEP → ANY STEP", graph: "IN PRACTICE" };
  const kickMap = { prompt: "One instruction, one answer", loop: "Run until a check passes", web: "The line becomes a shape", graph: "One real agent run" };

  // loop mode: node positions glide chain → ring at circleAt
  const ring = spr(frame, fps, circleAt, 30);
  const lerp = (a: number, b: number) => a + (b - a) * ring;
  const loopPos = [
    { x: lerp(cx, cx), y: lerp(380, 380) },
    { x: lerp(cx, cx + 330), y: lerp(580, 640) },
    { x: lerp(cx, cx - 330), y: lerp(780, 640) },
  ];
  const orbit = interpolate(frame, [retryAt, retryAt + 70], [0, 2 * Math.PI], CLAMP);

  return (
    <Stage tint={tint} header={<Head kicker={kickMap[mode]} title={titleMap[mode]} accent={mode === "graph" || mode === "web" ? NEWS.brand : NEWS.blue} />}>
      <svg width={1920} height={960} style={{ position: "absolute", inset: 0 }}>
        {mode === "prompt" && (<>
          <Arrow x1={cx} y1={436} x2={cx} y2={524} at={ats[0] + 20} width={4.5} />
          <Arrow x1={cx} y1={636} x2={cx} y2={724} at={ats[1] + 18} width={4.5} />
        </>)}
        {mode === "loop" && ring < 0.5 && (<>
          <Arrow x1={cx} y1={436} x2={cx} y2={524} at={ats[0] + 20} width={4.5} />
          <Arrow x1={cx} y1={636} x2={cx} y2={724} at={ats[1] + 20} width={4.5} />
        </>)}
        {mode === "loop" && frame >= circleAt && (<>
          {/* the ring: three arcs connecting the circle layout */}
          <Arrow x1={cx + 150} y1={400} x2={cx + 345} y2={575} at={circleAt + 10} color={NEWS.brand} curve={90} curveY={-40} />
          <Arrow x1={cx + 210} y1={705} x2={cx - 210} y2={705} at={circleAt + 20} color={NEWS.brand} curveY={90} />
          <Arrow x1={cx - 345} y1={575} x2={cx - 150} y2={400} at={circleAt + 30} color={NEWS.brand} curve={-90} curveY={-40} />
          {frame >= retryAt && <circle cx={cx + Math.sin(orbit) * 330} cy={533 - Math.cos(orbit) * 165} r={10} fill={NEWS.brand} />}
        </>)}
        {mode === "web" && (<>
          {/* ghost of the straight line, fading as the web takes over */}
          <g opacity={interpolate(frame, [ats[0], ats[0] + 20], [0.5, 0.12], CLAMP)}>
            <line x1={330} y1={300} x2={1590} y2={300} stroke={NEWS.inkDim} strokeWidth={3} strokeDasharray="8 8" />
          </g>
          {/* any-to-any arrows — every arrow lands ON a dot */}
          <Arrow x1={1005} y1={315} x2={1370} y2={445} at={ats[0]} color={NEWS.ink} width={3.5} />
          <Arrow x1={1365} y1={485} x2={1005} y2={635} at={ats[0] + 8} color={NEWS.ink} width={3.5} />
          <Arrow x1={915} y1={675} x2={575} y2={725} at={ats[0] + 16} color={NEWS.ink} width={3.5} />
          {/* BRANCHES — one node splits two ways */}
          <Arrow x1={550} y1={435} x2={915} y2={320} at={ats[1]} color={NEWS.blue} width={4.5} />
          <Arrow x1={555} y1={480} x2={915} y2={640} at={ats[1] + 6} color={NEWS.blue} width={4.5} />
          {/* LOOPS — an arc back */}
          <Arrow x1={1385} y1={435} x2={1005} y2={300} at={ats[2]} color={NEWS.brand} curve={-60} curveY={-150} width={4.5} />
          {/* REVISITS — dashed return */}
          <Arrow x1={530} y1={695} x2={522} y2={505} at={ats[3]} color="#C9913D" dashed width={4.5} />
          {/* DIFFERENT PATHS — the alternative route */}
          <Arrow x1={1005} y1={665} x2={1345} y2={712} at={ats[4]} color={NEWS.green} width={4.5} />
        </>)}
        {mode === "graph" && (<>
          <Arrow x1={415} y1={470} x2={595} y2={470} at={ats[1]} />
          {/* LOOPS BACK first (VO order), then the split, then the merge */}
          <Arrow x1={640} y1={530} x2={330} y2={530} at={ats[2]} color="#C9913D" curveY={170} width={4} />
          <Arrow x1={830} y1={440} x2={1030} y2={370} at={ats[3]} color={NEWS.brand} />
          <Arrow x1={830} y1={500} x2={1030} y2={650} at={ats[3] + 6} color={NEWS.brand} />
          <Arrow x1={1290} y1={370} x2={1440} y2={470} at={ats[4] - 8} color={NEWS.green} />
          <Arrow x1={1290} y1={650} x2={1440} y2={520} at={ats[4] - 4} color={NEWS.green} />
        </>)}
      </svg>
      {mode === "prompt" && (<>
        <Node x={cx} y={380} label="Input" at={ats[0]} w={300} />
        <Node x={cx} y={580} label="AI" at={ats[1]} color={NEWS.blue} w={300} />
        <Node x={cx} y={780} label="Output" at={ats[2]} w={300} />
        {doneAt !== undefined && (
          <div style={{ position: "absolute", left: cx + 200, top: 748, transform: `rotate(2deg) scale(${interpolate(spr(frame, fps, doneAt, 20), [0, 1], [1.5, 1], CLAMP)})`, padding: "10px 24px", borderRadius: 10, background: NEWS.green, opacity: interpolate(frame, [doneAt, doneAt + 8], [0, 1], CLAMP), boxShadow: "0 12px 30px rgba(20,18,16,0.2)" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 36, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Done ✓</span>
          </div>
        )}
      </>)}
      {mode === "loop" && (<>
        <Node x={loopPos[0].x} y={loopPos[0].y} label="Try" at={ats[0]} w={300} />
        <Node x={loopPos[1].x} y={loopPos[1].y} label="Check" at={ats[1]} color={NEWS.blue} w={300} />
        <Node x={loopPos[2].x} y={loopPos[2].y} label="Pass?" at={ats[2]} color={NEWS.green} w={300} />
        <div style={{ position: "absolute", left: cx - 120, top: 560, fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1, color: NEWS.brand, textTransform: "uppercase", opacity: interpolate(frame, [retryAt, retryAt + 10], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, retryAt, 20), [0, 1], [1.4, 1], CLAMP)})` }}>↺ try again</div>
      </>)}
      {mode === "web" && (<>
        {([[520, 460], [960, 300], [1400, 460], [960, 660], [530, 740], [1390, 720]] as const).map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: "50%", background: NEWS.dark, border: `3px solid ${i === 0 ? NEWS.blue : "rgba(20,18,16,0.25)"}`, boxShadow: "0 8px 20px rgba(20,18,16,0.18)", transform: `scale(${interpolate(spr(frame, fps, 4 + i * 4, 18), [0, 1], [0, 1])})` }} />
        ))}
        {([[ats[1], "branches", 640, 330, NEWS.blue], [ats[2], "loops", 1150, 170, NEWS.brand], [ats[3], "revisits", 350, 590, "#C9913D"], [ats[4], "paths", 1120, 736, NEWS.green]] as const).map(([at, label, x, y, color], i) => (
          <span key={i} style={{ position: "absolute", left: x as number, top: y as number, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.5, textTransform: "uppercase", color: color as string, opacity: interpolate(frame, [(at as number) + 4, (at as number) + 12], [0, 1], CLAMP) }}>{label}</span>
        ))}
      </>)}
      {mode === "graph" && (<>
        <Node x={300} y={470} label="Research" at={ats[0]} w={250} pulseAt={ats[2] + 18} />
        <Node x={720} y={470} label="Dead end" at={ats[1]} color={NEWS.red} w={240} />
        <Node x={1160} y={360} label="Tool A" at={ats[3]} color={NEWS.blue} w={210} />
        <Node x={1160} y={660} label="Tool B" at={ats[3] + 6} color={NEWS.blue} w={210} />
        <Node x={1560} y={490} label="Merge" at={ats[4]} color={NEWS.green} w={220} />
      </>)}
    </Stage>
  );
};

// ── GraphShapeScene — the finished run zoomed out: "the whole shape = a graph" ─
export const GraphShapeScene: React.FC<{ durationInFrames: number; labelAt: number; pulseAt: number }> = ({ labelAt, pulseAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spr(frame, fps, 4, 30);
  const label = spr(frame, fps, labelAt, 22);
  // mini replica of the example run (dots + arrows), scaled down + centred
  const P = { r: [300, 300], d: [640, 300], a: [1000, 180], b: [1000, 420], m: [1320, 300] } as const;
  const pulse = (i: number) => interpolate(frame, [pulseAt + i * 14, pulseAt + i * 14 + 10, pulseAt + i * 14 + 30], [0, 1, 0], CLAMP);
  return (
    <Stage tint={NEWS.brand} header={<Head kicker="The whole shape" title="THAT'S A GRAPH" accent={NEWS.brand} />}>
      <div style={{ position: "relative", width: 1620, height: 600, transform: `scale(${interpolate(settle, [0, 1], [1.12, 1])})`, opacity: interpolate(frame, [0, 8], [0, 1], CLAMP) }}>
        <svg width={1620} height={600} style={{ position: "absolute", inset: 0 }}>
          <line x1={P.r[0]} y1={P.r[1]} x2={P.d[0]} y2={P.d[1]} stroke={NEWS.inkDim} strokeWidth={4 + pulse(0) * 3} />
          <path d={`M ${P.d[0]} ${P.d[1] + 40} Q ${(P.d[0] + P.r[0]) / 2} ${P.d[1] + 190} ${P.r[0]} ${P.r[1] + 40}`} fill="none" stroke="#C9913D" strokeWidth={4 + pulse(1) * 3} />
          <line x1={P.d[0]} y1={P.d[1]} x2={P.a[0]} y2={P.a[1]} stroke={NEWS.brand} strokeWidth={4 + pulse(2) * 3} />
          <line x1={P.d[0]} y1={P.d[1]} x2={P.b[0]} y2={P.b[1]} stroke={NEWS.brand} strokeWidth={4 + pulse(2) * 3} />
          <line x1={P.a[0]} y1={P.a[1]} x2={P.m[0]} y2={P.m[1]} stroke={NEWS.green} strokeWidth={4 + pulse(3) * 3} />
          <line x1={P.b[0]} y1={P.b[1]} x2={P.m[0]} y2={P.m[1]} stroke={NEWS.green} strokeWidth={4 + pulse(3) * 3} />
        </svg>
        {Object.entries(P).map(([k, [x, y]]) => (
          <div key={k} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", background: NEWS.dark, border: `4px solid ${k === "d" ? NEWS.red : k === "m" ? NEWS.green : NEWS.blue}`, boxShadow: "0 8px 22px rgba(20,18,16,0.2)" }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center" }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 110, letterSpacing: 2, textTransform: "uppercase", color: NEWS.ink, transform: `scale(${interpolate(label, [0, 1], [1.35, 1], CLAMP)})`, opacity: interpolate(frame, [labelAt, labelAt + 8], [0, 1], CLAMP) }}>
            A <span style={{ color: NEWS.brand }}>GRAPH</span>
          </span>
        </div>
      </div>
    </Stage>
  );
};

// ── RoadmapScene — the promise: three numbered answers, revealed as spoken ────
export const RoadmapScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["What it means", "Where it came from", "One simple rule"];
  return (
    <Stage tint={NEWS.blue} header={<Head kicker="Give me five minutes" title="THREE ANSWERS" accent={NEWS.blue} />}>
      <div style={{ display: "flex", gap: 44 }}>
        {items.map((t, i) => {
          const e = spr(frame, fps, ats[i], 24);
          const active = interpolate(frame, [ats[2] + 60 + i * 40, ats[2] + 70 + i * 40, ats[2] + 90 + i * 40], [0, 1, 0], CLAMP);
          return (
            <div key={t} style={{ width: 480, padding: "38px 40px", borderRadius: 16, background: NEWS.dark, borderTop: `5px solid ${[NEWS.blue, "#C9913D", NEWS.green][i]}`, display: "flex", flexDirection: "column", gap: 14, boxShadow: `0 18px 44px rgba(20,18,16,0.22)${active > 0 ? `, 0 0 ${26 * active}px ${[NEWS.blue, "#C9913D", NEWS.green][i]}` : ""}`, transform: `translateY(${interpolate(e, [0, 1], [46, 0])}px)`, opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 58, color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>{`0${i + 1}`}</span>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 42, letterSpacing: 1, textTransform: "uppercase", color: "#fff", lineHeight: 1.05 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ── TimelineScene — year → year with per-side label ats + a span brace ────────
export const TimelineScene: React.FC<{ durationInFrames: number; leftYear: string; rightYear: string; leftLabel?: string; rightLabel?: string; highlightAt: number; labelAt?: number; leftLabelAt?: number; rightLabelAt?: number; braceAt?: number; braceText?: string; kicker?: string; title?: string; side?: "left" | "right" }>
  = ({ leftYear, rightYear, leftLabel, rightLabel, highlightAt, labelAt = 110, leftLabelAt, rightLabelAt, braceAt, braceText, kicker, title = "THE TIMELINE", side = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = interpolate(frame, [10, 40], [0, 1], CLAMP);
  const hl = spr(frame, fps, highlightAt, 22);
  const y = 470, x1 = 360, x2 = 1560;
  const brace = braceAt !== undefined ? interpolate(frame, [braceAt, braceAt + 22], [0, 1], CLAMP) : 0;
  const sideAts = [leftLabelAt ?? labelAt, rightLabelAt ?? labelAt];
  return (
    <Stage tint={NEWS.blue} header={<Head kicker={kicker} title={title} accent={NEWS.blue} />}>
      <svg width={1920} height={400} style={{ position: "absolute", inset: 0, top: 380 }}>
        <line x1={x1} y1={y - 260} x2={x1 + (x2 - x1) * line} y2={y - 260} stroke={NEWS.inkDim} strokeWidth={5} />
        {braceAt !== undefined && brace > 0 && (
          <path d={`M ${x1 + 40} ${y - 320} L ${x1 + 40 + (x2 - x1 - 80) * brace} ${y - 320}`} stroke="#C9913D" strokeWidth={4} fill="none" strokeLinecap="round" />
        )}
      </svg>
      {braceAt !== undefined && braceText ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", opacity: interpolate(frame, [braceAt + 10, braceAt + 22], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3, textTransform: "uppercase", color: "#C9913D" }}>{braceText}</span>
        </div>
      ) : null}
      {[[x1, leftYear, leftLabel, false], [x2, rightYear, rightLabel, side === "right"]].map(([x, yr, lb, hot]: any, i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) - 190, top: 520, width: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: hot ? NEWS.red : NEWS.ink, transform: `scale(${hot ? interpolate(hl, [0, 1], [0, 1.4]) : interpolate(line, [0, 1], [0, 1])})`, boxShadow: hot ? `0 0 30px ${NEWS.red}` : "none" }} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 104, color: hot ? NEWS.red : NEWS.ink, lineHeight: 1, transform: hot ? `scale(${interpolate(hl, [0, 1], [0.7, 1])})` : "none", opacity: hot ? interpolate(frame, [highlightAt, highlightAt + 8], [0.3, 1], CLAMP) : 1 }}>{yr}</span>
          {lb ? <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: NEWS.inkDim, textAlign: "center", opacity: interpolate(frame, [sideAts[i], sideAts[i] + 10], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, sideAts[i], 22), [0, 1], [1.3, 1])})` }}>{lb}</span> : null}
        </div>
      ))}
    </Stage>
  );
};

// ── DebunkStatScene — the claim card; sources/stats pinned per word; optional
// DEBUNKED stamp (pass negative ats to pre-build the card for the stamp beat) ──
export const DebunkStatScene: React.FC<{ durationInFrames: number; sources: string[]; stats: { up?: string; down?: string }; sourceAt: number; sourceStagger?: number; statAt: number; downStatAt?: number; debunkAt?: number; dateChip?: string; dateAt?: number; claim?: string; claimAt?: number }>
  = ({ sources, stats, sourceAt, sourceStagger = 6, statAt, downStatAt, debunkAt, dateChip, dateAt = 0, claim, claimAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spr(frame, fps, 6, 26);
  const dAt = debunkAt ?? 999999;
  const downAt = downStatAt ?? statAt + 10;
  const stamp = spring({ frame: frame - dAt, fps, config: { stiffness: 200, damping: 12 }, durationInFrames: 22 });
  const debunked = frame >= dAt;
  return (
    <Stage tint={debunked ? NEWS.red : NEWS.blue}>
      <div style={{ position: "relative", width: 1120, padding: "56px 60px", borderRadius: 18, background: NEWS.dark, borderTop: `6px solid ${debunked ? NEWS.red : NEWS.green}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, boxShadow: "0 26px 64px rgba(20,18,16,0.28)", transform: `scale(${interpolate(card, [0, 1], [0.92, 1])}) rotate(${interpolate(stamp, [0, 1], [0, -1.5], CLAMP)}deg)`, filter: debunked ? "saturate(0.6) brightness(0.8)" : "none" }}>
        {dateChip ? (
          <div style={{ position: "absolute", top: -22, left: 60, padding: "8px 20px", borderRadius: 9, background: "#C9913D", boxShadow: "0 10px 26px rgba(20,18,16,0.24)", transform: `rotate(-2deg) scale(${interpolate(spr(frame, fps, dateAt, 20), [0, 1], [1.4, 1], CLAMP)})`, opacity: interpolate(frame, [dateAt, dateAt + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 30, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>{dateChip}</span>
          </div>
        ) : null}
        {claim ? (
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, letterSpacing: 1, textTransform: "uppercase", color: "#fff", textAlign: "center", opacity: interpolate(frame, [claimAt, claimAt + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, claimAt, 22), [0, 1], [1.18, 1])})` }}>{claim}</span>
        ) : null}
        <div style={{ display: "flex", gap: 18, opacity: interpolate(frame, [sourceAt, sourceAt + 10], [0, 1], CLAMP) }}>
          {sources.map((s, i) => (
            <div key={s} style={{ padding: "10px 22px", borderRadius: 9, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", opacity: interpolate(frame, [sourceAt + i * sourceStagger, sourceAt + i * sourceStagger + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, sourceAt + i * sourceStagger, 18), [0, 1], [20, 0])}px)` }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 0.5, color: "#fff", textTransform: "uppercase" }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 70 }}>
          {stats.up && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(frame, [statAt, statAt + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, statAt, 20), [0, 1], [0.7, 1])})` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 150, color: NEWS.green, lineHeight: 1 }}>{stats.up}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>accuracy</span>
          </div>}
          {stats.down && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(frame, [downAt, downAt + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, downAt, 20), [0, 1], [0.7, 1])})` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 150, color: NEWS.brand, lineHeight: 1 }}>{stats.down}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>cost</span>
          </div>}
        </div>
        {debunked && (
          <div style={{ position: "absolute", top: "42%", left: "50%", transform: `translate(-50%,-50%) rotate(-9deg) scale(${interpolate(stamp, [0, 1], [1.8, 1], CLAMP)})`, padding: "12px 40px", border: `6px solid ${NEWS.red}`, borderRadius: 12, opacity: interpolate(frame, [dAt, dAt + 6], [0, 1], CLAMP), background: "rgba(20,18,16,0.4)" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 76, letterSpacing: 4, color: NEWS.red, textTransform: "uppercase" }}>Debunked</span>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ── TwoColumnScene — comparison; left builds centred, shifts as right arrives ─
export const TwoColumnScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[]; leftAt: number; rightAt: number; leftItemAts?: number[]; rightItemAts?: number[]; leftColor?: string; rightColor?: string; tint?: string }>
  = ({ kicker, title, leftTitle, leftItems, rightTitle, rightItems, leftAt, rightAt, leftItemAts, rightItemAts, leftColor = NEWS.green, rightColor = NEWS.brand, tint = NEWS.blue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shift = spr(frame, fps, rightAt, 28);
  const Col: React.FC<{ at: number; t: string; items: string[]; itemAts?: number[]; color: string }> = ({ at, t, items, itemAts, color }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 640, padding: "34px 36px", borderRadius: 16, background: NEWS.dark, borderTop: `6px solid ${color}`, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 18px 44px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(e, [0, 1], [42, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{t}</span>
        {items.map((it, i) => {
          const ia = itemAts?.[i] ?? at + 10 + i * 8;
          return (
            <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [ia, ia + 8], [0, 1], CLAMP), transform: `translateX(${interpolate(spr(frame, fps, ia, 20), [0, 1], [-18, 0])}px)` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,0.9)" }}>{it}</span>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <Stage tint={tint} header={<Head kicker={kicker} title={title} accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 44, alignItems: "flex-start", transform: `translateX(${interpolate(shift, [0, 1], [372, 0])}px)` }}>
        <Col at={leftAt} t={leftTitle} items={leftItems} itemAts={leftItemAts} color={leftColor} />
        <div style={{ alignSelf: "center", fontFamily: HERO, fontSize: 60, color: NEWS.inkDim, opacity: interpolate(frame, [rightAt, rightAt + 8], [0, 1], CLAMP) }}>vs</div>
        <Col at={rightAt} t={rightTitle} items={rightItems} itemAts={rightItemAts} color={rightColor} />
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
      <StampChip at={whichAt} text="Which one?" />
    </Stage>
  );
};

// ── RecapScene — stacked verdict rows + optional payoff stamp ─────────────────
export const RecapScene: React.FC<{ durationInFrames: number; rows: { at: number; icon: "check" | "warn" | "cross"; title: string; sub: string }[]; kicker?: string; title?: string; accent?: string; stamp?: string; stampAt?: number }>
  = ({ rows, kicker = "So, what is it really?", title = "THE VERDICT", accent = NEWS.brand, stamp, stampAt }) => {
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
              {r.sub ? <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{r.sub}</span> : null}
            </div>
          );
        })}
      </div>
      {stamp && stampAt !== undefined ? <StampChip at={stampAt} text={stamp} color={NEWS.red} bottom={56} /> : null}
    </Stage>
  );
};

// ── BuzzwordFeedScene — the NEXT buzzword: feed cards, month after month ──────
export const BuzzwordFeedScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const months = ["This month", "Next month", "The month after"];
  return (
    <Stage tint={"#C9913D"} header={<Head kicker="The rule survives" title="THE NEXT BUZZWORD" accent={"#C9913D"} />}>
      <div style={{ display: "flex", gap: 40 }}>
        {months.map((m, i) => {
          const e = spr(frame, fps, ats[i], 24);
          return (
            <div key={m} style={{ width: 440, padding: "30px 34px", borderRadius: 16, background: "#fff", border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 16px 40px rgba(20,18,16,0.16)", display: "flex", flexDirection: "column", gap: 18, transform: `translateY(${interpolate(e, [0, 1], [56, 0])}px) rotate(${[-1.6, 1.2, -0.8][i]}deg)`, opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#C9913D" }}>{m}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(20,18,16,0.12)" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 16, width: "72%", borderRadius: 8, background: "rgba(20,18,16,0.16)" }} />
                  <div style={{ height: 16, width: "48%", borderRadius: 8, background: "rgba(20,18,16,0.1)" }} />
                </div>
              </div>
              <div style={{ alignSelf: "flex-start", padding: "8px 20px", borderRadius: 8, background: NEWS.dark }}>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>“____ engineering”</span>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ── ClosingScene — "genuinely new" struck through → OLD IDEA, NEW NAME slams ──
export const ClosingScene: React.FC<{ durationInFrames: number; strikeAt: number }> = ({ strikeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inE = spr(frame, fps, 6, 24);
  const strike = interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], CLAMP);
  const slam = spring({ frame: frame - (strikeAt + 8), fps, config: { stiffness: 200, damping: 14 }, durationInFrames: 22 });
  return (
    <Stage tint={NEWS.red}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", opacity: interpolate(frame, [6, 14], [0, 1], CLAMP), transform: `scale(${interpolate(inE, [0, 1], [1.2, 1])})`, filter: strike > 0.6 ? "opacity(0.45)" : "none" }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 96, letterSpacing: 2, textTransform: "uppercase", color: NEWS.ink }}>Genuinely new?</span>
          <div style={{ position: "absolute", left: "-2%", top: "52%", width: `${strike * 104}%`, height: 9, background: NEWS.red, borderRadius: 5, transform: "rotate(-2deg)" }} />
        </div>
        {frame >= strikeAt + 8 && (
          <div style={{ padding: "16px 44px", borderRadius: 12, background: NEWS.red, transform: `rotate(-1.5deg) scale(${interpolate(slam, [0, 1], [1.6, 1], CLAMP)})`, boxShadow: "0 20px 50px rgba(20,18,16,0.28)" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 92, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Old idea, new name</span>
          </div>
        )}
      </div>
    </Stage>
  );
};
