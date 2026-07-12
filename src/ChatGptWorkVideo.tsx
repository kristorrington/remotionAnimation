import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { MigrateStopScene, SpeedWallScene, PlumbingScene, BillPrinterScene, BenchmarksLieScene, FinishCheckScene } from "./scenes/MetaphorScenes";
import { PathDoorsScene, AppFlowScene } from "./scenes/SideHustleScenes";
import { ScannerScene } from "./scenes/GptScenes";
import { OneWorkspaceScene, RivalryScene, SolIncidentScene, NoBackupNoAgentScene, SandboxScene } from "./scenes/ChatGptWorkScenes";
import { ScreenshotReceiptScene, SourceCardScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";

// ChatGptWorkVideo — transparent cutaway overlay for the "What is ChatGPT
// Work" explainer (~5m30s, 9914f @ 30fps). Beats classified per CLAUDE.md §3;
// every `at` is pinned to whisper word frames (captionsData, 2026-07-13).
// The opener carries the ChatGPT blossom (OpenAiMark) — Kris's hard rule.

export const CHATGPT_WORK_DUR = 9914;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8); the first cover is the logo opener
  { scene: "oneWorkspace", from: 90, dur: 190, fullscreen: true }, // panels dive in on "folds Codex into ChatGPT" (190)
  { scene: "dirPan", from: 300, dur: 150 }, // "adds one directory for the tools your business already uses" (296)
  { scene: "fewerTabs", from: 460, dur: 130 }, // "fewer tabs, fewer handoffs" (~445-585)
  { scene: "migrateStop", from: 862, dur: 158, fullscreen: true }, // "learn it now, do not trust it with your only copy" (870-1016)
  { scene: "launchProof", from: 1060, dur: 180 }, // "launched on Thursday, July 9th" (1077)
  { scene: "notRebrand", from: 1290, dur: 100 }, // "an Enterprise rebrand misses the product change" (1300-1390)
  { scene: "codexMergeProof", from: 1400, dur: 220 }, // "merged Codex technology directly into ChatGPT" (1392)
  { scene: "classicProof", from: 1810, dur: 180 }, // "renamed ChatGPT Classic" (1803)
  { scene: "productSplit", from: 2100, dur: 300, fullscreen: true }, // "a genuine product split across the same account ecosystem" (2310-2433)
  { scene: "rivalry", from: 2445, dur: 250, fullscreen: true }, // "ChatGPT Work versus Claude Cowork and Copilot" (2445-2705)
  { scene: "modelsProof", from: 2900, dur: 200 }, // "three named models: Sol, Terra, and Luna" (2893)
  { scene: "rolesUnclear", from: 3120, dur: 110 }, // "reporting does not define those roles clearly" (3170-3240)
  { scene: "staggerProof", from: 3250, dur: 140 }, // "how the release got delayed" (3240)
  { scene: "scanner", from: 3400, dur: 180, fullscreen: true }, // "restricted access pending a national security review" (3387-3560)
  { scene: "reviewScopeProof", from: 3590, dur: 230 }, // "cyber, biological, and military risk" (3590-3660)
  { scene: "accessProof", from: 3980, dur: 190 }, // "Access started with Pro, Enterprise, and Edu" (3971)
  { scene: "planCompare", from: 4180, dur: 300, fullscreen: true }, // "Plus and Business would follow within days" (4183-4360)
  { scene: "dontChase", from: 4495, dur: 115 }, // "do not upgrade purely to chase early access" (4495-4555)
  { scene: "billPrinter", from: 4620, dur: 230, fullscreen: true }, // "usage-metered billing that scales with task complexity" (4690)
  { scene: "noPriceProof", from: 4870, dur: 210 }, // "did not publish a fixed price" (4876)
  { scene: "costReal", from: 5130, dur: 140 }, // "cost becomes real after repeated use" (5150-5300)
  { scene: "directoryPan", from: 5311, dur: 150 }, // "the Unified Plugins Directory... Slack, Gmail, Salesforce" (5311-5460)
  { scene: "appFlow", from: 5480, dur: 330, fullscreen: true }, // "...Zoom, LinkedIn, and Outlook... behind one product surface" (5642-5800)
  { scene: "connectorWarn", from: 5900, dur: 150 }, // "not assume every connector can read, write, automate" (5873-6090)
  { scene: "strategyProof", from: 6120, dur: 200 }, // "sit across Microsoft 365 and Google Workspace" (6225)
  { scene: "controlLayer", from: 6380, dur: 210, fullscreen: true }, // "the control layer across your work stack" (6460)
  { scene: "trustTest", from: 6700, dur: 120 }, // "launch week turns into a trust test" (6712)
  { scene: "unverifiedCard", from: 6830, dur: 150 }, // "quota resets and confusion around the redesign" (6829)
  { scene: "solIncident", from: 6990, dur: 330, fullscreen: true }, // "two Sol incidents... deleted" (6993) → NOT CONFIRMED (7162)
  { scene: "damageAtSpeed", from: 7440, dur: 220, fullscreen: true }, // "an agent with file access can damage the work" (7500-7660)
  { scene: "needsPermissions", from: 7660, dur: 95 }, // "a useful agent needs permissions" (7660-7738)
  { scene: "needsLimits", from: 7755, dur: 170 }, // "a trustworthy agent needs limits" (7738-7830)
  { scene: "demosHide", from: 7860, dur: 240, fullscreen: true }, // "coverage focused on... polished demos; file safety deserves equal attention" (7856-8100)
  { scene: "backupRule", from: 8110, dur: 260, fullscreen: true }, // "do not run agentic tasks against anything that lacks a backup" (8140-8260)
  { scene: "greenLight", from: 8400, dur: 140 }, // "official acknowledgment or patch note" (8323-8440)
  { scene: "sandbox", from: 8830, dur: 300, fullscreen: true }, // "start inside a sandbox folder containing copies only" (8836)
  { scene: "onlyCopy", from: 9140, dur: 160 }, // "do not point it at the only version of a client deliverable" (9100-9280)
  { scene: "verdictCompare", from: 9300, dur: 220 }, // "launch day... patch notes show whether it's earning trust" (9300-9420)
  { scene: "finishCheck", from: 9530, dur: 240, fullscreen: true }, // "learn the workflow now, grant real access after the patches" (9560-9760)
];

