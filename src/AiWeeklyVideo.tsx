import React from "react";
import { AbsoluteFill, Sequence, OffthreadVideo, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { SystemBreakScene } from "./scenes/SystemBreakScene";
import { BalanceScaleScene, GatesScene } from "./scenes/GptScenes";
import { glassCard } from "./motion/subjects";
import { FONT, SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";
import { KineticText, DecisionFramework, MusicController, PALETTE } from "./motion/editkit";

// AiWeeklyVideo — the transparent cutaway overlay for the weekly AI-news
// roundup: "3 stories that matter, 2 that don't" (~8m07s, 14613f @ 30fps).
// Edit spine (Kris, 2026 — "b-roll FIRST before animations"): every section
// OPENS on the real source (screenshot / tweet / official film) as the cover,
// THEN cuts to the animated explainer. Model-review edit kit + restrained
// editorial motion; every number is EXACT from the transcript; internal /
// company claims are flagged, independent sources labelled. Chapters:
// The Feed / Hugging Face / Opus 5 / Open Weights / The Watchlist / The Filter.

export const AI_WEEKLY_DUR = 14613;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OPUS = PALETTE.opus; // #D97757 terracotta (brand)
const SONNET = PALETTE.sonnet; // #6E93BD slate blue
const GREEN = PALETTE.win;
const AMBER = PALETTE.cost;
const RED = PALETTE.danger;
const SHOT = "assets/external/screenshots";

// ── receipt helper — a b-roll source card (kicker/title on paper above) ───────
type Shot = { w: number; h: number };
const IMG: Record<string, Shot> = {
  hf: { w: 3840, h: 2600 },
  eval: { w: 3840, h: 2160 },
  delangue: { w: 1100, h: 1440 },
  opus5: { w: 3840, h: 1400 },
  effort: { w: 3840, h: 1150 },
  halfprice: { w: 1100, h: 1500 },
  aa: { w: 3840, h: 950 },
  jensen: { w: 1100, h: 1300 },
  kimi: { w: 3840, h: 1450 },
  gemini: { w: 3840, h: 900 },
  presence: { w: 3840, h: 1000 },
};
const receipt = (
  dur: number, key: keyof typeof IMG, file: string, url: string,
  kicker: string, title: string, tint: string,
  opts: { cardW?: number; cardH?: number; notes?: { at: number; rect: { x: number; y: number; w: number; h: number }; kind?: "box" | "underline" | "circle" }[]; titlePos?: "center" | "right" | "left"; titleTop?: number } = {},
) => {
  const im = IMG[key];
  const full = { x: 0, y: 0, w: im.w, h: im.h };
  const cardH = opts.cardH ?? Math.min(760, Math.round((opts.cardW ?? 1600) * (im.h / im.w)));
  const cardW = opts.cardW ?? Math.round(cardH * (im.w / im.h));
  return (
    <ScreenshotReceiptScene
      durationInFrames={dur} kicker={kicker} title={title} fullBleed={false} tint={tint}
      src={`${SHOT}/${file}`} url={url} imageW={im.w} imageH={im.h}
      cardW={cardW} cardH={cardH} from={full} to={full} zoomAt={0}
      notes={opts.notes} titlePos={opts.titlePos} titleTop={opts.titleTop}
    />
  );
};

// ── ClipCard — a play-framed film card for the muted official-footage montage ─
const ClipCard: React.FC<{ durationInFrames: number; kicker: string; title: string; clip: string; source: string; tint: string }> = ({ durationInFrames, kicker, title, clip, source, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - 4, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 26 });
  const cardW = 1180, cardH = 664;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x77} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 16, overflow: "hidden", ...glassCard(tint + "cc", 2.5), transform: `scale(${interpolate(e, [0, 1], [0.9, 1])})`, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP), boxShadow: `0 22px 60px rgba(6,9,16,0.4)` }}>
          <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* film chrome */}
          <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 8, background: "rgba(6,9,16,0.6)", border: `1px solid ${tint}` }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: RED }} />
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, letterSpacing: 2, color: "#fff" }}>· OFFICIAL FILM</span>
          </div>
          <div style={{ position: "absolute", bottom: 14, right: 18, fontFamily: FONT, fontWeight: 600, fontSize: 16, color: "rgba(255,255,255,0.7)" }}>{source}</div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── ChipRow — three quick benefit/label stickers (reused for market/control) ──
