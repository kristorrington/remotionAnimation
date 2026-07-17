import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { BenchBarsScene, GatesScene } from "./scenes/GptScenes";
import { RaceFasterScene } from "./scenes/LaunchScenes";
import { BillPrinterScene } from "./scenes/MetaphorScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { CartoonRobot } from "./motion/subjects";
import { FONT } from "./components/overlayUI";
import { SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";
import valsTop3 from "../public/assets/external/charts/vals-index-top3.json";

// KimiVideo — transparent cutaway overlay for "Kimi K3: the new king?"
// (~6m11s, 11128f @ 30fps). Receipt-forward per Kris's b-roll plan: 14
// receipt beats from 7 official/independent pages, 8 full-screen animated
// spans, one native recreated chart (the Vals top-3 — the overall tab isn't
// in any capture, §10.3). Every `at` is whisper-pinned (captionsData,
// 2026-07-18).

export const KIMI_DUR = 11128;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8); first cover at ~3s = the product
  { scene: "kimiHero", from: 90, dur: 110 }, // "Moonshot AI just revealed… most powerful open AI model (1-141)"
  { scene: "arenaTop", from: 200, dur: 340 }, // "number-one spot in front-end coding (194-282)… half a point behind Claude Fable 5 (357-470)"
  { scene: "threeCatches", from: 540, dur: 320, fullscreen: true }, // "three catches (502): slower (555), tokens (688), can't download the weights (802)"
  { scene: "kingKinetic", from: 860, dur: 170 }, // "is Kimi K3 really the new king? (823-894)… start with the results (932-1014)"
  // ── CH1 · Vals AI independent testing ──
  { scene: "valsProof", from: 1030, dur: 340 }, // "Vals AI independently tested (1036-1126)… 74.7%, second of 38 (1244-1350)"
  { scene: "valsBars", from: 1370, dur: 570, fullscreen: true }, // "Claude first 75.14 (1430-1452)… GPT-5.6 Sol 73.12 (1577)… ahead of GPT (1811)"
  { scene: "valsCard", from: 1940, dur: 420 }, // "coding even stronger (1971-2020): 95.1% SWE-bench Verified (2077-2190), 91.27% Vibe Code Bench (2261-2342)"
  { scene: "homeworkKinetic", from: 2360, dur: 240 }, // "not just Moonshot grading its own homework (2385-2441)… near the front of the pack (2575-2599)"
  // ── CH2 · Arena vs Artificial Analysis ──
  { scene: "arenaTweet", from: 2714, dur: 320 }, // "K3 reached 1,679 Elo (2735-2827)… ahead of Claude and GPT (2903-3025)"
  { scene: "laneKinetic", from: 3034, dur: 200 }, // "the arena measures front-end generation only (3053-3122)"
  { scene: "aaProof", from: 3234, dur: 330 }, // "Artificial Analysis… Intelligence Index score of 57 (3405-3468)… fourth (3531)"
  { scene: "trioBoards", from: 3564, dur: 420, fullscreen: true }, // "number one in one arena (3619), second on Vals (3677), fourth on AA (3723)… different things (3903)"
  { scene: "frontierKinetic", from: 3984, dur: 200 }, // "the honest conclusion: frontier-level (3999-4087)… best overall is shaky (4130-4225)"
  // ── CH3 · The ridiculous size ──
  { scene: "paramsProof", from: 4318, dur: 270 }, // "2.8 trillion total parameters (4349-4430)"
  { scene: "moeScene", from: 4588, dur: 770, fullscreen: true }, // "mixture of experts (4611): 896 experts (4709), only 16 active (4806), ~50B working (4907)… 896 teams (5061), 16 teams (5176)"
  { scene: "contextProof", from: 5358, dur: 340 }, // "context window just over one million tokens (5407-5488)… codebases, documents, agents (5568-5674)"
  // ── CH4 · Speed ──
  { scene: "kdaProof", from: 5698, dur: 390 }, // "Kimi Delta Attention (5758-5779)… 6.3× faster under specific million-token conditions (5867-5981)"
  { scene: "speedRace", from: 6088, dur: 620, fullscreen: true }, // "not 6× faster than competitors (6172-6239)… 62 tok/s (6336-6400)… GLM-5.2 167 (6610-6692)"
  { scene: "compareProof", from: 6708, dur: 450 }, // "GLM 2.7× K3's throughput (6790-6877)… 1.99s vs 1.54s first token (6941-7133)"
  { scene: "speedKinetic", from: 7356, dur: 139 }, // "the current API is not a speed leader (7368-7391)… half the problem (7460-7477)"
  // ── CH5 · Tokens + the bill ──
  { scene: "tokensProof", from: 7495, dur: 445 }, // "K3 generated 130 million output tokens (7617-7673)… twice the median (7850-7897)"
  { scene: "billPrinter", from: 7940, dur: 490, fullscreen: true }, // "slower AND more of them (8014-8114)… agent for an hour (8224-8292)… larger bill (8394-8413)"
  { scene: "pricingProof", from: 8430, dur: 475 }, // "$3 per million uncached (8467-8555), $15 output (8576-8645)… expensive if twice the tokens (8831-8898)"
  // ── CH6 · The open-model claim ──
  { scene: "openClaim", from: 8905, dur: 405 }, // "the open-model claim (8936-8961)… API today (9026-9071), weights promised July 27 (9113-9166)"
  { scene: "gateBeat", from: 9310, dur: 350, fullscreen: true }, // "benchmarks validate through the API (9356-9420), they don't make the weights available (9441-9479)"
  { scene: "infraKinetic", from: 9660, dur: 250 }, // "serious infrastructure (9685-9701)… not a gaming PC (9824-9843)"
  // ── the verdict: recap montage + the catches return ──
  { scene: "recapArena", from: 9940, dur: 145, fullscreen: true }, // "largest open-weight model Moonshot has announced (9969-10030)"
  { scene: "recapVals", from: 10085, dur: 140, fullscreen: true }, // "compete with the leading closed models (10118-10166)"
  { scene: "recapAA", from: 10225, dur: 105, fullscreen: true }, // "coding results genuinely impressive (10190-10243)"
  { scene: "catchesEcho", from: 10330, dur: 310, fullscreen: true }, // "API relatively slow (10366), unusually verbose (10438), weights haven't arrived (10494)"
  { scene: "crownKinetic", from: 10640, dur: 280 }, // "opens up the competition (10576-10600)… whether it deserves the crown depends (10778-10865)"
];

