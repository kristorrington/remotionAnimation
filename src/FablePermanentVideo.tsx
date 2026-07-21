import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { BalanceScaleScene } from "./scenes/GptScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { glassCard } from "./motion/subjects";
import { ClaudeMark } from "./components/Cartoons";
import { FONT } from "./components/overlayUI";
import { ThemeProvider } from "./theme";

// FablePermanentVideo — transparent cutaway overlay for "Claude Fable 5 Is Now
// Permanent | Here's Why" (~6m12s, 11185f @ 30fps). Receipt-forward explainer:
// the @claudeai permanence tweet, the pricing page ($10/$50), the crisis
// timeline (suspension → restore → permanent), and the structural "who gets it"
// split — each keyframe-zoomed into its claim. Every `at` is whisper-pinned
// (captionsData, talking-head.mp4 2026-07-21).

export const FP_DUR = 11185;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CYAN = "#D97757"; // Claude terracotta (brand)
const RED = "#C65B52";
const GREEN = "#4FA98A";
const AMBER = "#C9913D";
const BLUE = "#6E93BD";
const GOLD = "#E8B84B";
const SHOT = "assets/external/screenshots";
const CLIPS = "assets/external/clips";

// ── shared: a plan card (glass sticker) ────────────────────────────────────
const PlanCard: React.FC<{ name: string; state: "included" | "credits"; note?: string; at: number; x?: number }> = ({ name, state, note, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { stiffness: 130, damping: 17 }, durationInFrames: 20 });
  if (frame < at) return null;
  const col = state === "included" ? GREEN : AMBER;
  return (
    <div style={{ transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})`, opacity: interpolate(p, [0, 0.4], [0, 1]), width: 360, borderRadius: 16, padding: "22px 24px", ...glassCard(col + "cc", 2.5), display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 0.5, color: "#fff", transform: "translateZ(0)" }}>{name}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="34" height="34" viewBox="0 0 100 100">{state === "included" ? <><circle cx={50} cy={50} r={42} fill={`${GREEN}33`} stroke={GREEN} strokeWidth={8} /><path d="M30 52 L45 66 L72 36" stroke={GREEN} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" /></> : <><circle cx={50} cy={50} r={42} fill={`${AMBER}22`} stroke={AMBER} strokeWidth={8} /><path d="M50 28 V56" stroke={AMBER} strokeWidth={10} strokeLinecap="round" /><circle cx={50} cy={70} r={5} fill={AMBER} /></>}</svg>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: col, transform: "translateZ(0)" }}>{state === "included" ? "INCLUDED" : "VIA CREDITS"}</span>
      </div>
      {note ? <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.7)" }}>{note}</span> : null}
    </div>
  );
};

// TIER SPLIT — the core "who gets it" structure. Max + Team Premium get a
// permanent INCLUDED allowance (green ✓); Pro + Team Standard move to usage
// CREDITS (amber). A dividing line draws between the two halves.
const TierSplitScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const lineH = interpolate(frame, [70, 100], [0, 320], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3a1} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <PlanCard name="Max" state="included" note="50% of weekly limits" at={20} />
            <PlanCard name="Team Premium" state="included" note="50% of weekly limits" at={40} />
          </div>
          {/* the line between standard & premium */}
          <div style={{ width: 3, height: lineH, borderRadius: 2, background: "rgba(120,112,102,0.6)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <PlanCard name="Pro" state="credits" at={110} />
            <PlanCard name="Team Standard" state="credits" at={130} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={tint} />
      </div>
    </SceneShell>
  );
};

// HALF METER — "permanent ≠ unlimited": a weekly-allowance bar where Fable 5 can
// only eat up to HALF. The 50% fill sweeps in and a divider marks the ceiling.
const HalfMeterScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [30, 70], [0, 50], CLAMP); // % of the bar Fable eats
  const barW = 980;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3a2} impacts={[70]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
        <div style={{ position: "relative", width: barW, height: 130 }}>
          {/* the full weekly bar */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, ...glassCard("rgba(120,112,102,0.5)", 2) }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "rgba(31,30,29,0.55)", position: "absolute", top: -40, left: 6, transform: "translateZ(0)" }}>YOUR WEEKLY ALLOWANCE</div>
          {/* Fable's 50% fill */}
          <div style={{ position: "absolute", top: 8, left: 8, bottom: 8, width: `calc(${fill}% - 12px)`, borderRadius: 14, background: `linear-gradient(90deg, ${CYAN}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${CYAN}66` }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", transform: "translateZ(0)", opacity: fill > 30 ? 1 : 0 }}>FABLE 5</span>
          </div>
          {/* the 50% ceiling marker */}
          <div style={{ position: "absolute", top: -18, bottom: -18, left: "50%", width: 4, background: RED, borderRadius: 2 }} />
          <div style={{ position: "absolute", top: -58, left: "calc(50% - 34px)", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: RED, transform: "translateZ(0)" }}>50%</div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={tint} />
      </div>
    </SceneShell>
  );
};

// COST CLIMB — long agentic sessions burn output tokens; a meter climbs from
// green into red while token coins pour, and a bill figure rolls up.
const CostClimbScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const level = interpolate(frame, [20, 200], [8, 100], CLAMP);
  const col = level < 45 ? GREEN : level < 78 ? AMBER : RED;
  const coins = Array.from({ length: 7 }, (_, i) => 20 + i * 22);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3a3} impacts={[200]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 44, height: 340 }}>
          {/* falling token coins */}
          {coins.map((at, i) => {
            const p = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 14 }, durationInFrames: 30 });
            if (frame < at) return null;
            return <div key={i} style={{ position: "absolute", left: -140 + i * 20, top: interpolate(p, [0, 1], [-40, 200 + (i % 3) * 30]), width: 46, height: 46, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${GOLD}, #b8860b)`, border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#5a4200" }}>$</div>;
          })}
          {/* the climbing cost meter */}
          <div style={{ position: "relative", width: 150, height: 320, borderRadius: 22, ...glassCard("rgba(120,112,102,0.5)", 2), overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, height: `calc(${level}% - 16px)`, borderRadius: 14, background: `linear-gradient(0deg, ${GREEN}, ${col})`, boxShadow: `0 0 28px ${col}77` }} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={58} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ROUTE & RESERVE — reserve Fable 5 for the hard lane; route routine work to
