import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "./components/overlayUI";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { CartoonRobot, BugCharacter, TinyDev, SpeechBubble, MoveAlong, poseTimeline } from "./motion/subjects";
import { JengaTower, LeakingBucket, TrafficJam, ServerRack, LockGate, RetryWheel, ConveyorBelt } from "./motion/objects";
import { Odometer, LabelArrow } from "./motion/primitives";
import { LightLeak, DepthProps, ExitWrap } from "./motion/cinematics";
import { WordPop } from "./motion/WordPop";
import { VoiceGlow } from "./motion/voice";
import { BarsIn, LineDraw, DonutFill, BarRace, ChartData } from "./motion/charts";
import { SourceScreenshot } from "./motion/SourceScreenshot";
import { PathDoorsScene, DraftPolishScene, DocFunnelScene, AppFlowScene, FirstLineDeskScene, SkillCartridgeScene, ThreeBuyersScene } from "./scenes/SideHustleScenes";
import { BalanceScaleScene, BenchBarsScene, ScannerScene, GatesScene } from "./scenes/GptScenes";
import { LogoBadge, IconBrain } from "./components/Cartoons";
import speedups from "../public/assets/external/charts/dspark-speedups.json";

// ============================================================================
// TEMPLATE LAB — the browsable catalog of every reusable subject/object/system.
// Scrub it in Studio to preview components before using them in a video; each
// section is ~3s. NOT part of any published video.
// ============================================================================

const DEMO = 90; // frames per section

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <span style={{ position: "absolute", top: 44, left: 60, fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: "#D97757", transform: "translateZ(0)" }}>{title}</span>
    {children}
  </AbsoluteFill>
);

const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 70 }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap }}>{children}</div>
);

const speedupChart = speedups as ChartData;

const lineData: ChartData = {
  title: "Cost per completed workflow (recreated demo)",
  unit: "%",
  source: { name: "your own test runs" },
  data: [
    { label: "wk 1", value: 100 },
    { label: "wk 2", value: 92 },
    { label: "wk 3", value: 81 },
    { label: "wk 4", value: 74 },
  ],
};

const raceBefore: ChartData = {
  unit: "", source: { name: "demo" },
  data: [
    { label: "Current", value: 78 },
    { label: "DSpark", value: 44 },
    { label: "Other", value: 60 },
  ],
};
const raceAfter: ChartData = {
  unit: "", source: { name: "demo" },
  data: [
    { label: "Current", value: 78 },
    { label: "DSpark", value: 96 },
    { label: "Other", value: 62 },
  ],
};

const PoseDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const poses = ["walking", "thinking", "confused", "facepalm", "pointing"] as const;
  return (
    <Row>
      {poses.map((p) => (
        <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <CartoonRobot pose={p} size={200} />
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,0.7)", transform: "translateZ(0)" }}>{p}</span>
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <CartoonRobot pose={poseTimeline(frame, [[0, "idle"], [40, "alarmed"]])} size={200} lookX={frame > 40 ? 6 : 0} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,0.7)", transform: "translateZ(0)" }}>poseTimeline + lookX</span>
      </div>
    </Row>
  );
};

