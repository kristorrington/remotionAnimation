import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { MigrateStopScene, SpeedWallScene, CheaperToServeScene, HiddenCostScene, FinishCheckScene } from "./scenes/MetaphorScenes";
import { PathDoorsScene, AppFlowScene } from "./scenes/SideHustleScenes";
import { OneWorkspaceScene, RivalryScene } from "./scenes/ChatGptWorkScenes";
import { VoiceLiveScene } from "./scenes/AiNewsScenes";
import { StepsScene } from "./scenes/StepsScene";
import { StatCountersScene } from "./scenes/StatCountersScene";
import { BalanceScaleScene } from "./scenes/GptScenes";
import { SameCoreScene } from "./scenes/LaunchScenes";
import { BenefitMetersScene } from "./scenes/BenefitMetersScene";
import { ReactionsScene } from "./scenes/RobotScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ChatGptMark, ClaudeMark } from "./components/Cartoons";
import { ThemeProvider } from "./theme";

// AiNewsVideo — transparent cutaway overlay for the weekly AI-news roundup
// ("GPT-5.6 + the new super-app", ~5m40s, 10209f @ 30fps). Beats classified per
// CLAUDE.md §3; every `at` is pinned to whisper word frames (captionsData,
// 2026-07-14). The opening ANIMATION carries the ChatGPT logo (Kris's hard
// rule) and the first cover is the openai.com receipt (first-5s screenshot).

export const AINEWS_DUR = 10209;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8); first cover = the launch-page receipt
  { scene: "heroProof", from: 90, dur: 150, fullscreen: true }, // "GPT 5.6 was the headline" (2) → openai.com hero
  { scene: "oneApp", from: 240, dur: 217, fullscreen: true }, // "ChatGPT, Codex, and its browser experience together" (250-371)
  { scene: "modeDoors", from: 457, dur: 180 }, // "choose between work mode and Codex mode" (463)
  { scene: "workFlow", from: 637, dur: 190 }, // "files, browsers, and connected tools in the same conversation" (701-830)
  { scene: "codexSteps", from: 827, dur: 268 }, // "repositories, branches, terminal access, and code review" (956-1080)
  { scene: "newstackProof", from: 1095, dur: 180 }, // "According to The New Stack" (1101) → "one main working environment" (1226)
  { scene: "modeCompare", from: 1560, dur: 390 }, // "research → work mode / repository → Codex mode" (1590-1940)
  { scene: "gptliveProof", from: 1950, dur: 180 }, // "OpenAI also released GPT-Live" (1985)
  { scene: "voiceLive", from: 2400, dur: 400, fullscreen: true }, // "brainstorm while walking" (2435) → "keeps track" (2737)
  { scene: "cheaperServe", from: 3111, dur: 248, fullscreen: true }, // "not a dramatic benchmark victory (3231) — cost and speed (3326)"
  { scene: "aaProof", from: 3359, dur: 150 }, // "Artificial Analysis report" (3365)
  { scene: "statRace", from: 3509, dur: 493, fullscreen: true }, // "one minute (3586) for 77 cents (3624) vs six minutes (3752), $4 (3787)"
  { scene: "sixthFifth", from: 4002, dur: 130 }, // "one sixth of the time (4008), one fifth of the cost (4065)"
  { scene: "econScale", from: 4360, dur: 260, fullscreen: true }, // "twice as intelligent (4377) vs acceptable work, faster, cheaper (4495)"
  { scene: "tierDoors", from: 4620, dur: 340, fullscreen: true }, // "Sol Pro, Terra, Terra Pro (4650-4740)… clearest result (4923)"
  { scene: "gdpvalProof", from: 5143, dur: 220 }, // "On GDPval (5149), just behind Claude Fable (5234)"
  { scene: "browsecompProof", from: 5363, dur: 190 }, // "browser based computer use" (5385) — layout differs from gdpvalProof
  { scene: "efficiencyNotIq", from: 5645, dur: 155 }, // "efficiency release (5651), not an intelligence leap (5738)"
  { scene: "xaiProof", from: 5976, dur: 141 }, // "xAI also announced Grok 4.5" (5982)
  { scene: "premiumTrio", from: 6117, dur: 250, fullscreen: true }, // "same premium category as GPT 5.6 and Claude Fable" (6123-6259)
  { scene: "fableAccessProof", from: 6664, dur: 200 }, // "Anthropic (6670) widened access (6698)… rate limits (6802)"
  { scene: "testBoth", from: 6864, dur: 377, fullscreen: true }, // "strongest competitors (6907) → test both companies directly (7208)"
  { scene: "coworkProof", from: 7352, dur: 184 }, // "Cowork Web and Mobile" (7358-7377)
  { scene: "envAssembles", from: 7536, dur: 215, fullscreen: true }, // "the model is one part of a complete working environment" (7595)
  { scene: "seedreamProof", from: 7751, dur: 81, fullscreen: true }, // "ByteDance released Seedream 5.0 Pro" (7757-7795)
  { scene: "museProof", from: 7832, dur: 150, fullscreen: true }, // "Meta released Muse Spark 1.1 and Muse Image" (7838-7915)
  { scene: "remixProof", from: 7982, dur: 120, fullscreen: true }, // "Video Remix to Google Photos" (7988)
  { scene: "takeCompare", from: 8576, dur: 358 }, // "efficiency upgrade (8582) vs the more important workflow change (8709)"
  { scene: "migrateStop", from: 8934, dur: 194, fullscreen: true }, // "do not switch because one model reached the top (8940-9000)"
  { scene: "threeMeters", from: 9128, dur: 327, fullscreen: true }, // "cost (9134), time (9193), correction (9264) — at least two (9394)"
  { scene: "hiddenCost", from: 9455, dur: 147, fullscreen: true }, // "cheap output becomes expensive when you repair all of it" (9468)
  { scene: "speedWall", from: 9602, dur: 197, fullscreen: true }, // "fast output… consistently wrong" (9635-9690: crash at 88)
  { scene: "finishCheck", from: 9799, dur: 227, fullscreen: true }, // "preserve quality while cutting time and cost (9722-9874)"
];

