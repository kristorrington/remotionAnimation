import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { TwoColumnScene } from "./scenes/GraphEngScenes";
import {
  DetectionCardScene, LaunchVsBlogScene, InspectParagraphScene, WordForkScene, KeyBarsScene,
  ParisScene, EcosystemScene, WorldwideScene, SplitLayerScene, SixLabsScene, ContactFlowScene,
  EssayScene, RewriteBreakScene, LifecycleFadeScene, ContextTripleScene, EvidenceStackScene, FinalFlowScene,
} from "./scenes/WatermarkScenes";

// WatermarkVideo — "Claude's Invisible Watermark" cutaway track
// (talking-head-190826.mp4 = the _cut_synced master, 7:29, 13476f @30fps).
// Evidence-first per Kris's two briefs: real receipts (Anthropic blog +
// support doc crops, EU Code page, DeepMind/SynthID, GitHub removal repos,
// Forbes, real Claude Code footage) + conceptual explainers that are clearly
// labelled ILLUSTRATION. Whisper-pinned (captions-190826.ts, from ≈ spoken−6).
// NOTE "not highly robust" beat (9988): receipt shows Anthropic's REAL
// sentence (light editing / complete rewrite) — flagged to Kris, see EDITPLAN.

export const WM_DUR = 13476;

const SHOT = "assets/external/screenshots";
const CLIP = "assets/external/clips";
const RED = "#D8392B";
const GREEN = "#1E9E57";
const AMBER = "#E0A016";
const BLUE = "#2C6BD4";
const BRAND = "#D9502E";

