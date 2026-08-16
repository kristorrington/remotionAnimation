import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic } from "./scenes/AiNews2Scenes";
import { KineticClip } from "./scenes/AstraScenes";
import { FlowScene, TimelineScene, DebunkStatScene, TwoColumnScene, ThreeDefsScene, RecapScene } from "./scenes/GraphEngScenes";

// GraphEngVideo — the premium investigative cutaway for the "Graph Engineering"
// explainer (talking-head-160826.mp4, ~7:20, 13200f @ 30fps). Evidence-first:
// real receipts (LangChain blog, PyPI, Steinberger tweet, Turing Post debunk,
// Josh Simmons origin, Hamel article, LangGraph GitHub) + the official LangGraph
// node-graph clip prove each claim; clean native diagrams carry the
// prompt→loop→graph explainer where no source exists. Presenter is the anchor
// and returns between beats. Whisper-pinned (captions-160826.ts, from ≈ spoken−6).

export const GE_DUR = 13200;

const BLUE = NEWS.blue;
const GREEN = NEWS.green;
const AMBER = NEWS.amber;
const RED = NEWS.red;
const BRAND = NEWS.brand;
const SHOT = "assets/external/screenshots";
const CLIP = "assets/external/clips";

// gentle full-bleed push-in for a wide page receipt — TOP-ANCHORED (y:0) so a
// headline at the top of the page is never sliced by the inset crop.
const wide = (W: number, H: number) => ({ from: { x: 0, y: 0, w: W, h: H }, to: { x: Math.round(W * 0.03), y: 0, w: Math.round(W * 0.94), h: Math.round(H * 0.94) }, zoomAt: 10 });

