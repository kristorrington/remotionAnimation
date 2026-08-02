import React from "react";
import { AbsoluteFill, Sequence, OffthreadVideo, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { BalanceScaleScene, GatesScene } from "./scenes/GptScenes";
import { glassCard } from "./motion/subjects";
import { FONT } from "./components/overlayUI";
import { ThemeProvider } from "./theme";
import { KineticText, BenchmarkBar, MusicController, PALETTE } from "./motion/editkit";
import {
  LabTile, LogoGrid, LogoTitle, CostFaceoff, VerdictSplit, PriceCutsScene, PriceWarScene,
  TokenPriceScene, TypoScene, MysteryModelScene, LeaderboardLeakScene, LevelCard,
  EvidenceRecap, Watchlist, DontChips,
} from "./scenes/AiNews2Scenes";

// AiNews2Video — the cutaway overlay for the AI-news roundup: "5 labs, one day —
// which stories are actually real?" (~7m26s, 13380f @ 30fps). Spine (Kris):
// b-roll / logo FIRST, then the animated explainer; every lab rides its real
// logo throughout; the whole cut resolves into a 3-LEVEL EVIDENCE rule
// (official / reported / rumour). Every number is EXACT from the transcript;
// internal claims are labelled "BRAND'S OWN EVAL", never passed off as
// independent. Chapters: The Feed / DeepSeek / OpenAI / The Rumours /
// Also This Week / The Rule.

export const AI_NEWS2_DUR = 13380;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OPUS = PALETTE.opus; // #D97757 terracotta (brand)
const SONNET = PALETTE.sonnet;
const GREEN = PALETTE.win;
const AMBER = PALETTE.cost;
const RED = PALETTE.danger;
const SHOT = "assets/external/screenshots";

// ── receipt helper — a b-roll source card (kicker/title on paper above) ───────
type ImgShot = { w: number; h: number };
const IMG: Record<string, ImgShot> = {
  dsUpdates: { w: 1950, h: 930 },
  dsTweet: { w: 1100, h: 1150 },
  dsPricing: { w: 1560, h: 1800 },
  aa: { w: 3060, h: 1575 },
  altman: { w: 1100, h: 1330 },
  luna: { w: 2010, h: 800 },
  minimax: { w: 2400, h: 840 },
  dreamina: { w: 1100, h: 490 },
  gemini35: { w: 2110, h: 1385 },
  robotics: { w: 2680, h: 2560 },
};
const receipt = (
  dur: number, key: keyof typeof IMG, file: string, url: string,
  kicker: string, title: string, tint: string,
  opts: { cardW?: number; cardH?: number; notes?: { at: number; rect: { x: number; y: number; w: number; h: number }; kind?: "box" | "underline" | "circle"; label?: string }[]; titlePos?: "center" | "right" | "left"; titleTop?: number } = {},
) => {
  const im = IMG[key];
  const full = { x: 0, y: 0, w: im.w, h: im.h };
  const cardH = opts.cardH ?? Math.min(760, Math.round((opts.cardW ?? 1500) * (im.h / im.w)));
  const cardW = opts.cardW ?? Math.round(cardH * (im.w / im.h));
  return (
    <ScreenshotReceiptScene
      durationInFrames={dur} kicker={kicker} title={title} fullBleed={false} tint={tint}
      src={`${SHOT}/${file}`} url={url} imageW={im.w} imageH={im.h}
      cardW={cardW} cardH={cardH} from={full} to={full} zoomAt={0}
      notes={opts.notes} titlePos={opts.titlePos} titleTop={opts.titleTop}
    />
  );
};

// ── ClipCard — a play-framed film card for the muted official-footage montage ─
const ClipCard: React.FC<{ durationInFrames: number; kicker: string; title: string; clip: string; source: string; tint: string }> = ({ durationInFrames, kicker, title, clip, source, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - 4, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 26 });
  const cardW = 1180, cardH = 664;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x77} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 16, overflow: "hidden", ...glassCard(tint + "cc", 2.5), transform: `scale(${interpolate(e, [0, 1], [0.9, 1])})`, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP), boxShadow: `0 22px 60px rgba(6,9,16,0.4)` }}>
        <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 8, background: "rgba(6,9,16,0.6)", border: `1px solid ${tint}` }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: RED }} />
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, letterSpacing: 2, color: "#fff" }}>· OFFICIAL FILM</span>
          </div>
          <div style={{ position: "absolute", bottom: 14, right: 18, fontFamily: FONT, fontWeight: 600, fontSize: 16, color: "rgba(255,255,255,0.7)" }}>{source}</div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── ThreeTiers — the thesis foreshadow: confirmed / self-reported / rumour ─────
