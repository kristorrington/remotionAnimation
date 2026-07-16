import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { StepsScene } from "./scenes/StepsScene";
import { FlowScene } from "./scenes/FlowScene";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { NotMagicScene } from "./scenes/RobotScenes";
import { ReactionsScene } from "./scenes/RobotScenes";
import { ThresholdGateScene } from "./scenes/MetaphorScenes";
import { QuestionFlipScene, ExpectationScene } from "./scenes/WealthScenes";
import { ThemeProvider } from "./theme";
import {
  PathDoorsScene, DraftPolishScene, DocFunnelScene, AppFlowScene,
  FirstLineDeskScene, SkillCartridgeScene, ThreeBuyersScene,
} from "./scenes/SideHustleScenes";

// SideHustleVideo — transparent cutaway overlay for the "5 Claude side
// hustles for beginners" explainer (~7m43s, 13881f @ 30fps). Beats classified
// per CLAUDE.md §3. NOTE: anchors are SRT line-level (frame = seconds × 30,
// from ≈ spoken − 6); tighten against captionsData.ts word times after the
// whisper pass if any label feels early/late.

export const SIDE_HUSTLE_DUR = 13881;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open (CLAUDE.md §8): frames 0–90 are full-frame talking head —
  // the first cover NEVER starts at 0; it flash-cuts in at 90.
  { scene: "thresholdGate", from: 90, dur: 222, fullscreen: true },
  { scene: "questionFlip", from: 318, dur: 182 },
  { scene: "pathDoors", from: 505, dur: 355, fullscreen: true },
  { scene: "steps", from: 906, dur: 245 },
  { scene: "compare", from: 1157, dur: 263 },
  { scene: "flow", from: 1608, dur: 382 },
  { scene: "expectation", from: 2000, dur: 280 },
  { scene: "steps", from: 2286, dur: 314 },
  { scene: "takeawayThink", from: 2802, dur: 130, fullscreen: true },
  { scene: "notMagic", from: 2935, dur: 395, fullscreen: true },
  { scene: "draftPolish", from: 3343, dur: 560, fullscreen: true },
  { scene: "compare", from: 3936, dur: 584 },
  { scene: "reactions", from: 4580, dur: 430 },
  // 5010 → 5550: intentional talking-head beat (competition downside + path-2 intro)
  { scene: "docFunnel", from: 5550, dur: 410, fullscreen: true },
  { scene: "steps", from: 5967, dur: 593 },
  { scene: "flow", from: 6787, dur: 353 },
  { scene: "appFlow", from: 7500, dur: 800 },
  { scene: "compare", from: 8306, dur: 389 },
  { scene: "firstDesk", from: 8699, dur: 720 },
  { scene: "flow", from: 9753, dur: 477 },
  { scene: "skillCart", from: 10313, dur: 857 },
  { scene: "compare", from: 11272, dur: 428 },
  // 11700 → 12102: talking-head beat (the honest "you have to market it" stretch)
  { scene: "pathDoors2", from: 12102, dur: 738, fullscreen: true },
  { scene: "threeBuyers", from: 12844, dur: 570, fullscreen: true },
  { scene: "takeaway30", from: 13423, dur: 190, fullscreen: true },
];

export const SIDE_HUSTLE_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const SIDE_HUSTLE_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

