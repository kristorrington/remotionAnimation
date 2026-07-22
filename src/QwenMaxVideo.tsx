import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { glassCard } from "./motion/subjects";
import { FONT, SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";

// QwenMaxVideo — transparent cutaway overlay for "Alibaba's New Qwen 3.8 Max:
// 'Second Only To Fable 5'" (~6m31s, 11732f @ 30fps). A verification story:
// the launch tweet, the missing benchmarks, what independent testing actually
// shows (requesty/benchlm/AA/mark_k), the messy price comparison, and the
// three questions to run on ANY model launch. Receipt-heavy; every `at` is
// whisper-pinned (captionsData, talking-head.mp4 2026-07-22).

export const QWEN_DUR = 11732;

const CYAN = "#D97757";
const RED = "#C65B52";
const GREEN = "#4FA98A";
const AMBER = "#C9913D";
const BLUE = "#6E93BD";
const SHOT = "assets/external/screenshots";

// ── HEAD-TO-HEAD DUEL — the independent 269-file architecture task: Qwen 3.8
// vs Kimi K3 blocks, evidence chips landing on their spoken frames, and the
// "7 groups each" caution that outweighs the 3-point gap. ──
const DuelScene: React.FC<{ durationInFrames: number; filesAt: number; ptsAt: number; fasterAt: number; qwenAt: number }> = ({ durationInFrames, filesAt, ptsAt, fasterAt, qwenAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Chip: React.FC<{ at: number; label: string; col: string; tilt?: number }> = ({ at, label, col, tilt = -2 }) => {
    const p = spring({ frame: frame - at, fps, config: { stiffness: 200, damping: 13 }, durationInFrames: 16 });
    if (frame < at) return null;
    return (
      <div style={{ transform: `rotate(${tilt}deg) scale(${interpolate(p, [0, 1], [1.6, 1])})`, opacity: interpolate(p, [0, 0.4], [0, 1]), padding: "8px 18px", borderRadius: 10, background: col, boxShadow: `0 8px 20px ${col}55` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: "#fff", transform: "translateZ(0)" }}>{label}</span>
      </div>
    );
  };
  const Block: React.FC<{ name: string; col: string; entered: number; children: React.ReactNode }> = ({ name, col, entered, children }) => {
    const p = spring({ frame: frame - entered, fps, config: { stiffness: 120, damping: 17 }, durationInFrames: 20 });
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, opacity: interpolate(p, [0, 0.4], [0, 1]) }}>
        <div style={{ width: 340, height: 150, borderRadius: 18, ...glassCard(col + "cc", 2.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 1, color: "#fff", transform: "translateZ(0)" }}>{name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", minHeight: 120 }}>{children}</div>
      </div>
    );
  };
  const files = spring({ frame: frame - filesAt, fps, config: { stiffness: 170, damping: 14 }, durationInFrames: 18 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x9a1} impacts={[ptsAt]} tint={BLUE}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* the shared task */}
        {frame >= filesAt && (
          <div style={{ transform: `scale(${interpolate(files, [0, 1], [1.5, 1])})`, opacity: interpolate(files, [0, 0.4], [0, 1]), padding: "10px 26px", borderRadius: 12, background: "rgba(253,251,246,0.97)", border: `2px solid ${BLUE}`, boxShadow: "0 10px 26px rgba(31,30,29,0.18)" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 1.5, color: "#1F1E1D" }}>SAME TASK · 269 FILES</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 90, alignItems: "flex-start" }}>
          <Block name="KIMI K3" col={GREEN} entered={14}>
            <Chip at={ptsAt} label="+3 PTS · BLIND REVIEW" col={GREEN} />
            <Chip at={fasterAt} label="FASTER · FEWER TOKENS" col={GREEN} tilt={2} />
          </Block>
          <Block name="QWEN 3.8" col={BLUE} entered={26}>
            <Chip at={qwenAt} label="FEWER TOOL CALLS" col={BLUE} />
            <Chip at={qwenAt + 40} label="STRONGER BOUNDARY" col={BLUE} tilt={2} />
          </Block>
        </div>
        <SceneHeadline kicker="ONE INDEPENDENT TEST" title="CLOSE — NOT A CROWN" titleSize={58} accent={BLUE} />
      </div>
    </SceneShell>
  );
};

