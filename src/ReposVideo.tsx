import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { SkillCartridgeScene } from "./scenes/SideHustleScenes";
import { GatesScene } from "./scenes/GptScenes";
import { StepsScene } from "./scenes/StepsScene";
import { FlowScene } from "./scenes/FlowScene";
import { StackCollapseScene } from "./scenes/CostScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";

// ReposVideo — transparent cutaway overlay for the "7 GitHub repos that
// upgrade your next Claude Code project" video (~4m07s, 7403f @ 30fps).
// RECEIPT-FORWARD cut (Kris, July 2026: "MORE b-roll cropped images, less
// animations, more left slide transitions"): 17 receipt beats vs 6 animated
// scenes; a pull-left rides every chapter intro, every mid-chapter receipt
// swap, and all seven recap-montage hits. Every `at` is whisper-pinned
// (captionsData, 2026-07-17).

export const REPOS_DUR = 7403;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8); first cover at ~3s
  { scene: "repoFan", from: 90, dur: 224, fullscreen: true }, // "seven GitHub repos (54-97)… upgrade your next Claude Code project (127-206)… let's get into it (279-314)"
  // ── CH1 · Awesome Claude Code ──
  { scene: "awesomeProof", from: 323, dur: 237 }, // "First is Awesome Claude Code (329-412): a curated directory (424-449)"
  { scene: "awesomeToc", from: 560, dur: 390 }, // "where you go when your setup's missing something (562-717)… search the directory for memory tools (811-872)"
  { scene: "nothingKinetic", from: 950, dur: 164 }, // "nothing to install… a useful starting point (961-1114)"
  // ── CH2 · Anthropic Skills ──
  { scene: "skillsProof", from: 1108, dur: 234 }, // "Next is Anthropic Skills (1114-1180): stops CLAUDE.md becoming one giant list (1224-1348)"
  { scene: "skillSplit", from: 1342, dur: 377, fullscreen: true }, // "separate SKILL.md files (1429-1491): review a PR (1568), documentation (1656), testing (1692)"
  { scene: "cleanKinetic", from: 1719, dur: 145 }, // "keeps your instructions cleaner… easier to reuse (1726-1870)"
  // ── CH3 · Claude Context ──
  { scene: "contextLogo", from: 1864, dur: 195 }, // "Third is Claude Context (1870-1937)"
  { scene: "contextClaim", from: 2059, dur: 307 }, // "semantic search through MCP (1956-2059)… code based on meaning (2097-2133)"
  { scene: "authFlow", from: 2366, dur: 258, fullscreen: true }, // "asking where authentication is handled (2301-2372)… surface the relevant files (2395-2444)"
  { scene: "milvusKinetic", from: 2624, dur: 145 }, // "the trade-off: embeddings and a Milvus vector database (2630-2781)"
  // ── CH4 · Everything Claude Code ──
  { scene: "eccProof", from: 2775, dur: 205 }, // "Fourth is Everything Claude Code (2781-2866)" - the skills table, top shot
  { scene: "eccTable", from: 2980, dur: 414 }, // "38 agents and 156 skills (2898-2980)... pull out one planning agent (3234-3331)"
  { scene: "dupeStack", from: 3394, dur: 206, fullscreen: true }, // "installing everything → duplicated instructions (3448-3487) and unnecessary complexity (3494-3547)"
  { scene: "partsKinetic", from: 3600, dur: 93 }, // "a parts store rather than a package (3578-3676)"
  // ── CH5 · Claude Code Action ──
  { scene: "actionHero", from: 3687, dur: 203 }, // "Fifth is Claude Code Action (3693-3779): brings Claude into GitHub issues and PRs (3787-3877)"
  { scene: "actionConvo", from: 4047, dur: 191 }, // "Tag Claude on a bug report (4053-4106)… prepare a proposed fix for review (4163-4238)"
  { scene: "onePlaceKinetic", from: 4238, dur: 162 }, // "task, code changes and discussion all in one place (4247-4373)"
  // ── CH6 · Claude-Mem ──
  { scene: "memHero", from: 4479, dur: 192 }, // "Sixth is Claude-Mem (4485-4553): searchable memory across sessions (4561-4671)"
  { scene: "memSteps", from: 4677, dur: 373, fullscreen: true }, // "close a session (4698)… reopen two days later (4866-4911)… recover why (4948-5050)"
  { scene: "memFeatures", from: 5050, dur: 154 }, // "useful for longer builds where decisions carry forward (5063-5210)"
  { scene: "staleKinetic", from: 5204, dur: 163 }, // "stored assumptions can become outdated (5289-5373)"
  // ── CH7 · Superpowers ──
  { scene: "superProof7", from: 5367, dur: 228 }, // "finally, Superpowers (5381-5468): a stricter process before it starts writing code (5484-5601)"
  { scene: "workflowProof7", from: 5595, dur: 235 }, // "clarify the request (5637), create a design (5682), write a plan (5716)…"
  { scene: "inviteGates", from: 5836, dur: 337, fullscreen: true }, // "team invitations (5860): who can send them (5942), when the link should expire (5993-6014); missing requirements (6077)"
  { scene: "heavyKinetic", from: 6167, dur: 163 }, // "stronger fit for larger features… too heavy for quick one-line fixes (6185-6339)"
  // ── the recap MONTAGE — all seven repo tops, one pull-left per line ──
  { scene: "recapAwesome", from: 6390, dur: 85, fullscreen: true }, // "Awesome Claude Code helps you discover tools (6396-6450)"
  { scene: "recapSkills", from: 6475, dur: 103, fullscreen: true }, // "Anthropic Skills keeps reusable instructions organised (6475-6548)"
  { scene: "recapContext", from: 6578, dur: 110, fullscreen: true }, // "Claude Context makes large codebases easier to search (6578-6671)"
  { scene: "recapEcc", from: 6688, dur: 118, fullscreen: true }, // "Everything Claude Code gives you a library (6688-6774)"
  { scene: "recapAction", from: 6806, dur: 103, fullscreen: true }, // "Claude Code Action moves development tasks into GitHub (6806-6893)"
  { scene: "recapMem", from: 6909, dur: 100, fullscreen: true }, // "Claude-Mem carries useful context between sessions (6909-6983)"
  { scene: "recapSuper", from: 7009, dur: 135, fullscreen: true }, // "Superpowers improves the decisions Claude makes (7009-7127)"
  { scene: "bottleneckKinetic", from: 7144, dur: 130 }, // "pick the repo that solves the bottleneck you already have (7150-7232)"
];

