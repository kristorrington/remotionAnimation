import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic } from "./scenes/AiNews2Scenes";
import { FlowScene, TimelineScene, DebunkStatScene, OriginTimelineScene, TwoColumnScene, ThreeDefsScene, RecapScene, BigStatScene } from "./scenes/GraphEngScenes";

// GraphEngVideo — the premium investigative cutaway for the "Graph Engineering"
// explainer (talking-head-160826.mp4, ~7:20, 13200f @ 30fps). Evidence-first
// tech-doc: real receipts + clean diagrams prove each claim; the presenter is
// the anchor and returns between beats. Native scenes pass-1; the b-roll
// receipts/clips (LangChain blog, pypistats, Steinberger tweet, Turing Post,
// LangGraph footage, restaurant/boardroom stock) layer in on the footage pass.
// Whisper-pinned to captions-160826.ts (from ≈ spokenFrame − 6).

export const GE_DUR = 13200;

const BLUE = NEWS.blue;
const GREEN = NEWS.green;
const AMBER = NEWS.amber;
const RED = NEWS.red;
const BRAND = NEWS.brand;

type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE HYPE (tight open) ──
  { key: "title", from: 296, dur: 206, fullscreen: true, node: (
    <NewsKinetic durationInFrames={206} tint={BRAND} text="GRAPH ENGINEERING" highlight="ENGINEERING" size={110} />
  ) },
  { key: "oldNew", from: 502, dur: 214, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={214} kicker="Idea vs name" title="OLD IDEA, NEW NAME" leftYear="2024" leftLabel="the idea" rightYear="2026" rightLabel="the name" highlightAt={8} labelAt={110} side="right" />
  ) },
  { key: "neverReal", from: 716, dur: 210, fullscreen: true, node: (
    <NewsKinetic durationInFrames={210} tint={RED} text="THE VIRAL PROOF? NEVER REAL." highlight="NEVER REAL." size={82} />
  ) },

  // ── PROMPT → LOOP → GRAPH ──
  { key: "flowPrompt", from: 1297, dur: 307, fullscreen: true, pip: true, node: (
    <FlowScene durationInFrames={307} mode="prompt" ats={[20, 90, 170]} />
  ) },
  { key: "flowLoop", from: 1604, dur: 411, fullscreen: true, pip: true, node: (
    <FlowScene durationInFrames={411} mode="loop" ats={[20, 90, 170]} />
  ) },
  { key: "flowGraph", from: 2015, dur: 535, fullscreen: true, pip: true, node: (
    <FlowScene durationInFrames={535} mode="graph" ats={[20, 120, 240, 340, 430]} />
  ) },
  { key: "flowExample", from: 2550, dur: 500, fullscreen: true, pip: true, node: (
    <FlowScene durationInFrames={500} mode="graph" ats={[8, 89, 225, 374, 430]} />
  ) },

  // ── NONE OF THIS IS NEW / LANGGRAPH ──
  { key: "noneNew", from: 3392, dur: 158, fullscreen: true, node: (
    <NewsKinetic durationInFrames={158} tint={BLUE} text="NONE OF THIS IS NEW" highlight="NEW" size={104} />
  ) },
  { key: "langgraphTL", from: 3550, dur: 387, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={387} kicker="LangGraph" title="IT SHIPPED IN 2024" leftYear="2024" leftLabel="LangGraph launches" rightYear="2026" rightLabel={"“graph engineering”"} highlightAt={20} labelAt={200} side="left" />
  ) },
  { key: "downloads", from: 3931, dur: 300, fullscreen: true, pip: true, node: (
    <BigStatScene durationInFrames={300} value="65M" unit="downloads / month" label="LangGraph today" at={20} tint={GREEN} />
  ) },
  { key: "adk", from: 4352, dur: 360, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={360} kicker="Google ADK 2.0" title="THE TECH CAME FIRST" leftYear="MAY 2026" leftLabel="ADK ships" rightYear="JULY 2026" rightLabel="the label goes viral" highlightAt={20} labelAt={180} side="left" />
  ) },

  // ── RESTAURANT ANALOGY (stock footage layers here) ──
  { key: "restaurant", from: 4972, dur: 411, fullscreen: true, node: (
    <NewsKinetic durationInFrames={411} tint={AMBER} text="SAME KITCHEN. SAME FOOD." highlight="SAME FOOD." size={92} />
  ) },
  { key: "frenchMenu", from: 5383, dur: 194, fullscreen: true, node: (
    <NewsKinetic durationInFrames={194} tint={AMBER} text="NEW NAME ON THE MENU" highlight="NEW NAME" size={96} />
  ) },

  // ── ORIGIN TIMELINE ──
  { key: "origin", from: 5571, dur: 1061, fullscreen: true, pip: true, node: (
    <OriginTimelineScene durationInFrames={1061} events={[
      { at: 20, date: "JUL 4", who: "Josh Simmons", note: "a quiet blog post" },
      { at: 360, date: "JUL 18", who: "Steinberger", note: "2.8M views", big: true },
      { at: 820, date: "JUL 18", who: "Hamel Husain", note: "“Loop is dead”", big: true },
    ]} />
  ) },
  { key: "noNotes", from: 6632, dur: 411, fullscreen: true, node: (
    <RecapScene durationInFrames={411} rows={[
      { at: 10, icon: "cross", title: "No release notes", sub: "" },
      { at: 90, icon: "cross", title: "No product launch", sub: "" },
      { at: 170, icon: "cross", title: "No LangChain / Google announcement", sub: "" },
    ]} />
  ) },
  { key: "goodDay", from: 7043, dur: 260, fullscreen: true, node: (
    <NewsKinetic durationInFrames={260} tint={BRAND} text="JUST A GOOD DAY FOR A PHRASE" highlight="A PHRASE" size={80} />
  ) },

  // ── THE FALSE STAT ──
  { key: "debunk", from: 7460, dur: 900, fullscreen: true, pip: true, node: (
    <DebunkStatScene durationInFrames={900} sources={["Microsoft", "Stanford", "Anthropic"]} stats={{ up: "+18%", down: "−85%" }} sourceAt={60} statAt={150} debunkAt={520} />
  ) },
  { key: "notIdeal", from: 8500, dur: 281, fullscreen: true, node: (
    <RecapScene durationInFrames={281} rows={[
      { at: 10, icon: "check", title: "Day 1 — cited as fact", sub: "in a client deck" },
      { at: 120, icon: "cross", title: "Day 3 — publicly debunked", sub: "not ideal" },
    ]} />
  ) },

  // ── FAKE NUMBER vs VAGUE TERM ──
  { key: "numVsTerm", from: 8930, dur: 460, fullscreen: true, pip: true, node: (
    <TwoColumnScene durationInFrames={460} kicker="Why this one spread" title="NUMBER vs LABEL" leftTitle="Fake number" leftItems={["Has a source", "You can check it", "It gets falsified"]} rightTitle="Vague term" rightItems={["No fixed meaning", "Nothing to check", "Never quite wrong"]} leftAt={20} rightAt={150} leftColor={RED} rightColor={AMBER} />
  ) },

  // ── DOCS SEARCH / THREE DEFINITIONS ──
  { key: "docs", from: 9440, dur: 551, fullscreen: true, pip: true, node: (
    <RecapScene durationInFrames={551} rows={[
      { at: 20, icon: "cross", title: "Anthropic docs", sub: "not an official term" },
      { at: 150, icon: "cross", title: "OpenAI docs", sub: "not an official term" },
      { at: 280, icon: "cross", title: "Google docs", sub: "not an official term" },
    ]} />
  ) },
  { key: "threeDefs", from: 9985, dur: 555, fullscreen: true, pip: true, node: (
    <ThreeDefsScene durationInFrames={555} ats={[20, 150, 280]} whichAt={360} />
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
    {/* SFX — restrained: soft whoosh on fullscreen starts; bass hit on the debunk */}
    {BEATS.filter((b) => b.fullscreen).map((b, i) => (
      <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.18} rate={vary(i)} />
    ))}
    <SfxCue from={7460 + 520} src={SFX.boom ?? SFX.softWhoosh} volume={0.3} />
  </AbsoluteFill>
);
