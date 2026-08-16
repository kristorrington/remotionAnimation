import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic } from "./scenes/AiNews2Scenes";
import { KineticClip } from "./scenes/AstraScenes";
import { FlowScene, GraphShapeScene, RoadmapScene, TimelineScene, DebunkStatScene, TwoColumnScene, ThreeDefsScene, RecapScene, BuzzwordFeedScene, ClosingScene } from "./scenes/GraphEngScenes";

// GraphEngVideo — the premium investigative cutaway for the "Graph Engineering"
// explainer (talking-head-160826.mp4, ~7:20, 13200f @ 30fps). REVISION 2
// (Kris, Aug 2026): footage-first — real receipts/clips replace repeated
// animations (ADK blog receipt replaces the 2nd timeline; the LangChain
// Academy graph clip lands on "you've got a map"; the closing timeline became
// a strike-through payoff); every element `at` re-pinned to its whisper word;
// kinetics trimmed ≤4s; the concept beat (abstract web) no longer duplicates
// the worked-example diagram. Proxy audio +133ms (lip-sync, baked).

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
  // ── THE HYPE ── "the internet lost its mind" (186) → the real feed
  { key: "hookHype", from: 200, dur: 96, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={96} kicker="YOUR FEED THIS WEEK" title="THE HYPE" tint={AMBER} fullBleed={false}
      src={`${SHOT}/ge-tweet-0xmovez.png`} url="x.com" imageW={1170} imageH={590} cardW={1120} cardH={565}
      from={{ x: 60, y: 30, w: 1050, h: 530 }} to={{ x: 0, y: 0, w: 1170, h: 590 }} zoomAt={6} />
  ) },
  // "Graph Engineering" spoken at 302
  { key: "title", from: 296, dur: 69, fullscreen: true, node: (
    <NewsKinetic durationInFrames={69} tint={BRAND} text="GRAPH ENGINEERING" highlight="ENGINEERING" size={110} />
  ) },
  // "you've probably seen it all over your feed" (365) → a second real tweet
  { key: "feedGoyal", from: 365, dur: 99, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={99} kicker="AND EVERYWHERE ELSE" title="ALL OVER YOUR FEED" tint={AMBER} fullBleed={false}
      src={`${SHOT}/ge-tweet-goyal.png`} url="x.com" imageW={1160} imageH={915} cardW={1010} cardH={640}
      from={{ x: 0, y: 0, w: 1160, h: 915 }} to={{ x: 0, y: 0, w: 1160, h: 735 }} zoomAt={8} />
  ) },
  // "idea ~2.5 years old (508) / name ~3 weeks old (608)"
  { key: "oldNew", from: 464, dur: 252, fullscreen: true, pip: true, node: (
    <TimelineScene durationInFrames={252} kicker="Idea vs name" title="OLD IDEA, NEW NAME" leftYear="2024" leftLabel="the idea" rightYear="2026" rightLabel="the name" leftLabelAt={8} rightLabelAt={105} highlightAt={144} braceAt={44} braceText="≈ 2½ years" side="right" />
  ) },
  // "the stat everyone keeps repeating as proof? Never real." (722)
  { key: "neverReal", from: 716, dur: 122, fullscreen: true, node: (
    <NewsKinetic durationInFrames={122} tint={RED} text="THE VIRAL PROOF? NEVER REAL." highlight="NEVER REAL." size={82} />
  ) },
  // the promise: "what it means (849) / where it came from (898) / one rule (945)"
  { key: "roadmap", from: 838, dur: 248, fullscreen: true, pip: true, node: (
    <RoadmapScene durationInFrames={248} ats={[12, 60, 107]} />
  ) },

  // ── PROMPT → LOOP → GRAPH (clean native explainer, every node on its word) ──
  // Input "instruction" 1380 · AI "goes in" 1403 · Output "output" 1424 · "done." 1555
  { key: "flowPrompt", from: 1297, dur: 307, fullscreen: true, pip: true, node: <FlowScene durationInFrames={307} mode="prompt" ats={[83, 106, 127]} doneAt={254} /> },
  // Try "running" 1706 · Check 1774 · Pass 1788 · "picture a circle" 1813 → ring · "tries again" 1944
  { key: "flowLoop", from: 1604, dur: 411, fullscreen: true, pip: true, node: <FlowScene durationInFrames={411} mode="loop" ats={[102, 170, 184]} circleAt={209} retryAt={340} /> },
  // the CONCEPT (abstract web — distinct from the worked example): "point" 2178 ·
  // "branches" 2260 · "loops" 2283 · "revisits" 2299 · "paths" 2329
  { key: "flowWeb", from: 2123, dur: 240, fullscreen: true, pip: true, node: <FlowScene durationInFrames={240} mode="web" ats={[55, 137, 160, 176, 206]} /> },
  // "instead of one straight line, you've got a MAP (2444)" → LangChain's own graph
  { key: "mapClip", from: 2363, dur: 187, fullscreen: true, node: (
    <KineticClip durationInFrames={187} clip={`${CLIP}/ge-langgraph-a.mp4`} clipDur={200} startFrom={54} text="NOT A LINE. A MAP." highlight="MAP." size={92} textAt={81} source="LangChain" />
  ) },
  // the worked example IN VO ORDER: research 2582 · dead end 2652 · LOOPS BACK 2681 · splits 2775 · combines 2924
  { key: "flowExample", from: 2550, dur: 433, fullscreen: true, pip: true, node: <FlowScene durationInFrames={433} mode="graph" ats={[32, 102, 131, 225, 374]} /> },
  // "the whole shape, that's a GRAPH (3061)" · arrows re-pulse on "every arrow" 3091
  { key: "shapeGraph", from: 2983, dur: 252, fullscreen: true, pip: true, node: <GraphShapeScene durationInFrames={252} labelAt={78} pulseAt={108} /> },

  // ── NONE OF THIS IS NEW (real receipts) ──
  { key: "noneNew", from: 3392, dur: 63, fullscreen: true, node: (
    <NewsKinetic durationInFrames={63} tint={BLUE} text="NONE OF THIS IS NEW" highlight="NEW" size={104} />
  ) },
  // "LangGraph… launched January 2024 / 2.5 years before" → zoom the "3 Years" title on 3636
  { key: "langchainBlog", from: 3455, dur: 345, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={345} kicker="LANGCHAIN.COM" title="3 YEARS OF THIS" tint={BLUE}
      src={`${SHOT}/ge-langchain-blog-wide.png`} url="langchain.com/blog" imageW={1884} imageH={1007}
      from={{ x: 0, y: 0, w: 1884, h: 1007 }} to={{ x: 0, y: 0, w: 1884, h: 1007 }}
      waypoints={[{ rect: { x: 0, y: 0, w: 1884, h: 1007 }, at: 0 }, { rect: { x: 110, y: 340, w: 1330, h: 610 }, at: 181 }]}
      notes={[{ at: 200, rect: { x: 160, y: 420, w: 640, h: 130 }, kind: "box" }]}
      titlePos="right" />
  ) },
  // "65 million downloads a month" (3950) — pypistats live counter shows 72.7M
  { key: "downloads", from: 3925, dur: 169, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={169} kicker="PYPISTATS.ORG" title="NOW 72M / MONTH" tint={GREEN} fullBleed={false}
      src={`${SHOT}/ge-pypistats.png`} url="pypistats.org/packages/langgraph" imageW={1000} imageH={645} cardW={1180} cardH={761}
      from={{ x: 0, y: 0, w: 1000, h: 645 }} to={{ x: 40, y: 30, w: 920, h: 593 }} zoomAt={12} />
  ) },
  // "we're not talking about some TINY experiment" (4094) → the founders shipping it
  { key: "notTiny", from: 4094, dur: 131, fullscreen: true, node: (
    <KineticClip durationInFrames={131} clip={`${CLIP}/ge-langgraph-b.mp4`} clipDur={267} text="NOT A TINY EXPERIMENT" highlight="TINY" size={84} source="LangChain" />
  ) },
  // "people had GRAPH WORKFLOWS too (4231) · ADK 2.0 GA (4300)" → Google's own blog
  { key: "adk", from: 4225, dur: 377, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={377} kicker="GOOGLE · ADK GO 2.0" title="THE TECH CAME FIRST" tint={BLUE}
      src={`${SHOT}/ge-adk.png`} url="developers.googleblog.com" imageW={2300} imageH={1229}
      from={{ x: 0, y: 0, w: 2300, h: 1229 }} to={{ x: 0, y: 0, w: 2300, h: 1229 }}
      waypoints={[{ rect: { x: 0, y: 0, w: 2300, h: 1229 }, at: 0 }, { rect: { x: 120, y: 60, w: 2060, h: 700 }, at: 111 }]}
      notes={[{ at: 122, rect: { x: 185, y: 370, w: 1530, h: 125 }, kind: "box" }]}
      titlePos="right" />
  ) },

  // ── RESTAURANT ANALOGY (three stock beats, one per sentence) ──
  // "serving the same dish since 2024" (4915)
  { key: "kitchen", from: 4844, dur: 256, fullscreen: true, node: (
    <KineticClip durationInFrames={256} clip={`${CLIP}/ge-stock-kitchen.mp4`} text="SAME DISH SINCE 2024" highlight="2024" size={88} textAt={66} bright={0.74} />
  ) },
  // "renames the dish" (5150)
  { key: "dish", from: 5100, dur: 256, fullscreen: true, node: (
    <KineticClip durationInFrames={256} clip={`${CLIP}/ge-stock-dish.mp4`} text="RENAME THE DISH" highlight="RENAME" size={92} textAt={44} bright={0.64} />
  ) },
  // "wrote the menu in French" (5399)
  { key: "frenchMenu", from: 5356, dur: 104, fullscreen: true, node: (
    <KineticClip durationInFrames={104} clip={`${CLIP}/ge-stock-menu.mp4`} text="THE MENU IN FRENCH" highlight="FRENCH" size={88} textAt={33} />
  ) },

  // ── ORIGIN (the real posts, escalating) ──
  { key: "origJosh", from: 5567, dur: 331, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={331} kicker="JUL 4 · A QUIET POST" title="WHERE IT STARTED" tint={BLUE}
      src={`${SHOT}/ge-josh-simmons.png`} url="drjoshcsimmons.com" imageW={1446} imageH={773} {...wide(1446, 773)} titlePos="right" />
  ) },
  { key: "origSteipete", from: 5898, dur: 300, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={300} kicker="JUL 18 · STEINBERGER" title="THEN IT WENT VIRAL" tint={AMBER} fullBleed={false}
      src={`${SHOT}/ge-tweet-steipete.png`} url="x.com/steipete" imageW={1100} imageH={450} cardW={1300} cardH={532}
      from={{ x: 60, y: 20, w: 980, h: 401 }} to={{ x: 0, y: 0, w: 1100, h: 450 }} zoomAt={10} />
  ) },
  // "'Loop Engineering is Dead' (6527)" → zoom + box the essay headline on the word
  { key: "origHamel", from: 6347, dur: 279, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={279} kicker="JUL 18 · HAMEL HUSAIN" title={"“LOOP IS DEAD”"} tint={AMBER} fullBleed={false}
      src={`${SHOT}/ge-hamel.png`} url="hamel.dev" imageW={1300} imageH={760} cardW={1240} cardH={725}
      from={{ x: 0, y: 0, w: 1300, h: 760 }} to={{ x: 0, y: 0, w: 1300, h: 760 }}
      waypoints={[{ rect: { x: 0, y: 0, w: 1300, h: 760 }, at: 0 }, { rect: { x: 90, y: 0, w: 1210, h: 707 }, at: 174 }]}
      notes={[{ at: 186, rect: { x: 110, y: 20, w: 1060, h: 150 }, kind: "box" }]} />
  ) },
  // FOUR spoken "no"s (release notes 6642 · launch 6684 · LangChain 6724 · Google 6779),
  // payoff STAMP on "nothing suddenly shipped" (6840)
  { key: "noNotes", from: 6626, dur: 282, fullscreen: true, node: (
    <RecapScene durationInFrames={282} kicker="So what shipped that day?" title="JULY 18" accent={AMBER} rows={[
      { at: 16, icon: "cross", title: "No release notes", sub: "" },
      { at: 58, icon: "cross", title: "No product launch", sub: "" },
      { at: 98, icon: "cross", title: "No LangChain announcement", sub: "" },
      { at: 153, icon: "cross", title: "No Google announcement", sub: "" },
    ]} stamp="NOTHING SHIPPED" stampAt={214} />
  ) },
  // "a really good day for a phrase" (7043)
  { key: "goodDay", from: 7011, dur: 120, fullscreen: true, node: (
    <NewsKinetic durationInFrames={120} tint={BRAND} text="A GOOD DAY FOR A PHRASE" highlight="A PHRASE" size={80} />
  ) },

  // ── THE FALSE STAT ──
  // the claim assembles AS he describes it: sources 7511/7542/7573 · +18% 7609 · −85% 7676
  { key: "debunkClaim", from: 7352, dur: 429, fullscreen: true, pip: true, node: (
    <DebunkStatScene durationInFrames={429} sources={["Microsoft", "Stanford", "Anthropic"]} stats={{ up: "+18%", down: "−85%" }} dateChip="JUL 19" dateAt={16} claim={"“GRAPH ENGINEERING REPLACED RAG”"} claimAt={128} sourceAt={159} sourceStagger={31} statAt={257} downStatAt={324} />
  ) },
  // "Turing Post actually checked it" → zoom + box their headline
  { key: "turingpost", from: 7951, dur: 307, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={307} kicker="TURING POST · JUL 21" title="THEY CHECKED IT" tint={RED} fullBleed={false}
      src={`${SHOT}/ge-turingpost.png`} url="turingpost.com" imageW={1796} imageH={960} cardW={1420} cardH={760}
      from={{ x: 0, y: 0, w: 1796, h: 960 }} to={{ x: 0, y: 0, w: 1796, h: 960 }}
      waypoints={[{ rect: { x: 0, y: 0, w: 1796, h: 960 }, at: 0 }, { rect: { x: 30, y: 0, w: 1600, h: 856 }, at: 108 }]}
      notes={[{ at: 62, rect: { x: 50, y: 5, w: 1470, h: 185 }, kind: "box" }]} />
  ) },
  // the verdict: the claim card returns pre-built, DEBUNKED slams (boom)
  { key: "debunkStamp", from: 8258, dur: 161, fullscreen: true, pip: true, node: (
    <DebunkStatScene durationInFrames={161} sources={["Microsoft", "Stanford", "Anthropic"]} stats={{ up: "+18%", down: "−85%" }} dateChip="JUL 19" dateAt={-60} claim={"“GRAPH ENGINEERING REPLACED RAG”"} claimAt={-50} sourceAt={-40} sourceStagger={0} statAt={-30} downStatAt={-20} debunkAt={14} />
  ) },
  // "use that stat in a client presentation" (8419)
  { key: "boardroom", from: 8419, dur: 171, fullscreen: true, node: (
    <KineticClip durationInFrames={171} clip={`${CLIP}/ge-stock-boardroom.mp4`} text="THE CLIENT PITCH" highlight="PITCH" size={92} />
  ) },

  // ── FAKE NUMBER vs VAGUE TERM ── left col on "fake number" 8936, right on "vague term" 9069
  { key: "numVsTerm", from: 8928, dur: 451, fullscreen: true, pip: true, node: (
    <TwoColumnScene durationInFrames={451} kicker="Why this one spread" title="NUMBER vs LABEL" leftTitle="Fake number" leftItems={["Has a source", "You can check it", "It gets falsified"]} rightTitle="Vague term" rightItems={["No fixed meaning", "Nothing to check", "Never quite wrong"]} leftAt={8} leftItemAts={[37, 57, 77]} rightAt={141} rightItemAts={[214, 254, 294]} leftColor={RED} rightColor={AMBER} />
  ) },

  // ── DOCS SEARCH / THREE DEFINITIONS ── rows on Anthropic 9440 / OpenAI 9493 / Google 9542
  { key: "docs", from: 9379, dur: 412, fullscreen: true, pip: true, node: (
    <RecapScene durationInFrames={412} kicker="Try it yourself" title="SEARCH THE DOCS" accent={BLUE} rows={[
      { at: 61, icon: "cross", title: "Anthropic docs", sub: "" },
      { at: 114, icon: "cross", title: "OpenAI docs", sub: "" },
      { at: 163, icon: "cross", title: "Google docs", sub: "" },
    ]} stamp="NOT AN OFFICIAL TERM" stampAt={327} />
  ) },
  // defs on 9991 / 10038 / 10080 · "which one" 10338
  { key: "threeDefs", from: 9979, dur: 421, fullscreen: true, pip: true, node: (
    <ThreeDefsScene durationInFrames={421} ats={[12, 59, 101]} whichAt={359} />
  ) },
  // "people are still publishing takes" (10493) → the real podcast roundtable
  { key: "coverage", from: 10400, dur: 233, fullscreen: true, node: (
    <KineticClip durationInFrames={233} clip={`${CLIP}/ge-langgraph-c.mp4`} clipDur={226} text="EVERYONE'S GOT A TAKE" highlight="TAKE" size={84} textAt={87} source="LangChain" />
  ) },

  // ── RECAP + THE RULE ── rows on technique 10649 / new name 10717 / proof point 10818
  { key: "recap", from: 10633, dur: 365, fullscreen: true, pip: true, node: (
    <RecapScene durationInFrames={365} rows={[
      { at: 16, icon: "check", title: "Real technique", sub: "shipping for years" },
      { at: 84, icon: "warn", title: "New name", sub: "popular for weeks" },
      { at: 185, icon: "cross", title: "False proof point", sub: "failed fact-checking" },
    ]} />
  ) },
  // "who actually shipped it" (11198)
  { key: "whoShips", from: 11178, dur: 118, fullscreen: true, node: (
    <NewsKinetic durationInFrames={118} tint={BRAND} text="WHO ACTUALLY SHIPPED IT?" highlight="SHIPPED IT?" size={80} />
  ) },
  // left = what he says to DO (evaluate 11374 / test 11432 / build 11455 / see 11473);
  // right lands on "tweets (11636), blog posts (11652), commentary (11675)"
  { key: "rule", from: 11296, dur: 566, fullscreen: true, pip: true, node: (
    <TwoColumnScene durationInFrames={566} kicker="The rule" title="EVIDENCE vs COMMENTARY" leftTitle="Real capability" leftItems={["Evaluate it", "Test it", "Build with it", "See what it does"]} leftAt={19} leftItemAts={[78, 136, 159, 177]} rightTitle="Only talk" rightItems={["Tweets", "Blog posts", "Hot takes"]} rightAt={258} rightItemAts={[340, 356, 379]} leftColor={GREEN} rightColor={AMBER} />
  ) },

  // ── ENDING ──
  // "this month (12184) / next month (12209) / the month after (12241)"
  { key: "buzzwords", from: 12130, dur: 157, fullscreen: true, pip: true, node: (
    <BuzzwordFeedScene durationInFrames={157} ats={[54, 79, 111]} />
  ) },
  // "something genuinely new (12438) … an old idea wearing a new name (12482)"
  { key: "closing", from: 12432, dur: 148, fullscreen: true, node: (
    <ClosingScene durationInFrames={148} strikeAt={50} />
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
    <MusicController state="main" from={0} durationInFrames={7352} volume={0.07} duck={[{ from: 296, to: 926 }]} />
    <MusicController state="caveat" from={7352} durationInFrames={2027} volume={0.06} />
    <MusicController state="main" from={9379} durationInFrames={GE_DUR - 9379} volume={0.065} />
    {/* SFX — restrained: soft whoosh on fullscreen starts; bass hit on the debunk stamp */}
    {BEATS.filter((b) => b.fullscreen).map((b, i) => (
      <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.18} rate={vary(i)} />
    ))}
    <SfxCue from={8258 + 14} src={SFX.boom} volume={0.3} />
  </AbsoluteFill>
);