type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE HYPE ──
  { key: "hookHype", from: 206, dur: 90, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={90} kicker="YOUR FEED THIS WEEK" title="THE HYPE" tint={AMBER} fullBleed={false}
      src={`${SHOT}/ge-tweet-0xmovez.png`} url="x.com" imageW={1170} imageH={590} cardW={1120} cardH={565}
      from={{ x: 60, y: 30, w: 1050, h: 530 }} to={{ x: 0, y: 0, w: 1170, h: 590 }} zoomAt={6} />
  ) },
  { key: "title", from: 296, dur: 206, fullscreen: true, node: (
    <NewsKinetic durationInFrames={206} tint={BRAND} text="GRAPH ENGINEERING" highlight="ENGINEERING" size={110} />
  ) },
  { key: "oldNew", from: 502, dur: 214, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={214} kicker="Idea vs name" title="OLD IDEA, NEW NAME" leftYear="2024" leftLabel="the idea" rightYear="2026" rightLabel="the name" highlightAt={8} labelAt={110} side="right" />
  ) },
  { key: "neverReal", from: 716, dur: 210, fullscreen: true, node: (
    <NewsKinetic durationInFrames={210} tint={RED} text="THE VIRAL PROOF? NEVER REAL." highlight="NEVER REAL." size={82} />
  ) },

  // ── PROMPT → LOOP → GRAPH (clean native explainer) ──
  { key: "flowPrompt", from: 1297, dur: 307, fullscreen: true, pip: true, node: <FlowScene durationInFrames={307} mode="prompt" ats={[20, 90, 170]} /> },
  { key: "flowLoop", from: 1604, dur: 411, fullscreen: true, pip: true, node: <FlowScene durationInFrames={411} mode="loop" ats={[20, 90, 170]} /> },
  { key: "flowGraph", from: 2015, dur: 535, fullscreen: true, pip: true, node: <FlowScene durationInFrames={535} mode="graph" ats={[20, 120, 240, 340, 430]} /> },
  { key: "flowExample", from: 2550, dur: 500, fullscreen: true, pip: true, node: <FlowScene durationInFrames={500} mode="graph" ats={[8, 89, 225, 374, 430]} /> },

  // ── NONE OF THIS IS NEW / LANGGRAPH (real receipts) ──
  { key: "noneNew", from: 3392, dur: 158, fullscreen: true, node: (
    <NewsKinetic durationInFrames={158} tint={BLUE} text="NONE OF THIS IS NEW" highlight="NEW" size={104} />
  ) },
  { key: "langchainBlog", from: 3550, dur: 220, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={220} kicker="LANGCHAIN.COM" title="3 YEARS OF THIS" tint={BLUE}
      src={`${SHOT}/ge-langchain-blog-wide.png`} url="langchain.com/blog" imageW={1884} imageH={1007} {...wide(1884, 1007)} titlePos="right" />
  ) },
  { key: "langgraphClip", from: 3770, dur: 161, fullscreen: true, pip: true, node: (
    <KineticClip durationInFrames={161} clip={`${CLIP}/ge-langgraph-a.mp4`} clipDur={267} text="A REAL, SHIPPING PRODUCT" highlight="SHIPPING" size={78} source="LangChain" />
  ) },
  { key: "downloads", from: 3931, dur: 421, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={421} kicker="PYPISTATS.ORG" title="72M DOWNLOADS / MONTH" tint={GREEN} fullBleed={false}
      src={`${SHOT}/ge-pypistats.png`} url="pypistats.org/packages/langgraph" imageW={1000} imageH={645} cardW={1180} cardH={761}
      from={{ x: 0, y: 0, w: 1000, h: 645 }} to={{ x: 40, y: 30, w: 920, h: 593 }} zoomAt={12} />
  ) },
  { key: "adk", from: 4352, dur: 360, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={360} kicker="Google ADK 2.0" title="THE TECH CAME FIRST" leftYear="MAY 2026" leftLabel="ADK ships" rightYear="JULY 2026" rightLabel="the label goes viral" highlightAt={20} labelAt={180} side="left" />
  ) },

  // ── RESTAURANT ANALOGY (stock, honest B-ROLL) ──
  { key: "restaurant", from: 4972, dur: 411, fullscreen: true, node: (
    <KineticClip durationInFrames={411} clip={`${CLIP}/ge-stock-kitchen.mp4`} clipDur={270} text="SAME KITCHEN. SAME FOOD." highlight="SAME FOOD." size={90} />
  ) },
  { key: "frenchMenu", from: 5383, dur: 188, fullscreen: true, node: (
    <KineticClip durationInFrames={188} clip={`${CLIP}/ge-stock-menu.mp4`} clipDur={225} text="NEW NAME ON THE MENU" highlight="NEW NAME" size={94} />
  ) },

  // ── ORIGIN (the real posts, escalating) ──
  { key: "origJosh", from: 5571, dur: 340, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={340} kicker="JUL 4 · A QUIET POST" title="WHERE IT STARTED" tint={BLUE}
      src={`${SHOT}/ge-josh-simmons.png`} url="drjoshcsimmons.com" imageW={1446} imageH={773} {...wide(1446, 773)} titlePos="right" />
  ) },
  { key: "origSteipete", from: 5911, dur: 340, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={340} kicker="JUL 18 · 2.8M VIEWS" title="THEN IT WENT VIRAL" tint={AMBER} fullBleed={false}
      src={`${SHOT}/ge-tweet-steipete.png`} url="x.com/steipete" imageW={1100} imageH={450} cardW={1300} cardH={532}
      from={{ x: 60, y: 20, w: 980, h: 401 }} to={{ x: 0, y: 0, w: 1100, h: 450 }} zoomAt={10} />
  ) },
  { key: "origHamel", from: 6251, dur: 381, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={381} kicker="JUL 18 · HAMEL HUSAIN" title={"“LOOP IS DEAD”"} tint={AMBER}
      src={`${SHOT}/ge-hamel.png`} url="hamel.dev" imageW={1300} imageH={760} {...wide(1300, 760)} titlePos="left" />
  ) },
  { key: "noNotes", from: 6632, dur: 411, fullscreen: true, node: (
    <RecapScene durationInFrames={411} rows={[
      { at: 10, icon: "cross", title: "No release notes", sub: "" },
      { at: 90, icon: "cross", title: "No product launch", sub: "" },
      { at: 170, icon: "cross", title: "No LangChain / Google announcement", sub: "" },
    ]} />
  ) },
  { key: "goodDay", from: 7043, dur: 417, fullscreen: true, node: (
    <NewsKinetic durationInFrames={417} tint={BRAND} text="JUST A GOOD DAY FOR A PHRASE" highlight="A PHRASE" size={80} />
  ) },

  // ── THE FALSE STAT ──
  { key: "debunk", from: 7460, dur: 505, fullscreen: true, pip: true, node: (
    <DebunkStatScene durationInFrames={505} sources={["Microsoft", "Stanford", "Anthropic"]} stats={{ up: "+18%", down: "−85%" }} sourceAt={40} statAt={120} debunkAt={430} />
  ) },
  { key: "turingpost", from: 7965, dur: 395, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={395} kicker="TURING POST · JUL 21" title="THEY CHECKED IT" tint={RED}
      src={`${SHOT}/ge-turingpost.png`} url="turingpost.com" imageW={1796} imageH={960} {...wide(1796, 960)} titlePos="right" />
  ) },
  { key: "boardroom", from: 8360, dur: 570, fullscreen: true, pip: true, node: (
    <KineticClip durationInFrames={570} clip={`${CLIP}/ge-stock-boardroom.mp4`} clipDur={186} text="CITED DAY 1. DEBUNKED DAY 3." highlight="DEBUNKED" size={76} />
  ) },

  // ── FAKE NUMBER vs VAGUE TERM ──
  { key: "numVsTerm", from: 8930, dur: 460, fullscreen: true, pip: true, node: (
    <TwoColumnScene durationInFrames={460} kicker="Why this one spread" title="NUMBER vs LABEL" leftTitle="Fake number" leftItems={["Has a source", "You can check it", "It gets falsified"]} rightTitle="Vague term" rightItems={["No fixed meaning", "Nothing to check", "Never quite wrong"]} leftAt={20} rightAt={150} leftColor={RED} rightColor={AMBER} />
  ) },

  // ── DOCS SEARCH / THREE DEFINITIONS ──
  { key: "docs", from: 9440, dur: 545, fullscreen: true, pip: true, node: (
    <RecapScene durationInFrames={545} rows={[
      { at: 20, icon: "cross", title: "Anthropic docs", sub: "not an official term" },
      { at: 150, icon: "cross", title: "OpenAI docs", sub: "not an official term" },
      { at: 280, icon: "cross", title: "Google docs", sub: "not an official term" },
    ]} />
  ) },
  { key: "threeDefs", from: 9985, dur: 650, fullscreen: true, pip: true, node: (
    <ThreeDefsScene durationInFrames={650} ats={[20, 150, 280]} whichAt={400} />
  ) },

  // ── RECAP + THE RULE ──
  { key: "recap", from: 10635, dur: 560, fullscreen: true, pip: true, node: (
    <RecapScene durationInFrames={560} rows={[
      { at: 20, icon: "check", title: "Real technique", sub: "shipping for years" },
      { at: 170, icon: "warn", title: "New name", sub: "popular for weeks" },
      { at: 320, icon: "cross", title: "False proof point", sub: "failed fact-checking" },
    ]} />
  ) },
  { key: "whoShips", from: 11195, dur: 250, fullscreen: true, node: (
    <NewsKinetic durationInFrames={250} tint={BRAND} text="WHO'S ACTUALLY SHIPPING IT?" highlight="SHIPPING IT?" size={80} />
  ) },
  { key: "rule", from: 11445, dur: 500, fullscreen: true, pip: true, node: (
    <TwoColumnScene durationInFrames={500} kicker="The rule" title="EVIDENCE vs COMMENTARY" leftTitle="Real capability" leftItems={["Official docs", "Product page", "Release notes", "You can test it"]} rightTitle="Commentary" rightItems={["A tweet", "A blog post", "A hot take", "An unverified label"]} leftAt={20} rightAt={170} leftColor={GREEN} rightColor={AMBER} />
  ) },

  // ── ENDING ──
  { key: "oldLabel", from: 12432, dur: 320, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={320} kicker="What this really is" title="OLD IDEA → NEW LABEL" leftYear="2024" leftLabel="the capability" rightYear="2026" rightLabel="the name" highlightAt={8} labelAt={140} side="right" />
  ) },
];