const ThreeTiers: React.FC<{ durationInFrames: number; tint: string; ats: number[] }> = ({ durationInFrames, tint, ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tiers = [
    { label: "CONFIRMED", sub: "Official — from the company", col: GREEN },
    { label: "SELF-REPORTED", sub: "The company's own numbers", col: AMBER },
    { label: "RUMOUR", sub: "Screenshots & leaks", col: RED },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x5b} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tiers.map((t, i) => {
            const at = ats[i];
            const e = spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 24 });
            return (
              <div key={t.label} style={{ width: 760, padding: "20px 30px", borderRadius: 14, ...glassCard(t.col + "cc", 2.5), display: "flex", alignItems: "center", gap: 22, transform: `translateX(${interpolate(e, [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <div style={{ width: 14, height: 44, borderRadius: 4, background: t.col }} />
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", width: 320, transform: "translateZ(0)" }}>{t.label}</span>
                <span style={{ flex: 1, fontFamily: FONT, fontWeight: 600, fontSize: 24, color: t.col, transform: "translateZ(0)" }}>{t.sub}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="THREE VERY DIFFERENT THINGS" title="NOT ALL NEWS IS EQUAL" titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── RumourPile — Mew3 + Kinsley, both stamped Level 3 ─────────────────────────
const RumourPile: React.FC<{ durationInFrames: number; tint: string; ats: number[] }> = ({ durationInFrames, tint, ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Card: React.FC<{ name: string; logo: "openai" | "qwen"; at: number; tilt: number }> = ({ name, logo, at, tilt }) => {
    const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 16 }, durationInFrames: 26 });
    return (
      <div style={{ width: 420, padding: "30px 30px 36px", borderRadius: 18, ...glassCard(RED + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `translateY(${interpolate(e, [0, 1], [-60, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2.5, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <LabTile logo={logo} h={116} at={at + 4} />
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#fff", transform: "translateZ(0)" }}>{name}</span>
        <div style={{ padding: "8px 22px", borderRadius: 999, background: RED }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: "#fff" }}>LEVEL 3</span>
        </div>
      </div>
    );
  };
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x5c} tint={tint} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 46 }}>
          <Card name="MEW3" logo="openai" at={ats[0]} tilt={-3} />
          <Card name="KINSLEY" logo="qwen" at={ats[1]} tilt={3} />
        </div>
        <SceneHeadline kicker="A MYSTERY NAME IS STILL A MYSTERY NAME" title="THE RUMOUR PILE" titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── BEATS — from ≈ spokenFrame − 6 (whisper-pinned). node carries the scene so
//    windows / fullscreen spans / cut list can never drift from the visuals. ──
type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE FEED (hook: five labs, the problem, the promise) ──
  { key: "hookGrid", from: 100, dur: 378, fullscreen: true, node: (
    <LogoGrid durationInFrames={378} particleSeed={0x11} tint={OPUS} kicker="ONE 24-HOUR WINDOW" title="FIVE LABS. BIG NEWS."
      items={[
        { logo: "deepseek", at: 46, label: "DeepSeek", tilt: -2 },
        { logo: "openai", at: 112, label: "OpenAI", tilt: 2 },
        { logo: "qwen", at: 210, label: "Qwen", tilt: -1 },
        { logo: "minimax", at: 250, label: "MiniMax", tilt: 2 },
        { logo: "google", at: 285, label: "Google", tilt: -2 },
      ]} />
  ) },
  { key: "hookTiers", from: 478, dur: 327, fullscreen: true, node: <ThreeTiers durationInFrames={327} tint={SONNET} ats={[8, 160, 244]} /> },
  { key: "hookPromise", from: 805, dur: 165, fullscreen: true, node: (
    <SceneShell durationInFrames={165} particleSeed={0x12} tint={OPUS}>
      <KineticText text="A SIMPLE 3-LEVEL RULE" durationInFrames={165} highlight="3-LEVEL" y={520} size={86} />
    </SceneShell>
  ) },

  // ── DEEPSEEK V4 FLASH ──
  { key: "dsTitle", from: 964, dur: 96, fullscreen: true, node: (
    <LogoTitle durationInFrames={96} particleSeed={0x13} tint={SONNET} logo="deepseek" kicker="FIRST UP" title="DEEPSEEK V4 FLASH" />
  ) },
  { key: "dsUpdates", from: 1058, dur: 250, receipt: true, node: receipt(250, "dsUpdates", "ai2-ds-updates.png", "api-docs.deepseek.com/updates", "DEEPSEEK · OFFICIAL UPDATE PAGE", "PUBLIC BETA, JULY 31", GREEN) },
  { key: "dsBars", from: 1400, dur: 300, fullscreen: true, node: (
    <SceneShell durationInFrames={300} particleSeed={0x14} tint={AMBER}>
      <BenchmarkBar sourceType="internal" at={70} width={1000}
        chart={{ title: "DEEPSEEK'S CODING SCORE", unit: "", source: { name: "DeepSeek update page", url: "api-docs.deepseek.com/updates" }, data: [{ label: "BEFORE", value: 7.3 }, { label: "AFTER", value: 54.4 }] }} />
    </SceneShell>
  ) },
  { key: "dsAA", from: 1700, dur: 300, receipt: true, node: receipt(300, "aa", "ai2-aa-v4flash.png", "artificialanalysis.ai/models/deepseek-v4-flash", "ARTIFICIAL ANALYSIS · INDEPENDENT", "INDEPENDENTLY: #3 OF 101", SONNET) },
  { key: "dsCost", from: 2205, dur: 501, fullscreen: true, node: (
    <CostFaceoff durationInFrames={501} tint={GREEN} leftLogo="deepseek" leftCost="≈2¢" rightLogo="glm" rightCost="≈$4"
      fixedAt={30} gapAt={360} stampText="SAME RESULT · ~200× CHEAPER" stampAt={370} kicker="ONE REAL-WORLD TEST · ONE BUG" title="SAME FIX, TINY COST" />
  ) },
  { key: "dsCaveat", from: 2706, dur: 300, fullscreen: true, node: (
    <SceneShell durationInFrames={300} particleSeed={0x16} tint={AMBER}>
      <FinalTakeawayScene durationInFrames={300} kicker="STILL — ONE BUG, TESTED BY ONE PERSON" title="NOT PROOF OF EVERYTHING" stamp="ONE DATA POINT" stampAt={170} accent={AMBER} />
    </SceneShell>
  ) },
  { key: "dsApi", from: 3006, dur: 320, receipt: true, node: receipt(320, "dsTweet", "ai2-ds-tweet.png", "x.com/deepseek_ai", "DEEPSEEK · OFFICIAL", "API ONLY · V4 PRO NEXT", SONNET) },
  { key: "dsVerdict", from: 3326, dur: 204, fullscreen: true, node: (
    <VerdictSplit durationInFrames={204} particleSeed={0x17} tint={SONNET} kicker="DEEPSEEK · THE VERDICT" title="TWO CLAIMS, TWO LEVELS"
      leftAt={12} rightAt={60} leftLabel="CONFIRMED" leftSub="The launch itself" rightLabel="NOT CONFIRMED" rightSub="The 7.5× jump" />
  ) },

  // ── OPENAI (the clearer story: price cuts) ──
  { key: "oaTitle", from: 3527, dur: 96, fullscreen: true, node: (
    <LogoTitle durationInFrames={96} particleSeed={0x18} tint={OPUS} logo="openai" kicker="NEXT UP · MUCH CLEARER" title="OPENAI CUTS PRICES" />
  ) },
  { key: "oaAltman", from: 3624, dur: 252, receipt: true, node: receipt(252, "altman", "ai2-altman.png", "x.com/sama", "OPENAI · OFFICIAL", "TWO PRICE CUTS ANNOUNCED", GREEN) },
  { key: "oaCuts", from: 3878, dur: 364, fullscreen: true, node: <PriceCutsScene durationInFrames={364} tint={GREEN} at1={8} at2={70} /> },
  { key: "oaWar", from: 4242, dur: 493, fullscreen: true, node: <PriceWarScene durationInFrames={493} tint={AMBER} dropAt={20} stampAt={400} /> },
  { key: "oaTerra", from: 4735, dur: 335, fullscreen: true, node: (
    <TokenPriceScene durationInFrames={335} tint={OPUS} logo="openai" model="GPT-5.6 TERRA" inCost="$2" outCost="$12" at={12} kicker="THE ONE DEVELOPERS CARE ABOUT" title="BUILT FOR REAL APPS" />
  ) },
  { key: "oaClip", from: 5070, dur: 290, fullscreen: true, node: (
    <ClipCard durationInFrames={290} kicker="OPENAI · OFFICIAL FILM" title="CHEAPER AT THE BOTTOM, FASTER AT THE TOP" clip="assets/external/clips/ai2-openai-chatgptwork.mp4" source="OpenAI — Introducing ChatGPT Work" tint={SONNET} />
  ) },
  { key: "oaLooksWrong", from: 5466, dur: 166, fullscreen: true, node: (
    <SceneShell durationInFrames={166} particleSeed={0x5d} tint={AMBER}>
      <KineticText text="A NUMBER THAT LOOKS WRONG" durationInFrames={166} highlight="WRONG" y={520} size={72} />
    </SceneShell>
  ) },
  { key: "oaTypo", from: 5632, dur: 500, node: <TypoScene durationInFrames={500} tint={AMBER} strikeAt={20} fixAt={388} /> },
  { key: "oaLuna", from: 6132, dur: 156, receipt: true, node: receipt(156, "luna", "ai2-openai-luna.png", "developers.openai.com/api/docs/models/gpt-5.6-luna", "OPENAI · DEVELOPER DOCS", "THE REAL PRICE: $1.20", GREEN) },

  // ── THE RUMOURS (Mew3 + Kinsley) ──
  { key: "ruMew", from: 6284, dur: 500, fullscreen: true, node: (
    <MysteryModelScene durationInFrames={500} tint={RED} name="MEW3" showAt={30} vanishAt={300} logo="openai" kicker="OPENAI · A DELETED CLIP" title="APPEARED, THEN GONE" />
  ) },
  { key: "ruHype", from: 6980, dur: 505, fullscreen: true, node: (
    <BalanceScaleScene durationInFrames={505} kicker="NO PAGE. NO CONFIRMATION." title="BIG CLAIM, TINY PROOF" tint={AMBER}
      leftLabel="EVIDENCE" rightLabel="HYPE: GPT-6" dropLeftAt={40} dropRightAt={110} tipAt={160} stampText="A HUGE LEAP" stampAt={300} />
  ) },
  { key: "ruMewVerdict", from: 7485, dur: 200, fullscreen: true, node: (
    <SceneShell durationInFrames={200} particleSeed={0x19} tint={RED} mood="danger">
      <KineticText text="MEW3 STAYS A RUMOUR" durationInFrames={200} highlight="RUMOUR" y={520} size={82} />
    </SceneShell>
  ) },
  { key: "ruKinsley", from: 7684, dur: 560, fullscreen: true, node: (
    <LeaderboardLeakScene durationInFrames={560} tint={SONNET} rowsAt={30} claimAt={440} />
  ) },
  { key: "ruPile", from: 8244, dur: 440, fullscreen: true, node: <RumourPile durationInFrames={440} tint={RED} ats={[30, 90]} /> },

  // ── ALSO THIS WEEK ──
  { key: "alsoGrid", from: 8680, dur: 720, fullscreen: true, node: (
    <LogoGrid durationInFrames={720} particleSeed={0x1a} tint={SONNET} kicker="ALSO THIS WEEK" title="FOUR MORE DROPS" titleSize={56} tileH={128}
      items={[
        { logo: "minimax", at: 92, label: "H3 · multimodal", tilt: -2 },
        { logo: "dreamina", at: 289, label: "Seedance 2.5 · AI video", tilt: 2 },
        { logo: "google", at: 409, label: "Gemini 3.5 Pro · LM Arena", tilt: -1.5 },
        { logo: "google", at: 528, label: "Gemini Robotics 2", tilt: 2 },
      ]} />
  ) },
  { key: "alsoRank", from: 9400, dur: 360, fullscreen: true, node: (
    <SceneShell durationInFrames={360} particleSeed={0x1b} tint={AMBER}>
      <FinalTakeawayScene durationInFrames={360} kicker="NO INDEPENDENT TESTING · NO PRICING YET" title="NOT ENOUGH TO RANK" stamp="SO I WON'T PRETEND" stampAt={220} accent={AMBER} />
    </SceneShell>
  ) },

  // ── THE RULE (3 levels of evidence → recap → watchlist → close) ──
  { key: "ruleIntro", from: 9757, dur: 156, fullscreen: true, node: (
    <SceneShell durationInFrames={156} particleSeed={0x1c} tint={OPUS}>
      <KineticText text="THREE LEVELS OF EVIDENCE" durationInFrames={156} highlight="EVIDENCE" y={520} size={74} />
    </SceneShell>
  ) },
  { key: "lvl1", from: 9913, dur: 438, fullscreen: true, node: (
    <LevelCard durationInFrames={438} particleSeed={0x1d} tint={GREEN} accent={GREEN} n={1} label="OFFICIAL"
      chips={["Own website", "Documentation", "Update page"]} chipAts={[30, 60, 90]} logos={["openai", "deepseek"]}
      tagline="STATE IT CLEARLY" tagAt={300} />
  ) },
  { key: "lvl2", from: 10351, dur: 456, fullscreen: true, node: (
    <LevelCard durationInFrames={456} particleSeed={0x1e} tint={AMBER} accent={AMBER} n={2} label="REPORTED / SELF-TESTED"
      chips={["The company's own benchmark", "One real-world test"]} chipAts={[30, 80]}
      tagline="CITE THE SOURCE" tagAt={320} />
  ) },
  { key: "lvl3", from: 10807, dur: 400, fullscreen: true, node: (
    <LevelCard durationInFrames={400} particleSeed={0x1f} tint={RED} accent={RED} n={3} label="LEAK / RUMOUR"
      chips={["A screenshot", "A mystery name", "A deleted video", "A leaderboard entry"]} chipAts={[20, 45, 70, 95]}
      tagline="STAYS A RUMOUR" tagAt={300} />
  ) },
  { key: "recap", from: 11206, dur: 760, fullscreen: true, node: (
    <EvidenceRecap durationInFrames={760} tint={OPUS} title="ONLY TWO ARE CONFIRMED"
      level1={[{ logo: "deepseek", label: "V4 Flash launched", at: 200 }, { logo: "openai", label: "Price cuts", at: 260 }]}
      level2={[{ logo: "deepseek", label: "The 7.5× jump", at: 360 }]}
      level3={[{ logo: "openai", label: "Mew3", at: 470 }, { logo: "qwen", label: "Kinsley", at: 520 }]} />
  ) },
  { key: "ruleGates", from: 11960, dur: 230, fullscreen: true, node: (
    <GatesScene durationInFrames={230} kicker="WHAT WOULD CHANGE THE RANKING" title="TWO THINGS" tint={SONNET}
      gates={[{ label: "INDEPENDENT TEST", at: 20 }, { label: "OFFICIAL CONFIRMATION", at: 110 }]} />
  ) },
  { key: "watch", from: 12191, dur: 500, fullscreen: true, node: (
    <Watchlist durationInFrames={500} tint={OPUS} items={[
      { logo: "deepseek", text: "V4 Pro", at: 30 },
      { logo: "deepseek", text: "V4 Flash chatbot access", at: 100 },
      { logo: "openai", text: "A word on Mew3", at: 210 },
      { logo: "qwen", text: "A word on Kinsley", at: 320 },
    ]} />
  ) },
  { key: "dont", from: 12693, dur: 340, fullscreen: true, node: (
    <DontChips durationInFrames={340} tint={RED} items={[
      { a: "A screenshot", b: "a launch", at: 20 },
      { a: "A benchmark", b: "settled fact", at: 90 },
      { a: "A deleted video", b: "a roadmap", at: 160 },
    ]} />
  ) },
];

export const AI_NEWS2_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const AI_NEWS2_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const AI_NEWS2_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);

const OUTRO_FROM = 13030;

export const AiNews2Visuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill>
        {BEATS.map((b) => (
          <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={30}>
            {b.node}
          </Sequence>
        ))}
        {/* OUTRO — subscribe CTA + comment prompt; holds while the face closes */}
        <Sequence from={OUTRO_FROM} durationInFrames={AI_NEWS2_DUR - OUTRO_FROM} premountFor={30}>
          <Fable5Outro durationInFrames={AI_NEWS2_DUR - OUTRO_FROM} kicker="CHECK THE EVIDENCE, EVERY WEEK" tag="Which story do you think is real? Tell me in the comments." />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export const AiNews2Video: React.FC = () => {
  return (
    <AbsoluteFill>
      <AiNews2Visuals />

      {/* ===== MUSIC — analytical bed; caveat bed over the rumours + watchlist ===== */}
      <MusicController state="main" from={100} durationInFrames={880} volume={0.07} />
      <MusicController state="main" from={964} durationInFrames={2566} volume={0.07} duck={[{ from: 1058, to: 1308 }, { from: 3006, to: 3320 }]} />
      <MusicController state="main" from={3527} durationInFrames={2761} volume={0.07} duck={[{ from: 3624, to: 3876 }, { from: 6040, to: 6288 }]} />
      <MusicController state="caveat" from={6284} durationInFrames={2396} volume={0.06} />
      <MusicController state="main" from={8680} durationInFrames={1077} volume={0.07} />
      <MusicController state="main" from={9757} durationInFrames={AI_NEWS2_DUR - 9757} volume={0.065} />

      {/* ===== SFX — RESTRAINED (Kris: the per-story hit was distracting). A soft
          whoosh only on the big FULLSCREEN reveals, one warning on the price war. */}
      {BEATS.filter((b) => b.fullscreen).map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.2} rate={vary(i)} />
      ))}
      <SfxCue from={4242 + 400} src={SFX.warningPulse} volume={0.26} />
    </AbsoluteFill>
  );
};