const ChipRow: React.FC<{ durationInFrames: number; kicker: string; title: string; chips: string[]; tint: string }> = ({ durationInFrames, kicker, title, chips, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x78} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", gap: 28 }}>
          {chips.map((c, i) => {
            const at = 10 + i * 14;
            const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
            const tilt = [-3, 2, -2][i % 3];
            return (
              <div key={c} style={{ padding: "30px 34px", borderRadius: 14, ...glassCard(tint + "cc", 2.5), transform: `translateY(${interpolate(e, [0, 1], [42, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 3, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#fff", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{c}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── TwoRuns — same task, one run clean, one run with retries + a manual fix ───
const TwoRuns: React.FC<{ durationInFrames: number; tint: string }> = ({ durationInFrames, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Row: React.FC<{ at: number; col: string; name: string; steps: string[]; cost: string }> = ({ at, col, name, steps, cost }) => {
    const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
    return (
      <div style={{ width: 900, padding: "22px 28px", borderRadius: 16, ...glassCard(col + "cc", 2.5), display: "flex", alignItems: "center", gap: 20, transform: `translateX(${interpolate(e, [0, 1], [-40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", width: 130, transform: "translateZ(0)" }}>{name}</span>
        <div style={{ display: "flex", gap: 10, flex: 1 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 6px", borderRadius: 10, background: `${col}22`, border: `1.5px solid ${col}`, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: "#fff" }}>{s}</div>
          ))}
        </div>
        <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: col, width: 140, textAlign: "right", transform: "translateZ(0)" }}>{cost}</span>
      </div>
    );
  };
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x79} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <Row at={12} col={RED} name="RUN A" steps={["run", "retry", "retry", "retry", "human fix"]} cost="$$$" />
        <Row at={70} col={GREEN} name="RUN B" steps={["run", "done"]} cost="$" />
        <SceneHeadline kicker="SAME TASK · SAME TOKEN PRICE" title="THE GAP IS COMPLETION COST" titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── BEATS — from ≈ spokenFrame − 6 (SRT-pinned). node carries the scene so the
//    windows / fullscreen spans / cut list can never drift from the visuals. ──
type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE FEED (cold-open b-roll montage: the 3 stories as real sources) ──
  { key: "hookHF", from: 100, dur: 150, receipt: true, node: receipt(150, "hf", "ainews-hf-blog.png", "huggingface.co/blog", "THIS WEEK · STORY 1", "A REAL COMPANY GOT HIT", RED) },
  { key: "hookOpus", from: 256, dur: 130, receipt: true, node: receipt(130, "opus5", "ainews-opus5-hero.png", "anthropic.com/news", "THIS WEEK · STORY 2", "OPUS 5 LANDED", OPUS) },
  { key: "hookOpen", from: 326, dur: 132, receipt: true, node: receipt(132, "jensen", "ainews-jensen.png", "x.com/JensenHuang", "THIS WEEK · STORY 3", "OPEN WEIGHTS, BIG BACKERS", SONNET) },
  { key: "hookWatch", from: 462, dur: 150, fullscreen: true, node: (<SceneShell durationInFrames={150} particleSeed={0x11} tint={AMBER}><KineticText text="2 ON THE WATCHLIST" durationInFrames={150} highlight="WATCHLIST" y={520} size={92} /></SceneShell>) },

  // ── STORY 1 · HUGGING FACE (a benchmark that breached a real company) ──
  { key: "s1hero", from: 744, dur: 320, receipt: true, node: receipt(320, "hf", "ainews-hf-blog.png", "huggingface.co/blog/security-incident-july-2026", "HUGGING FACE · DISCLOSURE", "17,000 EVENTS REBUILT", RED, { notes: [{ at: 60, rect: { x: 300, y: 250, w: 2900, h: 150 }, kind: "box" }] }) },
  { key: "s1trail", from: 1048, dur: 300, receipt: true, node: receipt(300, "delangue", "ainews-delangue-hf.png", "x.com/ClementDelangue", "HF CEO · ON X", "CAUGHT AT RECORD SPEED", SONNET) },
  { key: "s1eval", from: 1445, dur: 300, receipt: true, node: receipt(300, "eval", "ainews-openai-eval.png", "openai.com/index/hugging-face-model-evaluation-security-incident", "THE SET-UP · OPENAI", "INTERNET ON, GUARDS OFF", AMBER) },
  { key: "s1chain", from: 1824, dur: 470, fullscreen: true, node: (
    <SystemBreakScene durationInFrames={470} kicker="HOW A TEST BECAME A BREACH" title="WEAKNESSES, CHAINED" tint={RED}
      badges={[{ label: "TARGET REACHABLE", at: 30 }, { label: "LOOKED USEFUL", at: 120 }, { label: "CHAINED EXPLOITS", at: 210 }, { label: "→ HUGGING FACE", at: 320 }]} errorAt={360} />
  ) },
  { key: "s1real", from: 2360, dur: 300, fullscreen: true, node: (
    <SceneShell durationInFrames={300} particleSeed={0x12} tint={RED} mood="danger">
      <FinalTakeawayScene durationInFrames={300} kicker="THE SET-UP EXPLAINS IT — IT DOESN'T UNDO IT" title="STILL A REAL BREACH" stamp="A REAL COMPANY, COMPROMISED" stampAt={180} accent={RED} />
    </SceneShell>
  ) },
  { key: "s1gates", from: 2690, dur: 620, fullscreen: true, node: (
    <GatesScene durationInFrames={620} kicker="IF YOU RUN AGENTS — NON-NEGOTIABLE NOW" title="THREE GATES, MINIMUM" tint={SONNET}
      gates={[{ label: "EGRESS", at: 20 }, { label: "CREDENTIAL SCOPE", at: 120 }, { label: "TOOL PERMISSIONS", at: 220 }]} />
  ) },
  { key: "s1balance", from: 3450, dur: 500, fullscreen: true, node: (
    <BalanceScaleScene durationInFrames={500} kicker="A BETTER AGENT DOES UNINTENDED WORK FASTER TOO" title="CAPABILITY = RISK" tint={AMBER}
      leftLabel="CAPABILITY" rightLabel="RISK" dropLeftAt={30} dropRightAt={110} tipAt={150} stampText="THEY MOVE TOGETHER" stampAt={300} />
  ) },

  // ── STORY 2 · OPUS 5 (same token price — completion cost is the real story) ──
  { key: "s2hero", from: 3986, dur: 320, receipt: true, node: receipt(320, "opus5", "ainews-opus5-hero.png", "anthropic.com/news/claude-opus-5", "ANTHROPIC · OPUS 5", "SAME PRICE AS OPUS 4.8", OPUS) },
  { key: "s2price", from: 4324, dur: 300, fullscreen: true, node: (
    <SceneShell durationInFrames={300} particleSeed={0x13} tint={AMBER}>
      <KineticText text="PRICE IS HALF THE STORY" durationInFrames={300} highlight="HALF" y={520} size={86} />
    </SceneShell>
  ) },
  { key: "s2evidence", from: 4700, dur: 340, receipt: true, node: receipt(340, "effort", "ainews-opus5-effort.png", "anthropic.com/news/claude-opus-5", "THE EVIDENCE THAT COUNTS", "SCORED ON WHOLE TASKS", OPUS) },
  { key: "s2live", from: 5040, dur: 300, receipt: true, node: receipt(300, "halfprice", "ainews-opus5-halfprice.png", "x.com/claudeai", "CLAUDE · ON X", "LIVE TODAY", GREEN) },
  { key: "s2honest", from: 5290, dur: 250, fullscreen: true, node: (
    <SceneShell durationInFrames={250} particleSeed={0x14} tint={AMBER}>
      <KineticText text="MOSTLY ANTHROPIC'S OWN DATA" durationInFrames={250} highlight="OWN" y={520} size={72} />
    </SceneShell>
  ) },
  { key: "s2aa", from: 5566, dur: 300, receipt: true, node: receipt(300, "aa", "ainews-aa-opus5.png", "artificialanalysis.ai/models/claude-opus-5", "INDEPENDENT · ARTIFICIAL ANALYSIS", "AN OUTSIDE CHECK", SONNET) },
  { key: "s2trails", from: 5880, dur: 240, fullscreen: true, node: (
    <SceneShell durationInFrames={240} particleSeed={0x15} tint={RED}>
      <KineticText text="STILL TRAILS ON CYBER" durationInFrames={240} highlight="TRAILS" y={520} size={82} />
    </SceneShell>
  ) },
  { key: "s2tworuns", from: 6146, dur: 420, fullscreen: true, node: <TwoRuns durationInFrames={420} tint={AMBER} /> },
  { key: "s2verdict", from: 6600, dur: 320, fullscreen: true, node: (
    <SceneShell durationInFrames={320} particleSeed={0x16} tint={GREEN}>
      <FinalTakeawayScene durationInFrames={320} kicker="A MODEL EARNS YOUR ATTENTION WHEN…" title="COMPLETION COST DROPS" stamp="ON WORK LIKE YOURS" stampAt={190} accent={GREEN} />
    </SceneShell>
  ) },

  // ── STORY 3 · OPEN WEIGHTS (access becomes strategy) ──
  { key: "s3clip", from: 7037, dur: 380, node: (
    <ClipCard durationInFrames={380} kicker="JULY 24 · THE COALITION" title="A PUSH FOR OPEN WEIGHTS" clip="assets/external/clips/ainews-nvidia-openweights.mp4" source="NVIDIA GTC · Jensen Huang" tint={SONNET} />
  ) },
  { key: "s3jensen", from: 7263, dur: 320, receipt: true, node: receipt(320, "jensen", "ainews-jensen.png", "x.com/JensenHuang", "JENSEN HUANG · ON X", "SAFETY · INNOVATION · SOVEREIGNTY", SONNET) },
  { key: "s3market", from: 7642, dur: 340, fullscreen: true, node: (
    <ChipRow durationInFrames={340} kicker="WHY IT'S A MARKET STORY" title="LEVERAGE, NOT JUST TECH" tint={GREEN} chips={["MORE SUPPLIERS", "MORE HOSTING", "MORE BARGAINING"]} />
  ) },
  { key: "s3route", from: 7944, dur: 360, fullscreen: true, node: (
    <SceneShell durationInFrames={360} particleSeed={0x17} tint={OPUS}>
      <FinalTakeawayScene durationInFrames={360} kicker="THE REAL SAVING ISN'T ONE CHEAP MODEL" title="ROUTE EACH TASK TO ITS FIT" stamp="CAPABILITY, NOT HABIT" stampAt={220} accent={OPUS} />
    </SceneShell>
  ) },
  { key: "s3control", from: 8261, dur: 420, fullscreen: true, node: (
    <SceneShell durationInFrames={420} particleSeed={0x18} tint={SONNET}>
      <DecisionFramework title="WHAT CONTROL BUYS YOU" revealAts={[20, 150, 280]} columns={[
        { name: "WHERE IT RUNS", use: "Your infra, your call", accent: SONNET },
        { name: "FINE-TUNING", use: "Adapt it to you", accent: OPUS, highlight: true },
        { name: "NO LOCK-IN", use: "One vendor can't sink you", accent: GREEN },
      ]} />
    </SceneShell>
  ) },
  { key: "s3advocacy", from: 8700, dur: 340, fullscreen: true, node: (
    <SceneShell durationInFrames={340} particleSeed={0x19} tint={AMBER}>
      <FinalTakeawayScene durationInFrames={340} kicker="BE STRAIGHT ABOUT WHAT IT IS" title="ADVOCACY, NOT PROOF" stamp="A SIGNAL — NOT A GUARANTEE" stampAt={200} accent={AMBER} />
    </SceneShell>
  ) },
  { key: "s3kimi", from: 9043, dur: 340, receipt: true, node: receipt(340, "kimi", "ainews-kimi.png", "github.com/MoonshotAI/Kimi-K2.5", "OPEN WEIGHTS · IN THE WILD", "STABLE WEIGHTS · REAL LICENCE", GREEN) },
  { key: "s3strategy", from: 9528, dur: 340, fullscreen: true, node: (
    <SceneShell durationInFrames={340} particleSeed={0x1a} tint={GREEN}>
      <FinalTakeawayScene durationInFrames={340} kicker="THE STRATEGY THIS IS REALLY ABOUT" title="OPEN FOR ROUTINE, FRONTIER FOR HARD" stamp="PORTABLE BY DESIGN" stampAt={210} accent={GREEN} />
    </SceneShell>
  ) },

  // ── THE WATCHLIST (2 stories that don't count yet) ──
  { key: "wReason", from: 10047, dur: 340, fullscreen: true, node: (
    <SceneShell durationInFrames={340} particleSeed={0x1b} tint={AMBER}>
      <FinalTakeawayScene durationInFrames={340} kicker="BOTH ON THE LIST — SAME REASON" title="NO RELEASE. NO OUTSIDE PROOF." stamp="JUST THE COMPANY'S WORD" stampAt={200} accent={AMBER} />
    </SceneShell>
  ) },
  { key: "wGemini", from: 10269, dur: 360, receipt: true, node: receipt(360, "gemini", "ainews-gemini-api.png", "ai.google.dev/gemini-api/docs/models", "WATCHLIST · GOOGLE", "NO ROW FOR 3.5 PRO YET", SONNET) },
  { key: "wGeminiGates", from: 10706, dur: 500, fullscreen: true, node: (
    <GatesScene durationInFrames={500} kicker="WHAT WOULD MAKE IT REAL" title="RELEASE · PRICING · TESTING" tint={SONNET}
      gates={[{ label: "RELEASE DATE", at: 20 }, { label: "PUBLIC PRICING", at: 110 }, { label: "INDEPENDENT TEST", at: 210 }]} missingAt={300} missingLabel="STILL WATCHLIST" />
  ) },
  { key: "wPresence", from: 10932, dur: 360, receipt: true, node: receipt(360, "presence", "ainews-presence-vb.png", "venturebeat.com/orchestration", "WATCHLIST · OPENAI", "PRESENCE, UNVEILED", OPUS) },
  { key: "wPresenceStat", from: 11435, dur: 380, fullscreen: true, node: (
    <SceneShell durationInFrames={380} particleSeed={0x1c} tint={GREEN}>
      <FinalTakeawayScene durationInFrames={380} kicker="ITS STRONGEST REPORTED NUMBER" title="75% RESOLVED, NO HUMAN" stamp="…IN OPENAI'S OWN DEPLOYMENT" stampAt={230} accent={GREEN} />
    </SceneShell>
  ) },
  { key: "wStandard", from: 12262, dur: 380, fullscreen: true, node: (
    <SceneShell durationInFrames={380} particleSeed={0x1d} tint={AMBER}>
      <FinalTakeawayScene durationInFrames={380} kicker="A PRESS-RELEASE NUMBER ISN'T EVIDENCE" title="OUTSIDE PROOF BEATS PR" stamp="SAME STANDARD, BOTH TIMES" stampAt={230} accent={AMBER} />
    </SceneShell>
  ) },

  // ── THE FILTER (the rule + the close) ──
  { key: "fRule", from: 12921, dur: 560, fullscreen: true, node: (
    <SceneShell durationInFrames={560} particleSeed={0x1e} tint={OPUS}>
      <DecisionFramework title="JUDGE EVERY ANNOUNCEMENT" revealAts={[30, 170, 320]} columns={[
        { name: "CAPABILITY", use: "Can it do more — today?", accent: OPUS, highlight: true },
        { name: "RISK", use: "What can it now break?", accent: RED },
        { name: "COST & ACCESS", use: "Cheaper? In your hands?", accent: GREEN },
      ]} />
    </SceneShell>
  ) },
  { key: "fToday", from: 13120, dur: 260, node: (
    <SceneShell durationInFrames={260} particleSeed={0x1f} tint={OPUS}>
      <KineticText text="TODAY — NOT EVENTUALLY" durationInFrames={260} highlight="TODAY" y={520} size={92} />
    </SceneShell>
  ) },
  { key: "fRecap", from: 13483, dur: 460, fullscreen: true, node: (
    <ChipRow durationInFrames={460} kicker="THIS WEEK, IN ONE LINE" title="WHAT ACTUALLY MOVED" tint={SONNET} chips={["OPUS 5: COST", "HUGGING FACE: RISK", "OPEN WEIGHTS: ACCESS"]} />
  ) },
];

export const AI_WEEKLY_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const AI_WEEKLY_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const AI_WEEKLY_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);

const OUTRO_FROM = 13990;

export const AiWeeklyVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill>
        {BEATS.map((b) => (
          <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={30}>
            {b.node}
          </Sequence>
        ))}
        {/* OUTRO — free-community CTA + sign-off; holds while the face closes */}
        <Sequence from={OUTRO_FROM} durationInFrames={AI_WEEKLY_DUR - OUTRO_FROM} premountFor={30}>
          <Fable5Outro durationInFrames={AI_WEEKLY_DUR - OUTRO_FROM} kicker="THE FRAMEWORK, EVERY WEEK" tag="Free breakdown inside the school community — go check it out" />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export const AiWeeklyVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <AiWeeklyVisuals />

      {/* ===== MUSIC — main analytical bed; caveat bed over risk + watchlist ===== */}
      <MusicController state="main" from={100} durationInFrames={600} volume={0.07} />
      <MusicController state="caveat" from={744} durationInFrames={3200} volume={0.06} duck={[{ from: 744, to: 1064 }, { from: 1445, to: 1745 }]} />
      <MusicController state="main" from={3986} durationInFrames={3050} volume={0.07} duck={[{ from: 3986, to: 4306 }, { from: 4700, to: 5340 }, { from: 5566, to: 5866 }]} />
      <MusicController state="main" from={7037} durationInFrames={2830} volume={0.07} duck={[{ from: 7037, to: 7583 }, { from: 9043, to: 9383 }]} />
      <MusicController state="caveat" from={10047} durationInFrames={2830} volume={0.06} duck={[{ from: 10269, to: 10629 }, { from: 10932, to: 11292 }]} />
      <MusicController state="main" from={12921} durationInFrames={AI_WEEKLY_DUR - 12921} volume={0.065} />

      {/* ===== SFX — restrained: entrance per beat, accents on key beats ===== */}
      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.softWhoosh : pick(SFX_POOLS.entry, i)} volume={0.4} rate={vary(i)} />
      ))}
      {/* receipts settle — a soft camera shutter */}
      {BEATS.filter((b) => b.receipt).map((b, i) => (
        <SfxCue key={`r-${b.from}`} from={b.from + 22} src={SFX.confirmation} volume={0.34} rate={vary(i)} />
      ))}
      {/* section starts — one low impact */}
      {[744, 3986, 7037, 10047, 12921].map((f) => (
        <SfxCue key={`sec-${f}`} from={f} src={SFX.lowImpact} volume={0.4} />
      ))}
      {/* the breach + the balance tip — a warning pulse */}
      <SfxCue from={1824 + 360} src={SFX.warningPulse} volume={0.4} />
      <SfxCue from={3450 + 150} src={SFX.warningPulse} volume={0.36} />
    </AbsoluteFill>
  );
};
