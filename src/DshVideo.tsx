import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import {
  DemoClip, KeywordFlash, CommandCard, ArchScene, PrereqScene, ListScene,
  PtcFlow, PluginFan, SummaryScene,
} from "./scenes/DshScenes";

// DshVideo — the overlay track for the DeepSeek Harness tutorial. Real demo
// footage (DemoClip) is the hero; graphics only clarify. Every beat is pinned
// to the A-roll narration (SRT frames, cut_synced). Demo `startAt` = seconds
// into each 30fps proxy. fullscreen beats cover the A-roll; pip beats show Kris
// in the corner while the demo plays. DUR 23440 (13:01 @30fps).

export const DSH_DUR = 23440;

const I = "assets/external/clips/dsh-02-install.mp4";
const S = "assets/external/clips/dsh-03-setup.mp4";
const U = "assets/external/clips/dsh-04-using-it.mp4";
const SET = "assets/external/clips/dsh-05-settings.mp4";
const W = "assets/external/clips/dsh-06-websearch.mp4";

type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; pip?: boolean; cut?: boolean; node: React.ReactNode };
const B: Beat[] = [
  // ── COLD OPEN — rapid proof flashes (Kris PiP), keyword per phrase ──────────
  { key: "coBrowser", from: 96, dur: 54, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={54} src={S} startAt={62} scale={1.06} label="In my browser · local" /> },
  { key: "coFiles", from: 150, dur: 42, fullscreen: true, pip: true, cut: true, node: (<><DemoClip durationInFrames={42} src={U} startAt={49} scale={1.15} originX={30} originY={55} /><KeywordFlash durationInFrames={42} text="Reads files" icon="files" /></>) },
  { key: "coCode", from: 192, dur: 71, fullscreen: true, pip: true, cut: true, node: (<><DemoClip durationInFrames={71} src={U} startAt={84} scale={1.2} originX={35} originY={45} /><KeywordFlash durationInFrames={71} text="Writes code" icon="code" /></>) },
  { key: "coTraj", from: 263, dur: 52, fullscreen: true, pip: true, cut: true, node: (<><DemoClip durationInFrames={52} src={U} startAt={30} scale={1.12} originX={55} originY={22} /><KeywordFlash durationInFrames={52} text="Trajectory" icon="steps" /></>) },
  { key: "coWeb", from: 315, dur: 35, fullscreen: true, pip: true, cut: true, node: (<><DemoClip durationInFrames={35} src={W} startAt={44} scale={1.15} originX={45} originY={40} /><KeywordFlash durationInFrames={35} text="Live web" icon="web" /></>) },
  { key: "coCmd", from: 350, dur: 103, fullscreen: true, pip: true, cut: true, node: (<><DemoClip durationInFrames={103} src={I} startAt={23} scale={1.25} originX={12} originY={26} /><KeywordFlash durationInFrames={103} text="One command" /></>) },

  // ── PREREQUISITES ──────────────────────────────────────────────────────────
  { key: "prereq", from: 1707, dur: 352, fullscreen: true, pip: true, cut: true, node: <PrereqScene durationInFrames={352} ats={[78, 100]} /> },
  { key: "nodeVer", from: 2059, dur: 213, fullscreen: true, pip: true, cut: true, node: <CommandCard durationInFrames={213} eyebrow="Check it's installed" cmd="node --version" /> },
  { key: "arch", from: 2711, dur: 350, fullscreen: true, pip: true, cut: true, node: <ArchScene durationInFrames={350} lineAt={70} /> },

  // ── INSTALL ────────────────────────────────────────────────────────────────
  { key: "termOpen", from: 3129, dur: 234, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={234} src={I} startAt={2} scale={1.2} originX={12} originY={22} label="Terminal" /> },
  { key: "cmdHero", from: 3363, dur: 550, fullscreen: true, pip: true, cut: true, node: <CommandCard durationInFrames={550} eyebrow="The install command" cmd="npm install -g @deepseek-ai/dsh" hi="-g" annot="-g = global install" annotAt={262} /> },
  { key: "cmdNpx", from: 3913, dur: 433, fullscreen: true, pip: true, cut: true, node: <CommandCard durationInFrames={433} eyebrow="No-install alternative" cmd="npm install -g @deepseek-ai/dsh" second={{ label: "One-off run", cmd: "npx @deepseek-ai/dsh web", at: 40 }} /> },
  { key: "installing", from: 4346, dur: 233, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={233} src={I} startAt={34} scale={1.15} originX={20} originY={45} rate={1.6} label="Installing" /> },
  { key: "dshWeb", from: 4579, dur: 660, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={660} src={I} startAt={79} scale={1.3} originX={14} originY={58} label="dsh web --no-open" note={{ at: 40, x: 6, y: 62, w: 34, h: 9 }} /> },

  // ── SETUP ──────────────────────────────────────────────────────────────────
  { key: "browserOpen", from: 5233, dur: 233, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={233} src={S} startAt={1} scale={1.05} label="127.0.0.1:3080" note={{ at: 30, x: 5, y: 3, w: 16, h: 4 }} /> },
  { key: "uiLoaded", from: 5466, dur: 187, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={187} src={S} startAt={6} scale={1.04} label="Harness Web UI · local" /> },
  { key: "notice", from: 5653, dur: 187, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={187} src={S} startAt={10} scale={1.35} originX={50} originY={30} /> },
  { key: "apiKey", from: 5840, dur: 324, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={324} src={S} startAt={30} scale={1.3} originX={50} originY={42} label="API key" /> },
  { key: "workspace", from: 6536, dur: 598, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={598} src={S} startAt={54} scale={1.15} originX={50} originY={55} label="Workspace" kenBurns={0.05} /> },

  // ── FIRST CHAT + TRAJECTORY ──────────────────────────────────────────────────
  { key: "firstChat", from: 7298, dur: 648, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={648} src={U} startAt={1} scale={1.1} originX={55} originY={40} label="First prompt" kenBurns={0.05} /> },
  { key: "trajectory", from: 8047, dur: 921, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={921} src={U} startAt={28} scale={1.12} originX={52} originY={30} label="Trajectory" kenBurns={0.06} /> },

  // ── PROJECT UNDERSTANDING ────────────────────────────────────────────────────
  { key: "projFiles", from: 9092, dur: 748, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={748} src={U} startAt={47} scale={1.14} originX={30} originY={45} label="Reading the project" kenBurns={0.05} /> },
  { key: "projExplain", from: 9830, dur: 828, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={828} src={U} startAt={56} scale={1.18} originX={55} originY={42} label="Understands the codebase" kenBurns={0.06} /> },

  // ── CODE CREATION + RUN (hero) ───────────────────────────────────────────────
  { key: "primePrompt", from: 10869, dur: 674, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={674} src={U} startAt={72} scale={1.16} originX={50} originY={40} label="prime_checker.py" /> },
  { key: "primeRun", from: 11543, dur: 668, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={668} src={U} startAt={76} scale={1.22} originX={45} originY={35} label="3/3 tests passed" /> },

  // ── PERMISSIONS ──────────────────────────────────────────────────────────────
  { key: "permReal", from: 12843, dur: 246, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={246} src={SET} startAt={9} scale={1.3} originX={20} originY={78} label="Permissions" /> },
  { key: "permList", from: 13089, dur: 939, fullscreen: true, pip: true, cut: true, node: (
    <ListScene durationInFrames={939} eyebrow="Who controls the agent" title="Three permission modes"
      rows={[{ t: "Read Only", s: "inspect, don't modify — safest" }, { t: "Workspace Write", s: "edit inside your workspace" }, { t: "Full Access", s: "removes file restrictions" }]}
      ats={[20, 270, 660]} activeIdx={2} activeAt={660} />
  ) },

  // ── MODEL SELECTOR ───────────────────────────────────────────────────────────
  { key: "modelReal", from: 14161, dur: 244, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={244} src={SET} startAt={37} scale={1.35} originX={78} originY={72} label="Model selector" /> },
  { key: "modelList", from: 14405, dur: 829, fullscreen: true, pip: true, cut: true, node: (
    <ListScene durationInFrames={829} eyebrow="In this build" title="Pick the model"
      rows={[{ t: "DeepSeek V4 Flash", s: "faster — everyday use" }, { t: "DeepSeek V4 Pro", s: "more capable — harder problems" }, { t: "DeepSeek V4 Flash Vision-Exp", s: "experimental — works with images" }]}
      ats={[10, 138, 254]} />
  ) },

  // ── SETTINGS / APPEARANCE ────────────────────────────────────────────────────
  { key: "settingsPanel", from: 15341, dur: 526, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={526} src={SET} startAt={62} scale={1.15} originX={45} originY={45} label="Settings" kenBurns={0.06} /> },

  // ── AGENT PRESETS ────────────────────────────────────────────────────────────
  { key: "presetReal", from: 15861, dur: 356, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={356} src={SET} startAt={78} scale={1.12} originX={45} originY={45} label="Agent presets" /> },
  { key: "presetList", from: 16217, dur: 930, fullscreen: true, pip: true, cut: true, node: (
    <ListScene durationInFrames={930} eyebrow="Four built-in presets" title="Agent presets"
      rows={[{ t: "Standard", s: "the full toolkit" }, { t: "PTC", s: "multi-step Code Mode SDK" }, { t: "Minimal", s: "shell + file editor only" }, { t: "Creator", s: "build your own presets" }]}
      ats={[16, 200, 340, 480]} activeIdx={0} activeAt={16} />
  ) },
  { key: "ptcFlow", from: 17147, dur: 331, fullscreen: true, pip: true, cut: true, node: <PtcFlow durationInFrames={331} ats={[10, 120, 240]} /> },
  { key: "presetRest", from: 17478, dur: 961, fullscreen: true, pip: true, cut: true, node: (
    <ListScene durationInFrames={961} eyebrow="Four built-in presets" title="Agent presets"
      rows={[{ t: "Standard", s: "the full toolkit" }, { t: "PTC", s: "multi-step Code Mode SDK" }, { t: "Minimal", s: "shell + file editor only" }, { t: "Creator", s: "build your own presets" }]}
      ats={[0, 0, 0, 0]} activeIdx={2} activeAt={20} />
  ) },

  // ── PLUGINS ──────────────────────────────────────────────────────────────────
  { key: "pluginReal", from: 18433, dur: 159, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={159} src={SET} startAt={137} scale={1.15} originX={55} originY={40} label="Plugins" /> },
  { key: "pluginFan", from: 18592, dur: 456, fullscreen: true, pip: true, cut: true, node: <PluginFan durationInFrames={456} ats={[24, 60, 96, 130, 160]} countAt={99999} /> },
  { key: "pluginList", from: 19048, dur: 439, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={439} src={SET} startAt={139} scale={1.2} originX={70} originY={45} rate={1.05} label="160+ plugins" kenBurns={0.08} /> },

  // ── LIVE WEB SEARCH (final payoff) ───────────────────────────────────────────
  { key: "wsPrompt", from: 19846, dur: 291, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={291} src={W} startAt={1} scale={1.12} originX={50} originY={45} label="Live web search" /> },
  { key: "wsFiring", from: 20137, dur: 226, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={226} src={W} startAt={12} scale={1.15} originX={40} originY={35} rate={1.5} label="Invoking web search" kenBurns={0.05} /> },
  { key: "wsAnswer", from: 20363, dur: 345, fullscreen: true, pip: true, cut: true, node: <DemoClip durationInFrames={345} src={W} startAt={42} scale={1.18} originX={45} originY={40} label="Back into the chat" kenBurns={0.05} /> },

  // ── SUMMARY MONTAGE ──────────────────────────────────────────────────────────
  { key: "summary", from: 20702, dur: 660, fullscreen: true, pip: true, cut: true, node: (
    <SummaryScene durationInFrames={660} ats={[74, 124, 177, 244, 293, 360, 423]} />
  ) },

  // ── OUTRO command recap ──────────────────────────────────────────────────────
  { key: "outroCmds", from: 22307, dur: 606, fullscreen: true, pip: true, cut: true, node: <CommandCard durationInFrames={606} eyebrow="Two ways to run it" cmd="npm install -g @deepseek-ai/dsh" second={{ label: "Or the one-liner", cmd: "npx @deepseek-ai/dsh web", at: 183 }} /> },
];