export const REPOS_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const REPOS_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
// mid-chapter receipt swaps + chapter intros also get the pull-left (the
// montage + animations are covered by REPOS_FULLSCREEN in the Final)
export const REPOS_EXTRA_CUTS = [323, 560, 1108, 1864, 2059, 2775, 2980, 3229, 3687, 4047, 4479, 5050, 5367, 5595];

const SHOT = "assets/external/screenshots";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// THE HOOK — the seven real repo pages dealt as a fan of paper cards.
// Receipt-forward: the receipts are the cast; no doors, no robot.
const FAN = [
  "awesome-cc-top-wide.png", "anthropic-skills-top-wide.png", "claude-context-logo-wide.png",
  "ecc-skills-table-wide.png", "cc-action-hero-wide.png", "claude-mem-hero-wide.png", "superpowers-top-wide.png",
];
const FAN_ATS = [6, 20, 34, 48, 62, 76, 90];
const RepoFanScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x707} impacts={FAN_ATS} tint="#D97757">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
        <div style={{ position: "relative", width: 1560, height: 420 }}>
          {FAN.map((f, i) => {
            const at = FAN_ATS[i];
            if (frame < at) return null;
            const deal = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 26 });
            const k = i - 3;
            const x = 780 + k * 186 - 150;
            const y = 60 + Math.pow(Math.abs(k), 1.35) * 13;
            const rot = k * 3.5;
            return (
              <div key={f} style={{ position: "absolute", left: x, top: interpolate(deal, [0, 1], [y + 320, y]), transform: `rotate(${interpolate(deal, [0, 1], [rot + 10, rot])}deg)`, opacity: interpolate(deal, [0, 0.25], [0, 1]) }}>
                <div style={{ position: "relative", width: 300, height: 188, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(31,30,29,0.35)", boxShadow: "0 16px 38px rgba(31,30,29,0.22)", background: "#fff" }}>
                  <Img src={staticFile(`${SHOT}/${f}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left" }} />
                  <div style={{ position: "absolute", left: 10, top: 10, width: 38, height: 38, borderRadius: 8, background: "rgba(250,249,245,0.96)", border: "1px solid rgba(31,30,29,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: "#C15F3C" }}>{i + 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="7 GITHUB REPOS" title="FOR CLAUDE CODE" titleSize={62} />
      </div>
    </SceneShell>
  );
};

// Chapter badge: serif rank numeral + repo name on an ivory chip, top-left
// through each chapter's beats (§10.6 product identification).
const ChapterBadge: React.FC<{ rank: string; name: string }> = ({ rank, name }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", top: 44, left: 56, display: "flex", alignItems: "baseline", gap: 12, padding: "12px 20px", borderRadius: 12, background: "rgba(250,249,245,0.95)", border: "1px solid rgba(31,30,29,0.25)", boxShadow: "0 8px 26px rgba(31,30,29,0.16)", opacity: op }}>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: "#C15F3C" }}>{rank}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, color: "#1F1E1D" }}>{name}</span>
    </div>
  );
};

// Recap montage receipt: full-bleed repo top, no sticker (the pages ARE the
// recap), quick 92% inset settle.
const Montage: React.FC<{ dur: number; src: string; url: string; w?: number; h?: number }> = ({ dur, src, url, w = 3840, h = 2052 }) => (
  <ScreenshotReceiptScene durationInFrames={dur} title="" kicker="" tint="#D97757" src={src} url={url} imageW={w} imageH={h} from={{ x: Math.round(w * 0.04), y: Math.round(h * 0.04), w: Math.round(w * 0.92), h: Math.round(h * 0.92) }} to={{ x: 0, y: 0, w, h }} zoomAt={6} />
);

export const ReposVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 the hook — the seven REAL repo pages dealt as a fan of cards
          (receipt-forward: the receipts are the cast, no doors) */}
      <Sequence from={90} durationInFrames={224} premountFor={30}>
        <RepoFanScene durationInFrames={224} />
      </Sequence>

      {/* CH1 0:10 — the directory, its own repo page */}
      <Sequence from={323} durationInFrames={237} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={237} kicker="GITHUB · REPO 1" title="THE DIRECTORY" tint="#D97757" src={`${SHOT}/awesome-cc-top-wide.png`} url="github.com/hesreallyhim/awesome-claude-code" imageW={3840} imageH={2052} from={{ x: 700, y: 90, w: 1660, h: 887 }} to={{ x: 620, y: 40, w: 2160, h: 1155 }} zoomAt={12} highlight={{ x: 710, y: 610, w: 1760, h: 200 }} highlightAt={107} />
      </Sequence>
      {/* 0:18 the table of contents IS the pitch */}
      <Sequence from={560} durationInFrames={390} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={390} kicker="THE DIRECTORY" title="PICK A CATEGORY" titlePos="right" tint="#4FA98A" src={`${SHOT}/awesome-toc-wide.png`} url="github.com/hesreallyhim/awesome-claude-code" imageW={1500} imageH={1700} from={{ x: 40, y: 30, w: 1000, h: 535 }} to={{ x: 0, y: 1000, w: 1500, h: 802 }} zoomAt={14} highlight={{ x: 110, y: 1462, w: 640, h: 55 }} highlightAt={283} />
      </Sequence>
      <Sequence from={950} durationInFrames={164} premountFor={30}>
        <FinalTakeawayScene durationInFrames={164} title="NOTHING TO INSTALL" stamp="IT'S A MAP" stampAt={35} accent="#4FA98A" />
      </Sequence>

      {/* CH2 0:37 — official Anthropic skills repo */}
      <Sequence from={1108} durationInFrames={234} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={234} kicker="GITHUB · REPO 2" title="ANTHROPIC SKILLS" tint="#6E93BD" src={`${SHOT}/anthropic-skills-top-wide.png`} url="github.com/anthropics/skills" imageW={3840} imageH={2052} from={{ x: 2300, y: 200, w: 1300, h: 694 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={12} highlight={{ x: 2570, y: 400, w: 580, h: 180 }} highlightAt={80} />
      </Sequence>
      {/* 0:44 one giant file → separate SKILL.md cartridges */}
      <Sequence from={1342} durationInFrames={377} premountFor={30}>
        <SkillCartridgeScene durationInFrames={377} kicker="INSTEAD OF ONE GIANT FILE" title="SKILLS SPLIT IT" slotAt={100} runAts={[220, 302, 338]} cartridgeLabel="SKILL.MD" subject={false} />
      </Sequence>
      <Sequence from={1719} durationInFrames={145} premountFor={30}>
        <FinalTakeawayScene durationInFrames={145} title="CLEANER INSTRUCTIONS" stamp="BUILT TO REUSE" stampAt={123} accent="#D97757" />
      </Sequence>

      {/* CH3 1:02 — the pixel banner, then the claim */}
      <Sequence from={1864} durationInFrames={195} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={195} kicker="GITHUB · REPO 3" title="CLAUDE CONTEXT" titlePos="right" titleTop={640} tint="#D97757" src={`${SHOT}/claude-context-logo-wide.png`} url="github.com/zilliztech/claude-context" imageW={1900} imageH={1016} from={{ x: 60, y: 30, w: 1500, h: 802 }} to={{ x: 0, y: 0, w: 1900, h: 1016 }} zoomAt={12} />
      </Sequence>
      <Sequence from={2059} durationInFrames={307} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={307} kicker="ITS OWN WORDS" title="SEARCH BY MEANING" fullBleed={false} tint="#6E93BD" src={`${SHOT}/claude-context-claim-wide.png`} url="github.com/zilliztech/claude-context" imageW={2000} imageH={1069} from={{ x: 40, y: 90, w: 1500, h: 802 }} to={{ x: 0, y: 0, w: 2000, h: 1069 }} zoomAt={14} highlight={{ x: 60, y: 115, w: 1850, h: 90 }} highlightAt={53} />
      </Sequence>
      {/* 1:19 ask → meaning → found */}
      <Sequence from={2366} durationInFrames={258} premountFor={30}>
        <FlowScene durationInFrames={258} kicker="OLD PROJECT, NO FILENAMES" title="ASK IN PLAIN ENGLISH" nodes={[{ label: "Where's auth?" }, { label: "Meaning match" }, { label: "Files found" }]} nodeAts={[8, 30, 75]} tint="#4FA98A" />
      </Sequence>
      <Sequence from={2624} durationInFrames={145} premountFor={30}>
        <FinalTakeawayScene durationInFrames={145} title="THE TRADE-OFF" stamp="MILVUS SETUP" stampAt={89} accent="#C9913D" />
      </Sequence>

      {/* CH4 1:32 — the 38/156 library */}
      <Sequence from={2775} durationInFrames={205} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={205} kicker="GITHUB · REPO 4" title="EVERYTHING CLAUDE CODE" titlePos="left" titleTop={640} tint="#C9913D" src={`${SHOT}/ecc-skills-table-wide.png`} url="github.com/affaan-m/everything-claude-code" imageW={1760} imageH={941} from={{ x: 40, y: 20, w: 900, h: 481 }} to={{ x: 20, y: 10, w: 1300, h: 695 }} zoomAt={12} />
      </Sequence>
      <Sequence from={2980} durationInFrames={414} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={414} kicker="README CLAIMS" title="38 AGENTS · 156 SKILLS" titlePos="left" titleTop={640} tint="#4FA98A" src={`${SHOT}/ecc-skills-table-wide.png`} url="github.com/affaan-m/everything-claude-code" imageW={1760} imageH={941} from={{ x: 300, y: 300, w: 900, h: 481 }} to={{ x: 130, y: 120, w: 1560, h: 834 }} zoomAt={14} /></Sequence>
      {/* 1:53 install everything → duplicate pile collapses */}
      <Sequence from={3394} durationInFrames={206} premountFor={30}>
        <StackCollapseScene durationInFrames={206} kicker="INSTALL IT ALL?" title="THE PILE FALLS OVER" labels={["DUPES", "CONFLICTS", "BLOAT"]} drops={[48, 80, 110]} collapseAt={150} accent="#C9913D" tint="#C9913D" />
      </Sequence>
      <Sequence from={3600} durationInFrames={93} premountFor={30}>
        <FinalTakeawayScene durationInFrames={93} title="A PARTS STORE" stamp="NOT A PACKAGE" stampAt={32} accent="#D97757" />
      </Sequence>

      {/* CH5 2:02 — the official action, tag @claude */}
      <Sequence from={3687} durationInFrames={203} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={203} kicker="GITHUB · REPO 5" title="CLAUDE CODE ACTION" fullBleed={false} tint="#D97757" src={`${SHOT}/cc-action-hero-wide.png`} url="github.com/anthropics/claude-code-action" imageW={1900} imageH={1016} from={{ x: 320, y: 570, w: 1200, h: 641 }} to={{ x: 0, y: 0, w: 1900, h: 1016 }} zoomAt={12} />
      </Sequence>
      <Sequence from={4047} durationInFrames={191} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={191} kicker="ON A REAL ISSUE" title="TAG. FIX. REVIEW." fullBleed={false} tint="#4FA98A" src={`${SHOT}/cc-action-hero-wide.png`} url="github.com/anthropics/claude-code-action" imageW={1900} imageH={1016} from={{ x: 480, y: 260, w: 900, h: 481 }} to={{ x: 380, y: 170, w: 1300, h: 695 }} zoomAt={12} />
      </Sequence>
      <Sequence from={4238} durationInFrames={162} premountFor={30}>
        <FinalTakeawayScene durationInFrames={162} title="TASK + CODE + TALK" stamp="ONE PLACE" stampAt={99} accent="#4FA98A" />
      </Sequence>

      {/* CH6 2:29 — #1 repo of the day, memory across sessions */}
      <Sequence from={4479} durationInFrames={192} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={192} kicker="GITHUB · REPO 6" title="CLAUDE-MEM" fullBleed={false} tint="#D97757" src={`${SHOT}/claude-mem-hero-wide.png`} url="github.com/thedotmack/claude-mem" imageW={1900} imageH={1016} from={{ x: 380, y: 20, w: 1200, h: 641 }} to={{ x: 0, y: 0, w: 1900, h: 1016 }} zoomAt={12} highlight={{ x: 440, y: 40, w: 1030, h: 70 }} highlightAt={88} />
      </Sequence>
      {/* 2:36 close → reopen → recalled */}
      <Sequence from={4677} durationInFrames={373} premountFor={30}>
        <StepsScene durationInFrames={373} kicker="TWO DAYS LATER" title="IT STILL KNOWS WHY" steps={[{ label: "CLOSE", at: 21 }, { label: "REOPEN", at: 189 }, { label: "RECALLED", at: 271 }]} accent="#4FA98A" tint="#4FA98A" subject />
      </Sequence>
      <Sequence from={5050} durationInFrames={154} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={154} kicker="UNDER THE HOOD" title="MEMORY, AUTOMATIC" fullBleed={false} tint="#6E93BD" src={`${SHOT}/claude-mem-features-wide.png`} url="github.com/thedotmack/claude-mem" imageW={1900} imageH={1016} from={{ x: 60, y: 30, w: 1400, h: 748 }} to={{ x: 0, y: 0, w: 1900, h: 1016 }} zoomAt={12} />
      </Sequence>
      <Sequence from={5204} durationInFrames={163} premountFor={30}>
        <FinalTakeawayScene durationInFrames={163} title="STORED ≠ STILL TRUE" stamp="RE-CHECK IT" stampAt={128} accent="#C9913D" />
      </Sequence>

      {/* CH7 2:58 — superpowers: the stricter process */}
      <Sequence from={5367} durationInFrames={228} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={228} kicker="GITHUB · REPO 7" title="SUPERPOWERS" tint="#E8B84B" src={`${SHOT}/superpowers-top-wide.png`} url="github.com/obra/superpowers" imageW={3840} imageH={2052} from={{ x: 2300, y: 200, w: 1300, h: 694 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={12} highlight={{ x: 2570, y: 400, w: 580, h: 180 }} highlightAt={101} />
      </Sequence>
      <Sequence from={5595} durationInFrames={235} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={235} kicker="ITS OWN WORDS" title="ASKS BEFORE IT BUILDS" fullBleed={false} tint="#4FA98A" src={`${SHOT}/superpowers-workflow-wide.png`} url="github.com/obra/superpowers" imageW={1920} imageH={1026} from={{ x: 60, y: 331, w: 1300, h: 695 }} to={{ x: 0, y: 0, w: 1920, h: 1026 }} zoomAt={12} highlight={{ x: 90, y: 850, w: 1450, h: 110 }} highlightAt={100} />
      </Sequence>
      {/* 3:14 the invite-feature interrogation */}
      <Sequence from={5836} durationInFrames={337} premountFor={30}>
        <GatesScene durationInFrames={337} kicker="ADD TEAM INVITES?" title="FIRST, THE QUESTIONS" gates={[{ label: "WHO SENDS?", at: 106 }, { label: "WHEN TO EXPIRE?", at: 172 }]} missingAt={235} missingLabel="CAUGHT EARLY" subject={false} tint="#D97757" />
      </Sequence>
      <Sequence from={6167} durationInFrames={163} premountFor={30}>
        <FinalTakeawayScene durationInFrames={163} title="BIG FEATURES: YES" stamp="ONE-LINERS: SKIP" stampAt={95} accent="#C9913D" />
      </Sequence>

      {/* 3:33 THE RECAP MONTAGE — seven repo pages, seven pull-lefts */}
      <Sequence from={6390} durationInFrames={85} premountFor={30}><Montage dur={85} src={`${SHOT}/awesome-cc-top-wide.png`} url="github.com/hesreallyhim/awesome-claude-code" /></Sequence>
      <Sequence from={6475} durationInFrames={103} premountFor={30}><Montage dur={103} src={`${SHOT}/anthropic-skills-top-wide.png`} url="github.com/anthropics/skills" /></Sequence>
      <Sequence from={6578} durationInFrames={110} premountFor={30}><Montage dur={110} src={`${SHOT}/claude-context-top-wide.png`} url="github.com/zilliztech/claude-context" /></Sequence>
      <Sequence from={6688} durationInFrames={118} premountFor={30}><Montage dur={118} src={`${SHOT}/ecc-skills-table-wide.png`} url="github.com/affaan-m/everything-claude-code" w={1760} h={941} /></Sequence>
      <Sequence from={6806} durationInFrames={103} premountFor={30}><Montage dur={103} src={`${SHOT}/cc-action-top-wide.png`} url="github.com/anthropics/claude-code-action" /></Sequence>
      <Sequence from={6909} durationInFrames={100} premountFor={30}><Montage dur={100} src={`${SHOT}/claude-mem-top-wide.png`} url="github.com/thedotmack/claude-mem" /></Sequence>
      <Sequence from={7009} durationInFrames={135} premountFor={30}><Montage dur={135} src={`${SHOT}/superpowers-top-wide.png`} url="github.com/obra/superpowers" /></Sequence>
      <Sequence from={7144} durationInFrames={130} premountFor={30}>
        <FinalTakeawayScene durationInFrames={130} title="PICK BY BOTTLENECK" stamp="NOT BY HYPE" stampAt={39} accent="#E8B84B" />
      </Sequence>

      {/* chapter badges — serif rank + repo name, skipping nothing (receipts
          in this cut carry their own stickers top-center/right; badge stays
          top-left and clear) */}
      {/* badges ride the ANIMATED beats only - receipts carry their own
          stickers (no double-naming) */}
      <Sequence from={950} durationInFrames={164}><ChapterBadge rank="1/7" name="Awesome Claude Code" /></Sequence>
      <Sequence from={1342} durationInFrames={522}><ChapterBadge rank="2/7" name="Anthropic Skills" /></Sequence>
      <Sequence from={2366} durationInFrames={403}><ChapterBadge rank="3/7" name="Claude Context" /></Sequence>
      <Sequence from={3394} durationInFrames={299}><ChapterBadge rank="4/7" name="Everything Claude Code" /></Sequence>
      <Sequence from={4238} durationInFrames={162}><ChapterBadge rank="5/7" name="Claude Code Action" /></Sequence>
      <Sequence from={4677} durationInFrames={373}><ChapterBadge rank="6/7" name="Claude-Mem" /></Sequence>
      <Sequence from={5204} durationInFrames={163}><ChapterBadge rank="6/7" name="Claude-Mem" /></Sequence>
      <Sequence from={5836} durationInFrames={494}><ChapterBadge rank="7/7" name="Superpowers" /></Sequence>

      {/* 4:03 OUTRO — anchored to the spoken "subscribe" (7294) */}
      <Sequence from={7286} durationInFrames={REPOS_DUR - 7286} premountFor={30}>
        <Fable5Outro durationInFrames={REPOS_DUR - 7286} kicker="PRACTICAL AI — NO HYPE" tag="Which repo fixes your bottleneck? Tell me below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const ReposVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ReposVisuals />

      {/* ===== MUSIC — short low beds over the peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={620} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={3687} durationInFrames={713} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={6390} durationInFrames={896} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={7286} durationInFrames={REPOS_DUR - 7286} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — the palette ROTATES (Kris: "vary the audio effects"):
          whoosh only on fullscreen span starts; chapter/receipt cuts ride the
          entry pool (pageTurn/swish/paperSlide/shutterOld in rotation), all
          pitch-varied over five rates. ===== */}
      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.whoosh : pick(SFX_POOLS.entry, i)} volume={b.fullscreen ? 0.42 : 0.36} rate={vary(i)} />
      ))}
      <SfxCue from={7286} src={SFX.whoosh} volume={0.42} />
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.34 : cue.type === "whip" ? 0.26 : cue.type === "tick" ? 0.22 : 0.3} rate={vary(i + 2)} />
      ))}
      <SfxCue from={7298} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