export const GE_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const GE_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const GE_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);
export const GE_PIP: { from: number; to: number }[] = BEATS.filter((b) => b.pip).map((b) => ({ from: b.from, to: b.from + b.dur }));

const OUTRO_FROM = 12900;

export const GraphEngVisuals: React.FC = () => (
  <ThemeProvider style="paper">
    <AbsoluteFill>
      {BEATS.map((b) => (
        <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={30}>
          {b.node}
        </Sequence>
      ))}
      <Sequence from={OUTRO_FROM} durationInFrames={GE_DUR - OUTRO_FROM} premountFor={30}>
        <Fable5Outro durationInFrames={GE_DUR - OUTRO_FROM} kicker="EVIDENCE OVER HYPE" tag="Automation Vault · free n8n workflows · link in bio. Subscribe." />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);

export const GraphEngVideo: React.FC = () => (
  <AbsoluteFill>
    <GraphEngVisuals />
    {/* MUSIC — investigative open; steady middle; tense over the false-stat; resolve */}
    <MusicController state="main" from={0} durationInFrames={7460} volume={0.07} duck={[{ from: 296, to: 926 }]} />
    <MusicController state="caveat" from={7460} durationInFrames={1900} volume={0.06} />
    <MusicController state="main" from={9360} durationInFrames={GE_DUR - 9360} volume={0.065} />
    {/* SFX — restrained: soft whoosh on fullscreen starts; bass hit on the debunk stamp */}
    {BEATS.filter((b) => b.fullscreen).map((b, i) => (
      <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.18} rate={vary(i)} />
    ))}
    <SfxCue from={7460 + 430} src={SFX.boom} volume={0.3} />
  </AbsoluteFill>
);