export const SideHustleVisuals: React.FC = () => {
  return (
    // paper theme (Kris, July 2026): the long-form is ALIGNED with the shorts —
    // every scene renders on the ivory dot-grid paper via SceneShell/useTheme
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 HOOK — face delivers line 1 to camera, then the flash-cut into
          the trapdoor: drop on "waste your time" (166), pass run on "That is
          how people end up selling prompt packs" (202→) */}
      <Sequence from={90} durationInFrames={222} premountFor={30}>
        <ThresholdGateScene durationInFrames={222} kicker="ZERO CODING EXPERIENCE?" title="STOP CHASING THE BIGGEST NUMBER" failLabel="HYPE NUMBER" passLabel="PAID IN 30 DAYS" zoneLabel="REALISTIC" skipStamp="WASTED WEEKEND" tint="#C9913D" dropAt={74} attempt2At={112} />
      </Sequence>

      {/* 0:10 THE BETTER QUESTION */}
      <Sequence from={318} durationInFrames={182} premountFor={30}>
        <QuestionFlipScene durationInFrames={182} kicker="THE BETTER QUESTION" q1="WHAT'S THE BIGGEST HUSTLE?" q2="WHO PAYS YOU IN 30 DAYS?" q1At={6} crossAt={61} tint="#4FA98A" />
      </Sequence>

      {/* 0:17 FIVE WAYS IN — the doors appear (names stay sealed until the end) */}
      <Sequence from={505} durationInFrames={355} premountFor={30}>
        <PathDoorsScene durationInFrames={355} kicker="FIVE CLAUDE SIDE HUSTLES" title="NO CODE. NO PRETENDING." doors={[{ label: "PATH 1", at: 30 }, { label: "PATH 2", at: 45 }, { label: "PATH 3", at: 60 }, { label: "PATH 4", at: 75 }, { label: "PATH 5", at: 90 }]} />
      </Sequence>

      {/* 0:30 ZERO EXPERIENCE ≠ ZERO EFFORT */}
      <Sequence from={906} durationInFrames={245} premountFor={30}>
        <StepsScene durationInFrames={245} kicker="THE HONEST PART" title="ZERO EXPERIENCE ≠ ZERO EFFORT" accent="#C9913D" tint="#C9913D" steps={[{ label: "You need taste", at: 86 }, { label: "You need judgement", at: 124 }, { label: "Sell what people want", at: 207 }]} />
      </Sequence>

      {/* 0:38 NOT A TUTORIAL — a decision walkthrough */}
      <Sequence from={1157} durationInFrames={263} premountFor={30}>
        <CompareCard kicker="WHAT THIS VIDEO IS" tint="#D97757" left={{ title: "BUILD TUTORIAL", items: ["screen by screen"], accent: "#C65B52", mark: "✗" }} right={{ title: "DECISION WALKTHROUGH", items: ["before you waste a weekend"], accent: "#4FA98A", mark: "✓" }} leftDelay={6} rightDelay={85} durationInFrames={263} />
      </Sequence>

      {/* 0:53 WHAT PEOPLE ALREADY USE CLAUDE FOR */}
      <Sequence from={1608} durationInFrames={382} premountFor={30}>
        <FlowScene durationInFrames={382} kicker="ALREADY HAPPENING" title="WHAT PEOPLE USE CLAUDE FOR" nodes={[{ label: "Writing" }, { label: "Research" }, { label: "Admin" }, { label: "Automation" }]} nodeAts={[12, 47, 72, 92]} tint="#4FA98A" />
      </Sequence>

      {/* 1:06 NOT ONLY A CODING TOOL — business work beats software work */}
      <Sequence from={2000} durationInFrames={280} premountFor={30}>
        <ExpectationScene durationInFrames={280} kicker="THAT SHOULD TELL YOU SOMETHING" title="THE MONEY IS IN BUSINESS WORK" leftAt={57} rightAt={145} leftLabel="SOFTWARE WORK" rightLabel="BUSINESS WORK" leftCaption="CROWDED" rightCaption="CLOSER TO MONEY" tint="#C9913D" />
      </Sequence>

      {/* 1:16 WHY CLAUDE — when the deliverable is thinking */}
      <Sequence from={2286} durationInFrames={314} premountFor={30}>
        <StepsScene durationInFrames={314} kicker="WHY CLAUDE?" title="WHEN THE DELIVERABLE IS THINKING" tint="#D97757" steps={[{ label: "Writing", at: 98 }, { label: "Reasoning", at: 205 }, { label: "Long documents", at: 236 }, { label: "Careful analysis", at: 274 }]} />
      </Sequence>

      {/* 1:33 THE THINKING IS THE PRODUCT */}
      <Sequence from={2802} durationInFrames={130} premountFor={30}>
        <FinalTakeawayScene durationInFrames={130} kicker="THE TEST" title="THE THINKING IS THE PRODUCT" stamp="STRONG FIT" stampAt={75} accent="#4FA98A" />
      </Sequence>

      {/* 1:38 NOT MAGIC — it will not create a business for you */}
      <Sequence from={2935} durationInFrames={395} premountFor={30}>
        <NotMagicScene durationInFrames={395} kicker="DO NOT HEAR THIS AS MAGIC" title="IT WON'T BUILD THE BUSINESS" badges={[{ label: "A BUSINESS FOR YOU", at: 70 }, { label: "MONEY BUTTON", at: 150 }]} tint="#C65B52" />
      </Sequence>

      {/* 1:51 PATH 1 — assisted writing: Claude drafts, you fix the angle */}
      <Sequence from={3343} durationInFrames={560} premountFor={30}>
        <DraftPolishScene durationInFrames={560} kicker="PATH 1" title="ASSISTED WRITING & EDITING" polishAt={500} outcomeAt={517} outcomeLabel="YOUR ANGLE" />
      </Sequence>

      {/* 2:11 SELL THE OUTCOME, NOT "AI WRITING" */}
      <Sequence from={3936} durationInFrames={584} premountFor={30}>
        <CompareCard kicker="THE BEGINNER MISTAKE" tint="#C9913D" left={{ title: "AI WRITING", items: ["nobody wants that"], accent: "#C65B52", mark: "✗" }} right={{ title: "A FINISHED OUTCOME", items: ["2 posts / week", "a clean newsletter", "a batch of scripts"], accent: "#4FA98A", mark: "✓" }} leftDelay={6} rightDelay={174} durationInFrames={584} />
      </Sequence>

      {/* 2:32 GOOD ENOUGH WINS — beat the busy person, not the best writer */}
      <Sequence from={4580} durationInFrames={430} premountFor={30}>
        <ReactionsScene durationInFrames={430} kicker="THE BAR IS LOWER THAN YOU THINK" leftBubble="BEST WRITER? NO" leftPose="shrug" leftAccent="#C9913D" leftAt={97} rightBubble="FASTER THAN BUSY" rightPose="celebrate" rightAccent="#4FA98A" rightAt={210} stamp="SPEED WINS" stampColor="#4FA98A" pointAt={250} tint="#4FA98A" />
      </Sequence>

      {/* 3:05 PATH 2 — research for hire: many docs → one paid report */}
      <Sequence from={5550} durationInFrames={410} premountFor={30}>
        <DocFunnelScene durationInFrames={410} kicker="PATH 2" title="RESEARCH FOR HIRE" dropAts={[191, 208, 226, 244]} reportAt={310} reportLabel="THE FINDINGS" priceLabel="FIRST DOLLAR" />
      </Sequence>

      {/* 3:19 KEEP IT SMALL — sell a package with a clear output */}
      <Sequence from={5967} durationInFrames={593} premountFor={30}>
        <StepsScene durationInFrames={593} kicker="KEEP IT SMALL" title="SELL A SIMPLE PACKAGE" accent="#C9913D" tint="#C9913D" steps={[{ label: "5 competitors → 1-page summary", at: 245 }, { label: "3 tools → 1 recommendation", at: 389 }]} />
      </Sequence>

      {/* 3:46 CLAUDE READS, YOU DECIDE */}
      <Sequence from={6787} durationInFrames={353} premountFor={30}>
        <FlowScene durationInFrames={353} kicker="WHY THIS WORKS" title="CLAUDE READS. YOU DECIDE." nodes={[{ label: "Heavy reading" }, { label: "Your judgement" }, { label: "The decision" }]} nodeAts={[6, 65, 138]} tint="#D97757" />
      </Sequence>

      {/* 4:10 PATH 3 — no-code automations around the owner's tools */}
      <Sequence from={7500} durationInFrames={800} premountFor={30}>
        <AppFlowScene durationInFrames={800} kicker="PATH 3" title="FEWER MANUAL STEPS" apps={[{ label: "QUICKBOOKS", at: 19 }, { label: "PAYPAL", at: 60 }, { label: "HUBSPOT", at: 90 }, { label: "CANVA", at: 99 }, { label: "WORKSPACE", at: 160 }]} connectAt={317} collapseAt={772} />
      </Sequence>

      {/* 4:37 START SAFE — never money, deletions or final say */}
      <Sequence from={8306} durationInFrames={389} premountFor={30}>
        <CompareCard kicker="LOW-RISK FIRST" tint="#C65B52" left={{ title: "START WITH", items: ["drafting", "organizing", "summarizing"], accent: "#4FA98A", mark: "✓" }} right={{ title: "NEVER AUTOMATE", items: ["sending money", "deleting records", "final decisions"], accent: "#C65B52", mark: "✗" }} leftDelay={6} rightDelay={261} durationInFrames={389} />
      </Sequence>

      {/* 4:50 PATH 4 — the first-line helper for local businesses */}
      <Sequence from={8699} durationInFrames={720} premountFor={30}>
        <FirstLineDeskScene durationInFrames={720} kicker="PATH 4" title="DONE-FOR-YOU LOCAL HELPERS" bubbles={[{ label: "HOURS?", at: 311 }, { label: "PRICING?", at: 337 }, { label: "BOOKINGS?", at: 361 }]} routeAt={99999} approveAt={99999} />
      </Sequence>

      {/* 5:25 FIRST LINE, NOT AUTOPILOT */}
      <Sequence from={9753} durationInFrames={477} premountFor={30}>
        <FlowScene durationInFrames={477} kicker="SELL IT HONESTLY" title="FIRST LINE, NOT AUTOPILOT" nodes={[{ label: "Collects info" }, { label: "Drafts replies" }, { label: "Human approves" }]} nodeAts={[78, 127, 209]} tint="#D97757" />
      </Sequence>

      {/* 5:43 PATH 5 — productized skills: the SKILL.MD cartridge */}
      <Sequence from={10313} durationInFrames={857} premountFor={30}>
        <SkillCartridgeScene durationInFrames={857} kicker="PATH 5" title="PRODUCTIZED CLAUDE SKILLS" slotAt={432} runAts={[610, 660, 710]} cartridgeLabel="SKILL.MD" />
      </Sequence>

      {/* 6:12 PROMPT vs SKILL */}
      <Sequence from={11272} durationInFrames={428} premountFor={30}>
        <CompareCard kicker="NOT JUST A PROMPT" tint="#C9913D" left={{ title: "A PROMPT", items: ["disposable"], accent: "#C65B52", mark: "✗" }} right={{ title: "A SKILL", items: ["a mini operating system", "for one task"], accent: "#4FA98A", mark: "✓" }} leftDelay={112} rightDelay={228} durationInFrames={428} />
      </Sequence>

      {/* 6:43 THE RULE — pick the door that attaches to what you already do */}
      <Sequence from={12102} durationInFrames={738} premountFor={30}>
        <PathDoorsScene durationInFrames={738} kicker="ONE RULE" title="ATTACH IT TO WHAT YOU ALREADY DO" doors={[{ label: "WRITING", at: 183 }, { label: "RESEARCH", at: 307 }, { label: "AUTOMATIONS", at: 468 }, { label: "CHATBOTS", at: 581 }, { label: "SKILLS", at: 668 }]} />
      </Sequence>

      {/* 7:07 THE THREE-BUYERS GATE — empty slots = just an idea */}
      <Sequence from={12844} durationInFrames={570} premountFor={30}>
        <ThreeBuyersScene durationInFrames={570} kicker="BEFORE YOU BUILD ANYTHING" title="NAME THREE PEOPLE WHO'D PAY" filled={false} verdictAt={351} />
      </Sequence>

      {/* 7:27 THE 30-DAY PROOF WINDOW */}
      <Sequence from={13423} durationInFrames={190} premountFor={30}>
        <FinalTakeawayScene durationInFrames={190} kicker="GIVE YOURSELF" title="A 30-DAY PROOF WINDOW" stamp="PICK ONE. GO." stampAt={92} accent="#4FA98A" />
      </Sequence>

      {/* 7:38 OUTRO — anchored to the spoken "subscribe" (~13770) */}
      <Sequence from={13764} durationInFrames={SIDE_HUSTLE_DUR - 13764} premountFor={30}>
        <Fable5Outro durationInFrames={SIDE_HUSTLE_DUR - 13764} kicker="PRACTICAL AI — NO HYPE" tag="Which path are you picking? Name your three buyers below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const SideHustleVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <SideHustleVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={700} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={3343} durationInFrames={760} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={8699} durationInFrames={760} volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={12844} durationInFrames={770} volume={0.08} startFrom={600} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={13764} durationInFrames={SIDE_HUSTLE_DUR - 13764} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 13764].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      {/* step/list ticks at spoken anchors */}
      {[992, 1030, 1113, 2384, 2491, 2522, 2560, 6212, 6356].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.switch} volume={0.25} />
      ))}
      <SfxCue from={13776} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};

// Note: SideHustleVisuals wraps its own ThemeProvider, so both the standalone
// overlay comp and the Final render the paper look without extra plumbing.
