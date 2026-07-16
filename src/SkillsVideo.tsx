import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { SpeedWallScene } from "./scenes/MetaphorScenes";
import { PathDoorsScene, DocFunnelScene, AppFlowScene, SkillCartridgeScene } from "./scenes/SideHustleScenes";
import { GatesScene, BalanceScaleScene } from "./scenes/GptScenes";
import { StepsScene } from "./scenes/StepsScene";
import { StackCollapseScene } from "./scenes/CostScenes";
import { WaitingScene } from "./scenes/WaitingScene";
import { EightyPercentScene, SlopFactoryScene } from "./scenes/SkillsScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";

// SkillsVideo — transparent cutaway overlay for the "5 Claude Code skills
// ranked" video (~5m19s, 9556f @ 30fps). Beats classified per CLAUDE.md §3;
// every `at` is pinned to whisper word frames (captionsData, 2026-07-16).
// The opening line names no product, so the first cover is the five-doors
// hook; each skill's FIRST mention lands on its own site/repo receipt
// (brand first-mention rule).

export const SKILLS_DUR = 9556;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8); first cover at ~3s
  { scene: "hookDoors", from: 90, dur: 160, fullscreen: true }, // "five Claude Code skills (53-105)… rank (109)… worth installing (148-202)"
  { scene: "rankCriteria", from: 250, dur: 160 }, // "the problem they solve (256-297), how useful (303), how easily you can test (346-384)"
  { scene: "skillDef", from: 410, dur: 330, fullscreen: true }, // "a packaged set of instructions (448-493)… changes how Claude approaches (503-551)… different way to work (622-670)"
  { scene: "reachProof", from: 759, dur: 201 }, // "Number five is Agent Reach (738-818)… X, Reddit, YouTube and GitHub (896-983)"
  { scene: "reachFlow", from: 985, dur: 535, fullscreen: true }, // "research across several platforms (996-1045)… inspect a GitHub repo (1349), Reddit (1390), X (1442), YouTube (1496)"
  { scene: "oneRepoStack", from: 1650, dur: 350, fullscreen: true }, // "one repo (1688), one source (1735), one task (1805); more sources (1859)… harder to control (1915-1939)"
  { scene: "fitKinetic", from: 2000, dur: 150 }, // "if cross-platform research is central… remove a load of the friction (2045-2120)"
  { scene: "loopProof", from: 2147, dur: 188 }, // "Number four is Loop Library (2128-2224)"
  { scene: "eightyPercent", from: 2360, dur: 290, fullscreen: true }, // "produces something acceptable (2411)… says the job is finished (2454-2510); the final 20% yourself (2576-2621)"
  { scene: "loopGates", from: 2650, dur: 375, fullscreen: true }, // "keep Claude working until a defined finish condition (2718-2830); every test passes (2903), checklist completed (2959-2985)"
  { scene: "acceptableKinetic", from: 3030, dur: 150 }, // "stops when the answer looks acceptable… not actually finished (3092-3168)"
  { scene: "loopFits", from: 3205, dur: 375, fullscreen: true }, // "debugging (3260), research, writing… less useful when subjective (3442)… no clear way to know (3486-3537)"
  { scene: "pxProof", from: 3609, dur: 191 }, // "Number three is PX Pipe (3590-3670)"
  { scene: "contextCost", from: 3860, dur: 440, fullscreen: true }, // "files (3921), screenshots (3935), logs (3961), previous outputs (4003-4019)… more tokens reminding than completing (4192-4290)"
  { scene: "imageSwap", from: 4300, dur: 220, fullscreen: true }, // "convert bulky context into images (4342-4390) instead of raw text (4480)"
  { scene: "seventyProof", from: 4520, dur: 180 }, // "the headline claim is up to 70% fewer tokens (4520-4622)"
  { scene: "whoBenefits", from: 4700, dur: 550, fullscreen: true }, // "larger builds (4913), visual projects, long sessions (4972)… small project (5116)… don't actually need (5203-5234)"
  { scene: "rankThirdKinetic", from: 5290, dur: 150 }, // "cost matters more after the workflow is under control (5326-5409)"
  { scene: "tasteProof", from: 5537, dur: 193 }, // "Number two is Taste (5454-5552)… push Claude away from the generic look (5582-5629)"
  { scene: "slopFactory", from: 5745, dur: 245, fullscreen: true }, // "the same gradients (5760), the same oversized heading (5783-5804)… working doesn't mean well designed (5915-5972)"
  { scene: "abSteps", from: 6240, dur: 460 }, // "same design brief (6234)… with and without Taste (6294-6320): layout (6402), typography (6454), real product (6529-6592)"
  { scene: "examplesProof", from: 6800, dur: 160 }, // "a better starting point than the usual AI-generated patterns (6845-6942)"
  { scene: "superProof", from: 6964, dur: 276, fullscreen: true }, // "Number one is Superpowers (6970-7032)… planning, building, reviewing, checking (7149-7232)"
  { scene: "osKinetic", from: 7285, dur: 175 }, // "an operating system for Claude (7295-7334)… stopping Claude jumping into the build (7414-7514)"
  { scene: "speedWall", from: 7921, dur: 369, fullscreen: true }, // "starts building immediately (7804)… halfway it discovers (8009) an early decision created problems (8038-8106)"
  { scene: "slowJump", from: 8340, dur: 430 }, // "slow that jump (8380-8404): understand (8478), break into stages (8519-8560), review (8611)… correct before the wrong path (8687-8760)"
  { scene: "recapDoors", from: 8776, dur: 419, fullscreen: true }, // "Superpowers ranks first (8804-8856); Taste (8872), PX Pipe (8948), Loop Library (9040), Agent Reach (9116)"
  { scene: "wrongPathKinetic", from: 9216, dur: 139 }, // "benefits matter less when Claude is following the wrong path (9250-9327)"
];