type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── HOOK ── "quietly started watermarking… barely made any noise" (48-215)
  { key: "blogHook", from: 150, dur: 210, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={210} kicker="ANTHROPIC.COM · AUG 14" title="THE ANNOUNCEMENT" tint={BRAND} fullBleed={false}
      src={`${SHOT}/wmc-blog-hero.png`} url="anthropic.com/news" imageW={3840} imageH={2060} cardW={1400} cardH={751}
      from={{ x: 640, y: 120, w: 2560, h: 1373 }} to={{ x: 0, y: 0, w: 3840, h: 2060 }} zoomAt={8} />
  ) },
  // "positive hit sounds pretty damning (497) / Claude wrote this (576) / case closed (619)"
  { key: "detection", from: 473, dur: 164, fullscreen: true, node: (
    <DetectionCardScene durationInFrames={164} ats={[24, 103, 140]} />
  ) },
  // "didn't announce with a keynote (951) … technical blog post (1111)"
  { key: "launchVsBlog", from: 930, dur: 296, fullscreen: true, pip: true, node: (
    <LaunchVsBlogScene durationInFrames={296} ats={[21, 175]} />
  ) },
  // "models launched on or after August 2nd (1320) / older models transitioning (1410) / no announced date (1492)"
  { key: "aug2", from: 1226, dur: 368, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={368} kicker="ANTHROPIC.COM" title="AUG 2 — ON BY DEFAULT" tint={BLUE} fullBleed={false}
      src={`${SHOT}/wmc-blog-oldermodels.png`} url="anthropic.com/news" imageW={3840} imageH={900} cardW={1520} cardH={760}
      from={{ x: 1150, y: 40, w: 1700, h: 850 }} to={{ x: 1050, y: 0, w: 1800, h: 900 }} zoomAt={10}
      notes={[{ at: 100, rect: { x: 1270, y: 160, w: 1300, h: 185 }, kind: "box" }]} />
  ) },
  // "Forbes has already raised concerns… schools… smoking gun" (1600-1852)
  { key: "forbes", from: 1594, dur: 256, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={256} kicker="FORBES · AUG 11" title="THE SCHOOLS WORRY" tint={AMBER} fullBleed={false}
      src={`${SHOT}/wmc-forbes-headline.png`} url="forbes.com" imageW={1920} imageH={820} cardW={1480} cardH={632}
      from={{ x: 130, y: 20, w: 1500, h: 640 }} to={{ x: 0, y: 0, w: 1920, h: 820 }} zoomAt={8}
      notes={[{ at: 40, rect: { x: 165, y: 42, w: 1450, h: 125 }, kind: "box" }]} />
  ) },

  // ── HOW IT WORKS ──
  // "isn't slipping an invisible character (2370) / no hidden tags (2480)"
  { key: "inspect1", from: 2311, dur: 257, fullscreen: true, node: (
    <InspectParagraphScene durationInFrames={257} mode="single" ats={[30, 169]} />
  ) },
  // "grey or overcast (2903) / cold or wintry (2956) / both options make sense (2999)"
  { key: "wordFork", from: 2820, dur: 239, fullscreen: true, pip: true, node: (
    <WordForkScene durationInFrames={239} ats={[57, 116, 179]} />
  ) },
  // "secret key (3110) gently favour (3150) / nothing obvious gets added (3300)"
  { key: "keyBars", from: 3059, dur: 450, fullscreen: true, pip: true, node: (
    <KeyBarsScene durationInFrames={450} ats={[51, 91, 241]} />
  ) },
  // SynthID sequence: DeepMind (3515) → docs → repo. Montage exception: 3 quick receipts.
  { key: "synthDeepmind", from: 3509, dur: 99, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={99} kicker="DEEPMIND.GOOGLE" title="SYNTHID" tint={BLUE} fullBleed={false}
      src={`${SHOT}/wmc-deepmind-hero.png`} url="deepmind.google/blog" imageW={3840} imageH={1700} cardW={1400} cardH={620}
      from={{ x: 200, y: 120, w: 3440, h: 1523 }} to={{ x: 0, y: 0, w: 3840, h: 1700 }} zoomAt={6} />
  ) },
  { key: "synthDocs", from: 3608, dur: 88, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={88} kicker="AI.GOOGLE.DEV" title="HOW SYNTHID WORKS" tint={BLUE} fullBleed={false}
      src={`${SHOT}/wm-synthid-docs.png`} url="ai.google.dev" imageW={1920} imageH={2600} cardW={1180} cardH={700}
      from={{ x: 420, y: 120, w: 1180, h: 700 }} to={{ x: 380, y: 60, w: 1300, h: 771 }} zoomAt={6} />
  ) },
  { key: "synthRepo", from: 3696, dur: 79, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={79} kicker="GITHUB" title="NOT A NEW INVENTION" tint={BLUE} fullBleed={false}
      src={`${SHOT}/wm-synthid-github.png`} url="github.com/google-deepmind/synthid-text" imageW={1920} imageH={2000} cardW={1280} cardH={720}
      from={{ x: 280, y: 100, w: 1400, h: 788 }} to={{ x: 180, y: 0, w: 1560, h: 878 }} zoomAt={6} />
  ) },
  // "Paris is the capital of (3920) / France (4099) / no meaningful fork (4210)"
  { key: "paris", from: 3894, dur: 426, fullscreen: true, pip: true, node: (
    <ParisScene durationInFrames={426} ats={[26, 205, 316, 346]} />
  ) },
  // "compares the randomness… to the digits of pi" (4326-4505)
  { key: "pi", from: 4320, dur: 179, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={179} kicker="ANTHROPIC.COM" title="3.14159265…" tint={BRAND} fullBleed={false}
      src={`${SHOT}/wmc-blog-pi.png`} url="anthropic.com/news" imageW={3840} imageH={1240} cardW={1520} cardH={608}
      from={{ x: 1180, y: 180, w: 1620, h: 648 }} to={{ x: 1080, y: 60, w: 1800, h: 720 }} zoomAt={8}
      notes={[{ at: 60, rect: { x: 1265, y: 620, w: 1360, h: 120 }, kind: "underline" }]} />
  ) },
  // "none of this is visible / read it over and over, looks completely normal" (4505-4813)
  { key: "inspect2", from: 4499, dur: 313, fullscreen: true, node: (
    <InspectParagraphScene durationInFrames={313} mode="pair" ats={[16, 201]} />
  ) },

  // ── WHERE IT RUNS ── surfaces build as named (4948-5341)
  { key: "ecosystem", from: 4942, dur: 393, fullscreen: true, pip: true, node: (
    <EcosystemScene durationInFrames={393} ats={[68, 118, 183, 228, 298, 338, 373]} />
  ) },
  // "carry the watermark worldwide (5460) / no regional switch, no off switch (5500)"
  { key: "worldwide", from: 5335, dur: 258, fullscreen: true, pip: true, node: (
    <WorldwideScene durationInFrames={258} ats={[60, 125, 165]} />
  ) },
  // C2PA ≠ text watermark — REAL Claude Code footage + the blog's C2PA passage
  { key: "c2pa", from: 5760, dur: 340, fullscreen: true, node: (
    <SplitLayerScene durationInFrames={340} clip={`${CLIP}/wm-claudecode-tutorial.mp4`} shot={`${SHOT}/wmc-blog-c2pa-panel.png`} shotW={1800} shotH={1035} slamAt={200} />
  ) },

  // ── WHY ── "Article 50(2)… machine detectable" (6334-6643)
  { key: "euArticle", from: 6328, dur: 309, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={309} kicker="DIGITAL-STRATEGY.EC.EUROPA.EU" title="ARTICLE 50(2)" tint={BLUE} fullBleed={false}
      src={`${SHOT}/wmc-eu-header.png`} url="digital-strategy.ec.europa.eu" imageW={3840} imageH={1500} cardW={1520} cardH={594}
      from={{ x: 420, y: 140, w: 2100, h: 820 }} to={{ x: 200, y: 0, w: 3440, h: 1343 }} zoomAt={10} />
  ) },
  // six signatories (6660-6882) → "one global system" (6920+)
  { key: "sixLabs", from: 6637, dur: 553, fullscreen: true, pip: true, node: (
    <SixLabsScene durationInFrames={553} labAts={[23, 83, 123, 153, 193, 229]} globalAt={283} />
  ) },

  // ── THE PAYOFF ── "passed through Claude (7700) ≠ wrote all of it (7790)"
  { key: "contactFlow", from: 7642, dur: 212, fullscreen: true, node: (
    <ContactFlowScene durationInFrames={212} mode="flow" ats={[10, 106, 148]} />
  ) },
  // write/proofread(7943)/translate(7996)/summarise(8047) → same signal (8210)
  { key: "verbs", from: 7854, dur: 398, fullscreen: true, pip: true, node: (
    <ContactFlowScene durationInFrames={398} mode="verbs" ats={[20, 89, 142, 193, 356]} />
  ) },
  // student essay (8300) → grammar (8395) → detected (8520) → "NO." (8560)
  { key: "essay", from: 8252, dur: 372, fullscreen: true, pip: true, node: (
    <EssayScene durationInFrames={372} ats={[48, 143, 268, 308]} />
  ) },
  // "no user ID / org ID / conversation (8807-8916) / trace back (8987)" — Anthropic's own words
  { key: "noId", from: 8756, dur: 327, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={327} kicker="ANTHROPIC.COM" title="NO USER ID · NO ORG ID" tint={GREEN} fullBleed={false}
      src={`${SHOT}/wmc-blog-traced.png`} url="anthropic.com/news" imageW={3840} imageH={1000} cardW={1520} cardH={608}
      from={{ x: 1180, y: 60, w: 1660, h: 664 }} to={{ x: 1080, y: 0, w: 1800, h: 720 }} zoomAt={10}
      notes={[{ at: 66, rect: { x: 1140, y: 100, w: 1580, h: 210 }, kind: "box" }]} />
  ) },
  // "can't inspect the sentence yourself / looks like normal writing" (9117-9337)
  { key: "inspect3", from: 9083, dur: 242, fullscreen: true, node: (
    <InspectParagraphScene durationInFrames={242} mode="scan" ats={[30, 170]} />
  ) },

  // ── THE WEAKNESS ── real repos (9583+), commit dates days after the blog
  { key: "ghCleaner", from: 9521, dur: 129, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={129} kicker="GITHUB" title="REMOVAL TOOLS, ALREADY" tint={RED} fullBleed={false}
      src={`${SHOT}/wm-github-cleaner.png`} url="github.com/mikiane/claude-watermark-cleaner" imageW={1920} imageH={2000} cardW={1280} cardH={720}
      from={{ x: 280, y: 90, w: 1400, h: 788 }} to={{ x: 180, y: 0, w: 1560, h: 878 }} zoomAt={6} />
  ) },
  { key: "ghCommits", from: 9650, dur: 110, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={110} kicker="COMMIT HISTORY" title="DAYS AFTER THE BLOG" tint={RED} fullBleed={false}
      src={`${SHOT}/wm-github-cleaner-commits.png`} url="github.com/mikiane/claude-watermark-cleaner/commits" imageW={1920} imageH={2000} cardW={1480} cardH={432}
      from={{ x: 130, y: 180, w: 1340, h: 391 }} to={{ x: 0, y: 0, w: 1920, h: 560 }} zoomAt={8}
      notes={[{ at: 40, rect: { x: 170, y: 315, w: 680, h: 110 }, kind: "box" }]} />
  ) },
  // "another model rewrite it (9830) … break the signal (9866)"
  { key: "rewriteBreak", from: 9760, dur: 228, fullscreen: true, node: (
    <RewriteBreakScene durationInFrames={228} ats={[14, 50, 76, 106]} />
  ) },
  // "Anthropic is actually upfront… 'not highly robust'" — receipt shows the REAL sentence
  { key: "upfront", from: 9988, dur: 262, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={262} kicker="ANTHROPIC.COM · THEIR OWN WORDS" title="A REWRITE REMOVES IT" tint={RED} fullBleed={false}
      src={`${SHOT}/wmc-blog-cantedit.png`} url="anthropic.com/news" imageW={3840} imageH={1080} cardW={1520} cardH={608}
      from={{ x: 1180, y: 120, w: 1660, h: 664 }} to={{ x: 1080, y: 20, w: 1800, h: 720 }} zoomAt={10}
      notes={[{ at: 92, rect: { x: 1140, y: 135, w: 1620, h: 103 }, kind: "box" }]} />
  ) },

  // ── WHAT IT WAS BUILT FOR ── backlash (10580-10788)
  { key: "forbes2", from: 10568, dur: 220, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={220} kicker="FORBES" title="THE BACKLASH" tint={AMBER} fullBleed={false}
      src={`${SHOT}/wmc-forbes-keyfacts.png`} url="forbes.com" imageW={1920} imageH={1000} cardW={1480} cardH={540}
      from={{ x: 140, y: 750, w: 1400, h: 240 }} to={{ x: 0, y: 300, w: 1920, h: 700 }} zoomAt={10}
      notes={[{ at: 170, rect: { x: 150, y: 800, w: 1370, h: 95 }, kind: "box" }]} />
  ) },
  // EU recall: "machine detectable when produced" (10976-11164)
  { key: "euRecall", from: 10970, dur: 194, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={194} kicker="EU CODE OF PRACTICE" title="AT PRODUCTION — THAT'S ALL" tint={BLUE} fullBleed={false}
      src={`${SHOT}/wmc-eu-chapters.png`} url="digital-strategy.ec.europa.eu" imageW={3840} imageH={1700} cardW={1400} cardH={620}
      from={{ x: 300, y: 200, w: 2600, h: 1151 }} to={{ x: 120, y: 60, w: 3540, h: 1567 }} zoomAt={8} />
  ) },
  // "doesn't require the signal to survive every edit…" (11164-11400)
  { key: "lifecycle", from: 11158, dur: 236, fullscreen: true, pip: true, node: (
    <LifecycleFadeScene durationInFrames={236} ats={[12, 62, 106, 142, 172]} />
  ) },
  // "cleared a compliance requirement ≠ tamper-proof authorship" (11400-11707)
  { key: "compliance", from: 11394, dur: 306, fullscreen: true, pip: true, node: (
    <TwoColumnScene durationInFrames={306} kicker="What was actually achieved" title="CLEARED vs CREATED" leftTitle="Compliance ✓" leftItems={["Article 50(2) satisfied", "Detectable at output"]} rightTitle="Authorship proof ✕" rightItems={["Not tamper-proof", "A rewrite breaks it"]} leftAt={66} rightAt={166} leftColor={GREEN} rightColor={RED} />
  ) },

  // ── TAKEAWAY ── (11700-12250 face-only w/ captions) then stakes + evidence
  { key: "contextTriple", from: 12250, dur: 270, fullscreen: true, node: (
    <ContextTripleScene durationInFrames={270} ats={[50, 120, 200]} />
  ) },
  // "draft history (12545) / account records (12600) / another source (12655) / one signal (12770)"
  { key: "evidenceStack", from: 12520, dur: 343, fullscreen: true, pip: true, node: (
    <EvidenceStackScene durationInFrames={343} ats={[10, 25, 80, 135]} compareAt={250} />
  ) },
  // "it tells you Claude touched the text" (13052-13157)
  { key: "finalFlow", from: 13040, dur: 114, fullscreen: true, node: (
    <FinalFlowScene durationInFrames={114} />
  ) },
];