const sections: { title: string; node: React.ReactNode }[] = [
  { title: "ROBOT POSES: walking / thinking / confused / facepalm / pointing / timeline", node: <PoseDemo /> },
  {
    title: "MOVEALONG walk cycle + step puffs",
    node: (
      <div style={{ position: "relative", width: 1200, height: 340 }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, height: 4, background: "rgba(255,255,255,0.16)" }} />
        <MoveAlong start={6} end={80} fromX={80} toX={880} bottom={20}>
          <CartoonRobot pose="walking" size={220} />
        </MoveAlong>
      </div>
    ),
  },
  {
    title: "BUG CHARACTER: crawl / attack / squashed  ·  TINY DEV: typing / panic / happy",
    node: (
      <Row gap={54}>
        <BugCharacter state="crawl" size={170} />
        <BugCharacter state="attack" size={170} />
        <BugCharacter state="squashed" size={170} />
        <TinyDev pose="typing" size={230} />
        <TinyDev pose="panic" size={230} />
        <TinyDev pose="happy" size={230} />
      </Row>
    ),
  },
  {
    title: "SPEECH BUBBLE (shared) — normal + shout",
    node: (
      <Row gap={120}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <SpeechBubble text="draft, then verify" at={8} />
          <CartoonRobot pose="idle" size={220} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <SpeechBubble text="SHIP IT!!" at={20} shout flip />
          <CartoonRobot pose="celebrate" size={220} accent="#34D399" />
        </div>
      </Row>
    ),
  },
  { title: "JENGA TOWER — pull one block, wobble, collapse", node: <JengaTower pullAt={14} collapseAt={58} /> },
  { title: "LEAKING BUCKET — drains, then the patch bolts on", node: <LeakingBucket level={0.8} patchAt={50} /> },
  { title: "TRAFFIC JAM — requests bunch up + honk", node: <TrafficJam at={4} /> },
  {
    title: "SERVER RACK — normal → overheats",
    node: (
      <Row gap={140}>
        <ServerRack width={240} />
        <ServerRack width={240} overheatAt={30} />
      </Row>
    ),
  },
  {
    title: "LOCK GATE — slams shut / springs open",
    node: (
      <Row gap={160}>
        <LockGate at={24} action="close" label="ACCESS" />
        <LockGate at={48} action="open" label="UNLOCKED" />
      </Row>
    ),
  },
  { title: "RETRY WHEEL (shared) + CONVEYOR BELT (accelerating)", node: (
    <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
      <RetryWheel size={330} />
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <ConveyorBelt width={560} speed={3} />
        <ConveyorBelt width={560} speed={3} accelerate={{ to: 12, dur: 80 }} color="#F59E0B" />
      </div>
    </div>
  ) },
  {
    title: "ODOMETER + LABEL ARROW + WORD POP",
    node: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <Odometer to={128500} at={8} prefix="$" />
        <div style={{ display: "flex", gap: 260, alignItems: "center" }}>
          <LabelArrow label="THE LEAK" at={26} angle={-40} />
          <WordPop text="CHEAPER" at={40} size={84} />
        </div>
      </div>
    ),
  },
  {
    title: "VOICE GLOW — brain pulses with the VO (precomputed levels)",
    node: (
      <VoiceGlow clipFrom={1333} maxGlow={34}>
        <div style={{ width: 220, height: 220, borderRadius: 30, border: "4px solid #C15F3C", background: "rgba(12,18,30,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconBrain size={150} />
        </div>
      </VoiceGlow>
    ),
  },
  {
    title: "DEPTH PROPS + LIGHT LEAK + EXIT WRAP (push exit at the end)",
    node: (
      <ExitWrap dur={DEMO} kind="push">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <DepthProps />
          <CartoonRobot pose="celebrate" size={260} accent="#34D399" />
          <LightLeak at={26} dur={50} warm={false} />
        </AbsoluteFill>
      </ExitWrap>
    ),
  },
  { title: "CHART: BarsIn — grouped, from data-as-asset JSON + source chip", node: <BarsIn chart={speedupChart} at={8} maxValue={100} /> },
  { title: "CHART: LineDraw — single hue draws on, direct end label", node: <LineDraw chart={lineData} at={8} /> },
  {
    title: "CHART: DonutFill + BarRace (rank swap at mid)",
    node: (
      <div style={{ display: "flex", alignItems: "center", gap: 140 }}>
        <DonutFill value={62} label="CHEAPER TO FINISH" size={280} at={8} />
        <BarRace before={raceBefore} after={raceAfter} switchAt={40} width={760} />
      </div>
    ),
  },
  {
    title: "SOURCE SCREENSHOT — pan/zoom into the proof (placeholder image)",
    node: (
      <SourceScreenshot
        src="deepseek-logo.png"
        url="https://example.com/docs/model-card (placeholder asset)"
        imageW={800}
        imageH={800}
        to={{ x: 180, y: 300, w: 440, h: 240 }}
        highlight={{ x: 200, y: 340, w: 400, h: 80 }}
        width={1080}
        height={600}
      />
    ),
  },
  {
    title: "LOGO BADGE — tile mode vs transparent mode",
    node: (
      <Row gap={160}>
        <LogoBadge src={staticFile("deepseek-logo.png")} size={190} mode="tile" glow="rgba(77,107,254,0.6)" />
        <LogoBadge src={staticFile("claude-logo.png")} size={190} mode="transparent" glow="rgba(217,119,87,0.6)" />
      </Row>
    ),
  },
  // ——— Side-hustle templates (full scenes; the SceneShell fills the frame) ———
  {
    title: "PATH DOORS — N options, one opens",
    node: <PathDoorsScene durationInFrames={DEMO} kicker="PICK A PATH" title="FIVE WAYS IN" doors={[{ label: "WRITING", at: 4 }, { label: "RESEARCH", at: 10 }, { label: "AUTOMATION", at: 16 }, { label: "CHATBOTS", at: 22 }, { label: "SKILLS", at: 28 }]} pickIndex={1} pickAt={46} />,
  },
  {
    title: "DRAFT POLISH — AI drafts, human finishes",
    node: <DraftPolishScene durationInFrames={DEMO} kicker="ASSISTED" title="SELL THE OUTCOME" polishAt={30} outcomeAt={60} outcomeLabel="2 POSTS / WEEK" />,
  },
  {
    title: "DOC FUNNEL — many docs → one report",
    node: <DocFunnelScene durationInFrames={DEMO} kicker="RESEARCH FOR HIRE" title="ONE-PAGE ANSWER" dropAts={[4, 16, 28, 40, 50]} reportAt={62} />,
  },
  {
    title: "APP FLOW — tools wire into one workflow",
    node: <AppFlowScene durationInFrames={DEMO} kicker="NO-CODE AUTOMATION" title="FEWER MANUAL STEPS" apps={[{ label: "QUICKBOOKS", at: 4 }, { label: "PAYPAL", at: 10 }, { label: "HUBSPOT", at: 16 }, { label: "CANVA", at: 22 }, { label: "WORKSPACE", at: 28 }]} connectAt={40} collapseAt={66} />,
  },
  {
    title: "FIRST-LINE DESK — assistant answers, human approves",
    node: <FirstLineDeskScene durationInFrames={DEMO} kicker="DONE-FOR-YOU BOTS" title="A FIRST-LINE HELPER" bubbles={[{ label: "HOURS?", at: 6 }, { label: "PRICING?", at: 18 }, { label: "BOOKINGS?", at: 30 }]} routeAt={48} approveAt={66} />,
  },
  {
    title: "SKILL CARTRIDGE — repeatable beats disposable",
    node: <SkillCartridgeScene durationInFrames={DEMO} kicker="PRODUCTIZED SKILLS" title="A MINI OPERATING SYSTEM" slotAt={16} runAts={[44, 58, 72]} />,
  },
  {
    title: "THREE BUYERS — offer vs idea gate",
    node: <ThreeBuyersScene durationInFrames={DEMO} kicker="BEFORE YOU BUILD" title="NAME THREE PEOPLE" fillAts={[20, 34, 48]} verdictAt={64} filled />,
  },
  {
    title: "BalanceScaleScene — tradeoff tips",
    node: <BalanceScaleScene durationInFrames={DEMO} kicker="WORTH IT?" title="EFFICIENCY VS TRUST" dropLeftAt={10} dropRightAt={34} tipAt={48} stampText="SANDBOX FIRST" stampAt={64} tint="#EF4444" />,
  },
  {
    title: "BenchBarsScene — recreated chart",
    node: <BenchBarsScene durationInFrames={DEMO} kicker="REPORTED SCORES" title="THE RECEIPTS" barAts={[10, 30, 50]} tint="#D97757" />,
  },
  {
    title: "ScannerScene — inspection arch",
    node: <ScannerScene durationInFrames={DEMO} kicker="FEDERAL PIPELINE" title="SCANNED FIRST" scanAt={30} tagAt={64} tint="#F59E0B" />,
  },
  {
    title: "GatesScene — the three gates",
    node: <GatesScene durationInFrames={DEMO} kicker="THE RULE" title="THREE GATES" gates={[{ label: "SANDBOXED", at: 14 }, { label: "REVIEWED", at: 30 }, { label: "LEAST-PRIVILEGE", at: 46 }]} missingAt={68} tint="#D97757" />,
  },
];

export const TEMPLATE_LAB_DUR = sections.length * DEMO;

export const TemplateLab: React.FC = () => (
  <AbsoluteFill style={{ background: "#100d0b" }}>
    <AnimatedBackground durationInFrames={TEMPLATE_LAB_DUR} fade={false} />
    {sections.map((s, i) => (
      <Sequence key={s.title} from={i * DEMO} durationInFrames={DEMO}>
        <Section title={`${i + 1}/${sections.length} · ${s.title}`}>{s.node}</Section>
      </Sequence>
    ))}
  </AbsoluteFill>
);