export const SKILLS_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const SKILLS_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

const SHOT = "assets/external/screenshots";

export const SkillsVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 the hook — five doors, one for each skill */}
      <Sequence from={90} durationInFrames={160} premountFor={30}>
        <PathDoorsScene durationInFrames={160} kicker="5 CLAUDE CODE SKILLS" title="RANKED" doors={[{ label: "?", at: 6 }, { label: "?", at: 22 }, { label: "?", at: 38 }, { label: "?", at: 54 }, { label: "?", at: 70 }]} tint="#D97757" />
      </Sequence>

      {/* 0:08 the three ranking tests */}
      <Sequence from={250} durationInFrames={160} premountFor={30}>
        <StepsScene durationInFrames={160} kicker="RANKED BY" title="THREE TESTS" steps={[{ label: "THE PROBLEM", at: 8 }, { label: "USEFULNESS", at: 47 }, { label: "TESTABILITY", at: 117 }]} accent="#E8B84B" tint="#34D399" subject />
      </Sequence>

      {/* 0:13 what a skill IS — the SKILL.MD cartridge clicks in */}
      <Sequence from={410} durationInFrames={330} premountFor={30}>
        <SkillCartridgeScene durationInFrames={330} kicker="WHAT'S A SKILL?" title="PACKAGED RULES" slotAt={54} runAts={[87, 206, 234]} cartridgeLabel="SKILL.MD" />
      </Sequence>

      {/* 0:25 No.5 receipt — Agent Reach's own repo (busy page → card mode) */}
      <Sequence from={759} durationInFrames={201} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={201} kicker="GITHUB · No.5" title="AGENT REACH" fullBleed={false} tint="#D97757" src={`${SHOT}/agent-reach-github-wide.png`} url="github.com/Panniantong/agent-reach" imageW={3840} imageH={2052} from={{ x: 2350, y: 240, w: 1200, h: 641 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} highlight={{ x: 2570, y: 405, w: 580, h: 235 }} highlightAt={131} />
      </Sequence>

      {/* 0:33 four platforms wire into one workflow */}
      <Sequence from={985} durationInFrames={535} premountFor={30}>
        <AppFlowScene durationInFrames={535} kicker="ONE SESSION, FOUR SOURCES" title="RESEARCH WIRED IN" apps={[{ label: "GITHUB", at: 20 }, { label: "REDDIT", at: 45 }, { label: "X", at: 70 }, { label: "YOUTUBE", at: 95 }]} connectAt={358} collapseAt={505} tint="#34D399" />
      </Sequence>

      {/* 0:55 the counter — most people live in ONE repo; extra sources topple */}
      <Sequence from={1650} durationInFrames={350} premountFor={30}>
        <StackCollapseScene durationInFrames={350} kicker="MOST PEOPLE" title="ONE REPO. ONE TASK" labels={["+ SOURCES", "+ PLATFORMS", "+ TABS"]} drops={[203, 229, 249]} collapseAt={283} accent="#F59E0B" tint="#F59E0B" />
      </Sequence>

      {/* 1:07 kinetic: when cross-platform research IS the job */}
      <Sequence from={2000} durationInFrames={150} premountFor={30}>
        <FinalTakeawayScene durationInFrames={150} title="RESEARCH-HEAVY WORK?" stamp="THEN IT FITS" stampAt={39} accent="#34D399" />
      </Sequence>

      {/* 1:11 No.4 receipt — Loop Library's page */}
      <Sequence from={2147} durationInFrames={188} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={188} kicker="FORWARD FUTURE · No.4" title="LOOP LIBRARY" titlePos="right" tint="#60A5FA" src={`${SHOT}/loop-library-wide.png`} url="signals.forwardfuture.com/loop-library" imageW={2800} imageH={1497} from={{ x: 620, y: 220, w: 1600, h: 855 }} to={{ x: 0, y: 0, w: 2800, h: 1497 }} zoomAt={14} highlight={{ x: 115, y: 288, w: 1600, h: 64 }} highlightAt={40} />
      </Sequence>

      {/* 1:18 the 80% trap — bar stops, robot says DONE, the gap flashes */}
      <Sequence from={2360} durationInFrames={290} premountFor={30}>
        <EightyPercentScene durationInFrames={290} kicker="THE PROBLEM IT FIXES" title="THE 80% TRAP" doneAt={121} gapAt={222} tint="#F59E0B" />
      </Sequence>

      {/* 1:28 loop until the finish condition — gates open per condition */}
      <Sequence from={2650} durationInFrames={375} premountFor={30}>
        <GatesScene durationInFrames={375} kicker="LOOP UNTIL" title="A DEFINED FINISH" gates={[{ label: "TESTS PASS", at: 247 }, { label: "CHECKLIST DONE", at: 303 }]} tint="#34D399" />
      </Sequence>

      {/* 1:41 kinetic: acceptable is not finished */}
      <Sequence from={3030} durationInFrames={150} premountFor={30}>
        <FinalTakeawayScene durationInFrames={150} title="LOOKS ACCEPTABLE" stamp="≠ FINISHED" stampAt={110} accent="#EF4444" />
      </Sequence>

      {/* 1:47 where loops fit — the scale tips toward clear finish lines */}
      <Sequence from={3205} durationInFrames={375} premountFor={30}>
        <BalanceScaleScene durationInFrames={375} kicker="WHERE IT FITS" title="LOOPS NEED A FINISH LINE" leftLabel="CLEAR FINISH" rightLabel="SUBJECTIVE WORK" dropLeftAt={49} dropRightAt={231} tipAt={290} stampText="CLEAR = FIT" stampAt={320} tint="#F59E0B" />
      </Sequence>

      {/* 2:00 No.3 receipt — pxpipe.dev hero */}
      <Sequence from={3609} durationInFrames={191} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={191} kicker="PXPIPE.DEV · No.3" title="CONTEXT → PNG" titlePos="right" tint="#D97757" src={`${SHOT}/pxpipe-site-wide.png`} url="pxpipe.dev" imageW={2800} imageH={1497} from={{ x: 340, y: 430, w: 1700, h: 908 }} to={{ x: 0, y: 0, w: 2800, h: 1497 }} zoomAt={14} highlight={{ x: 230, y: 810, w: 1560, h: 145 }} highlightAt={55} />
      </Sequence>

      {/* 2:08 context gets expensive — the queue piles up in front of the brain */}
      <Sequence from={3860} durationInFrames={440} premountFor={30}>
        <WaitingScene durationInFrames={440} kicker="CONTEXT GETS EXPENSIVE" title="THE RE-EXPLAIN TAX" chips={[{ label: "FILES", at: 55 }, { label: "SCREENSHOTS", at: 69 }, { label: "LOGS", at: 95 }, { label: "OUTPUTS", at: 137 }]} tint="#F59E0B" />
      </Sequence>

      {/* 2:23 the swap — bulky context pours in, one PNG pops out */}
      <Sequence from={4300} durationInFrames={220} premountFor={30}>
        <DocFunnelScene durationInFrames={220} kicker="PX PIPE'S TRICK" title="CONTEXT → IMAGES" dropAts={[8, 24, 40, 56, 72]} reportAt={84} reportLabel="ONE PNG" priceLabel="SAME CONTEXT" tint="#60A5FA" />
      </Sequence>

      {/* 2:30 the 70% claim — pxpipe's own README line (card mode) */}
      <Sequence from={4520} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="GITHUB · PXPIPE" title="THE 70% CLAIM" fullBleed={false} tint="#34D399" src={`${SHOT}/pxpipe-github-wide.png`} url="github.com/teamchong/pxpipe" imageW={2100} imageH={1122} from={{ x: 20, y: 300, w: 1560, h: 834 }} to={{ x: 0, y: 0, w: 2100, h: 1122 }} zoomAt={14} highlight={{ x: 755, y: 700, w: 555, h: 70 }} highlightAt={61} />
      </Sequence>

      {/* 2:37 who benefits — the scale tips to big builds, small projects lose */}
      <Sequence from={4700} durationInFrames={550} premountFor={30}>
        <BalanceScaleScene durationInFrames={550} kicker="WORTH ADDING WHEN" title="BIG BUILDS ONLY" leftLabel="LONG BUILDS" rightLabel="SMALL PROJECT" dropLeftAt={207} dropRightAt={410} tipAt={448} stampText="BIG WINS" stampAt={500} tint="#34D399" />
      </Sequence>

      {/* 2:56 kinetic: workflow first, cost second */}
      <Sequence from={5290} durationInFrames={150} premountFor={30}>
        <FinalTakeawayScene durationInFrames={150} title="COST COMES SECOND" stamp="WORKFLOW FIRST" stampAt={78} accent="#D97757" />
      </Sequence>

      {/* 3:04 No.2 receipt — tasteskill.dev hero */}
      <Sequence from={5537} durationInFrames={193} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={193} kicker="TASTESKILL.DEV · No.2" title="ANTI-SLOP" titlePos="left" titleTop={880} tint="#D97757" src={`${SHOT}/taste-site-wide.png`} url="tasteskill.dev" imageW={2800} imageH={1497} from={{ x: 140, y: 120, w: 1500, h: 801 }} to={{ x: 0, y: 0, w: 2800, h: 1497 }} zoomAt={14} highlight={{ x: 200, y: 505, w: 1080, h: 115 }} highlightAt={73} />
      </Sequence>

      {/* 3:11 the slop factory — identical gradient cards roll off the belt */}
      <Sequence from={5745} durationInFrames={245} premountFor={30}>
        <SlopFactoryScene durationInFrames={245} kicker="YOU KNOW THE STYLE" title="THE SLOP FACTORY" cardAts={[15, 38, 59]} stampAt={170} tint="#EF4444" />
      </Sequence>

      {/* 3:28 the A/B test — same brief, three checks */}
      <Sequence from={6240} durationInFrames={460} premountFor={30}>
        <StepsScene durationInFrames={460} kicker="SAME BRIEF · WITH + WITHOUT" title="THREE CHECKS" steps={[{ label: "LAYOUT", at: 156 }, { label: "TYPOGRAPHY", at: 208 }, { label: "REAL PRODUCT?", at: 283 }]} accent="#60A5FA" tint="#60A5FA" subject />
      </Sequence>

      {/* 3:46 what Taste output looks like — the example designs (card mode) */}
      <Sequence from={6800} durationInFrames={160} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={160} kicker="BUILT WITH TASTE" title="THE STARTING POINT" fullBleed={false} tint="#34D399" src={`${SHOT}/taste-examples-wide.png`} url="github.com/leonxlnx/taste-skill" imageW={1650} imageH={882} from={{ x: 60, y: 40, w: 1000, h: 535 }} to={{ x: 0, y: 0, w: 1650, h: 882 }} zoomAt={12} />
      </Sequence>

      {/* 3:52 No.1 receipt — the official marketplace listing, 941k installs */}
      <Sequence from={6964} durationInFrames={276} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={276} kicker="CLAUDE.COM · No.1" title="941,207 INSTALLS" titleTop={620} tint="#D97757" src={`${SHOT}/superpowers-plugin-wide.png`} url="claude.com/plugins/superpowers" imageW={2560} imageH={1368} from={{ x: 1600, y: 100, w: 1400, h: 748 }} to={{ x: 0, y: 0, w: 2560, h: 1368 }} zoomAt={14} highlight={{ x: 1880, y: 560, w: 440, h: 85 }} highlightAt={62} />
      </Sequence>

      {/* 4:03 kinetic: an OS for Claude — really a brake */}
      <Sequence from={7285} durationInFrames={175} premountFor={30}>
        <FinalTakeawayScene durationInFrames={175} title="AN OS FOR CLAUDE" stamp="REALLY: A BRAKE" stampAt={123} accent="#E8B84B" />
      </Sequence>

      {/* 4:24 the usual pattern — BUILD NOW rocket meets the assumptions wall */}
      <Sequence from={7921} durationInFrames={369} premountFor={30}>
        <SpeedWallScene durationInFrames={369} kicker="THE USUAL PATTERN" title="FAST START, HARD WALL" wallLabel="EARLY ASSUMPTIONS" rocketLabel="BUILD NOW" tint="#EF4444" />
      </Sequence>

      {/* 4:38 what Superpowers does instead — plan, stage, review */}
      <Sequence from={8340} durationInFrames={430} premountFor={30}>
        <StepsScene durationInFrames={430} kicker="SUPERPOWERS SLOWS THE JUMP" title="PLAN → BUILD → REVIEW" steps={[{ label: "UNDERSTAND", at: 132 }, { label: "STAGES", at: 197 }, { label: "REVIEW", at: 265 }]} accent="#34D399" tint="#34D399" subject />
      </Sequence>

      {/* 4:52 the recap — the winner's door opens, the rest pop dimmed */}
      <Sequence from={8776} durationInFrames={419} premountFor={30}>
        <PathDoorsScene durationInFrames={419} kicker="THE FINAL RANKING" title="WHY No.1 WINS" doors={[{ label: "SUPER", at: 22 }, { label: "TASTE", at: 90 }, { label: "PX PIPE", at: 166 }, { label: "LOOP", at: 258 }, { label: "REACH", at: 334 }]} pickIndex={0} pickAt={54} tint="#E8B84B" />
      </Sequence>

      {/* 5:07 kinetic: nothing helps on the wrong path */}
      <Sequence from={9216} durationInFrames={139} premountFor={30}>
        <FinalTakeawayScene durationInFrames={139} title="ON THE WRONG PATH" stamp="NOTHING HELPS" stampAt={95} accent="#EF4444" />
      </Sequence>

      {/* 5:13 OUTRO — anchored to the spoken "subscribe" (9419) */}
      <Sequence from={9411} durationInFrames={SKILLS_DUR - 9411} premountFor={30}>
        <Fable5Outro durationInFrames={SKILLS_DUR - 9411} kicker="PRACTICAL AI — NO HYPE" tag="Which skill installs first? Tell me below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const SkillsVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <SkillsVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={760} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={4300} durationInFrames={850} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={7921} durationInFrames={1290} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={9411} durationInFrames={SKILLS_DUR - 9411} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 9411].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      <SfxCue from={9423} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};
