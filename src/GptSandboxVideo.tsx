import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { StepsScene } from "./scenes/StepsScene";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { SpeedLayerScene } from "./scenes/LaunchScenes";
import { RaceFasterScene } from "./scenes/LaunchScenes";
import { CheaperToServeScene, BenchmarksLieScene, MigrateStopScene, PlumbingScene } from "./scenes/MetaphorScenes";
import { SystemBreakScene } from "./scenes/SystemBreakScene";
import { PathDoorsScene } from "./scenes/SideHustleScenes";
import { AppFlowScene } from "./scenes/SideHustleScenes";
import { BalanceScaleScene, BenchBarsScene, ScannerScene, GatesScene } from "./scenes/GptScenes";
import { ThemeProvider } from "./theme";

// GptSandboxVideo — transparent cutaway overlay for the "GPT-5.6: sandbox it
// before you scale it" explainer (~4m34s, 8213f @ 30fps). Beats classified per
// CLAUDE.md §3; every `at` below is pinned to the whisper word frames in
// captionsData.ts (frame = seconds × 30, from ≈ spoken − 6).

export const GPT_SANDBOX_DUR = 8213;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open (CLAUDE.md §8): frames 0–90 are full-frame talking head —
  // the hook question is delivered to camera; the first cover cuts in at 90.
  { scene: "speedBoost", from: 90, dur: 320, fullscreen: true },
  { scene: "balance", from: 412, dur: 294, fullscreen: true },
  // 706 → 947: talking-head beat (launch dates + preview partners)
  { scene: "tiersDoors", from: 949, dur: 128 },
  { scene: "pricing", from: 1080, dur: 532 },
  { scene: "benchBars", from: 1616, dur: 492, fullscreen: true },
  // 2108 → 2360: talking-head beat (the Gemini caveat)
  { scene: "scanner", from: 2362, dur: 442 },
  { scene: "systemBreak", from: 2810, dur: 490, fullscreen: true },
  { scene: "cheaperServe", from: 3304, dur: 280 },
  { scene: "benchLie", from: 3588, dur: 766, fullscreen: true },
  { scene: "takeawayCapable", from: 4360, dur: 176, fullscreen: true },
  { scene: "appFlow", from: 4542, dur: 798 },
  { scene: "comparePerms", from: 5345, dur: 255 },
  { scene: "race", from: 5605, dur: 354, fullscreen: true },
  { scene: "migrateStop", from: 5966, dur: 468 },
  { scene: "gates", from: 6439, dur: 420, fullscreen: true },
  { scene: "plumbing", from: 6997, dur: 294 },
  { scene: "signals", from: 7301, dur: 552 },
  { scene: "takeawayFinale", from: 7862, dur: 208, fullscreen: true },
];

export const GPT_SANDBOX_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const GPT_SANDBOX_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

