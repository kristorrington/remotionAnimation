import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { BenchmarkBar, MusicController } from "./motion/editkit";
import {
  NEWS, DISPLAY, HERO, NewsShell, NewsHeadline, NewsKinetic, NewsTakeaway, NewsClipCard,
  LabTile, LogoGrid, LogoTitle, CostFaceoff, VerdictSplit, PriceCutsScene, PriceWarScene,
  TokenPriceScene, TypoScene, MysteryModelScene, LeaderboardLeakScene, LevelCard,
  EvidenceRecap, Watchlist, DontChips,
} from "./scenes/AiNews2Scenes";

// AiNews2Video — the cutaway overlay for the AI-news roundup: "5 labs, one day —
// which stories are actually real?" (~7m26s, 13380f @ 30fps). BOLD NEWSROOM
// style (Kris, Aug 2026): crisp near-white stage, condensed-impact type, ONE
// terracotta accent, dark news blocks, saturated data. B-roll / logo FIRST,
// then the animated explainer; every lab rides its real logo; the whole cut
// resolves into a 3-LEVEL EVIDENCE rule. Every number is EXACT; internal claims
// are labelled "brand's own eval". Chapters: Feed / DeepSeek / OpenAI /
// Rumours / Also This Week / The Rule.

export const AI_NEWS2_DUR = 13380;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BRAND = NEWS.brand;
const GREEN = NEWS.green;
const AMBER = NEWS.amber;
const RED = NEWS.red;
const BLUE = NEWS.blue;
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

// ── ThreeTiers — the thesis foreshadow: confirmed / self-reported / rumour ─────
const ThreeTiers: React.FC<{ durationInFrames: number; tint: string; ats: number[] }> = ({ durationInFrames, tint, ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tiers = [
    { label: "Confirmed", sub: "Official — from the company", col: GREEN },
    { label: "Self-reported", sub: "The company's own numbers", col: AMBER },
    { label: "Rumour", sub: "Screenshots & leaks", col: RED },
  ];
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tiers.map((t, i) => {
            const at = ats[i];
            const e = spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 24 });
            return (
              <div key={t.label} style={{ width: 780, padding: "18px 30px", background: NEWS.dark, borderRadius: 12, borderLeft: `10px solid ${t.col}`, display: "flex", alignItems: "center", gap: 22, boxShadow: "0 14px 34px rgba(20,18,16,0.16)", transform: `translateX(${interpolate(e, [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", width: 340, transform: "translateZ(0)" }}>{t.label}</span>
                <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 500, fontSize: 25, color: t.col, transform: "translateZ(0)" }}>{t.sub}</span>
              </div>
            );
          })}
        </div>
        <NewsHeadline kicker="Three very different things" title="NOT ALL NEWS IS EQUAL" titleSize={82} accent={BRAND} />
      </div>
    </NewsShell>
  );
};

// ── RumourPile — Mew3 + Kinsley, both stamped Level 3 ─────────────────────────
const RumourPile: React.FC<{ durationInFrames: number; tint: string; ats: number[] }> = ({ durationInFrames, tint, ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Card: React.FC<{ name: string; logo: "openai" | "qwen"; at: number; tilt: number }> = ({ name, logo, at, tilt }) => {
    const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 16 }, durationInFrames: 26 });
    return (
      <div style={{ width: 430, padding: "28px 30px 34px", background: NEWS.dark, borderRadius: 12, borderTop: `4px solid ${RED}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, boxShadow: "0 16px 40px rgba(20,18,16,0.2)", transform: `translateY(${interpolate(e, [0, 1], [-60, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2.5, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <LabTile logo={logo} h={116} at={at + 4} />
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 56, letterSpacing: 1, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)" }}>{name}</span>
        <div style={{ padding: "6px 22px", borderRadius: 999, background: RED }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Level 3</span>
        </div>
      </div>
    );
  };
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 46 }}>
          <Card name="Mew3" logo="openai" at={ats[0]} tilt={-3} />
          <Card name="Kinsley" logo="qwen" at={ats[1]} tilt={3} />
        </div>
        <NewsHeadline kicker="A mystery name is still a mystery name" title="THE RUMOUR PILE" titleSize={80} accent={BRAND} />
      </div>
    </NewsShell>
  );
};

// ── ChangeConditions — what would move a story up a level (2 gates) ────────────
const ChangeConditions: React.FC<{ durationInFrames: number; tint: string; ats: number[] }> = ({ durationInFrames, tint, ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["Independent test", "Official confirmation"];
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 30 }}>
          {items.map((c, i) => {
            const at = ats[i];
            const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
            return (
              <div key={c} style={{ width: 460, padding: "34px 30px", background: NEWS.dark, borderRadius: 12, borderTop: `4px solid ${BLUE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: "0 14px 34px rgba(20,18,16,0.16)", transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 74, lineHeight: 0.9, color: BLUE, transform: "translateZ(0)" }}>{i + 1}</span>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", textAlign: "center", transform: "translateZ(0)" }}>{c}</span>
              </div>
            );
          })}
        </div>
        <NewsHeadline kicker="What would change the ranking" title="TWO THINGS" titleSize={80} accent={BRAND} />
      </div>
    </NewsShell>
  );
};

