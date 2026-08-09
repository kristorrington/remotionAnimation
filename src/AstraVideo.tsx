import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic } from "./scenes/AiNews2Scenes";
import { ClipTakeaway, MissingProofScene } from "./scenes/GemRoboticsScenes";
import { LeanGateScene, TenGridScene, Counter27Scene, TwoChecksScene, TwoSignalsScene, TwoPathScene, RuleScene } from "./scenes/AstraScenes";

// AstraVideo — the Astra ten-proofs fact-check (~5m29s, 9864f @ 30fps, natural
// speed). RECEIPT-DRIVEN: the OpenAI Aug 1 post, the May Erdős post, the arXiv
// paper, tweets and reporting pages carry the evidence full-bleed; the official
// OpenAI Podcast (Ep. 20) clips carry the film-card beats; native scenes cover
// the Lean gate, the ten-problem grid, 27-vs-80, the mis-hung headline, the
// two-signal split, the system-card fork and the closing rule. Whisper-pinned
// to captions-090826.ts. OPEN: FACE full-frame, first receipt cuts in at ~242.

export const ASTRA_DUR = 9864;

const AMBER = NEWS.amber;
const RED = NEWS.red;
const BLUE = NEWS.blue;
const GREEN = NEWS.green;
const BRAND = NEWS.brand;
const SHOT = "assets/external/screenshots";
const CLIPS = "assets/external/clips";