export const GptSandboxVisuals: React.FC = () => {
  return (
    // paper theme: the aligned house style for long-form AND shorts
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 HOOK CLAIM — the SOL module bolts on: 54% more token-efficient */}
      <Sequence from={90} durationInFrames={320} premountFor={30}>
        <SpeedLayerScene durationInFrames={320} kicker="SAM ALTMAN, ON CNBC" title="54% MORE TOKEN-EFFICIENT" blockLabel="GPT-5.6" moduleLabel="SOL" tint="#34D399" />
      </Sequence>

      {/* 0:13 THE CATCH — efficiency vs "it cheated": the scale tips, the rule
          stamps on the spoken "sandbox" (649) */}
      <Sequence from={412} durationInFrames={294} premountFor={30}>
        <BalanceScaleScene durationInFrames={294} kicker="OPENAI'S OWN SAFETY CARD" title="FAST — BUT IT CHEATED" leftLabel="54% EFFICIENT" rightLabel="IT CHEATED" dropLeftAt={24} dropRightAt={94} tipAt={124} stampText="SANDBOX FIRST" stampAt={231} tint="#EF4444" />
      </Sequence>

      {/* 0:31 THREE TIERS — the doors appear on their names (993/1020/1051) */}
      <Sequence from={949} durationInFrames={128} premountFor={30}>
        <PathDoorsScene durationInFrames={128} kicker="THREE TIERS" title="SOL · TERRA · LUNA" doors={[{ label: "SOL", at: 38 }, { label: "TERRA", at: 65 }, { label: "LUNA", at: 96 }]} />
      </Sequence>

      {/* 0:36 PRICING — each tier's price lands on its spoken numbers */}
      <Sequence from={1080} durationInFrames={532} premountFor={30}>
        <StepsScene durationInFrames={532} kicker="PER MILLION TOKENS" title="A REAL ROUTING DECISION" accent="#F59E0B" tint="#F59E0B" steps={[{ label: "SOL — $5 in / $30 out", at: 6 }, { label: "TERRA — $2.50 in / $15 out", at: 168 }, { label: "LUNA — $1 in / $6 out", at: 293 }]} />
      </Sequence>

      {/* 0:54 THE RECEIPT — recreated Terminal-Bench chart; bars grow on 91.9
          (1689) / 88 (1854) / 84.3 (1930) */}
      <Sequence from={1616} durationInFrames={492} premountFor={30}>
        <BenchBarsScene durationInFrames={492} kicker="REPORTED CODING SCORES" title="SOL LEADS THE RECEIPTS" barAts={[67, 232, 308]} tint="#D97757" />
      </Sequence>

      {/* 1:18 FEDERAL PIPELINE — the model card rides through CAIS testing;
          scan on "CAIS" (2549), tag on "early precedent" (2718) */}
      <Sequence from={2362} durationInFrames={442} premountFor={30}>
        <ScannerScene durationInFrames={442} kicker="AXIOS · BANKINFOSECURITY" title="TESTED BY THE FEDS FIRST" cardLabel="GPT-5.6" archLabel="CAIS" tagLabel="EARLY PRECEDENT" scanAt={181} tagAt={350} tint="#F59E0B" />
      </Sequence>

      {/* 1:33 SYSTEM CARD — the workflow breaks: cheated (2986), fabricated
          (3010), destructive (3091) */}
      <Sequence from={2810} durationInFrames={490} premountFor={30}>
        <SystemBreakScene durationInFrames={490} kicker="JUNE 26 SYSTEM CARD" title="IT CHEATED ON TASKS" badges={[{ label: "TASK CHEATING", at: 170 }, { label: "FAKE RESULTS", at: 194 }, { label: "MOVED CREDENTIALS", at: 275 }]} errorAt={170} tint="#EF4444" />
      </Sequence>

      {/* 1:50 SCORES ≠ SAFE TOOLS — the benchmark meter is crossed out, the
          tool-risk meter is what actually moves */}
      <Sequence from={3304} durationInFrames={280} premountFor={30}>
        <CheaperToServeScene durationInFrames={280} kicker="FOR BUILDERS" title="SCORES DON'T PROVE SAFE TOOLS" leftLabel="BENCHMARK" rightLabel="TOOL-ACCESS RISK" />
      </Sequence>

      {/* 1:59 METR — the scoreboard placard drops on the mess behind it:
          reward hacking, 11.3h → 270h, unusable */}
      <Sequence from={3588} durationInFrames={766} premountFor={30}>
        <BenchmarksLieScene durationInFrames={766} kicker="METR TRIED TO MEASURE IT" title="THE ESTIMATE WAS UNUSABLE" messLabels={["REWARD HACKING", "11.3h → 270h", "UNUSABLE"]} />
      </Sequence>

      {/* 2:25 TAKEAWAY — capable is not the same as controlled */}
      <Sequence from={4360} durationInFrames={176} premountFor={30}>
        <FinalTakeawayScene durationInFrames={176} kicker="THE REAL READ" title="CAPABLE ≠ CONTROLLED" stamp="GATE IT" stampAt={95} accent="#EF4444" />
      </Sequence>

      {/* 2:31 LAUNCH-DAY PLACEMENT — the app tiles wire straight into the
          workplace: GitHub Copilot (4673), M365 (4816), ChatGPT Work (4898),
          Codex (5038); the wire connects on "cross-app" (5104) */}
      <Sequence from={4542} durationInFrames={798} premountFor={30}>
        <AppFlowScene durationInFrames={798} kicker="LAUNCH-DAY PLACEMENT" title="STRAIGHT INTO YOUR WORKPLACE" apps={[{ label: "GITHUB COPILOT", at: 125 }, { label: "M365 COPILOT", at: 268 }, { label: "CHATGPT WORK", at: 350 }, { label: "CODEX", at: 490 }]} connectAt={556} collapseAt={731} />
      </Sequence>

      {/* 2:58 PERMISSIONS > LEADERBOARD */}
      <Sequence from={5345} durationInFrames={255} premountFor={30}>
        <CompareCard kicker="ALREADY IN YOUR TOOLS?" tint="#D97757" left={{ title: "LEADERBOARD SPOT", items: ["bragging rights"], accent: "#EF4444", mark: "✗" }} right={{ title: "PERMISSIONS", items: ["what it can touch"], accent: "#34D399", mark: "✓" }} leftDelay={20} rightDelay={168} durationInFrames={255} />
      </Sequence>

      {/* 3:06 EXPLOITBENCH — same score as Mythos Preview on a third of the
          tokens: the efficiency case for a SANDBOXED pilot */}
      <Sequence from={5605} durationInFrames={354} premountFor={30}>
        <RaceFasterScene durationInFrames={354} kicker="DECRYPT · EXPLOITBENCH" title="SAME SCORE. A THIRD OF THE TOKENS." slowLabel="MYTHOS PREVIEW" fastLabel="SOL — ⅓ TOKENS" blockLabel="5.6" />
      </Sequence>

      {/* 3:18 DON'T MIGRATE BLIND — STOP sign, then the test bench */}
      <Sequence from={5966} durationInFrames={468} premountFor={30}>
        <MigrateStopScene durationInFrames={468} kicker="BLANKET MIGRATION?" title="RERUN YOUR REGRESSION FIRST" />
      </Sequence>

      {/* 3:34 THE THREE GATES — sandboxed (6584) / reviewed (6624) /
          least-privilege (6675); "any gate missing" (6739) slams one shut */}
      <Sequence from={6439} durationInFrames={420} premountFor={30}>
        <GatesScene durationInFrames={420} kicker="MY PRODUCTION RULE" title="THE THREE GATES" gates={[{ label: "SANDBOXED", at: 139 }, { label: "REVIEWED", at: 179 }, { label: "LEAST-PRIVILEGE", at: 230 }]} missingAt={294} missingLabel="STAY SUPERVISED" tint="#D97757" />
      </Sequence>

      {/* 3:53 AUDIT THE SCOPES — the plumber checks under the product label */}
      <Sequence from={6997} durationInFrames={294} premountFor={30}>
        <PlumbingScene durationInFrames={294} kicker="BEHIND THE PRODUCT LABEL" title="AUDIT THE SCOPES TODAY" />
      </Sequence>

      {/* 4:03 TWO SIGNALS — safeguards update (7429) + Commerce guidance (7600) */}
      <Sequence from={7301} durationInFrames={552} premountFor={30}>
        <StepsScene durationInFrames={552} kicker="BEFORE YOU MIGRATE" title="WATCH TWO SIGNALS" accent="#34D399" tint="#34D399" steps={[{ label: "Stronger system-card safeguards", at: 122 }, { label: "Commerce testing guidance", at: 293 }]} />
      </Sequence>

      {/* 4:22 FINALE — the rule, stamped on the spoken "sandbox" (8009) */}
      <Sequence from={7862} durationInFrames={208} premountFor={30}>
        <FinalTakeawayScene durationInFrames={208} kicker="UNTIL THEN" title="SANDBOX IT BEFORE YOU SCALE IT" stamp="THEN SCALE" stampAt={152} accent="#D97757" />
      </Sequence>

      {/* 4:29 OUTRO — anchored to the spoken "subscribe" (8144) */}
      <Sequence from={8076} durationInFrames={GPT_SANDBOX_DUR - 8076} premountFor={30}>
        <Fable5Outro durationInFrames={GPT_SANDBOX_DUR - 8076} kicker="PRACTICAL AI — NO HYPE" tag="Would you let GPT-5.6 touch prod? Tell me below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const GptSandboxVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GptSandboxVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={720} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={2810} durationInFrames={760} volume={0.07} startFrom={600} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={4542} durationInFrames={800} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={6439} durationInFrames={700} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={8076} durationInFrames={GPT_SANDBOX_DUR - 8076} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 8076].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      {/* pricing + signal ticks at the spoken numbers */}
      {[1091, 1158, 1267, 1315, 1391, 1418, 7429, 7600].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.switch} volume={0.25} />
      ))}
      <SfxCue from={8088} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};

// Note: GptSandboxVisuals wraps its own ThemeProvider, so both the standalone
// overlay comp and the Final render the paper look without extra plumbing.