// ── BEATS — from ≈ spokenFrame − 6 (whisper-pinned). ──
type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE FEED (hook) ──
  { key: "hookGrid", from: 100, dur: 378, fullscreen: true, node: (
    <LogoGrid durationInFrames={378} tint={BRAND} kicker="Five labs, one day" title="THE BIG THREE" tileH={150}
      items={[
        { logo: "deepseek", at: 46, label: "DeepSeek", tilt: -2 },
        { logo: "openai", at: 112, label: "OpenAI", tilt: 2 },
        { logo: "qwen", at: 240, label: "Qwen", tilt: -1 },
      ]} />
  ) },
  { key: "hookTiers", from: 478, dur: 327, fullscreen: true, node: <ThreeTiers durationInFrames={327} tint={BLUE} ats={[8, 160, 244]} /> },
  { key: "hookPromise", from: 805, dur: 165, fullscreen: true, node: <NewsKinetic durationInFrames={165} tint={BRAND} text="A SIMPLE 3-LEVEL RULE" highlight="3-LEVEL" size={104} /> },

  // ── DEEPSEEK V4 FLASH ──
  { key: "dsTitle", from: 964, dur: 96, fullscreen: true, node: (
    <LogoTitle durationInFrames={96} tint={BLUE} logo="deepseek" kicker="First up" title="DEEPSEEK V4 FLASH" />
  ) },
  { key: "dsUpdates", from: 1058, dur: 250, receipt: true, node: receipt(250, "dsUpdates", "ai2-ds-updates.png", "api-docs.deepseek.com/updates", "DEEPSEEK · OFFICIAL UPDATE PAGE", "PUBLIC BETA, JULY 31", GREEN) },
  { key: "dsBars", from: 1400, dur: 300, fullscreen: true, node: (
    <NewsShell durationInFrames={300} tint={AMBER}>
      <BenchmarkBar sourceType="internal" at={70} width={1000}
        chart={{ title: "DEEPSEEK'S CODING SCORE", unit: "", source: { name: "DeepSeek update page", url: "api-docs.deepseek.com/updates" }, data: [{ label: "BEFORE", value: 7.3 }, { label: "AFTER", value: 54.4 }] }} />
    </NewsShell>
  ) },
  { key: "dsAA", from: 1700, dur: 300, receipt: true, node: receipt(300, "aa", "ai2-aa-v4flash.png", "artificialanalysis.ai/models/deepseek-v4-flash", "ARTIFICIAL ANALYSIS · INDEPENDENT", "INDEPENDENTLY: #3 OF 101", BLUE) },
  { key: "dsCost", from: 2205, dur: 501, fullscreen: true, node: (
    <CostFaceoff durationInFrames={501} leftLogo="deepseek" leftCost="≈2¢" rightLogo="glm" rightCost="≈$4"
      fixedAt={30} gapAt={360} stampText="Same result · ~200× cheaper" stampAt={370} kicker="One real-world test · one bug" title="SAME FIX, TINY COST" />
  ) },
  { key: "dsCaveat", from: 2706, dur: 300, fullscreen: true, node: (
    <NewsTakeaway durationInFrames={300} tint={AMBER} kicker="Still — one bug, tested by one person" title="NOT PROOF OF EVERYTHING" stamp="One data point" stampAt={170} />
  ) },
  { key: "dsApi", from: 3006, dur: 320, receipt: true, node: receipt(320, "dsTweet", "ai2-ds-tweet.png", "x.com/deepseek_ai", "DEEPSEEK · OFFICIAL", "API ONLY · V4 PRO NEXT", BLUE) },
  { key: "dsVerdict", from: 3326, dur: 204, fullscreen: true, node: (
    <VerdictSplit durationInFrames={204} tint={BLUE} kicker="DeepSeek · the verdict" title="TWO CLAIMS, TWO LEVELS"
      leftAt={12} rightAt={60} leftLabel="Confirmed" leftSub="The launch itself" rightLabel="Not confirmed" rightSub="The 7.5× jump" />
  ) },

  // ── OPENAI ──
  { key: "oaTitle", from: 3527, dur: 96, fullscreen: true, node: (
    <LogoTitle durationInFrames={96} tint={BRAND} logo="openai" kicker="Next up · much clearer" title="OPENAI CUTS PRICES" />
  ) },
  { key: "oaAltman", from: 3624, dur: 252, receipt: true, node: receipt(252, "altman", "ai2-altman.png", "x.com/sama", "OPENAI · OFFICIAL", "TWO PRICE CUTS ANNOUNCED", GREEN) },
  { key: "oaCuts", from: 3878, dur: 364, fullscreen: true, node: <PriceCutsScene durationInFrames={364} tint={GREEN} at1={8} at2={70} /> },
  { key: "oaWar", from: 4242, dur: 493, fullscreen: true, node: <PriceWarScene durationInFrames={493} tint={AMBER} dropAt={20} stampAt={400} /> },
  { key: "oaTerra", from: 4735, dur: 335, fullscreen: true, node: (
    <TokenPriceScene durationInFrames={335} tint={BRAND} logo="openai" model="GPT-5.6 Terra" inCost="$2" outCost="$12" at={12} kicker="The one developers care about" title="BUILT FOR REAL APPS" />
  ) },
  { key: "oaClip", from: 5070, dur: 290, fullscreen: true, node: (
    <NewsClipCard durationInFrames={290} tint={BLUE} kicker="OpenAI · official film" title="CHEAPER AT THE BOTTOM, FASTER AT THE TOP" clip="assets/external/clips/ai2-openai-chatgptwork.mp4" source="OpenAI — Introducing ChatGPT Work" />
  ) },
  { key: "oaLooksWrong", from: 5466, dur: 166, fullscreen: true, node: <NewsKinetic durationInFrames={166} tint={AMBER} text="A NUMBER THAT LOOKS WRONG" highlight="WRONG" size={96} /> },
  { key: "oaTypo", from: 5632, dur: 500, node: <TypoScene durationInFrames={500} tint={AMBER} strikeAt={20} fixAt={388} /> },
  { key: "oaLuna", from: 6132, dur: 156, receipt: true, node: receipt(156, "luna", "ai2-openai-luna.png", "developers.openai.com/api/docs/models/gpt-5.6-luna", "OPENAI · DEVELOPER DOCS", "THE REAL PRICE: $1.20", GREEN) },

  // ── THE RUMOURS ──
  { key: "ruMew", from: 6284, dur: 500, fullscreen: true, node: (
    <MysteryModelScene durationInFrames={500} tint={RED} name="Mew3" showAt={30} vanishAt={300} logo="openai" kicker="OpenAI · a deleted clip" title="APPEARED, THEN GONE" />
  ) },
  { key: "ruHype", from: 6980, dur: 505, fullscreen: true, node: (
    <NewsTakeaway durationInFrames={505} tint={AMBER} kicker="No page. No confirmation." title="BIG CLAIM, TINY PROOF" stamp="A huge leap" stampAt={300} />
  ) },
  { key: "ruMewVerdict", from: 7485, dur: 200, fullscreen: true, node: <NewsKinetic durationInFrames={200} tint={RED} text="MEW3 STAYS A RUMOUR" highlight="RUMOUR" size={92} /> },
  { key: "ruKinsley", from: 7684, dur: 560, fullscreen: true, node: (
    <LeaderboardLeakScene durationInFrames={560} tint={BLUE} rowsAt={30} claimAt={440} />
  ) },
  { key: "ruPile", from: 8244, dur: 440, fullscreen: true, node: <RumourPile durationInFrames={440} tint={RED} ats={[30, 90]} /> },

  // ── ALSO THIS WEEK ──
  { key: "alsoGrid", from: 8680, dur: 580, fullscreen: true, node: (
    <LogoGrid durationInFrames={580} tint={BLUE} kicker="Also this week" title="FOUR MORE DROPS" titleSize={84} tileH={128}
      items={[
        { logo: "minimax", at: 92, label: "H3 · multimodal", tilt: -2 },
        { logo: "dreamina", at: 289, label: "Seedance 2.5 · AI video", tilt: 2 },
        { logo: "google", at: 409, label: "Gemini 3.5 Pro · LM Arena", tilt: -1.5 },
        { logo: "google", at: 528, label: "Gemini Robotics 2", tilt: 2 },
      ]} />
  ) },
  { key: "alsoMontage", from: 9266, dur: 494, fullscreen: true, node: (
    <NewsClipCard durationInFrames={494} tint={AMBER} kicker="Official demos · impressive" title="TOO EARLY TO RANK" clip="assets/external/clips/ai2-alsoweek-montage.mp4" source="DeepMind · MiniMax · Dreamina" />
  ) },

  // ── THE RULE ──
  { key: "ruleIntro", from: 9757, dur: 156, fullscreen: true, node: <NewsKinetic durationInFrames={156} tint={BRAND} text="THREE LEVELS OF EVIDENCE" highlight="EVIDENCE" size={90} /> },
  { key: "lvl1", from: 9913, dur: 438, fullscreen: true, node: (
    <LevelCard durationInFrames={438} tint={GREEN} accent={GREEN} n={1} label="Official"
      chips={["Own website", "Documentation", "Update page"]} chipAts={[30, 60, 90]} logos={["openai", "deepseek"]}
      tagline="State it clearly" tagAt={300} />
  ) },
  { key: "lvl2", from: 10351, dur: 456, fullscreen: true, node: (
    <LevelCard durationInFrames={456} tint={AMBER} accent={AMBER} n={2} label="Reported / self-tested"
      chips={["The company's own benchmark", "One real-world test"]} chipAts={[30, 80]}
      tagline="Cite the source" tagAt={320} />
  ) },
  { key: "lvl3", from: 10807, dur: 400, fullscreen: true, node: (
    <LevelCard durationInFrames={400} tint={RED} accent={RED} n={3} label="Leak / rumour"
      chips={["A screenshot", "A mystery name", "A deleted video", "A leaderboard entry"]} chipAts={[20, 45, 70, 95]}
      tagline="Stays a rumour" tagAt={300} />
  ) },
  { key: "recap", from: 11206, dur: 760, fullscreen: true, node: (
    <EvidenceRecap durationInFrames={760} tint={BRAND} title="ONLY TWO ARE CONFIRMED"
      level1={[{ logo: "deepseek", label: "V4 Flash launched", at: 200 }, { logo: "openai", label: "Price cuts", at: 260 }]}
      level2={[{ logo: "deepseek", label: "The 7.5× jump", at: 360 }]}
      level3={[{ logo: "openai", label: "Mew3", at: 470 }, { logo: "qwen", label: "Kinsley", at: 520 }]} />
  ) },
  { key: "ruleGates", from: 11960, dur: 230, fullscreen: true, node: <ChangeConditions durationInFrames={230} tint={BLUE} ats={[20, 110]} /> },
  { key: "watch", from: 12191, dur: 500, fullscreen: true, node: (
    <Watchlist durationInFrames={500} tint={BRAND} items={[
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

      {/* ===== MUSIC — analytical bed; caveat bed over the rumours ===== */}
      <MusicController state="main" from={100} durationInFrames={880} volume={0.07} />
      <MusicController state="main" from={964} durationInFrames={2566} volume={0.07} duck={[{ from: 1058, to: 1308 }, { from: 3006, to: 3320 }]} />
      <MusicController state="main" from={3527} durationInFrames={2761} volume={0.07} duck={[{ from: 3624, to: 3876 }, { from: 6132, to: 6288 }]} />
      <MusicController state="caveat" from={6284} durationInFrames={2396} volume={0.06} />
      <MusicController state="main" from={8680} durationInFrames={1077} volume={0.07} />
      <MusicController state="main" from={9757} durationInFrames={AI_NEWS2_DUR - 9757} volume={0.065} />

      {/* ===== SFX — RESTRAINED: soft whoosh on big FULLSCREEN reveals + one warning ===== */}
      {BEATS.filter((b) => b.fullscreen).map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.2} rate={vary(i)} />
      ))}
      <SfxCue from={4242 + 400} src={SFX.warningPulse} volume={0.26} />
    </AbsoluteFill>
  );
};