// ── PRICE ROWS — the messy cost comparison: Kimi $3/$15, Fable $10/$50, and
// Qwen 3.8 = "?" (credits only). Rows land on their spoken frames. ──
const PriceRowsScene: React.FC<{ durationInFrames: number; kimiAt: number; fableAt: number; qwenAt: number }> = ({ durationInFrames, kimiAt, fableAt, qwenAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { name: "KIMI K3", vals: "$3 in · $15 out", col: GREEN, at: kimiAt },
    { name: "FABLE 5", vals: "$10 in · $50 out", col: CYAN, at: fableAt },
    { name: "QWEN 3.8 MAX", vals: "? — credits only", col: AMBER, at: qwenAt },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x9a2} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {rows.map((r) => {
            const p = spring({ frame: frame - r.at, fps, config: { stiffness: 130, damping: 16 }, durationInFrames: 20 });
            if (frame < r.at) return null;
            return (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 24, width: 1000, transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px)`, opacity: interpolate(p, [0, 0.4], [0, 1]) }}>
                <div style={{ width: 330, padding: "18px 22px", borderRadius: 14, ...glassCard(r.col + "cc", 2) }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", transform: "translateZ(0)" }}>{r.name}</span>
                </div>
                <div style={{ flex: 1, padding: "18px 26px", borderRadius: 14, background: "rgba(253,251,246,0.97)", border: `2px solid ${r.col}88`, boxShadow: "0 10px 24px rgba(31,30,29,0.12)" }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: r.vals.startsWith("?") ? "#B4322C" : "#1F1E1D" }}>{r.vals}</span>
                </div>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="PER MILLION TOKENS" title="YOU CAN'T LINE THEM UP" titleSize={58} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// ── THREE QUESTIONS — the framework payoff: numbered serif cards land on the
// spoken frame of each question. Used once as a fast preview, once full. ──
const ThreeQuestionsScene: React.FC<{ durationInFrames: number; ats: [number, number, number]; subs?: boolean }> = ({ durationInFrames, ats, subs = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qs = [
    { n: "1", q: "Compared under\nwhat conditions?", s: "benchmarks · prompts · settings" },
    { n: "2", q: "What does one\ncompleted task cost?", s: "tokens · retries · review" },
    { n: "3", q: "Can you actually\ndeploy it?", s: "API · weights · licence · data" },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x9a3} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 52 }}>
        <div style={{ display: "flex", gap: 44 }}>
          {qs.map((x, i) => {
            const at = ats[i];
            const p = spring({ frame: frame - at, fps, config: { stiffness: 130, damping: 16 }, durationInFrames: 22 });
            if (frame < at) return null;
            return (
              <div key={x.n} style={{ width: 380, borderRadius: 18, padding: "30px 30px 26px", background: "rgba(253,251,246,0.97)", border: "1px solid rgba(31,30,29,0.16)", boxShadow: "0 22px 54px rgba(31,30,29,0.18)", transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px) rotate(${i === 1 ? 0 : i === 0 ? -1.4 : 1.4}deg)`, opacity: interpolate(p, [0, 0.4], [0, 1]), display: "flex", flexDirection: "column", gap: 14 }}>
                <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 64, lineHeight: 1, color: GREEN }}>{x.n}</span>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, lineHeight: 1.2, color: "#1F1E1D", whiteSpace: "pre-line" }}>{x.q}</span>
                {subs ? <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: "rgba(31,30,29,0.55)" }}>{x.s}</span> : null}
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="BEFORE IT TOUCHES AN AUTOMATION" title="ASK THESE THREE" titleSize={58} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// ── AA STATS — the native recreated chart moment (§13.27): Fable 5's REAL
// independent numbers as editorial counters + source chip. ──
const AAStatsScene: React.FC<{ durationInFrames: number; aAt: number; bAt: number; cAt: number }> = ({ durationInFrames, aAt, bAt, cAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stats = [
    { at: aAt, big: "60", label: "Intelligence Index", col: CYAN },
    { at: bAt, big: "68/s", label: "output tokens", col: GREEN },
    { at: cAt, big: "111s", label: "to first token", col: RED },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x9a4} tint={CYAN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ display: "flex", gap: 60 }}>
          {stats.map((s) => {
            const p = spring({ frame: frame - s.at, fps, config: { stiffness: 120, damping: 17 }, durationInFrames: 24 });
            if (frame < s.at) return null;
            return (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: interpolate(p, [0, 0.5], [0, 1]), transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)` }}>
                <div style={{ width: 300, borderTop: "2px solid rgba(31,30,29,0.7)", borderBottom: "1px solid rgba(31,30,29,0.25)", padding: "18px 0 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 110, lineHeight: 1, color: s.col }}>{s.big}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 1, color: "rgba(31,30,29,0.65)" }}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <SceneHeadline kicker="FABLE 5 · MAX EFFORT (OPUS 4.8 FALLBACK)" title="TESTED. PUBLISHED. CHECKABLE." titleSize={54} accent={CYAN} />
          <div style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid rgba(31,30,29,0.25)", background: "rgba(253,251,246,0.9)" }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 19, letterSpacing: 1.2, color: "rgba(31,30,29,0.6)" }}>SOURCE: ARTIFICIALANALYSIS.AI</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// ── BEATS — from ≈ spokenFrame − 6, whisper-pinned ──────────────────────────
const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // HOOK · the launch tweet (face 0-88, then the claim on screen)
  { scene: "qwenTweet", from: 88, dur: 360 }, // "second only to Fable 5 (181-229)… huge claim… 2.4 trillion parameters (292-360)"
  { scene: "cantCheck", from: 442, dur: 210, fullscreen: true }, // "try finding the benchmark that proves it — right now you can't (372-640)"
  { scene: "whereSits", from: 657, dur: 194 }, // "where does Qwen actually sit against Fable 5, Kimi K3… (663-850)"
  { scene: "markK", from: 851, dur: 260 }, // "I went looking for every comparison I could find (857-1110)"
  { scene: "threeQTease", from: 1113, dur: 172, fullscreen: true }, // "three questions to judge any model launch (1119-1285)"
  // CH1 · what was released
  { scene: "marktechpost", from: 1292, dur: 340 }, // "Qwen 3.8 Max Preview via Token Plan, Qoder, QoderWork (1292-1630)"
  { scene: "specTweet", from: 1637, dur: 260 }, // "2.4T multimodal, coding, data analysis, office work, tools (1643-1900)"
  { scene: "openSoon", from: 1900, dur: 340 }, // "open-weight soon… weights, licence, model card not published (1906-2240)"
  { scene: "moeDiagram", from: 2284, dur: 250 }, // "hasn't disclosed active params… total count ≠ compute per response (2152-2530)"
  // CH2 · the benchmark claim
  { scene: "benchClaim", from: 2545, dur: 330 }, // "comparable with leading frontier models, second only to Fable 5 (2661-2860)"
  { scene: "notShown", from: 2889, dur: 300, fullscreen: true }, // "hasn't published the list… evaluations… scores (2895-3360)"
  { scene: "technosports", from: 3361, dur: 250 }, // "Alibaba's summary of testing we haven't been shown (3367-3600)"
  { scene: "aaStats", from: 3740, dur: 570, fullscreen: true }, // "Fable 5 tested by AA: 60 index (3770), 68 tok/s (4131), 111s first token (4224)"
  { scene: "tradeoff", from: 4486, dur: 240, fullscreen: true }, // "intelligent, but expensive and slow to begin responding (4492-4720)"
  { scene: "noScore", from: 4729, dur: 336 }, // "Qwen has no AA score, not on LMArena… no independent leaderboard (4735-5060)"
  // CH3 · the one real head-to-head
  { scene: "duel", from: 5173, dur: 1104, fullscreen: true }, // "independent tester, 269 files (5459), Kimi +3 (5740), faster/fewer tokens (5876), Qwen fewer tool calls (6020)"
  { scene: "sevenGroups", from: 6282, dur: 260, fullscreen: true }, // "seven groups of claims needing correction — matters more (6288-6530)"
  { scene: "onTask", from: 6809, dur: 300, fullscreen: true }, // "one task, one run — doesn't prove Kimi better… label isn't enough (6815-7100)"
  { scene: "benchlm", from: 7114, dur: 310 }, // "different models can win different parts of the same job (7120-7420)"
  // CH4 · cost + access
  { scene: "prices", from: 7569, dur: 700, fullscreen: true }, // "Kimi $3/$15 (7575), Fable $10/$50 (7790), Qwen no published price (8015-8260)"
  { scene: "eeselTable", from: 8275, dur: 330 }, // "credits depend on usage, caching, reasoning, tools… can't compare directly (8281-8600)"
  { scene: "openCaution", from: 8693, dur: 280, fullscreen: true }, // "the word open needs the same caution (8699-8970)"
  { scene: "openUnknowns", from: 8981, dur: 500, fullscreen: true }, // "Moonshot announced its date (8971)… Alibaba hasn't confirmed checkpoint/date/licence (9134-9480)"
  { scene: "notLaptop", from: 9546, dur: 230, fullscreen: true }, // "serious infrastructure — open-weight ≠ your laptop (9552-9770)"
  // CH5 · the three questions
  { scene: "threeQs", from: 9774, dur: 880, fullscreen: true }, // "First: conditions (9800)… Second: task cost (10069)… Third: deploy (10370)"
  // VERDICT
  { scene: "qwenHome", from: 10645, dur: 178 }, // "run those questions on Qwen 3.8 Max today (10651-10820)"
  { scene: "chatUi", from: 10937, dur: 200 }, // "real strengths in tool use and complex software (10943-11130)"
  { scene: "verdict", from: 11144, dur: 240, fullscreen: true }, // "not enough public evidence to place it second overall (11078-11380)"
];

export const QWEN_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const QWEN_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const QWEN_EXTRA_CUTS = [657, 851, 1292, 1637, 1900, 2284, 2545, 3361, 4729, 7114, 8275, 10645, 10937];

export const QwenMaxVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* HOOK — the launch tweet: establish, underline the claim, zoom the promo banner */}
      <Sequence from={88} durationInFrames={360} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={360} kicker="QWEN · @Alibaba_Qwen" title="THE CLAIM" fullBleed={false} tint={CYAN} src={`${SHOT}/qwen-tweet.png`} url="x.com/Alibaba_Qwen" imageW={1100} imageH={1394} cardW={1100} cardH={820} from={{ x: 0, y: 0, w: 1100, h: 1394 }} to={{ x: 20, y: 110, w: 1060, h: 790 }} zoomAt={16} notes={[{ at: 99, rect: { x: 35, y: 390, w: 755, h: 52 }, kind: "underline" }, { at: 210, rect: { x: 70, y: 800, w: 320, h: 78 }, kind: "box" }]} />
      </Sequence>
      {/* 0:14 — try to check it: you can't */}
      <Sequence from={442} durationInFrames={210} premountFor={30}>
        <FinalTakeawayScene durationInFrames={210} kicker="TRY TO FIND THE BENCHMARK" title="YOU CAN'T" stamp="NOTHING PUBLISHED" stampAt={80} accent={RED} />
      </Sequence>
      {/* 0:22 — where does it actually sit: the last scored Qwen vs Fable */}
      <Sequence from={657} durationInFrames={194} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={194} kicker="REQUESTY · LAST SCORED QWEN" title="QWEN 3.7 vs FABLE 5" fullBleed={false} tint={BLUE} src={`${SHOT}/qwen-requesty-wide.png`} url="requesty.ai" imageW={2260} imageH={1200} cardW={1500} cardH={797} from={{ x: 40, y: 20, w: 2180, h: 1160 }} to={{ x: 60, y: 40, w: 2140, h: 1136 }} zoomAt={16} />
      </Sequence>
      {/* 0:28 — the community chart everyone is sharing */}
      <Sequence from={851} durationInFrames={260} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={260} kicker="COMMUNITY CHART · UNVERIFIED" title="ONE BAR BELOW FABLE" fullBleed={false} tint={AMBER} src={`${SHOT}/qwen-mark-tweet.png`} url="x.com/mark_k" imageW={1100} imageH={960} cardW={920} cardH={803} to={{ x: 0, y: 0, w: 1100, h: 960 }} zoomAt={0} notes={[{ at: 120, rect: { x: 220, y: 800, w: 760, h: 95 }, kind: "box" }]} />
      </Sequence>
      {/* 0:37 — three questions (fast tease) */}
      <Sequence from={1113} durationInFrames={172} premountFor={30}>
        <ThreeQuestionsScene durationInFrames={172} ats={[16, 34, 52]} subs={false} />
      </Sequence>

      {/* CH1 0:43 — what was actually released */}
      <Sequence from={1292} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="MARKTECHPOST" title="PREVIEW, VIA TOKEN PLAN" fullBleed={false} tint={BLUE} src={`${SHOT}/qwen-marktechpost-wide.png`} url="marktechpost.com" imageW={1560} imageH={1250} cardW={1100} cardH={881} to={{ x: 0, y: 0, w: 1560, h: 1250 }} zoomAt={0} notes={[{ at: 199, rect: { x: 20, y: 700, w: 1500, h: 130 }, kind: "underline" }]} />
      </Sequence>
      {/* 0:54 — 2.4T multimodal: the promo banner chips */}
      <Sequence from={1637} durationInFrames={260} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={260} kicker="THE LAUNCH CARD" title="2.4T · MULTIMODAL" fullBleed={false} tint={CYAN} src={`${SHOT}/qwen-tweet.png`} url="x.com/Alibaba_Qwen" imageW={1100} imageH={1394} cardW={1360} cardH={740} from={{ x: 40, y: 560, w: 1020, h: 590 }} to={{ x: 55, y: 575, w: 990, h: 539 }} zoomAt={16} notes={[{ at: 30, rect: { x: 70, y: 800, w: 130, h: 78 }, kind: "circle" }]} />
      </Sequence>
      {/* 1:03 — "open-weight soon" but nothing published */}
      <Sequence from={1900} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="DATACONOMY" title="'SOON' — NOT YET" fullBleed={false} tint={AMBER} src={`${SHOT}/qwen-dataconomy-open-wide.png`} url="dataconomy.com" imageW={2400} imageH={1280} cardW={1500} cardH={800} from={{ x: 30, y: 20, w: 2340, h: 1248 }} to={{ x: 60, y: 40, w: 2280, h: 1216 }} zoomAt={16} notes={[{ at: 20, rect: { x: 80, y: 70, w: 2220, h: 210 }, kind: "box" }]} />
      </Sequence>
      {/* 1:16 — total params ≠ compute (the MoE diagram) */}
      <Sequence from={2284} durationInFrames={250} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={250} kicker="HOW MoE MODELS BILL" title="2.4T ≠ COMPUTE PER TOKEN" fullBleed={false} tint={BLUE} src={`${SHOT}/qwen-eesel-moe-wide.png`} url="eesel.ai/blog" imageW={1380} imageH={1000} cardW={1160} cardH={840} to={{ x: 0, y: 0, w: 1380, h: 1000 }} zoomAt={0} notes={[{ at: 60, rect: { x: 285, y: 645, w: 810, h: 210 }, kind: "box" }]} />
      </Sequence>

      {/* CH2 1:25 — the benchmark claim, back on the tweet text */}
      <Sequence from={2545} durationInFrames={330} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={330} kicker="THE WORDING" title="'SECOND ONLY TO FABLE 5'" fullBleed={false} tint={RED} src={`${SHOT}/qwen-tweet.png`} url="x.com/Alibaba_Qwen" imageW={1100} imageH={1394} cardW={1400} cardH={520} from={{ x: 20, y: 220, w: 1060, h: 320 }} to={{ x: 30, y: 240, w: 1040, h: 386 }} zoomAt={16} notes={[{ at: 199, rect: { x: 35, y: 390, w: 755, h: 52 }, kind: "underline" }]} />
      </Sequence>
      {/* 1:36 — nothing to check */}
      <Sequence from={2889} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="NO LIST · NO EVALS · NO SCORES" title="NOTHING TO CHECK" stamp="AN INTERNAL SUMMARY" stampAt={180} accent={RED} />
      </Sequence>
      {/* 1:52 — a company caption isn't a review */}
      <Sequence from={3361} durationInFrames={250} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={250} kicker="TECHNOSPORTS · JUL 20 UPDATE" title="CLAIMS, NO NUMBERS" fullBleed={false} tint={AMBER} src={`${SHOT}/qwen-technosports-wide.png`} url="technosports.co.in" imageW={2900} imageH={1980} cardW={1420} cardH={580} from={{ x: 0, y: 0, w: 2900, h: 1100 }} to={{ x: 0, y: 1130, w: 2340, h: 830 }} zoomAt={70} notes={[{ at: 90, rect: { x: 20, y: 1628, w: 2280, h: 245 }, kind: "box" }]} />
      </Sequence>
      {/* 2:04 — what REAL testing looks like: Fable's AA numbers (native chart) */}
      <Sequence from={3740} durationInFrames={570} premountFor={30}>
        <AAStatsScene durationInFrames={570} aAt={30} bAt={391} cAt={484} />
      </Sequence>
      {/* 2:29 — the trade-off */}
      <Sequence from={4486} durationInFrames={240} premountFor={30}>
        <FinalTakeawayScene durationInFrames={240} kicker="EVEN THE LEADER PAYS" title="SMART · PRICEY · SLOW START" stamp="A REAL TRADE-OFF" stampAt={140} accent={AMBER} />
      </Sequence>
      {/* 2:37 — Qwen 3.8 has no independent score yet */}
      <Sequence from={4729} durationInFrames={336} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={336} kicker="ARTIFICIAL ANALYSIS" title="3.7 IS SCORED — 3.8 ISN'T" fullBleed={false} tint={BLUE} src={`${SHOT}/qwen-aa-wide.png`} url="artificialanalysis.ai" imageW={3140} imageH={1680} cardW={1540} cardH={642} from={{ x: 0, y: 0, w: 3140, h: 1680 }} to={{ x: 0, y: 0, w: 3140, h: 1200 }} zoomAt={20} notes={[{ at: 40, rect: { x: 20, y: 290, w: 320, h: 420 }, kind: "box" }]} />
      </Sequence>

      {/* CH3 2:52 — the one real head-to-head (269 files) */}
      <Sequence from={5173} durationInFrames={1104} premountFor={30}>
        <DuelScene durationInFrames={1104} filesAt={286} ptsAt={567} fasterAt={703} qwenAt={847} />
      </Sequence>
      {/* 3:29 — seven groups each */}
      <Sequence from={6282} durationInFrames={260} premountFor={30}>
        <FinalTakeawayScene durationInFrames={260} kicker="BOTH OVERREACHED THE EVIDENCE" title="7 CORRECTIONS EACH" stamp="THAT'S THE HEADLINE" stampAt={150} accent={RED} />
      </Sequence>
      {/* 3:47 — one task ≠ proof */}
      <Sequence from={6809} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="ONE TASK · ONE RUN" title="NOT PROOF" stamp="THE LABEL ISN'T ENOUGH" stampAt={180} accent={AMBER} />
      </Sequence>
      {/* 3:57 — different models win different parts */}
      <Sequence from={7114} durationInFrames={310} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={310} kicker="BENCHLM · FABLE vs QWEN 3.7" title="SPLIT DECISIONS" fullBleed={false} tint={GREEN} src={`${SHOT}/qwen-benchlm-compare.png`} url="benchlm.ai" imageW={2340} imageH={2400} cardW={1400} cardH={545} from={{ x: 30, y: 30, w: 2280, h: 800 }} to={{ x: 30, y: 1540, w: 2280, h: 800 }} zoomAt={100} notes={[{ at: 130, rect: { x: 60, y: 1600, w: 2220, h: 172 }, kind: "box" }]} />
      </Sequence>

      {/* CH4 4:12 — the price rows */}
      <Sequence from={7569} durationInFrames={700} premountFor={30}>
        <PriceRowsScene durationInFrames={700} kimiAt={20} fableAt={221} qwenAt={446} />
      </Sequence>
      {/* 4:35 — the Qwen price table with no 3.8 row */}
      <Sequence from={8275} durationInFrames={330} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={330} kicker="EESEL · QWEN API RATE CARD" title="NO 3.8 ROW YET" fullBleed={false} tint={AMBER} src={`${SHOT}/qwen-eesel-table-wide.png`} url="eesel.ai/blog" imageW={1520} imageH={1800} cardW={1080} cardH={764} from={{ x: 0, y: 0, w: 1520, h: 1400 }} to={{ x: 0, y: 60, w: 1520, h: 1000 }} zoomAt={16} notes={[{ at: 30, rect: { x: 30, y: 255, w: 1460, h: 575 }, kind: "box" }]} />
      </Sequence>
      {/* 4:49 — 'open' needs the same caution */}
      <Sequence from={8693} durationInFrames={280} premountFor={30}>
        <FinalTakeawayScene durationInFrames={280} kicker="THE WORD 'OPEN'" title="SAME CAUTION" stamp="PROMISE ≠ RELEASE" stampAt={160} accent={BLUE} />
      </Sequence>
      {/* 4:59 — Kimi has a date; Qwen has unknowns */}
      <Sequence from={8981} durationInFrames={500} premountFor={30}>
        <ThreeUnknownsScene durationInFrames={500} />
      </Sequence>
      {/* 5:18 — not laptop-sized */}
      <Sequence from={9546} durationInFrames={230} premountFor={30}>
        <FinalTakeawayScene durationInFrames={230} kicker="EVEN IF THE WEIGHTS LAND" title="NOT LAPTOP-SIZED" stamp="SERIOUS INFRASTRUCTURE" stampAt={130} accent={RED} />
      </Sequence>

      {/* CH5 5:25 — the three questions, in full */}
      <Sequence from={9774} durationInFrames={880} premountFor={30}>
        <ThreeQuestionsScene durationInFrames={880} ats={[26, 295, 596]} />
      </Sequence>

      {/* VERDICT 5:54 — could be top-tier… */}
      <Sequence from={10645} durationInFrames={178} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={178} kicker="QWEN.AI" title="COULD BE TOP-TIER" fullBleed={false} tint={BLUE} src={`${SHOT}/qwen-home-wide.png`} url="qwen.ai" imageW={3840} imageH={2160} cardW={1500} cardH={844} from={{ x: 60, y: 40, w: 3720, h: 2092 }} to={{ x: 100, y: 60, w: 3640, h: 2048 }} zoomAt={16} /></Sequence>
      {/* 6:04 — real strengths in the product */}
      <Sequence from={10937} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="CHAT.QWEN.AI" title="REAL STRENGTHS" fullBleed={false} tint={GREEN} src={`${SHOT}/qwen-chat-ui-wide.png`} url="chat.qwen.ai" imageW={3840} imageH={2160} cardW={1500} cardH={844} from={{ x: 60, y: 40, w: 3720, h: 2092 }} to={{ x: 100, y: 60, w: 3640, h: 2048 }} zoomAt={16} /></Sequence>
      {/* 6:11 — the verdict */}
      <Sequence from={11144} durationInFrames={240} premountFor={30}>
        <FinalTakeawayScene durationInFrames={240} kicker="SECOND OVERALL?" title="EVIDENCE: NOT YET" stamp="TEST ONE REAL WORKFLOW" stampAt={140} accent={CYAN} />
      </Sequence>

      {/* 6:24 OUTRO — anchored to the spoken "subscribe" (11530) */}
      <Sequence from={11518} durationInFrames={QWEN_DUR - 11518} premountFor={30}>
        <Fable5Outro durationInFrames={QWEN_DUR - 11518} kicker="EVERY LAUNCH, SAME TREATMENT" tag="Would you put Qwen 3.8 in an automation? Comments below." />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

// ── THREE UNKNOWNS — Kimi's weights have a DATE; Qwen 3.8's release has three
// open questions. A dated card vs three "?" chips. ──
const ThreeUnknownsScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const unknowns = [
    { at: 175, label: "EXACT CHECKPOINT?" },
    { at: 225, label: "WHEN?" },
    { at: 275, label: "WHICH LICENCE?" },
  ];
  const kimiP = spring({ frame: frame - 14, fps, config: { stiffness: 130, damping: 16 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x9a5} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: interpolate(kimiP, [0, 0.4], [0, 1]), transform: `translateY(${interpolate(kimiP, [0, 1], [30, 0])}px)` }}>
            <div style={{ width: 360, padding: "24px 26px", borderRadius: 16, ...glassCard(GREEN + "cc", 2.5), display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", transform: "translateZ(0)" }}>KIMI K3</span>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: GREEN, transform: "translateZ(0)" }}>WEIGHTS: DATED ✓</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 380, padding: "24px 26px", borderRadius: 16, ...glassCard(AMBER + "cc", 2.5) }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", transform: "translateZ(0)" }}>QWEN 3.8 MAX</span>
            </div>
            {unknowns.map((u) => {
              const p = spring({ frame: frame - u.at, fps, config: { stiffness: 190, damping: 13 }, durationInFrames: 16 });
              if (frame < u.at) return null;
              return (
                <div key={u.label} style={{ transform: `rotate(-1.5deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`, opacity: interpolate(p, [0, 0.4], [0, 1]), padding: "10px 22px", borderRadius: 10, background: "rgba(253,251,246,0.97)", border: `2px solid ${RED}`, boxShadow: "0 8px 20px rgba(31,30,29,0.15)" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 1, color: "#B4322C" }}>{u.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <SceneHeadline kicker="ONE HAS A DATE. ONE HAS QUESTIONS." title="'SOON' ISN'T A PLAN" titleSize={58} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

export const QwenMaxVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <QwenMaxVisuals />

      {/* ===== MUSIC — short low beds over the peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={88} durationInFrames={1000} volume={0.08} fadeInFrames={30} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={5173} durationInFrames={1370} volume={0.075} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={9774} durationInFrames={1100} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={11518} durationInFrames={QWEN_DUR - 11518} volume={0.075} fadeInFrames={30} />

      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.whoosh : pick(SFX_POOLS.entry, i)} volume={b.fullscreen ? 0.42 : 0.36} rate={vary(i)} />
      ))}
      <SfxCue from={11518} src={SFX.whoosh} volume={0.42} />
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.34 : cue.type === "whip" ? 0.26 : cue.type === "tick" ? 0.22 : 0.3} rate={vary(i + 2)} />
      ))}
      <SfxCue from={11530} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