// cheaper models. Two lanes: a heavy task rides the Fable lane, small tasks
// peel off to the Sonnet/Opus lane.
const RouteReserveScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lanes = [
    { label: "FABLE 5", sub: "hard planning · reasoning · big repos", col: CYAN, at: 20, y: 0 },
    { label: "SONNET / OPUS", sub: "docs · small edits · routine", col: BLUE, at: 60, y: 1 },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3a4} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {lanes.map((ln, i) => {
            const p = spring({ frame: frame - ln.at, fps, config: { stiffness: 120, damping: 17 }, durationInFrames: 22 });
            if (frame < ln.at) return null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, width: 1080, transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px)`, opacity: interpolate(p, [0, 0.4], [0, 1]) }}>
                <div style={{ width: 70, height: 70, borderRadius: 16, ...glassCard(ln.col + "cc", 2), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0 ? <ClaudeMark size={44} /> : <div style={{ width: 26, height: 26, borderRadius: 8, background: ln.col }} />}
                </div>
                <div style={{ flex: 1, height: 70, borderRadius: 16, ...glassCard(ln.col + "88", 2), display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 26 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 1, color: "#fff", transform: "translateZ(0)" }}>{ln.label}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.72)", transform: "translateZ(0)" }}>{ln.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={58} accent={tint} />
      </div>
    </SceneShell>
  );
};

// OFFICIAL LAUNCH-FILM CLIP — muted "Introducing Claude Fable 5" film card.
const ClipFilmScene: React.FC<{ durationInFrames: number; kicker: string; title: string; src: string; tint: string; accent?: string; label?: string }> = ({ durationInFrames, kicker, title, src, tint, accent = CYAN, label = "ANTHROPIC · OFFICIAL FILM" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 22 });
  const cardW = 1180;
  const cardH = Math.round((cardW * 9) / 16);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x11} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={accent} />
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 16, overflow: "hidden", border: `2px solid ${accent}`, boxShadow: "0 24px 60px rgba(31,30,29,0.28)", background: "#0e0d0c", transform: `scale(${interpolate(pop, [0, 1], [0.93, 1])})`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
          <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 22, top: 22, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 10, background: "rgba(14,13,12,0.74)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#E03E36", boxShadow: "0 0 8px #E03E36" }} />
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: 2, color: "#fff", transform: "translateZ(0)" }}>{label}</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// ── BEATS — from ≈ spokenFrame − 6, whisper-pinned. ─────────────────────────
const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // HOOK · the permanence tweet (face delivers "no longer a temporary bonus", 0-88)
  { scene: "permTweet", from: 88, dur: 416 }, // "Anthropic made its most powerful model a permanent part… included with all Max and Team Premium plans (98-503)"
  { scene: "notUnlimited", from: 509, dur: 336, fullscreen: true }, // "but permanent does not mean unlimited… only 50% of weekly limits (503-845)"
  { scene: "extendedPromo", from: 1090, dur: 320, fullscreen: true }, // "treated as a temporary promotion, extended several times (1082-1408)"
  { scene: "techtimes", from: 1410, dur: 410 }, // "that uncertainty is now over for Max and Team Premium (1416)"
  { scene: "availability", from: 1824, dur: 230, fullscreen: true }, // "permanent only describes its availability, not unlimited sessions (1828-2060)"
  { scene: "tierSplit", from: 2240, dur: 620, fullscreen: true }, // "how the new structure affects each subscription — Max/Team Premium included, Pro/Team Standard not (2244-2860)"
  { scene: "viaCredits", from: 2960, dur: 380, fullscreen: true }, // "does not disappear — Pro and Team Standard continue via usage credits (2870-3344)"
  { scene: "credit100", from: 3344, dur: 400, fullscreen: true }, // "one-time $100 credit, then continued use becomes a metered cost (3344-3744)"
  { scene: "enterprise", from: 3750, dur: 460, fullscreen: true }, // "Enterprise is more complicated — check with your administrator (3754-4230)"
  { scene: "halfLimitDeep", from: 4230, dur: 540, fullscreen: true }, // "the 50% limit — not a separate allowance, eats half your weekly bar (4230-4770)"
  { scene: "usageVaries", from: 4780, dur: 500, fullscreen: true }, // "usage depends on prompt size, context, output, difficulty — only your usage page is reliable (4780-5280)"
  { scene: "expensive", from: 5300, dur: 340, fullscreen: true }, // "that limit matters — Fable 5 is extremely expensive outside the bundle (5290-5640)"
  { scene: "pricing", from: 5640, dur: 660 }, // "$10 per million input, $50 per million output (5940-6300)"
  { scene: "costClimb", from: 6300, dur: 560, fullscreen: true }, // "Claude Code generates large outputs — tokens accumulate quickly in long agentic sessions (6100-6860)"
  { scene: "predictable", from: 6870, dur: 240, fullscreen: true }, // "predictable allowance — but still metered after the included capacity (6510-7050)"
  { scene: "launchClip", from: 7112, dur: 88 }, // OFFICIAL FILM — "Fable 5 originally launched on June 9th (7115)"
  { scene: "suspendTweet", from: 7200, dur: 252 }, // "only three days later, US export controls suspended access globally (7200)"
  { scene: "forbesSuspend", from: 7452, dur: 358 }, // "could not verify nationality in real time, so removed access for everyone (7452)"
  { scene: "redeploy", from: 7815, dur: 435 }, // "improved classifier blocks it in 99% of cases — Fable 5 returned globally July 1 (7815-8250)"
  { scene: "bleeping", from: 8250, dur: 246 }, // "Anthropic continued extending temporary included access (8249)"
  { scene: "techcrunch", from: 8496, dur: 164 }, // "instead of including an expensive, compute-intensive model across every paid subscription (8496)"
  { scene: "tierLine", from: 8660, dur: 408, fullscreen: true }, // "drawn a line between its standard and premium tiers (8658-9068)"
  { scene: "shouldUpgrade", from: 9068, dur: 490, fullscreen: true }, // "so should you upgrade purely to get permanent Fable 5? (9068-9560)"
  { scene: "benchmark", from: 9560, dur: 400 }, // "if you regularly use Claude Code for difficult work, Max could be worth it — Fable 5 was #1 at launch (9560)"
  { scene: "routeReserve", from: 9962, dur: 680, fullscreen: true }, // "reserve Fable 5 for the tasks where it changes the result; route routine work to cheaper models (9962-10642)"
  { scene: "nowPermanent", from: 10650, dur: 400, fullscreen: true }, // "certainty about where it belongs — Fable 5 is now permanent (10650-11040)"
];

export const FP_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const FP_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const FP_EXTRA_CUTS = [1410, 5640, 7200, 7452, 7815, 8250, 8496, 9560];

export const FablePermanentVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* HOOK — the @claudeai permanence tweet (establish → zoom the Max/Team Premium line) */}
      <Sequence from={88} durationInFrames={416} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={416} kicker="CLAUDE · @claudeai" title="NOW PERMANENT" fullBleed={false} tint={CYAN} src={`${SHOT}/fable-permanent-tweet.png`} url="x.com/claudeai" imageW={1100} imageH={786} cardW={1120} cardH={800} to={{ x: 0, y: 0, w: 1100, h: 786 }} zoomAt={0} notes={[{ at: 300, rect: { x: 30, y: 158, w: 1040, h: 100 }, kind: "underline" }]} />
      </Sequence>
      {/* 0:17 — permanent ≠ unlimited (50% meter) */}
      <Sequence from={509} durationInFrames={336} premountFor={30}>
        <HalfMeterScene durationInFrames={336} kicker="EVEN IF YOU QUALIFY" title="PERMANENT ≠ UNLIMITED" tint={RED} />
      </Sequence>
      {/* 0:36 — a temporary promotion, extended several times */}
      <Sequence from={1090} durationInFrames={320} premountFor={30}>
        <FinalTakeawayScene durationInFrames={320} kicker="UNTIL NOW" title="ALWAYS 'TEMPORARY'" stamp="EXTENDED, AGAIN & AGAIN" stampAt={180} accent={AMBER} />
      </Sequence>
      {/* 0:47 — TechTimes: permanent for Max, credits for Pro */}
      <Sequence from={1410} durationInFrames={410} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={410} kicker="TECHTIMES · JUL 18" title="THE LIMBO ENDS" fullBleed={false} tint={GREEN} src={`${SHOT}/fable-techtimes-wide.png`} url="techtimes.com" imageW={3840} imageH={2400} cardW={1500} cardH={840} from={{ x: 500, y: 20, w: 3000, h: 1600 }} to={{ x: 600, y: 40, w: 2620, h: 1400 }} zoomAt={20} notes={[{ at: 40, rect: { x: 660, y: 96, w: 2440, h: 208 }, kind: "box" }]} />
      </Sequence>
      {/* 1:00 — availability ≠ unlimited */}
      <Sequence from={1824} durationInFrames={230} premountFor={30}>
        <FinalTakeawayScene durationInFrames={230} kicker="'PERMANENT' ONLY MEANS" title="IT WON'T DISAPPEAR" stamp="STILL NOT UNLIMITED" stampAt={140} accent={RED} />
      </Sequence>
      {/* 1:15 — the tier split: who actually gets it */}
      <Sequence from={2240} durationInFrames={620} premountFor={30}>
        <TierSplitScene durationInFrames={620} kicker="WHO ACTUALLY GETS IT" title="INCLUDED vs CREDITS" tint={BLUE} />
      </Sequence>
      {/* 1:39 — Pro/Team Standard: still available via credits */}
      <Sequence from={2960} durationInFrames={380} premountFor={30}>
        <FinalTakeawayScene durationInFrames={380} kicker="PRO & TEAM STANDARD" title="STILL AVAILABLE" stamp="— VIA USAGE CREDITS" stampAt={200} accent={AMBER} />
      </Sequence>
      {/* 1:51 — one-time $100 credit, then metered */}
      <Sequence from={3344} durationInFrames={400} premountFor={30}>
        <FinalTakeawayScene durationInFrames={400} kicker="A ONE-TIME HELPING HAND" title="$100 CREDIT" stamp="THEN IT'S METERED" stampAt={220} accent={GOLD} />
      </Sequence>
      {/* 2:05 — Enterprise: check with your admin */}
      <Sequence from={3750} durationInFrames={460} premountFor={30}>
        <FinalTakeawayScene durationInFrames={460} kicker="ENTERPRISE IS DIFFERENT" title="IT DEPENDS" stamp="CHECK WITH YOUR ADMIN" stampAt={240} accent={BLUE} />
      </Sequence>
      {/* 2:21 — the 50% limit is SHARED, not separate */}
      <Sequence from={4230} durationInFrames={540} premountFor={30}>
        <HalfMeterScene durationInFrames={540} kicker="NOT A SEPARATE ALLOWANCE" title="HALF YOUR WEEKLY BAR" tint={AMBER} />
      </Sequence>
      {/* 2:39 — usage varies; only your usage page is real */}
      <Sequence from={4780} durationInFrames={500} premountFor={30}>
        <FinalTakeawayScene durationInFrames={500} kicker="A SHORT Q ≠ A LONG REPO SESSION" title="USAGE VARIES" stamp="TRUST YOUR USAGE PAGE" stampAt={300} accent={CYAN} />
      </Sequence>
      {/* 2:57 — expensive outside the bundle */}
      <Sequence from={5300} durationInFrames={340} premountFor={30}>
        <FinalTakeawayScene durationInFrames={340} kicker="OUTSIDE THE BUNDLE" title="IT GETS EXPENSIVE" stamp="THE STEEPEST CLAUDE MODEL" stampAt={200} accent={RED} />
      </Sequence>
      {/* 3:08 — pricing page: $10 in / $50 out */}
      <Sequence from={5640} durationInFrames={660} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={660} kicker="CLAUDE API PRICING" title="$10 IN · $50 OUT" fullBleed={false} tint={RED} src={`${SHOT}/fable-pricing-wide.png`} url="platform.claude.com" imageW={1900} imageH={1720} cardW={1440} cardH={840} from={{ x: 0, y: 20, w: 1900, h: 1050 }} to={{ x: 20, y: 180, w: 1860, h: 520 }} zoomAt={280} notes={[{ at: 300, rect: { x: 1555, y: 300, w: 310, h: 100 }, kind: "box" }]} />
      </Sequence>
      {/* 3:30 — long agentic sessions accumulate cost */}
      <Sequence from={6300} durationInFrames={560} premountFor={30}>
        <CostClimbScene durationInFrames={560} kicker="LONG AGENTIC SESSIONS" title="TOKENS ADD UP FAST" tint={RED} />
      </Sequence>
      {/* 3:49 — predictable, but still metered */}
      <Sequence from={6870} durationInFrames={240} premountFor={30}>
        <FinalTakeawayScene durationInFrames={240} kicker="INCLUDED ACCESS HELPS" title="MORE PREDICTABLE" stamp="— BUT STILL METERED AFTER" stampAt={150} accent={AMBER} />
      </Sequence>
      {/* 3:57 — OFFICIAL FILM: Fable 5 launched June 9 */}
      <Sequence from={7112} durationInFrames={88} premountFor={30}>
        <ClipFilmScene durationInFrames={88} kicker="IT LAUNCHED JUNE 9" title="MEET CLAUDE FABLE 5" src={`${CLIPS}/fable-launch-clip.mp4`} tint={CYAN} accent={CYAN} />
      </Sequence>
      {/* 4:00 — suspension: export controls pulled it globally */}
      <Sequence from={7200} durationInFrames={252} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={252} kicker="ANTHROPIC · @AnthropicAI" title="PULLED IN 3 DAYS" fullBleed={false} tint={RED} src={`${SHOT}/fable-suspend-tweet.png`} url="x.com/AnthropicAI" imageW={1100} imageH={1000} cardW={912} cardH={830} to={{ x: 0, y: 0, w: 1100, h: 1000 }} zoomAt={0} />
      </Sequence>
      {/* 4:08 — Forbes: couldn't verify nationality, removed for all */}
      <Sequence from={7452} durationInFrames={358} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={358} kicker="FORBES · EXPORT ORDER" title="OFF FOR EVERYONE" fullBleed={false} tint={RED} src={`${SHOT}/fable-forbes-suspend-wide.png`} url="forbes.com" imageW={3840} imageH={2200} cardW={1500} cardH={840} from={{ x: 300, y: 20, w: 3100, h: 1650 }} to={{ x: 340, y: 30, w: 2900, h: 1550 }} zoomAt={20} notes={[{ at: 40, rect: { x: 360, y: 80, w: 2500, h: 335 }, kind: "box" }]} />
      </Sequence>
      {/* 4:20 — restored July 1 with an improved classifier */}
      <Sequence from={7815} durationInFrames={435} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={435} kicker="ANTHROPIC · REDEPLOY" title="BACK JULY 1 · 99% BLOCKED" fullBleed={false} tint={GREEN} src={`${SHOT}/fable-redeploy-wide.png`} url="anthropic.com/news" imageW={3840} imageH={2400} cardW={1500} cardH={840} from={{ x: 480, y: 780, w: 2600, h: 1390 }} to={{ x: 520, y: 820, w: 2500, h: 1330 }} zoomAt={20} />
      </Sequence>
      {/* 4:35 — BleepingComputer: extended access, buying time */}
      <Sequence from={8250} durationInFrames={246} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={246} kicker="BLEEPINGCOMPUTER" title="ONE MORE EXTENSION" fullBleed={false} tint={AMBER} src={`${SHOT}/fable-bleeping-wide.png`} url="bleepingcomputer.com" imageW={3840} imageH={2400} cardW={1500} cardH={840} from={{ x: 560, y: 720, w: 2900, h: 1550 }} to={{ x: 640, y: 760, w: 2560, h: 1370 }} zoomAt={20} notes={[{ at: 40, rect: { x: 700, y: 810, w: 1730, h: 200 }, kind: "box" }]} />
      </Sequence>
      {/* 4:43 — TechCrunch: Mythos kept scarce (150 orgs) */}
      <Sequence from={8496} durationInFrames={164} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={164} kicker="TECHCRUNCH · THE SIBLING" title="KEPT SCARCE" fullBleed={false} tint={BLUE} src={`${SHOT}/fable-techcrunch-wide.png`} url="techcrunch.com" imageW={3840} imageH={2000} cardW={1500} cardH={840} from={{ x: 1620, y: 240, w: 2100, h: 1120 }} to={{ x: 1680, y: 300, w: 1980, h: 1060 }} zoomAt={20} notes={[{ at: 30, rect: { x: 1860, y: 540, w: 1120, h: 490 }, kind: "box" }]} />
      </Sequence>
      {/* 4:49 — the line: standard vs premium */}
      <Sequence from={8660} durationInFrames={408} premountFor={30}>
        <TierSplitScene durationInFrames={408} kicker="THE REAL COMMERCIAL STRUCTURE" title="A LINE IS DRAWN" tint={CYAN} />
      </Sequence>
      {/* 5:02 — should you upgrade? weigh it */}
      <Sequence from={9068} durationInFrames={490} premountFor={30}>
        <BalanceScaleScene durationInFrames={490} kicker="SHOULD YOU UPGRADE?" title="WEIGH IT HONESTLY" leftLabel="OCCASIONAL USE" rightLabel="HEAVY CLAUDE CODE" dropLeftAt={60} dropRightAt={170} tipAt={250} stampText="IT DEPENDS" stampAt={360} tint={BLUE} />
      </Sequence>
      {/* 5:19 — Artificial Analysis: #1 at launch (why it can be worth it) */}
      <Sequence from={9560} durationInFrames={400} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={400} kicker="ARTIFICIAL ANALYSIS" title="#1 AT LAUNCH" fullBleed={false} tint={GOLD} src={`${SHOT}/fable-bench-tweet.png`} url="x.com/ArtificialAnlys" imageW={1100} imageH={1100} cardW={840} cardH={840} to={{ x: 0, y: 0, w: 1100, h: 1100 }} zoomAt={0} />
      </Sequence>
      {/* 5:32 — reserve Fable 5 for the hard lane */}
      <Sequence from={9962} durationInFrames={680} premountFor={30}>
        <RouteReserveScene durationInFrames={680} kicker="THE SMART WAY TO USE IT" title="RESERVE IT FOR THE HARD STUFF" tint={GREEN} />
      </Sequence>
      {/* 5:55 — the payoff */}
      <Sequence from={10650} durationInFrames={400} premountFor={30}>
        <FinalTakeawayScene durationInFrames={400} kicker="LIMITS STAY · CERTAINTY ARRIVES" title="FABLE 5 IS NOW PERMANENT" stamp="KNOW WHERE IT BELONGS" stampAt={230} accent={CYAN} />
      </Sequence>

      {/* 6:09 OUTRO — anchored to the spoken "subscribe" (11088) */}
      <Sequence from={11076} durationInFrames={FP_DUR - 11076} premountFor={30}>
        <Fable5Outro durationInFrames={FP_DUR - 11076} kicker="THE BUSINESS SIDE OF AI" tag="Upgrading for Fable 5? Drop your use-case in the comments." />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const FablePermanentVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FablePermanentVisuals />

      {/* ===== MUSIC — short low beds over the peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={88} durationInFrames={900} volume={0.08} fadeInFrames={30} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={7112} durationInFrames={1200} volume={0.075} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={9962} durationInFrames={1100} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={11076} durationInFrames={FP_DUR - 11076} volume={0.075} fadeInFrames={30} />

      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.whoosh : pick(SFX_POOLS.entry, i)} volume={b.fullscreen ? 0.42 : 0.36} rate={vary(i)} />
      ))}
      <SfxCue from={11076} src={SFX.whoosh} volume={0.42} />
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.34 : cue.type === "whip" ? 0.26 : cue.type === "tick" ? 0.22 : 0.3} rate={vary(i + 2)} />
      ))}
      <SfxCue from={11088} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