type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE POST (hook) ──
  { key: "hookReceipt", from: 242, dur: 198, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={198} kicker="OPENAI.COM · AUG 1" title="THE POST EVERYONE SCREENSHOTTED" tint={BLUE}
      src={`${SHOT}/astra-ten-advances-wide.png`} url="openai.com/index/ten-advances-in-mathematics" imageW={3840} imageH={2052}
      from={{ x: 154, y: 82, w: 3532, h: 1888 }} to={{ x: 1049, y: 287, w: 1744, h: 932 }} zoomAt={20} titlePos="left" titleTop={330} />
  ) },
  { key: "ricTweet", from: 520, dur: 260, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={260} kicker="THE CLAIM, SPREADING" title="SAME PARAGRAPH, EVERY REPOST" tint={AMBER} fullBleed={false}
      src={`${SHOT}/astra-tweet-ric.png`} url="x.com" imageW={1100} imageH={640}
      cardW={1160} cardH={675} from={{ x: 40, y: 40, w: 1020, h: 560 }} to={{ x: 0, y: 0, w: 1100, h: 640 }} zoomAt={16}
      notes={[{ at: 130, rect: { x: 33, y: 440, w: 990, h: 95 }, kind: "underline" }]} />
  ) },
  { key: "shippedKinetic", from: 1071, dur: 164, fullscreen: true, node: (
    <NewsKinetic durationInFrames={164} tint={BLUE} text="WHAT ACTUALLY SHIPPED" highlight="SHIPPED" size={100} />
  ) },

  // ── THE PROOF ──
  { key: "manuscript249", from: 1395, dur: 235, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={235} tint={BLUE} kicker="Dropped the same day — no tease" title="249 PAGES" stamp="Machine-checked, all of it" stampAt={130} titleSize={110} clip={`${CLIPS}/astra-pod-a.mp4`} clipDur={450} />
  ) },
  { key: "leanGate", from: 1630, dur: 370, fullscreen: true, pip: true, node: (
    <LeanGateScene durationInFrames={370} passAts={[140, 205, 270]} tagAt={9999} />
  ) },
  { key: "leanTalk", from: 2000, dur: 325, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={325} tint={GREEN} kicker="It re-derives every logical step" title="CAN'T BE SWEET-TALKED" stamp="Approved = proven" stampAt={169} titleSize={74} clip={`${CLIPS}/astra-pod-b.mp4`} clipDur={390} />
  ) },
  { key: "tenGrid", from: 2325, dur: 335, fullscreen: true, pip: true, node: (
    <TenGridScene durationInFrames={335} startAt={15} fieldAts={[15, 110, 163]} checkAt={230} />
  ) },
  { key: "arxivReceipt", from: 2660, dur: 367, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={367} kicker="ARXIV · 2605.20695" title="A FIELDS MEDALIST ON THE PAPER" tint={GREEN}
      src={`${SHOT}/astra-arxiv-wide.png`} url="arxiv.org/abs/2605.20695" imageW={3840} imageH={2160}
      from={{ x: 0, y: 0, w: 3840, h: 2160 }} to={{ x: 0, y: 140, w: 2200, h: 1176 }} zoomAt={24} titlePos="right"
      notes={[{ at: 135, rect: { x: 460, y: 288, w: 210, h: 54 }, kind: "box" }]} />
  ) },

  // ── THE WRONG NUMBER ──
  { key: "eightyKinetic", from: 3369, dur: 150, fullscreen: true, node: (
    <NewsKinetic durationInFrames={150} tint={RED} text="AN 80-YEAR-OLD PROBLEM?" highlight="80-YEAR-OLD" size={92} />
  ) },
  { key: "nonsoficReceipt", from: 3519, dur: 270, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={270} kicker="THE ACTUAL LIST" title="THE HARDEST ONE IN THE BATCH" tint={RED} fullBleed={false}
      src={`${SHOT}/astra-ten-results.png`} url="openai.com/index/ten-advances-in-mathematics" imageW={1500} imageH={2070}
      cardW={1400} cardH={700} from={{ x: 50, y: 30, w: 1400, h: 700 }} to={{ x: 80, y: 700, w: 1340, h: 670 }} zoomAt={35}
      notes={[{ at: 150, rect: { x: 115, y: 885, w: 1265, h: 100 }, kind: "underline" }]} />
  ) },
  { key: "counter27", from: 3789, dur: 145, fullscreen: true, node: (
    <Counter27Scene durationInFrames={145} slamAt={16} strikeAt={62} />
  ) },
  { key: "mayReceipt", from: 3934, dur: 386, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={386} kicker="OPENAI.COM · MAY 20" title="THE REAL 80-YEAR RESULT" tint={GREEN}
      src={`${SHOT}/astra-may-erdos-wide.png`} url="openai.com/index/model-disproves-discrete-geometry-conjecture" imageW={3840} imageH={2052}
      from={{ x: 154, y: 82, w: 3532, h: 1888 }} to={{ x: 1011, y: 287, w: 1822, h: 974 }} zoomAt={24} titlePos="left"
      notes={[{ at: 238, rect: { x: 1676, y: 307, w: 185, h: 35 }, kind: "box" }]} />
  ) },
  { key: "gowersAgain", from: 4320, dur: 200, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={200} tint={GREEN} kicker="Same setup, same co-author" title="GOWERS. AGAIN." stamp="arXiv paper №2" stampAt={80} titleSize={92} clip={`${CLIPS}/astra-pod-c.mp4`} clipDur={360} />
  ) },
  { key: "versionsKinetic", from: 4520, dur: 180, fullscreen: true, node: (
    <NewsKinetic durationInFrames={180} tint={AMBER} text="THE MILESTONE SHIPPED TWO VERSIONS EARLIER" highlight="EARLIER" size={72} />
  ) },
  { key: "twoChecks", from: 4700, dur: 310, fullscreen: true, pip: true, node: (
    <TwoChecksScene durationInFrames={310} leftAt={20} rightAt={70} hopAt={229} />
  ) },
  { key: "sloppy", from: 5010, dur: 280, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={280} tint={AMBER} kicker="A checkable number, wrong" title="HOW CAREFUL WAS THE REST?" stamp="Check the checkable first" stampAt={170} titleSize={68} clip={`${CLIPS}/astra-pod-a.mp4`} clipDur={450} />
  ) },

  // ── TWO STORIES ──
  { key: "officialTweet", from: 5554, dur: 284, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={284} kicker="OPENAI RESEARCHER · AUG 1" title="OFFICIAL — ON THE RECORD" tint={GREEN} fullBleed={false}
      src={`${SHOT}/astra-tweet-noam.png`} url="x.com/polynoamial" imageW={1100} imageH={1490}
      cardW={580} cardH={760} from={{ x: 0, y: 0, w: 1100, h: 1490 }} to={{ x: 20, y: 60, w: 1060, h: 1400 }} zoomAt={20}
      notes={[{ at: 66, rect: { x: 35, y: 145, w: 1020, h: 300 }, kind: "underline" }]} />
  ) },
  { key: "missingDocs", from: 5838, dur: 234, fullscreen: true, pip: true, node: (
    <MissingProofScene durationInFrames={234} tint={AMBER} kicker="But that's all there is" title="STILL MISSING" clip={`${CLIPS}/astra-pod-b.mp4`} clipDur={390} items={[
      { at: 6, label: "System card" },
      { at: 62, label: "Model page" },
      { at: 142, label: "A confirmed flagship link" },
    ]} />
  ) },
  { key: "briefingReceipt", from: 6072, dur: 382, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={382} kicker="THE-DECODER · REPORTING" title="THE BRIEFING STORY" tint={AMBER}
      src={`${SHOT}/astra-decoder-wide.png`} url="the-decoder.com" imageW={3200} imageH={1710}
      from={{ x: 128, y: 68, w: 2944, h: 1573 }} to={{ x: 477, y: 299, w: 1350, h: 721 }} zoomAt={24} titlePos="right"
      notes={[{ at: 190, rect: { x: 557, y: 379, w: 1190, h: 215 }, kind: "underline" }]} />
  ) },
  { key: "twoSignals", from: 6454, dur: 406, fullscreen: true, pip: true, node: (
    <TwoSignalsScene durationInFrames={406} leftAt={70} rightAt={198} />
  ) },
  { key: "capability", from: 6860, dur: 270, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={270} tint={GREEN} kicker="Ten solved theorems" title="A CAPABILITY SIGNAL" stamp="Strong — somewhere" stampAt={120} titleSize={80} clip={`${CLIPS}/astra-pod-c.mp4`} clipDur={360} />
  ) },
  { key: "stakes", from: 7130, dur: 304, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={304} tint={AMBER} kicker="The briefing — if it's accurate" title="A STAKES SIGNAL" stamp="Reaches hiring & rollouts" stampAt={48} titleSize={80} clip={`${CLIPS}/astra-pod-b.mp4`} clipDur={390} />
  ) },
  { key: "codebaseKinetic", from: 7434, dur: 136, fullscreen: true, node: (
    <NewsKinetic durationInFrames={136} tint={BRAND} text="10 THEOREMS ≠ YOUR CODEBASE" highlight="CODEBASE" size={84} />
  ) },
  { key: "pymntsReceipt", from: 7686, dur: 374, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={374} kicker="PYMNTS · REPORTING" title="NOT ONE PUBLISHED STATEMENT" tint={RED}
      src={`${SHOT}/astra-pymnts-wide.png`} url="pymnts.com" imageW={2943} imageH={1573}
      from={{ x: 118, y: 63, w: 2707, h: 1447 }} to={{ x: 180, y: 60, w: 1810, h: 967 }} zoomAt={24} titlePos="right" titleTop={430}
      notes={[{ at: 126, rect: { x: 243, y: 100, w: 1690, h: 172 }, kind: "underline" }]} />
  ) },

  // ── THE TEST ──
  { key: "systemCard", from: 8060, dur: 340, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={340} tint={BLUE} kicker="One document ends the guessing" title="THE SYSTEM CARD" stamp="It doesn't exist yet" stampAt={145} titleSize={84} clip={`${CLIPS}/astra-pod-a.mp4`} clipDur={450} />
  ) },
  { key: "namingTweet", from: 8400, dur: 208, receipt: true, pip: true, node: (
    <ScreenshotReceiptScene durationInFrames={208} kicker="TESTINGCATALOG · REPORTING" title="EVEN THE NAME IS UNDECIDED" tint={AMBER} fullBleed={false}
      src={`${SHOT}/astra-tweet-testingcatalog.png`} url="x.com/testingcatalog" imageW={1100} imageH={1550}
      cardW={545} cardH={760} from={{ x: 0, y: 0, w: 1100, h: 1550 }} to={{ x: 25, y: 100, w: 1050, h: 1330 }} zoomAt={18}
      notes={[{ at: 90, rect: { x: 545, y: 612, w: 510, h: 125 }, kind: "box" }]} />
  ) },
  { key: "deliveryKinetic", from: 8608, dur: 156, fullscreen: true, node: (
    <NewsKinetic durationInFrames={156} tint={AMBER} text="«OUT FOR DELIVERY» — THREE DAYS" highlight="DELIVERY»" size={76} />
  ) },
  { key: "fork", from: 8764, dur: 426, fullscreen: true, pip: true, node: (
    <TwoPathScene durationInFrames={426} docAt={10} leftAt={30} rightAt={181} />
  ) },
  { key: "rule", from: 9190, dur: 340, fullscreen: true, pip: true, node: (
    <RuleScene durationInFrames={340} mathAt={160} briefAt={274} />
  ) },
];