export const WM_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const WM_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const WM_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);
export const WM_PIP: { from: number; to: number }[] = BEATS.filter((b) => b.pip).map((b) => ({ from: b.from, to: b.from + b.dur }));

const OUTRO_FROM = 13250;

export const WatermarkVisuals: React.FC = () => (
  <ThemeProvider style="paper">
    <AbsoluteFill>
      {BEATS.map((b) => (
        <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={30}>
          {b.node}
        </Sequence>
      ))}
      <Sequence from={OUTRO_FROM} durationInFrames={WM_DUR - OUTRO_FROM} premountFor={30}>
        <Fable5Outro durationInFrames={WM_DUR - OUTRO_FROM} kicker="AI NEWS WITHOUT THE HYPE" tag="Automation Vault · free n8n workflows · link in bio. Subscribe." />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);

export const WatermarkVideo: React.FC = () => (
  <AbsoluteFill>
    <WatermarkVisuals />
    {/* MUSIC — understated documentary: steady open, tense through the
        weakness/backlash stretch, resolve for the takeaway */}
    <MusicController state="main" from={0} durationInFrames={9331} volume={0.06} duck={[{ from: 473, to: 637 }, { from: 9988, to: 10250 }]} />
    <MusicController state="caveat" from={9331} durationInFrames={2369} volume={0.055} />
    <MusicController state="main" from={11700} durationInFrames={WM_DUR - 11700} volume={0.055} />
    {/* SFX — restrained: soft whoosh on fullscreen starts, one stamp on CASE
        CLOSED, quiet ticks as the evidence cards land */}
    {BEATS.filter((b) => b.fullscreen).map((b, i) => (
      <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.15} rate={vary(i)} />
    ))}
    <SfxCue from={473 + 140} src={SFX.clickPop} volume={0.22} />
    {[12530, 12600, 12655].map((f, i) => (
      <SfxCue key={`tick-${f}`} from={f} src={SFX.pageTurn} volume={0.12} rate={vary(i)} />
    ))}
  </AbsoluteFill>
);