export const CHATGPT_WORK_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const CHATGPT_WORK_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

const SHOT = "assets/external/screenshots";

export const ChatGptWorkVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 HOOK — four work surfaces dive into ONE ChatGPT window (blossom on) */}
      <Sequence from={90} durationInFrames={190} premountFor={30}>
        <OneWorkspaceScene durationInFrames={190} title="ONE WORKSPACE" panelAts={[10, 30, 60, 78]} mergeAt={100} stampAt={140} tint="#D97757" />
      </Sequence>

      {/* 0:10 b-roll: the Unified Plugins Directory, first glance ("adds one directory" 296) */}
      <Sequence from={300} durationInFrames={150} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={150} kicker="OPENAI.COM" title="ONE DIRECTORY" tint="#34D399" src={`${SHOT}/openai-plugins-grid.png`} url="openai.com/business/plugins" imageW={2880} imageH={5500} from={{ x: 0, y: 760, w: 2880, h: 1539 }} to={{ x: 0, y: 60, w: 2880, h: 1539 }} zoomAt={12} />
      </Sequence>

      {/* 0:15 kinetic: the promise */}
      <Sequence from={460} durationInFrames={130} premountFor={30}>
        <FinalTakeawayScene durationInFrames={130} title="FEWER TABS" stamp="ONE CHAT" stampAt={85} accent="#D97757" />
      </Sequence>

      {/* 0:29 the verdict, acted out: learn it — but STOP before trusting it */}
      <Sequence from={862} durationInFrames={158} premountFor={30}>
        <MigrateStopScene durationInFrames={158} title="LEARN, DON'T TRUST" stopAtFrame={90} />
      </Sequence>

      {/* 0:35 receipt: OpenAI's own launch page ("Thursday, July 9th" 1077) */}
      <Sequence from={1060} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="OPENAI.COM · JUL 9" title="LAUNCH DAY" titlePos="right" tint="#D97757" src={`${SHOT}/openai-work-launch-wide.png`} url="openai.com" imageW={3840} imageH={2052} from={{ x: 154, y: 82, w: 3532, h: 1888 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={16} highlight={{ x: 1560, y: 210, w: 760, h: 120 }} highlightAt={30} />
      </Sequence>

      {/* 0:43 kinetic: not a rebrand */}
      <Sequence from={1290} durationInFrames={100} premountFor={30}>
        <FinalTakeawayScene durationInFrames={100} title="NOT A REBRAND" accent="#F59E0B" />
      </Sequence>

      {/* 0:46 receipt: help center — Codex merged into ChatGPT ("merged directly" 1392) */}
      <Sequence from={1400} durationInFrames={220} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={220} kicker="HELP.OPENAI.COM" title="CODEX, FOLDED IN" tint="#34D399" src={`${SHOT}/openai-help-codex-wide.png`} url="help.openai.com" imageW={2535} imageH={1355} from={{ x: 102, y: 54, w: 2332, h: 1246 }} to={{ x: 0, y: 0, w: 2535, h: 1355 }} zoomAt={16} highlight={{ x: 385, y: 592, w: 1360, h: 80 }} highlightAt={34} />
      </Sequence>

      {/* 1:00 receipt: the "ChatGPT Classic" rename, from the FAQ ("renamed" 1803) */}
      <Sequence from={1810} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="HELP.OPENAI.COM" title="MEET 'CLASSIC'" tint="#F59E0B" src={`${SHOT}/openai-help-classic-wide.png`} url="help.openai.com" imageW={2535} imageH={1355} from={{ x: 0, y: 0, w: 2535, h: 1355 }} to={{ x: 180, y: 40, w: 1980, h: 1058 }} zoomAt={14} highlight={{ x: 385, y: 86, w: 1130, h: 76 }} highlightAt={31} />
      </Sequence>

      {/* 1:10 the product split: two doors, one direction pushed */}
      <Sequence from={2100} durationInFrames={300} premountFor={30}>
        <PathDoorsScene durationInFrames={300} kicker="ONE ACCOUNT" title="A REAL SPLIT" doors={[{ label: "CHATGPT", at: 40 }, { label: "CLASSIC", at: 72 }]} pickIndex={0} pickAt={225} />
      </Sequence>

      {/* 1:21 the rivalry: three work-AI columns, subject enlarged */}
      <Sequence from={2445} durationInFrames={250} premountFor={30}>
        <RivalryScene durationInFrames={250} kicker="THE OBVIOUS COMPARISON" title="WORK-AI RIVALRY" colAts={[10, 45, 78]} emphasizeAt={219} tint="#34D399" />
      </Sequence>

      {/* 1:36 receipt: help-center table naming Sol, Terra, Luna (2893) */}
      <Sequence from={2900} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="HELP.OPENAI.COM" title="SOL · TERRA · LUNA" tint="#D97757" src={`${SHOT}/openai-help-models-table-wide.png`} url="help.openai.com" imageW={2535} imageH={1355} from={{ x: 102, y: 54, w: 2332, h: 1246 }} to={{ x: 0, y: 0, w: 2535, h: 1355 }} zoomAt={12} highlight={{ x: 385, y: 420, w: 1345, h: 84 }} highlightAt={19} />
      </Sequence>

      {/* 1:44 kinetic: the fine print */}
      <Sequence from={3120} durationInFrames={110} premountFor={30}>
        <FinalTakeawayScene durationInFrames={110} title="ROLES: UNCLEAR" accent="#F59E0B" />
      </Sequence>

      {/* 1:48 receipt: TechSpot's staggered-release headline (3240) */}
      <Sequence from={3250} durationInFrames={140} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={140} kicker="TECHSPOT · JUN 27" title="STAGGERED RELEASE" titlePos="right" tint="#EF4444" src={`${SHOT}/techspot-staggered-wide.png`} url="techspot.com" imageW={2900} imageH={1550} from={{ x: 116, y: 62, w: 2668, h: 1426 }} to={{ x: 0, y: 0, w: 2900, h: 1550 }} zoomAt={14} highlight={{ x: 300, y: 150, w: 1715, h: 340 }} highlightAt={28} />
      </Sequence>

      {/* 1:53 the review, acted out: GPT-5.6 rides through the scan arch */}
      <Sequence from={3400} durationInFrames={180} premountFor={30}>
        <ScannerScene durationInFrames={180} kicker="NATIONAL-SECURITY REVIEW" title="HELD AT THE GATE" cardLabel="GPT-5.6" archLabel="US REVIEW" tagLabel="RESTRICTED" scanAt={40} tagAt={95} tint="#EF4444" />
      </Sequence>

      {/* 1:59 receipt: the review scope — cyber, biological, military (3590) */}
      <Sequence from={3590} durationInFrames={230} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={230} kicker="THETECHPORTAL" title="THE REVIEW SCOPE" titlePos="right" tint="#F59E0B" src={`${SHOT}/techportal-review-wide.png`} url="thetechportal.com" imageW={2021} imageH={1080} from={{ x: 80, y: 43, w: 1859, h: 994 }} to={{ x: 0, y: 0, w: 2021, h: 1080 }} zoomAt={14} highlight={{ x: 450, y: 620, w: 1120, h: 130 }} highlightAt={20} />
      </Sequence>

      {/* 2:12 receipt: MacRumors — who gets it first (3971) */}
      <Sequence from={3980} durationInFrames={190} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={190} kicker="MACRUMORS · JUL 9" title="WHO GETS IT" titlePos="right" tint="#34D399" src={`${SHOT}/macrumors-rollout-wide.png`} url="macrumors.com" imageW={2535} imageH={1355} from={{ x: 102, y: 54, w: 2332, h: 1246 }} to={{ x: 0, y: 0, w: 2535, h: 1355 }} zoomAt={14} highlight={{ x: 195, y: 262, w: 1490, h: 92 }} highlightAt={22} />
      </Sequence>

      {/* 2:19 today vs the coming days */}
      <Sequence from={4180} durationInFrames={300} premountFor={30}>
        <CompareCard kicker="THE ROLLOUT" tint="#D97757" left={{ title: "TODAY", items: ["Pro", "Enterprise", "Edu"], accent: "#34D399", mark: "✓" }} right={{ title: "COMING DAYS", items: ["Plus", "Business"], accent: "#F59E0B", mark: "→" }} leftDelay={20} rightDelay={50} durationInFrames={300} />
      </Sequence>

      {/* 2:29 kinetic: don't chase access */}
      <Sequence from={4495} durationInFrames={115} premountFor={30}>
        <FinalTakeawayScene durationInFrames={115} title="DON'T CHASE ACCESS" accent="#EF4444" />
      </Sequence>

      {/* 2:34 billing, acted out: the meter runs while the task runs */}
      <Sequence from={4620} durationInFrames={230} premountFor={30}>
        <BillPrinterScene durationInFrames={230} kicker="THE DECODER REPORTS" title="METERED BILLING" />
      </Sequence>

      {/* 2:42 receipt: the pricing page has no Work price (4876) */}
      <Sequence from={4870} durationInFrames={210} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={210} kicker="CHATGPT.COM/PRICING" title="NO WORK PRICE" tint="#F59E0B" src={`${SHOT}/chatgpt-pricing-wide.png`} url="chatgpt.com/pricing" imageW={3200} imageH={1710} from={{ x: 0, y: 0, w: 3200, h: 1710 }} to={{ x: 340, y: 260, w: 2560, h: 1368 }} zoomAt={18} />
      </Sequence>

      {/* 2:51 kinetic: cost gets real */}
      <Sequence from={5130} durationInFrames={140} premountFor={30}>
        <FinalTakeawayScene durationInFrames={140} title="COST GETS REAL" subtitle="after repeated use" accent="#E8B84B" />
      </Sequence>

      {/* 2:57 b-roll: the directory pan — Slack, Gmail, Salesforce… (5311) */}
      <Sequence from={5311} durationInFrames={150} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={150} kicker="UNIFIED PLUGINS DIRECTORY" title="YOUR APPS, LISTED" titlePos="right" tint="#34D399" src={`${SHOT}/openai-plugins-grid.png`} url="openai.com/business/plugins" imageW={2880} imageH={5500} from={{ x: 0, y: 1500, w: 2880, h: 1539 }} to={{ x: 0, y: 100, w: 2880, h: 1539 }} zoomAt={14} highlight={{ x: 55, y: 120, w: 900, h: 210 }} highlightAt={130} />
      </Sequence>

      {/* 3:02 the point: apps wire into ONE surface */}
      <Sequence from={5480} durationInFrames={330} premountFor={30}>
        <AppFlowScene durationInFrames={330} title="ONE SURFACE" apps={[{ label: "GMAIL", at: 30 }, { label: "TEAMS", at: 70 }, { label: "ZOOM", at: 110 }, { label: "OUTLOOK", at: 165 }]} connectAt={200} collapseAt={9999} />
      </Sequence>

      {/* 3:16 kinetic: day-one limits */}
      <Sequence from={5900} durationInFrames={150} premountFor={30}>
        <FinalTakeawayScene durationInFrames={150} title="DAY-ONE LIMITS" stamp="CHECK PERMISSIONS" stampAt={80} accent="#F59E0B" />
      </Sequence>

      {/* 3:24 receipt backdrop: OpenAI pitching itself across the work stack */}
      <Sequence from={6120} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="OPENAI.COM" title="ACROSS BOTH STACKS" titlePos="right" tint="#D97757" src={`${SHOT}/openai-work-integrations-wide.png`} url="openai.com" imageW={3840} imageH={2052} from={{ x: 154, y: 82, w: 3532, h: 1888 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={16} />
      </Sequence>

      {/* 3:32 the strategy, acted out: the control layer under the shiny apps */}
      <Sequence from={6380} durationInFrames={210} premountFor={30}>
        <PlumbingScene durationInFrames={210} title="THE CONTROL LAYER?" />
      </Sequence>

      {/* 3:43 kinetic: the trust test */}
      <Sequence from={6700} durationInFrames={120} premountFor={30}>
        <FinalTakeawayScene durationInFrames={120} title="THE TRUST TEST" accent="#EF4444" />
      </Sequence>

      {/* 3:47 the July-11 noise, clearly flagged as unverified */}
      <Sequence from={6830} durationInFrames={150} premountFor={30}>
        <SourceCardScene durationInFrames={150} kicker="JULY 11 · UNVERIFIED" title="LAUNCH-WEEK NOISE" sourceName="community reports — unconfirmed" lines={[{ text: "Quota resets", highlight: true }, { text: "Redesign confusion" }]} highlightAt={60} accent="#F59E0B" />
      </Sequence>

      {/* 3:53 THE beat: the reported Sol incidents (illustration, then NOT CONFIRMED) */}
      <Sequence from={6990} durationInFrames={330} premountFor={30}>
        <SolIncidentScene durationInFrames={330} kicker="ONE UNVERIFIED REPORT" title="TWO SOL INCIDENTS" deleteAt={58} warnAt={92} freezeAt={172} tint="#EF4444" />
      </Sequence>

      {/* 4:08 damage at speed: the fast agent hits the wall it was avoiding */}
      <Sequence from={7440} durationInFrames={220} premountFor={30}>
        <SpeedWallScene durationInFrames={220} title="DAMAGE AT SPEED" wallLabel="YOUR FILES" rocketLabel="AGENT" />
      </Sequence>

      {/* 4:15 the two-line law */}
      <Sequence from={7660} durationInFrames={95} premountFor={30}>
        <FinalTakeawayScene durationInFrames={95} title="AGENTS NEED PERMISSIONS" accent="#D97757" />
      </Sequence>
      <Sequence from={7755} durationInFrames={170} premountFor={30}>
        <FinalTakeawayScene durationInFrames={170} title="TRUST NEEDS LIMITS" stamp="SANDBOX IT" stampAt={60} accent="#EF4444" />
      </Sequence>

      {/* 4:22 the coverage gap: shiny demos in front, file safety behind */}
      <Sequence from={7860} durationInFrames={240} premountFor={30}>
        <BenchmarksLieScene durationInFrames={240} title="DEMOS HIDE RISK" messLabels={["FILE SAFETY", "PERMISSIONS", "RECOVERY"]} />
      </Sequence>

      {/* 4:30 MY RULE: no backup, no agent */}
      <Sequence from={8110} durationInFrames={260} premountFor={30}>
        <NoBackupNoAgentScene durationInFrames={260} kicker="MY RULE" title="BACK IT UP FIRST" stopAt={40} copyAt={148} goAt={200} stampAt={220} tint="#34D399" />
      </Sequence>

      {/* 4:40 kinetic: what flips the light */}
      <Sequence from={8400} durationInFrames={140} premountFor={30}>
        <FinalTakeawayScene durationInFrames={140} title="GREEN LIGHT: PATCH NOTES" accent="#34D399" />
      </Sequence>

      {/* 4:54 the playbook: sandbox first, write access last */}
      <Sequence from={8830} durationInFrames={300} premountFor={30}>
        <SandboxScene durationInFrames={300} kicker="START HERE" title="SANDBOX FIRST" copyAts={[50, 64, 78]} boundaryAt={100} chipAts={[120, 145, 245]} tint="#D97757" />
      </Sequence>

      {/* 5:04 kinetic: the red line */}
      <Sequence from={9140} durationInFrames={160} premountFor={30}>
        <FinalTakeawayScene durationInFrames={160} title="NOT YOUR ONLY COPY" accent="#EF4444" />
      </Sequence>

      {/* 5:10 launch day vs patch notes */}
      <Sequence from={9300} durationInFrames={220} premountFor={30}>
        <CompareCard kicker="THE VERDICT" tint="#34D399" left={{ title: "LAUNCH DAY", items: ["it's available"], accent: "#D97757", mark: "→" }} right={{ title: "PATCH NOTES", items: ["it's trustworthy"], accent: "#34D399", mark: "✓" }} leftDelay={20} rightDelay={90} durationInFrames={220} />
      </Sequence>

      {/* 5:17 closing verdict: learn now, trust later */}
      <Sequence from={9530} durationInFrames={240} premountFor={30}>
        <FinishCheckScene durationInFrames={240} kicker="THE CALL" title="LEARN NOW, TRUST LATER" stamp="WATCH THE PATCHES" stampAt={150} />
      </Sequence>

      {/* 5:26 OUTRO — anchored to the spoken "subscribe" (9847) */}
      <Sequence from={9790} durationInFrames={CHATGPT_WORK_DUR - 9790} premountFor={30}>
        <Fable5Outro durationInFrames={CHATGPT_WORK_DUR - 9790} kicker="PRACTICAL AI — NO HYPE" tag="Would you give it write access yet? Tell me below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const ChatGptWorkVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ChatGptWorkVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={1020} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={2900} durationInFrames={700} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={6700} durationInFrames={920} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={8830} durationInFrames={760} volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={9790} durationInFrames={CHATGPT_WORK_DUR - 9790} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 9790].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      <SfxCue from={9802} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};

// Note: ChatGptWorkVisuals wraps its own ThemeProvider, so both the standalone
// overlay comp and the Final render the paper look without extra plumbing.