export const ASTRA_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const ASTRA_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const ASTRA_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);
export const ASTRA_PIP: { from: number; to: number }[] = BEATS.filter((b) => b.pip).map((b) => ({ from: b.from, to: b.from + b.dur }));

const OUTRO_FROM = 9530;

export const AstraVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill>
        {BEATS.map((b) => (
          <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={30}>
            {b.node}
          </Sequence>
        ))}
        <Sequence from={OUTRO_FROM} durationInFrames={ASTRA_DUR - OUTRO_FROM} premountFor={30}>
          <Fable5Outro durationInFrames={ASTRA_DUR - OUTRO_FROM} kicker="THE EXACT WORDING, OFF THE CARD" tag="The system card drops → I pull the wording. Subscribe." />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export const AstraVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <AstraVisuals />

      {/* ===== MUSIC — main bed; caveat over the fact-check + the test ===== */}
      <MusicController state="main" from={0} durationInFrames={3369} volume={0.07} duck={[{ from: 0, to: 242 }, { from: 520, to: 780 }]} />
      <MusicController state="caveat" from={3369} durationInFrames={2185} volume={0.06} />
      <MusicController state="main" from={5554} durationInFrames={2506} volume={0.07} duck={[{ from: 7686, to: 8060 }]} />
      <MusicController state="caveat" from={8060} durationInFrames={1130} volume={0.06} />
      <MusicController state="main" from={9190} durationInFrames={ASTRA_DUR - 9190} volume={0.065} />

      {/* ===== SFX — soft whoosh on fullscreen starts only ===== */}
      {BEATS.filter((b) => b.fullscreen).map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.2} rate={vary(i)} />
      ))}
    </AbsoluteFill>
  );
};