export const AINEWS_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const AINEWS_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

const SHOT = "assets/external/screenshots";

export const AiNewsVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 first cover — the openai.com launch hero (brand-first: OpenAI) */}
      <Sequence from={90} durationInFrames={150} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={150} kicker="OPENAI.COM · JUL 9" title="GPT-5.6 IS HERE" titlePos="left" tint="#D97757" src={`${SHOT}/oai-gpt56-hero-wide.png`} url="openai.com/index/gpt-5-6" imageW={3840} imageH={2052} from={{ x: 480, y: 40, w: 2880, h: 1539 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} />
      </Sequence>

      {/* 0:08 LOGO OPENER — ChatGPT, Codex and the browser dive into ONE app */}
      <Sequence from={240} durationInFrames={217} premountFor={30}>
        <OneWorkspaceScene durationInFrames={217} title="ONE UNIFIED APP" panelNames={["CHAT", "CODEX", "BROWSER", "FILES"]} windowSuffix="" panelAts={[10, 30, 65, 88]} mergeAt={131} stampAt={145} tint="#4FA98A" />
      </Sequence>

      {/* 0:15 two modes, two doors */}
      <Sequence from={457} durationInFrames={180} premountFor={30}>
        <PathDoorsScene durationInFrames={180} kicker="ONE APP, TWO MODES" title="PICK A MODE" doors={[{ label: "WORK", at: 12 }, { label: "CODEX", at: 48 }]} tint="#D97757" />
      </Sequence>

      {/* 0:21 work mode: files + browser + tools wire into one chat */}
      <Sequence from={637} durationInFrames={190} premountFor={30}>
        <AppFlowScene durationInFrames={190} kicker="WORK MODE" title="ONE CONVERSATION" apps={[{ label: "FILES", at: 64 }, { label: "BROWSER", at: 103 }, { label: "TOOLS", at: 133 }]} connectAt={163} collapseAt={9999} tint="#4FA98A" />
      </Sequence>

      {/* 0:27 codex mode: the dev chain lights up step by step */}
      <Sequence from={827} durationInFrames={268} premountFor={30}>
        <StepsScene durationInFrames={268} kicker="CODEX MODE" title="BUILT FOR DEV WORK" steps={[{ label: "REPOS", at: 129 }, { label: "BRANCHES", at: 163 }, { label: "TERMINAL", at: 193 }, { label: "REVIEW", at: 223 }]} accent="#6E93BD" tint="#6E93BD" subject />
      </Sequence>

      {/* 0:36 receipt: The New Stack — 3 products fold into one */}
      <Sequence from={1095} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="THE NEW STACK" title="3 APPS → ONE" titlePos="right" tint="#D97757" src={`${SHOT}/newstack-superapp-wide.png`} url="thenewstack.io" imageW={2893} imageH={1546} from={{ x: 230, y: 60, w: 2170, h: 1160 }} to={{ x: 0, y: 0, w: 2893, h: 1546 }} zoomAt={16} highlight={{ x: 560, y: 80, w: 1500, h: 390 }} highlightAt={30} />
      </Sequence>

      {/* 0:52 which job goes where */}
      <Sequence from={1560} durationInFrames={390} premountFor={30}>
        <CompareCard kicker="MATCH MODE TO JOB" tint="#4FA98A" left={{ title: "WORK MODE", items: ["Research", "Files", "Drafts"], accent: "#4FA98A", mark: "✓" }} right={{ title: "CODEX MODE", items: ["Repos", "Reviews", "Terminal"], accent: "#6E93BD", mark: "✓" }} leftDelay={30} rightDelay={146} durationInFrames={390} />
      </Sequence>

      {/* 1:05 receipt: SiliconANGLE — GPT-Live launches */}
      <Sequence from={1950} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="SILICONANGLE" title="GPT-LIVE" titlePos="right" tint="#E8B84B" src={`${SHOT}/siliconangle-gptlive-wide.png`} url="siliconangle.com" imageW={2280} imageH={1219} from={{ x: 91, y: 49, w: 2098, h: 1121 }} to={{ x: 0, y: 0, w: 2280, h: 1219 }} zoomAt={14} highlight={{ x: 180, y: 950, w: 1900, h: 130 }} highlightAt={41} />
      </Sequence>

      {/* 1:20 GPT-Live acted out: talk, interrupt, keep the thread */}
      <Sequence from={2400} durationInFrames={400} premountFor={30}>
        <VoiceLiveScene durationInFrames={400} kicker="THE REAL TEST" title="INTERRUPT IT" chipAts={[35, 92, 162]} interruptAt={239} resumeAt={337} tint="#D97757" />
      </Sequence>

      {/* 1:43 the real story: not a benchmark win — the bill */}
      <Sequence from={3111} durationInFrames={248} premountFor={30}>
        <CheaperToServeScene durationInFrames={248} kicker="THE STRONGEST RESULT" title="CHEAPER + FASTER" leftLabel="BENCHMARK WIN?" rightLabel="COST + SPEED" crossAt={120} serveAt={179} checkAt={235} tint="#4FA98A" />
      </Sequence>

      {/* 1:51 receipt: the Artificial Analysis cost report */}
      <Sequence from={3359} durationInFrames={150} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={150} kicker="ARTIFICIAL ANALYSIS" title="COST REPORT" titlePos="right" tint="#4FA98A" src={`${SHOT}/aa-gpt56-landed-wide.png`} url="artificialanalysis.ai" imageW={3840} imageH={2052} from={{ x: 0, y: 0, w: 3840, h: 2052 }} to={{ x: 640, y: 60, w: 2880, h: 1539 }} zoomAt={18} highlight={{ x: 735, y: 790, w: 1600, h: 100 }} highlightAt={46} />
      </Sequence>

      {/* 1:57 THE numbers: 1 min / 77¢ vs 6 min / $4 */}
      <Sequence from={3509} durationInFrames={493} premountFor={30}>
        <StatCountersScene durationInFrames={493} kicker="SAME JOB, TWO BILLS" title="THE ECONOMICS" tint="#E8B84B" accent="#E8B84B" stats={[
          { value: 1, suffix: " MIN", label: "SOL PRO · TIME", at: 77, accent: "#4FA98A" },
          { value: 77, suffix: "¢", label: "SOL PRO · COST", at: 115, accent: "#4FA98A" },
          { value: 6, suffix: " MIN", label: "GPT-5.5 PRO · TIME", at: 243, accent: "#C65B52" },
          { value: 4, prefix: "$", label: "GPT-5.5 PRO · COST", at: 278, accent: "#C65B52" },
        ]} />
      </Sequence>

      {/* 2:13 kinetic: the fractions */}
      <Sequence from={4002} durationInFrames={130} premountFor={30}>
        <FinalTakeawayScene durationInFrames={130} title="1/6 THE TIME" stamp="1/5 THE COST" stampAt={63} accent="#E8B84B" />
      </Sequence>

      {/* 2:25 the economics scale tips: acceptable + fast + cheap wins */}
      <Sequence from={4360} durationInFrames={260} premountFor={30}>
        <BalanceScaleScene durationInFrames={260} kicker="WHAT MOVES THE NEEDLE" title="NEW ECONOMICS" leftLabel="2× SMARTER?" rightLabel="FASTER + CHEAPER" dropLeftAt={17} dropRightAt={135} tipAt={190} stampText="ECONOMICS" stampAt={225} tint="#4FA98A" />
      </Sequence>

      {/* 2:34 the tier doors — three names, one clear pick */}
      <Sequence from={4620} durationInFrames={340} premountFor={30}>
        <PathDoorsScene durationInFrames={340} kicker="CONFUSING NAMES" title="THREE NEW TIERS" doors={[{ label: "SOL PRO", at: 30 }, { label: "TERRA", at: 73 }, { label: "TERRA PRO", at: 100 }]} pickIndex={0} pickAt={303} tint="#D97757" />
      </Sequence>

      {/* 2:51 receipt: BenchLM — Fable 91 vs Sol 86 */}
      <Sequence from={5143} durationInFrames={220} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={220} kicker="BENCHLM · GDPVAL" title="JUST BEHIND FABLE" titlePos="right" tint="#4FA98A" src={`${SHOT}/benchlm-fable-vs-sol-wide.png`} url="benchlm.ai" imageW={3840} imageH={2052} from={{ x: 0, y: 0, w: 3840, h: 2052 }} to={{ x: 420, y: 30, w: 3000, h: 1604 }} zoomAt={16} highlight={{ x: 560, y: 440, w: 2720, h: 320 }} highlightAt={97} />
      </Sequence>

      {/* 2:59 receipt: OpenAI's own BrowseComp section (different layout + zoom) */}
      <Sequence from={5363} durationInFrames={190} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={190} kicker="OPENAI.COM" title="STRONG IN BROWSERS" titlePos="right" titleTop={560} tint="#6E93BD" src={`${SHOT}/oai-browsecomp-wide.png`} url="openai.com/index/gpt-5-6" imageW={3840} imageH={2052} from={{ x: 480, y: 120, w: 2880, h: 1539 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} highlight={{ x: 620, y: 225, w: 2000, h: 180 }} highlightAt={28} />
      </Sequence>

      {/* 3:08 kinetic: what this release actually is */}
      <Sequence from={5645} durationInFrames={155} premountFor={30}>
        <FinalTakeawayScene durationInFrames={155} title="EFFICIENCY RELEASE" stamp="NOT AN IQ LEAP" stampAt={93} accent="#C9913D" />
      </Sequence>

      {/* 3:19 receipt: x.ai — Grok 4.5 (brand-first: xAI) */}
      <Sequence from={5976} durationInFrames={141} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={141} kicker="X.AI · JUL 8" title="GROK 4.5" tint="#C65B52" src={`${SHOT}/xai-grok45-wide.png`} url="x.ai/news/grok-4-5" imageW={3840} imageH={2052} from={{ x: 520, y: 40, w: 2800, h: 1497 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} highlight={{ x: 1150, y: 110, w: 900, h: 150 }} highlightAt={30} />
      </Sequence>

      {/* 3:23 the premium tier is now three chairs */}
      <Sequence from={6117} durationInFrames={250} premountFor={30}>
        <RivalryScene durationInFrames={250} kicker="THE PREMIUM TIER" title="THREE AT THE TOP" colAts={[10, 63, 115]} emphasizeAt={9999} tint="#D97757" cols={[
          { name: "GROK 4.5", sub: "XAI", color: "#C65B52" },
          { name: "GPT-5.6", sub: "OPENAI", color: "#4FA98A", mark: <ChatGptMark size={76} glow /> },
          { name: "FABLE 5", sub: "ANTHROPIC", color: "#D97757", mark: <ClaudeMark size={64} /> },
        ]} />
      </Sequence>

      {/* 3:42 receipt: anthropic.com — Fable 5 access restored (brand-first: Anthropic) */}
      <Sequence from={6664} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="ANTHROPIC.COM" title="ACCESS RESTORED" tint="#4FA98A" src={`${SHOT}/anthropic-fable5-redeploy-wide.png`} url="anthropic.com/news/redeploying-fable-5" imageW={3840} imageH={2052} from={{ x: 0, y: 0, w: 3840, h: 2052 }} to={{ x: 480, y: 60, w: 2880, h: 1539 }} zoomAt={16} highlight={{ x: 1170, y: 400, w: 1500, h: 95 }} highlightAt={40} />
      </Sequence>

      {/* 3:48 two robots hype two models — the point: test BOTH */}
      <Sequence from={6864} durationInFrames={377} premountFor={30}>
        <ReactionsScene durationInFrames={377} kicker="NO LONGER OLD VS NEW" leftAt={43} rightAt={90} pointAt={344} leftBubble="GPT-5.6!" rightBubble="FABLE 5!" stamp="TEST BOTH" stampColor="#4FA98A" tint="#C9913D" />
      </Sequence>

      {/* 4:05 receipt: TechCrunch — Cowork goes web + mobile */}
      <Sequence from={7352} durationInFrames={184} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={184} kicker="TECHCRUNCH" title="COWORK GOES MOBILE" titlePos="left" tint="#D97757" src={`${SHOT}/tc-cowork-wide.png`} url="techcrunch.com" imageW={3840} imageH={2052} from={{ x: 0, y: 0, w: 3840, h: 2052 }} to={{ x: 180, y: 20, w: 3480, h: 1860 }} zoomAt={14} highlight={{ x: 1850, y: 740, w: 1100, h: 150 }} highlightAt={30} />
      </Sequence>

      {/* 4:11 the trend: the model is one part — the environment clicks on around it */}
      <Sequence from={7536} durationInFrames={215} premountFor={30}>
        <SameCoreScene durationInFrames={215} kicker="THE TREND" title="ONE PART OF THE SYSTEM" tint="#4FA98A" />
      </Sequence>

      {/* 4:18 image-model news flash: three quick receipts (varied layouts + zooms) */}
      <Sequence from={7751} durationInFrames={81} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={81} kicker="BYTEDANCE SEED" title="SEEDREAM 5.0 PRO" tint="#6E93BD" src={`${SHOT}/seedream5-pro-wide.png`} url="seed.bytedance.com" imageW={3840} imageH={2052} from={{ x: 300, y: 60, w: 3240, h: 1732 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={10} />
      </Sequence>
      <Sequence from={7832} durationInFrames={150} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={150} kicker="AI.META.COM" title="MUSE SPARK 1.1" titlePos="right" tint="#D97757" src={`${SHOT}/meta-musespark-wide.png`} url="ai.meta.com" imageW={3840} imageH={2052} from={{ x: 480, y: 20, w: 2880, h: 1539 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={12} highlight={{ x: 700, y: 50, w: 1200, h: 100 }} highlightAt={30} />
      </Sequence>
      <Sequence from={7982} durationInFrames={120} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={120} kicker="TECHCRUNCH" title="VIDEO REMIX" titlePos="right" tint="#4FA98A" src={`${SHOT}/tc-video-remix-wide.png`} url="techcrunch.com" imageW={3840} imageH={2052} from={{ x: 0, y: 0, w: 3840, h: 2052 }} to={{ x: 180, y: 0, w: 3480, h: 1860 }} zoomAt={12} />
      </Sequence>

      {/* 4:45 the week's verdict, side by side */}
      <Sequence from={8576} durationInFrames={358} premountFor={30}>
        <CompareCard kicker="THE TAKEAWAY" tint="#D97757" left={{ title: "GPT-5.6", items: ["Efficiency upgrade", "Cheaper tasks"], accent: "#E8B84B", mark: "$" }} right={{ title: "ONE APP", items: ["Workflow change", "Fewer handoffs"], accent: "#D97757", mark: "→" }} leftDelay={10} rightDelay={42} durationInFrames={358} />
      </Sequence>

      {/* 4:57 don't migrate on a leaderboard — test first */}
      <Sequence from={8934} durationInFrames={194} premountFor={30}>
        <MigrateStopScene durationInFrames={194} kicker="LEADERBOARD ≠ REASON" title="DON'T SWITCH BLIND" stopAtFrame={36} tint="#C65B52" />
      </Sequence>

      {/* 5:04 measure three things */}
      <Sequence from={9128} durationInFrames={327} premountFor={30}>
        <BenefitMetersScene durationInFrames={327} kicker="ONE REAL WORKFLOW" title="MEASURE 3 THINGS" stampText="SWITCH AT 2 OF 3" delays={[6, 65, 136]} stampAt={266} tint="#4FA98A" />
      </Sequence>

      {/* 5:15 cheap output that needs repair isn't cheap */}
      <Sequence from={9455} durationInFrames={147} premountFor={30}>
        <HiddenCostScene durationInFrames={147} kicker="THE CATCH" title="REPAIR COSTS" chipLabels={["REPAIR", "REDO", "REVIEW"]} chipAts={[65, 95, 125]} tint="#C9913D" />
      </Sequence>

      {/* 5:20 fast but wrong hits the wall */}
      <Sequence from={9602} durationInFrames={197} premountFor={30}>
        <SpeedWallScene durationInFrames={197} kicker="THE OTHER TRAP" title="FAST ≠ USEFUL" wallLabel="WRONG ANSWER" rocketLabel="FAST" tint="#C65B52" />
      </Sequence>

      {/* 5:26 the real reason to move */}
      <Sequence from={9799} durationInFrames={227} premountFor={30}>
        <FinishCheckScene durationInFrames={227} kicker="THE CALL" title="QUALITY, TIME, COST" stamp="REAL REASON TO MOVE" stampAt={100} tint="#4FA98A" />
      </Sequence>

      {/* 5:34 OUTRO — anchored to the spoken "Subscribe" (10033) */}
      <Sequence from={10026} durationInFrames={AINEWS_DUR - 10026} premountFor={30}>
        <Fable5Outro durationInFrames={AINEWS_DUR - 10026} kicker="WEEKLY AI ROUNDUP" tag="One video a week — every launch, tested not hyped" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const AiNewsVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <AiNewsVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={1100} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={3111} durationInFrames={890} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={8934} durationInFrames={1000} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={10026} durationInFrames={AINEWS_DUR - 10026} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 10026].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      <SfxCue from={10038} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};

// Note: AiNewsVisuals wraps its own ThemeProvider, so both the standalone
// overlay comp and the Final render the paper look without extra plumbing.