export const DSH_WINDOWS: { from: number; dur: number }[] = B.map((b) => ({ from: b.from, dur: b.dur }));
export const DSH_FULLSCREEN: { from: number; to: number }[] = B.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const DSH_CUTS = B.filter((b) => b.cut).map((b) => b.from);
export const DSH_PIP: { from: number; to: number }[] = B.filter((b) => b.pip).map((b) => ({ from: b.from, to: b.from + b.dur }));

const OUTRO_FROM = 23150;

export const DshVisuals: React.FC = () => (
  <ThemeProvider style="cinematic">
    <AbsoluteFill>
      {B.map((b) => (
        <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={20}>
          {b.node}
        </Sequence>
      ))}
      <Sequence from={OUTRO_FROM} durationInFrames={DSH_DUR - OUTRO_FROM} premountFor={20}>
        <Fable5Outro durationInFrames={DSH_DUR - OUTRO_FROM} kicker="LOCAL AI, DONE RIGHT" tag="Commands + official docs in the description. Subscribe for more local-AI walkthroughs." />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);

export const DshVideo: React.FC = () => (
  <AbsoluteFill>
    <DshVisuals />
    {/* MUSIC — modern electronic bed: higher energy intro, understated tutorial,
        lifts on hero moments (code run, plugins, web search), resolves at outro */}
    <MusicController state="main" from={0} durationInFrames={1707} volume={0.08} duck={[{ from: 12, to: 100 }]} />
    <MusicController state="caveat" from={1707} durationInFrames={9000} volume={0.05} startFrom={600} />
    <MusicController state="main" from={10707} durationInFrames={1520} volume={0.06} startFrom={200} duck={[{ from: 11794, to: 11960 }]} duckTo={0.4} />
    <MusicController state="caveat" from={12227} durationInFrames={7256} volume={0.05} startFrom={1400} />
    <MusicController state="main" from={19483} durationInFrames={1880} volume={0.07} startFrom={900} />
    <MusicController state="caveat" from={21363} durationInFrames={DSH_DUR - 21363} volume={0.05} startFrom={2600} />

    {/* SFX — restrained: whoosh on section starts, UI tick on demo beats, soft
        confirmation on the tests-pass payoff, low riser into web search */}
    {B.filter((b) => b.fullscreen).map((b, i) => (
      <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.12} rate={vary(i)} />
    ))}
    <SfxCue from={350} src={SFX.clickPop} volume={0.16} />
    <SfxCue from={11794 + 251} src={SFX.pluck} volume={0.28} />
    <SfxCue from={19583} src={SFX.boom} volume={0.14} />
    {[13089, 14405, 16217].map((f, i) => (<SfxCue key={`t-${f}`} from={f} src={SFX.tick} volume={0.1} rate={vary(i)} />))}
  </AbsoluteFill>
);
