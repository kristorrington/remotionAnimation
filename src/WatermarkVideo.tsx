import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import {
  DetectionCardScene, LaunchVsBlogScene, InspectParagraphScene, WordForkScene, KeyBarsScene,
  ParisScene, EcosystemScene, WorldwideScene, SplitLayerScene, SixLabsScene, ContactFlowScene,
  EssayScene, RewriteBreakScene, LifecycleFadeScene, ComplianceScene, ContextTripleScene,
  EvidenceStackScene, FinalFlowScene, EvidenceScene,
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

type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── HOOK ── "quietly started watermarking… barely made any noise" (48-215)
  { key: "blogHook", from: 150, dur: 210, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={210} source="Anthropic" title="Aug 14, 2026"
      src={`${SHOT}/wmc-blog-hero.png`} imageW={3840} imageH={2060}
      from={{ x: 640, y: 120, w: 2560, h: 1373 }} to={{ x: 0, y: 0, w: 3840, h: 2060 }} zoomAt={8} viewW={1560} viewH={836} />
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
    <EvidenceScene durationInFrames={368} source="Anthropic" title="On by default since Aug 2"
      src={`${SHOT}/wmc-blog-oldermodels.png`} imageW={3840} imageH={900}
      from={{ x: 1150, y: 40, w: 1700, h: 850 }} to={{ x: 1050, y: 0, w: 1800, h: 900 }} zoomAt={10} viewW={1560} viewH={780}
      notes={[{ at: 100, rect: { x: 1270, y: 160, w: 1300, h: 185 }, kind: "wash" }]} />
  ) },
  // "Forbes has already raised concerns… schools… smoking gun" (1600-1852)
  { key: "forbes", from: 1594, dur: 256, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={256} source="Forbes" title="Aug 11, 2026"
      src={`${SHOT}/wmc-forbes-headline.png`} imageW={1920} imageH={820}
      from={{ x: 130, y: 0, w: 1500, h: 640 }} to={{ x: 0, y: 0, w: 1920, h: 820 }} zoomAt={8} viewW={1640} viewH={700}
      notes={[{ at: 40, rect: { x: 300, y: 20, w: 1020, h: 118 }, kind: "wash" }]} />
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
    <KeyBarsScene durationInFrames={450} ats={[10, 91, 241]} />
  ) },
  // SynthID sequence: DeepMind (3515) → docs → repo. Montage exception: 3 quick receipts.
  { key: "synthDeepmind", from: 3509, dur: 99, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={99} source="Google DeepMind" title="SynthID, 2024"
      src={`${SHOT}/wmc-deepmind-hero.png`} imageW={3840} imageH={1700}
      from={{ x: 200, y: 120, w: 3440, h: 1523 }} to={{ x: 0, y: 0, w: 3840, h: 1700 }} zoomAt={6} viewW={1640} viewH={726} />
  ) },
  { key: "synthDocs", from: 3608, dur: 88, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={88} source="ai.google.dev" title="How SynthID works"
      src={`${SHOT}/wm-synthid-docs.png`} imageW={1920} imageH={2600}
      from={{ x: 420, y: 120, w: 1180, h: 700 }} to={{ x: 380, y: 60, w: 1300, h: 771 }} zoomAt={6} viewW={1400} viewH={830} />
  ) },
  { key: "synthRepo", from: 3696, dur: 79, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={79} source="GitHub" title="google-deepmind/synthid-text"
      src={`${SHOT}/wm-synthid-github.png`} imageW={1920} imageH={2000}
      from={{ x: 280, y: 100, w: 1400, h: 788 }} to={{ x: 180, y: 0, w: 1560, h: 878 }} zoomAt={6} viewW={1500} viewH={845} />
  ) },
  // "Paris is the capital of (3920) / France (4099) / no meaningful fork (4210)"
  { key: "paris", from: 3894, dur: 426, fullscreen: true, pip: true, node: (
    <ParisScene durationInFrames={426} ats={[26, 205, 316, 346]} />
  ) },
  // "compares the randomness… to the digits of pi" (4326-4505)
  { key: "pi", from: 4320, dur: 179, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={179} source="Anthropic" title="3.14159265…"
      src={`${SHOT}/wmc-blog-pi.png`} imageW={3840} imageH={1240}
      from={{ x: 1180, y: 180, w: 1620, h: 648 }} to={{ x: 1080, y: 60, w: 1800, h: 720 }} zoomAt={8} viewW={1600} viewH={640}
      notes={[{ at: 60, rect: { x: 1265, y: 620, w: 1360, h: 100 }, kind: "underline" }]} />
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
    <SplitLayerScene durationInFrames={340} clip={`${CLIP}/wm-claudecode-tutorial.mp4`} shot={`${SHOT}/wmc-blog-c2pa-panel.png`} slamAt={200} />
  ) },

  // ── WHY ── "Article 50(2)… machine detectable" (6334-6643)
  { key: "euArticle", from: 6328, dur: 309, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={309} source="European Commission" title="Article 50(2)"
      src={`${SHOT}/wmc-eu-header.png`} imageW={3840} imageH={1500}
      from={{ x: 420, y: 140, w: 2100, h: 820 }} to={{ x: 200, y: 0, w: 3440, h: 1343 }} zoomAt={10} viewW={1640} viewH={640} />
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
    <EvidenceScene durationInFrames={327} source="Anthropic" title="No user ID · no org ID"
      src={`${SHOT}/wmc-blog-traced.png`} imageW={3840} imageH={1000}
      from={{ x: 1180, y: 60, w: 1660, h: 664 }} to={{ x: 1080, y: 0, w: 1800, h: 720 }} zoomAt={10} viewW={1600} viewH={640}
      notes={[{ at: 66, rect: { x: 1140, y: 100, w: 1580, h: 210 }, kind: "wash" }]} />
  ) },
  // "can't inspect the sentence yourself / looks like normal writing" (9117-9337)
  { key: "inspect3", from: 9083, dur: 242, fullscreen: true, node: (
    <InspectParagraphScene durationInFrames={242} mode="scan" ats={[30, 170]} />
  ) },

  // ── THE WEAKNESS ── real repos (9583+), commit dates days after the blog
  { key: "ghCleaner", from: 9521, dur: 129, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={129} source="GitHub" title="Removal tools, already"
      src={`${SHOT}/wm-github-cleaner.png`} imageW={1920} imageH={2000}
      from={{ x: 280, y: 90, w: 1400, h: 788 }} to={{ x: 180, y: 0, w: 1560, h: 878 }} zoomAt={6} viewW={1500} viewH={845} />
  ) },
  { key: "ghCommits", from: 9650, dur: 110, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={110} source="GitHub" title="Commits — days after the blog"
      src={`${SHOT}/wm-github-cleaner-commits.png`} imageW={1920} imageH={2000}
      from={{ x: 130, y: 180, w: 1340, h: 391 }} to={{ x: 0, y: 0, w: 1920, h: 560 }} zoomAt={8} viewW={1700} viewH={496}
      notes={[{ at: 40, rect: { x: 170, y: 315, w: 680, h: 110 }, kind: "wash" }]} />
  ) },
  // "another model rewrite it (9830) … break the signal (9866)"
  { key: "rewriteBreak", from: 9760, dur: 228, fullscreen: true, node: (
    <RewriteBreakScene durationInFrames={228} ats={[14, 50, 76, 106]} />
  ) },
  // "Anthropic is actually upfront… 'not highly robust'" — receipt shows the REAL sentence
  { key: "upfront", from: 9988, dur: 262, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={262} source="Anthropic" title="Their own words"
      src={`${SHOT}/wmc-blog-cantedit.png`} imageW={3840} imageH={1080}
      from={{ x: 1180, y: 120, w: 1660, h: 664 }} to={{ x: 1080, y: 20, w: 1800, h: 720 }} zoomAt={10} viewW={1600} viewH={640}
      notes={[{ at: 92, rect: { x: 1140, y: 135, w: 1620, h: 103 }, kind: "wash" }]} />
  ) },

  // ── WHAT IT WAS BUILT FOR ── backlash (10580-10788)
  { key: "forbes2", from: 10568, dur: 220, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={220} source="Forbes" title="The backlash"
      src={`${SHOT}/wmc-forbes-keyfacts.png`} imageW={1920} imageH={1000}
      from={{ x: 140, y: 750, w: 1400, h: 240 }} to={{ x: 0, y: 300, w: 1920, h: 700 }} zoomAt={10} viewW={1680} viewH={613}
      notes={[{ at: 170, rect: { x: 150, y: 800, w: 1370, h: 95 }, kind: "wash" }]} />
  ) },
  // EU recall: "machine detectable when produced" (10976-11164)
  { key: "euRecall", from: 10970, dur: 194, receipt: true, pip: true, node: (
    <EvidenceScene durationInFrames={194} source="European Commission" title="Detectable at production — that's all"
      src={`${SHOT}/wmc-eu-chapters.png`} imageW={3840} imageH={1700}
      from={{ x: 300, y: 200, w: 2600, h: 1151 }} to={{ x: 120, y: 60, w: 3540, h: 1567 }} zoomAt={8} viewW={1640} viewH={726} />
  ) },
  // "doesn't require the signal to survive every edit…" (11164-11400)
  { key: "lifecycle", from: 11158, dur: 236, fullscreen: true, pip: true, node: (
    <LifecycleFadeScene durationInFrames={236} ats={[12, 62, 106, 142, 172]} />
  ) },
  // "cleared a compliance requirement ≠ tamper-proof authorship" (11400-11707)
  { key: "compliance", from: 11394, dur: 306, fullscreen: true, pip: true, node: (
    <ComplianceScene durationInFrames={306} leftAt={66} rightAt={166} />
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
  <ThemeProvider style="cinematic">
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
    {/* MUSIC — 5-section arc (Kris's sound brief): S1 tension open · S2 curious
        (calm bed) through the explainer · S3 energy returns for the payoff ·
        S4 strongest through the weakness · S5 restrained takeaway → CTA lift.
        Deep duck windows = the mini music DROPS before the big lines. */}
    <MusicController state="main" from={0} durationInFrames={2311} volume={0.075} fadeOutFrames={40} duck={[{ from: 473, to: 660 }]} duckTo={0.12} />
    <MusicController state="caveat" from={2311} durationInFrames={4993} volume={0.068} fadeInFrames={40} fadeOutFrames={40} />
    <MusicController state="main" from={7304} durationInFrames={2033} volume={0.072} startFrom={1200} fadeInFrames={40} fadeOutFrames={8} duck={[{ from: 7560, to: 7660 }]} duckTo={0.25} />
    <MusicController state="main" from={9337} durationInFrames={2363} volume={0.082} startFrom={1800} fadeInFrames={8} fadeOutFrames={60} duck={[{ from: 9988, to: 10280 }]} duckTo={0.1} />
    <MusicController state="caveat" from={11700} durationInFrames={1541} volume={0.05} fadeInFrames={50} fadeOutFrames={40} startFrom={4000} duck={[{ from: 12875, to: 13100 }]} duckTo={0.1} />
    <MusicController state="caveat" from={13241} durationInFrames={WM_DUR - 13241} volume={0.078} fadeInFrames={30} startFrom={5600} />

    {/* SFX — one felt moment every ~8-15s, one consistent digital family,
        rate-varied so repeats never read identical. Voice stays dominant. */}
    {BEATS.filter((b) => b.fullscreen).map((b, i) => (
      <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.15} rate={vary(i)} />
    ))}
    {/* hook: article reveal + conceptual detection */}
    <SfxCue from={150} src={SFX.softWhoosh} volume={0.13} />
    <SfxCue from={164} src={SFX.click} volume={0.09} />
    <SfxCue from={560} src={SFX.shutter} volume={0.1} />
    <SfxCue from={473 + 140} src={SFX.clickPop} volume={0.22} />
    {/* word forks + key nudge + clean-back */}
    <SfxCue from={2911} src={SFX.tick} volume={0.09} />
    <SfxCue from={2972} src={SFX.tick} volume={0.08} rate={vary(1)} />
    <SfxCue from={3150} src={SFX.clickPop} volume={0.09} />
    <SfxCue from={3305} src={SFX.swish} volume={0.08} />
    {/* Paris: typing → confirmation */}
    <SfxCue from={3920} src={SFX.tick} volume={0.06} />
    <SfxCue from={3944} src={SFX.tick} volume={0.06} rate={vary(2)} />
    <SfxCue from={4105} src={SFX.clickPop} volume={0.1} />
    <SfxCue from={4340} src={SFX.tick} volume={0.05} rate={vary(3)} />
    {/* ecosystem chips (alternate, never all seven) */}
    <SfxCue from={5010} src={SFX.click} volume={0.08} />
    <SfxCue from={5125} src={SFX.tick} volume={0.07} />
    <SfxCue from={5240} src={SFX.click} volume={0.08} rate={vary(1)} />
    <SfxCue from={5315} src={SFX.tick} volume={0.07} rate={vary(2)} />
    {/* EU document reveal + signatory ticks */}
    <SfxCue from={6334} src={SFX.pageTurn} volume={0.15} />
    <SfxCue from={6660} src={SFX.tick} volume={0.07} />
    <SfxCue from={6760} src={SFX.tick} volume={0.07} rate={vary(1)} />
    <SfxCue from={6830} src={SFX.tick} volume={0.07} rate={vary(2)} />
    {/* payoff flow: processing → detection */}
    <SfxCue from={7690} src={SFX.shutter} volume={0.09} />
    <SfxCue from={7755} src={SFX.clickPop} volume={0.11} />
    {/* verbs → SAME SIGNAL */}
    <SfxCue from={7874} src={SFX.click} volume={0.07} />
    <SfxCue from={7996} src={SFX.tick} volume={0.07} rate={vary(1)} />
    <SfxCue from={8047} src={SFX.click} volume={0.07} rate={vary(2)} />
    <SfxCue from={8215} src={SFX.thud} volume={0.16} />
    {/* student essay: type → process → detect → NO. */}
    <SfxCue from={8300} src={SFX.tick} volume={0.07} />
    <SfxCue from={8400} src={SFX.shutter} volume={0.08} rate={vary(1)} />
    <SfxCue from={8525} src={SFX.clickPop} volume={0.1} rate={vary(1)} />
    <SfxCue from={8578} src={SFX.thud} volume={0.14} rate={vary(1)} />
    {/* no-ID crosses */}
    <SfxCue from={8810} src={SFX.tick} volume={0.06} />
    <SfxCue from={8868} src={SFX.tick} volume={0.06} rate={vary(1)} />
    <SfxCue from={8924} src={SFX.tick} volume={0.06} rate={vary(2)} />
    {/* github + rewrite-breaks-it sequence */}
    <SfxCue from={9533} src={SFX.click} volume={0.09} />
    <SfxCue from={9662} src={SFX.click} volume={0.08} rate={vary(1)} />
    <SfxCue from={9780} src={SFX.swish} volume={0.08} rate={vary(1)} />
    <SfxCue from={9815} src={SFX.shutter} volume={0.08} rate={vary(2)} />
    <SfxCue from={9842} src={SFX.swish} volume={0.07} rate={vary(2)} />
    <SfxCue from={9868} src={SFX.switch} volume={0.12} />
    {/* "their own words" — music is near-silent here; one restrained impact */}
    <SfxCue from={10085} src={SFX.boom} volume={0.12} />
    {/* compliance ✓ / ✕ */}
    <SfxCue from={11465} src={SFX.clickPop} volume={0.1} />
    <SfxCue from={11565} src={SFX.tick} volume={0.08} rate={vary(1)} />
    <SfxCue from={11336} src={SFX.tick} volume={0.06} rate={vary(3)} />
    {/* evidence stack builds → the combined case lands */}
    {[12530, 12600, 12655].map((f, i) => (
      <SfxCue key={`tick-${f}`} from={f} src={SFX.tick} volume={0.1} rate={vary(i)} />
    ))}
    <SfxCue from={12790} src={SFX.thud} volume={0.13} rate={vary(2)} />
    {/* final flow only — "catching ≠ cheating" stays clean, no SFX */}
    <SfxCue from={13070} src={SFX.shutter} volume={0.07} rate={vary(3)} />
    {/* key receipt settles */}
    <SfxCue from={1240} src={SFX.shutter} volume={0.07} rate={vary(1)} />
    <SfxCue from={1608} src={SFX.shutter} volume={0.07} rate={vary(2)} />
    <SfxCue from={7965} src={SFX.shutter} volume={0.07} rate={vary(3)} />
    <SfxCue from={10002} src={SFX.shutter} volume={0.07} />
  </AbsoluteFill>
);