export const KIMI_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const KIMI_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
// receipt swaps + chapter intros also ride the pull-left
export const KIMI_EXTRA_CUTS = [200, 1030, 1940, 2714, 3234, 4318, 5358, 5698, 6708, 7495, 8430, 8905];

const SHOT = "assets/external/screenshots";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AMBER = "#C9913D";
const RED = "#C65B52";
const GREEN = "#4FA98A";

// THE THREE CATCHES — three ink sticker chips slam in scattered on their
// spoken frames while the robot gets progressively more worried. Reused at
// the verdict as the echo (chip labels swap to the verdict wording).
const CatchesScene: React.FC<{ durationInFrames: number; kicker: string; title: string; chips: string[]; chipAts: number[] }> = ({ durationInFrames, kicker, title, chips, chipAts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slots = [
    { x: -320, y: -40, rot: -3 },
    { x: 0, y: 24, rot: 2 },
    { x: 320, y: -18, rot: -2 },
  ];
  const worry = frame >= chipAts[2] ? "alarmed" : frame >= chipAts[1] ? "worried" : frame >= chipAts[0] ? "thinking" : "idle";
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x33} impacts={chipAts} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <div style={{ position: "relative", width: 900, height: 260 }}>
            {chips.map((c, i) => {
              const at = chipAts[i];
              if (frame < at) return null;
              const e = spring({ frame: frame - at, fps, config: { stiffness: 240, damping: 14 }, durationInFrames: 16 });
              const s = slots[i];
              return (
                <div key={c} style={{ position: "absolute", left: 450 + s.x - 150, top: 110 + s.y, width: 300, textAlign: "center", transform: `rotate(${s.rot}deg) scale(${interpolate(e, [0, 1], [1.7, 1])})`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
                  <div style={{ display: "inline-block", padding: "14px 26px", borderRadius: 10, background: "rgba(253,251,246,0.95)", border: `4px solid ${i === 2 ? RED : AMBER}`, boxShadow: "0 10px 26px rgba(31,30,29,0.16)" }}>
                    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: "#1F1E1D", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{c}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <CartoonRobot pose={worry} size={240} accent={AMBER} lookX={-9} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// THE SCOREBOARD TRIO — three leaderboard placards with serif ranks pop on
// their spoken boards; the "different tests" chips wobble in under them.
const TrioBoardsScene: React.FC<{ durationInFrames: number; cardAts: number[]; noteAt: number }> = ({ durationInFrames, cardAts, noteAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boards = [
    { rank: "#1", name: "ARENA", sub: "front-end code", color: GREEN },
    { rank: "#2", name: "VALS INDEX", sub: "38 models", color: "#D97757" },
    { rank: "#4", name: "ARTIFICIAL ANALYSIS", sub: "intelligence 57", color: AMBER },
  ];
  const note = spring({ frame: frame - noteAt, fps, config: { stiffness: 200, damping: 16 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3b} impacts={cardAts} tint="#D97757">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 44 }}>
          {boards.map((b, i) => {
            const at = cardAts[i];
            if (frame < at) return null;
            const e = spring({ frame: frame - at, fps, config: { stiffness: 150, damping: 17 }, durationInFrames: 22 });
            return (
              <div key={b.name} style={{ width: 340, padding: "30px 24px 26px", borderRadius: 14, background: "rgba(250,249,245,0.96)", border: "1px solid rgba(31,30,29,0.28)", boxShadow: "0 16px 40px rgba(31,30,29,0.18)", textAlign: "center", transform: `translateY(${interpolate(e, [0, 1], [70, 0])}px) rotate(${[-2, 0, 2][i]}deg)`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 84, lineHeight: 1, color: b.color }}>{b.rank}</div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 27, letterSpacing: 1, color: "#1F1E1D", marginTop: 12, transform: "translateZ(0)" }}>{b.name}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: "rgba(31,30,29,0.6)", marginTop: 6, transform: "translateZ(0)" }}>{b.sub}</div>
              </div>
            );
          })}
        </div>
        {frame >= noteAt && (
          <div style={{ transform: `rotate(-1.5deg) scale(${interpolate(note, [0, 1], [1.5, 1])})`, opacity: interpolate(note, [0, 0.3], [0, 1]), padding: "10px 24px", borderRadius: 10, background: "rgba(253,251,246,0.95)", border: `3px solid ${AMBER}` }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: "#1F1E1D", transform: "translateZ(0)" }}>DIFFERENT TESTS, DIFFERENT RANKS</span>
          </div>
        )}
        <SceneHeadline kicker="ONE MODEL, THREE BOARDS" title="WHERE IT ACTUALLY RANKS" titleSize={60} />
      </div>
    </SceneShell>
  );
};

// MIXTURE OF EXPERTS — the 896-dot expert grid assembles, 16 experts flare on
// the spoken count, the ≈50B counter stamps, then the "teams" relabel turns
// the same grid into the company metaphor. SVG dots (render-safe, one node).
const MOE_COLS = 32;
const MOE_ROWS = 28; // 32 × 28 = 896
const PICKED = [37, 116, 169, 219, 302, 354, 408, 455, 541, 588, 643, 697, 752, 806, 854, 875];
const KimiMoEScene: React.FC<{ durationInFrames: number; labelAt: number; pickAt: number; countAt: number; teamsAt: number }> = ({ durationInFrames, labelAt, pickAt, countAt, teamsAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 1120;
  const H = 620;
  const cw = W / MOE_COLS;
  const ch = H / MOE_ROWS;
  const build = interpolate(frame, [6, 96], [0, MOE_COLS * MOE_ROWS], CLAMP);
  const picked = frame >= pickAt;
  const count = spring({ frame: frame - countAt, fps, config: { stiffness: 200, damping: 16 }, durationInFrames: 20 });
  const teams = frame >= teamsAt;
  const label = spring({ frame: frame - labelAt, fps, config: { stiffness: 220, damping: 15 }, durationInFrames: 16 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x896} impacts={[pickAt, countAt]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
        <div style={{ position: "relative", width: W, height: H }}>
          <svg width={W} height={H} style={{ display: "block" }}>
            {Array.from({ length: MOE_COLS * MOE_ROWS }, (_, i) => {
              if (i >= build) return null;
              const cx = (i % MOE_COLS) * cw + cw / 2;
              const cy = Math.floor(i / MOE_COLS) * ch + ch / 2;
              const isPick = PICKED.includes(i);
              const lit = picked && isPick;
              const flare = lit ? 1 + 0.35 * Math.max(0, 1 - (frame - pickAt) / 18) : 1;
              return <circle key={i} cx={cx} cy={cy} r={(lit ? 9 : 5.5) * flare} fill={lit ? GREEN : "rgba(31,30,29,0.28)"} style={lit ? { filter: `drop-shadow(0 0 8px ${GREEN})` } : undefined} />;
            })}
          </svg>
          {/* the 896 label rides the grid's top-left */}
          {frame >= labelAt && (
            <div style={{ position: "absolute", left: -30, top: -66, transform: `scale(${interpolate(label, [0, 1], [1.5, 1])}) rotate(-2deg)`, opacity: interpolate(label, [0, 0.3], [0, 1]), padding: "8px 20px", borderRadius: 10, background: "rgba(253,251,246,0.95)", border: `3px solid ${teams ? "#D97757" : GREEN}` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#1F1E1D", transform: "translateZ(0)" }}>{teams ? "896 TEAMS" : "896 EXPERTS"}</span>
            </div>
          )}
          {/* the active-parameters counter */}
          {frame >= countAt && (
            <div style={{ position: "absolute", right: -40, top: -70, transform: `scale(${interpolate(count, [0, 1], [1.7, 1])}) rotate(2deg)`, padding: "10px 24px", borderRadius: 10, background: "rgba(253,251,246,0.95)", border: `4px solid ${GREEN}`, boxShadow: "0 10px 26px rgba(31,30,29,0.16)", opacity: interpolate(count, [0, 0.3], [0, 1]) }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#1F1E1D", transform: "translateZ(0)" }}>16 ON ≈ 50B ACTIVE</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker="2.8T TOTAL, MIXTURE OF EXPERTS" title={teams ? "16 TEAMS PER TASK" : "16 EXPERTS PER TOKEN"} titleSize={60} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// Recap montage receipt — full-bleed page, no sticker, quick 92% settle.
const Montage: React.FC<{ dur: number; src: string; url: string; w: number; h: number }> = ({ dur, src, url, w, h }) => (
  <ScreenshotReceiptScene durationInFrames={dur} title="" kicker="" tint="#D97757" src={src} url={url} imageW={w} imageH={h} from={{ x: Math.round(w * 0.04), y: Math.round(h * 0.04), w: Math.round(w * 0.92), h: Math.round(h * 0.92) }} to={{ x: 0, y: 0, w, h }} zoomAt={6} />
);

export const KimiVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 the product itself — first cover names the subject */}
      <Sequence from={90} durationInFrames={110} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={110} kicker="MOONSHOT AI" title="KIMI K3" tint="#D97757" src={`${SHOT}/kimi-app-wide.png`} url="kimi.com" imageW={3840} imageH={2052} from={{ x: 380, y: 100, w: 3080, h: 1646 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={10} />
      </Sequence>
      {/* 0:06 the #1 claim — the arena table, Claude + GPT visibly below */}
      <Sequence from={200} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="ARENA · CODE | WEBDEV" title="K3 = #1" fullBleed={false} tint="#4FA98A" src={`${SHOT}/arena-webdev-top-wide.png`} url="arena.ai/leaderboard/code/webdev" imageW={2820} imageH={1507} from={{ x: 40, y: 30, w: 1800, h: 962 }} to={{ x: 0, y: 0, w: 2820, h: 1507 }} zoomAt={12} highlight={{ x: 46, y: 494, w: 2720, h: 108 }} highlightAt={15} />
      </Sequence>
      {/* 0:18 THE THREE CATCHES */}
      <Sequence from={540} durationInFrames={320} premountFor={30}>
        <CatchesScene durationInFrames={320} kicker="BEFORE THE CROWN" title="THREE CATCHES" chips={["SLOWER", "TOKEN-HUNGRY", "NO WEIGHTS"]} chipAts={[9, 100, 256]} />
      </Sequence>
      <Sequence from={860} durationInFrames={170} premountFor={30}>
        <FinalTakeawayScene durationInFrames={170} kicker="SO, IS KIMI K3" title="THE NEW KING?" stamp="CHECK THE RESULTS" stampAt={66} accent="#D97757" />
      </Sequence>

      {/* CH1 0:34 — Vals: the open-weight chart */}
      <Sequence from={1030} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="VALS AI · INDEPENDENT" title="74.7% · #2 OF 38" titlePos="right" tint="#D97757" src={`${SHOT}/vals-chart-wide.png`} url="vals.ai" imageW={2900} imageH={1550} from={{ x: 60, y: 40, w: 1900, h: 1015 }} to={{ x: 0, y: 0, w: 2900, h: 1550 }} zoomAt={12} highlight={{ x: 195, y: 1222, w: 2390, h: 66 }} highlightAt={214} />
      </Sequence>
      {/* 0:45 the top-3 — recreated natively (the overall tab isn't captured) */}
      <Sequence from={1370} durationInFrames={570} premountFor={30}>
        <BenchBarsScene durationInFrames={570} kicker="VALS INDEX · OVERALL" title="HALF A POINT BEHIND" barAts={[72, 8, 207]} tint="#4FA98A" data={valsTop3.data} sourceName={valsTop3.sourceName} sourceUrl={valsTop3.sourceUrl} decimals={2} />
      </Sequence>
      {/* 1:05 the coding numbers card */}
      <Sequence from={1940} durationInFrames={420} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={420} kicker="VALS AI · CODING" title="95.1% SWE-BENCH" fullBleed={false} tint="#4FA98A" src={`${SHOT}/vals-kimi-card-wide.png`} url="vals.ai" imageW={2900} imageH={1550} from={{ x: 60, y: 60, w: 1500, h: 802 }} to={{ x: 0, y: 0, w: 2900, h: 1550 }} zoomAt={12} highlight={{ x: 120, y: 565, w: 760, h: 180 }} highlightAt={137} />
      </Sequence>
      <Sequence from={2360} durationInFrames={240} premountFor={30}>
        <FinalTakeawayScene durationInFrames={240} kicker="NOT MOONSHOT'S NUMBERS" title="INDEPENDENTLY CONFIRMED" stamp="FRONT OF THE PACK" stampAt={215} accent="#4FA98A" />
      </Sequence>

      {/* CH2 1:30 — the arena tweet */}
      <Sequence from={2714} durationInFrames={320} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={320} kicker="ARENA · ON X" title="1,679 ELO" fullBleed={false} tint="#D97757" src={`${SHOT}/arena-k3-tweet.png`} url="x.com/arena" imageW={1620} imageH={2600} from={{ x: 40, y: 30, w: 1540, h: 1100 }} to={{ x: 20, y: 10, w: 1580, h: 2560 }} zoomAt={12} />
      </Sequence>
      <Sequence from={3034} durationInFrames={200} premountFor={30}>
        <FinalTakeawayScene durationInFrames={200} kicker="THE ARENA MEASURES" title="FRONT-END ONLY" stamp="ONE LANE" stampAt={52} accent={AMBER} />
      </Sequence>
      {/* 1:48 Artificial Analysis tiles */}
      <Sequence from={3234} durationInFrames={330} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={330} kicker="ARTIFICIAL ANALYSIS" title="INTELLIGENCE: 57" titlePos="right" tint={AMBER} src={`${SHOT}/aa-kimi-tiles-wide.png`} url="artificialanalysis.ai/models/kimi-k3" imageW={3840} imageH={2052} from={{ x: 420, y: 180, w: 2600, h: 1389 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={12} highlight={{ x: 480, y: 240, w: 560, h: 420 }} highlightAt={234} />
      </Sequence>
      {/* 1:59 one model, three boards */}
      <Sequence from={3564} durationInFrames={420} premountFor={30}>
        <TrioBoardsScene durationInFrames={420} cardAts={[55, 113, 159]} noteAt={329} />
      </Sequence>
      <Sequence from={3984} durationInFrames={200} premountFor={30}>
        <FinalTakeawayScene durationInFrames={200} kicker="THE HONEST CONCLUSION" title="FRONTIER-LEVEL" stamp="BEST OVERALL? SHAKY" stampAt={126} accent={AMBER} />
      </Sequence>

      {/* CH3 2:23 — the size, from Moonshot's own blog */}
      <Sequence from={4318} durationInFrames={270} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={270} kicker="MOONSHOT'S ANNOUNCEMENT" title="2.8 TRILLION" fullBleed={false} tint="#6E93BD" src={`${SHOT}/kimi-blog-claims-wide.png`} url="kimi.com/blog/kimi-k3" imageW={2900} imageH={1550} from={{ x: 480, y: 80, w: 2100, h: 1123 }} to={{ x: 0, y: 0, w: 2900, h: 1550 }} zoomAt={10} highlight={{ x: 660, y: 106, w: 1860, h: 95 }} highlightAt={31} />
      </Sequence>
      {/* 2:32 mixture of experts — the custom grid */}
      <Sequence from={4588} durationInFrames={770} premountFor={30}>
        <KimiMoEScene durationInFrames={770} labelAt={121} pickAt={218} countAt={319} teamsAt={473} />
      </Sequence>
      {/* 2:58 the 1M context, official docs */}
      <Sequence from={5358} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="MOONSHOT DOCS" title="1M-TOKEN CONTEXT" fullBleed={false} tint="#4FA98A" src={`${SHOT}/moonshot-quickstart-wide.png`} url="platform.moonshot.ai/docs" imageW={3840} imageH={2052} from={{ x: 900, y: 100, w: 2100, h: 1123 }} to={{ x: 560, y: 0, w: 2740, h: 1465 }} zoomAt={12} highlight={{ x: 1130, y: 255, w: 1540, h: 95 }} highlightAt={104} />
      </Sequence>

      {/* CH4 3:10 — Kimi Delta Attention, the 6.3× figure WITH its caveat */}
      <Sequence from={5698} durationInFrames={390} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={390} kicker="GITHUB · KIMI LINEAR" title="6.3× — SPECIFIC CONDITIONS" fullBleed={false} tint="#6E93BD" src={`${SHOT}/kimi-linear-graph-wide.png`} url="github.com/MoonshotAI/Kimi-Linear" imageW={2200} imageH={1176} from={{ x: 60, y: 40, w: 1400, h: 748 }} to={{ x: 0, y: 0, w: 2200, h: 1176 }} zoomAt={12} highlight={{ x: 1400, y: 380, w: 260, h: 200 }} highlightAt={169} />
      </Sequence>
      {/* 3:28 the race K3 vs GLM — GLM's lane is the fast one */}
      <Sequence from={6088} durationInFrames={620} premountFor={30}>
        <RaceFasterScene durationInFrames={620} kicker="MEASURED OUTPUT SPEED" title="62 VS 167 TOK/S" slowLabel="KIMI K3 · 62/s" fastLabel="GLM-5.2 · 167/s" slowBlock="K3" fastBlock="GLM" />
      </Sequence>
      {/* 3:44 the side-by-side table */}
      <Sequence from={6708} durationInFrames={450} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={450} kicker="ARTIFICIAL ANALYSIS" title="2.7× THE THROUGHPUT" fullBleed={false} tint={AMBER} src={`${SHOT}/aa-compare-table-wide.png`} url="artificialanalysis.ai" imageW={2900} imageH={1550} from={{ x: 60, y: 40, w: 1600, h: 855 }} to={{ x: 0, y: 0, w: 2900, h: 1550 }} zoomAt={12} />
      </Sequence>
      <Sequence from={7356} durationInFrames={139} premountFor={30}>
        <FinalTakeawayScene durationInFrames={139} kicker="KDA HELPS, BUT" title="NOT A SPEED LEADER" stamp="HALF THE PROBLEM" stampAt={104} accent={RED} />
      </Sequence>

      {/* CH5 4:10 — 130M output tokens */}
      <Sequence from={7495} durationInFrames={445} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={445} kicker="ARTIFICIAL ANALYSIS" title="130M OUTPUT TOKENS" fullBleed={false} tint={RED} src={`${SHOT}/aa-kimi-tokens.png`} url="artificialanalysis.ai/models/kimi-k3" imageW={660} imageH={560} from={{ x: 30, y: 20, w: 600, h: 509 }} to={{ x: 0, y: 0, w: 660, h: 560 }} zoomAt={12} />
      </Sequence>
      {/* 4:24 the bill printer — slower AND more tokens */}
      <Sequence from={7940} durationInFrames={490} premountFor={30}>
        <BillPrinterScene durationInFrames={490} kicker="SLOWER × MORE TOKENS" title="THE BILL PRINTS FASTER" />
      </Sequence>
      {/* 4:41 official pricing */}
      <Sequence from={8430} durationInFrames={475} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={475} kicker="MOONSHOT · OFFICIAL" title="$3 IN · $15 OUT" fullBleed={false} tint={AMBER} src={`${SHOT}/moonshot-pricing-wide.png`} url="platform.moonshot.ai/docs/pricing" imageW={1720} imageH={920} from={{ x: 40, y: 30, w: 1200, h: 641 }} to={{ x: 0, y: 0, w: 1720, h: 920 }} zoomAt={12} highlight={{ x: 100, y: 630, w: 1470, h: 70 }} highlightAt={37} />
      </Sequence>

      {/* CH6 4:57 — the open-model claim: July 27 */}
      <Sequence from={8905} durationInFrames={405} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={405} kicker="THE OPEN-MODEL CLAIM" title="WEIGHTS: JULY 27" fullBleed={false} tint="#6E93BD" src={`${SHOT}/kimi-blog-july27-wide.png`} url="kimi.com/blog/kimi-k3" imageW={2400} imageH={1283} from={{ x: 400, y: 120, w: 1500, h: 802 }} to={{ x: 0, y: 0, w: 2400, h: 1283 }} zoomAt={12} highlight={{ x: 435, y: 372, w: 1280, h: 84 }} highlightAt={253} />
      </Sequence>
      {/* 5:10 API gate open, weights gate shut */}
      <Sequence from={9310} durationInFrames={350} premountFor={30}>
        <GatesScene durationInFrames={350} kicker="WHAT YOU GET TODAY" title="API: OPEN · WEIGHTS: NOT YET" gates={[{ label: "API", at: 110 }, { label: "WEIGHTS", at: 132 }]} missingAt={155} missingLabel="JULY 27" tint={AMBER} subject={false} />
      </Sequence>
      <Sequence from={9660} durationInFrames={250} premountFor={30}>
        <FinalTakeawayScene durationInFrames={250} kicker="EVEN WHEN THEY ARRIVE" title="SERIOUS INFRASTRUCTURE" stamp="NOT A GAMING PC" stampAt={164} accent="#6E93BD" />
      </Sequence>

      {/* 5:31 the verdict — the boards return */}
      <Sequence from={9940} durationInFrames={145} premountFor={30}><Montage dur={145} src={`${SHOT}/arena-webdev-top-wide.png`} url="arena.ai/leaderboard/code/webdev" w={2820} h={1507} /></Sequence>
      <Sequence from={10085} durationInFrames={140} premountFor={30}><Montage dur={140} src={`${SHOT}/vals-chart-wide.png`} url="vals.ai" w={2900} h={1550} /></Sequence>
      <Sequence from={10225} durationInFrames={105} premountFor={30}><Montage dur={105} src={`${SHOT}/aa-kimi-tiles-wide.png`} url="artificialanalysis.ai/models/kimi-k3" w={3840} h={2052} /></Sequence>
      {/* 5:44 the catches, one last time */}
      <Sequence from={10330} durationInFrames={310} premountFor={30}>
        <CatchesScene durationInFrames={310} kicker="STILL TRUE" title="THE THREE CATCHES" chips={["SLOW API", "VERBOSE", "NO WEIGHTS YET"]} chipAts={[36, 108, 164]} />
      </Sequence>
      <Sequence from={10640} durationInFrames={280} premountFor={30}>
        <FinalTakeawayScene durationInFrames={280} kicker="NO LONGER JUST HYPE" title="COMPETITION: OPEN" stamp="CROWN: DEPENDS" stampAt={169} accent="#D97757" />
      </Sequence>

      {/* 6:05 OUTRO — anchored to the spoken "subscribe" (10970) */}
      <Sequence from={10958} durationInFrames={KIMI_DUR - 10958} premountFor={30}>
        <Fable5Outro durationInFrames={KIMI_DUR - 10958} kicker="PRACTICAL AI — NO HYPE" tag="Follow-up when the weights land July 27 — subscribe" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const KimiVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <KimiVisuals />

      {/* ===== MUSIC — short low beds over the peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={860} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={4318} durationInFrames={1040} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={9310} durationInFrames={1330} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={10958} durationInFrames={KIMI_DUR - 10958} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — rotating palette: whoosh only on fullscreen span starts;
          receipt/kinetic cuts ride the entry pool, pitch-varied ===== */}
      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.whoosh : pick(SFX_POOLS.entry, i)} volume={b.fullscreen ? 0.42 : 0.36} rate={vary(i)} />
      ))}
      <SfxCue from={10958} src={SFX.whoosh} volume={0.42} />
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.34 : cue.type === "whip" ? 0.26 : cue.type === "tick" ? 0.22 : 0.3} rate={vary(i + 2)} />
      ))}
      <SfxCue from={10970} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
