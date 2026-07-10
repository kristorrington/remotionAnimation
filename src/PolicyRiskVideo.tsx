import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { SectionCard } from "./components/SectionCard";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { ClaudeMark, IconGate, IconRoute, IconSilent, IconGuard, IconChange, IconGauge, IconShieldAlert, IconBug, IconChip, IconGlobe, IconStack } from "./components/Cartoons";
import { SFX, SfxCue } from "./components/Sfx";
import { MusicBed } from "./components/MusicBed";

// PolicyRiskVideo — transparent cutaway overlay for the "AI depends on policy"
// explainer (~8m02s, 14500f @ 30fps). Every title is anchored to the frame it's
// spoken (frame = sec×30); items to each line. Transparent gaps = talking head.
// Render transparent (ProRes 4444); SFX included.

type Card = { from: number; dur: number; kicker?: string; title: string; items?: string[]; itemDelays?: number[]; icon?: React.ReactNode };

const CARDS: Card[] = [
  { from: 83, dur: 235, icon: <ClaudeMark size={140} />, kicker: "YOUR AI AGENTS NOW", title: "DEPEND ON POLICY" }, // L2 "government policy" 0:02.9
  { from: 328, dur: 390, icon: <IconGate />, kicker: "WHAT ACTUALLY HAPPENED", title: "RESTRICT FOREIGN NATIONALS", items: ["Nationality can't be verified live", "→ both models went dark, for everyone"], itemDelays: [200, 300] }, // L5 0:11
  { from: 762, dur: 360, icon: <IconChange />, kicker: "NOT AN OPEN-SOURCE BAN", title: "A WARNING SHOT", items: ["Working in the morning…", "…cut off by policy that afternoon"], itemDelays: [248, 320] }, // L10 0:25.6
  { from: 1300, dur: 300, icon: <IconGauge />, kicker: "THE REAL QUESTION", title: "FASTER THAN YOUR ROADMAP?", items: ["The answer is yes."], itemDelays: [195] }, // L17 0:43.9
  { from: 2289, dur: 350, icon: <IconGuard />, kicker: "PICTURE THIS", title: "A BOUNCER AT THE DOOR", items: ["Risky request?", "Block, refuse…", "…or rotate to a weaker model"], itemDelays: [66, 130, 200] }, // L30 1:16.5
  { from: 2771, dur: 110, icon: <IconShieldAlert />, kicker: "ONCE IT'S THE WEAK POINT", title: "A NATIONAL-SECURITY ISSUE" }, // L37 1:32.6
  { from: 2874, dur: 440, icon: <IconBug />, kicker: "THE REPORTED TRIGGER", title: "SAFEGUARDS BYPASSED", items: ["Amazon researcher found a bypass", "On vulnerability prompts", "Model showed exploit code"], itemDelays: [91, 183, 312] }, // L38 1:36
  { from: 3400, dur: 430, icon: <IconGauge />, kicker: "ANTHROPIC'S ARGUMENT", title: "NARROW — NOT DOOMSDAY", items: ["A very narrow issue", "Not the drama, not the politics", "→ it's the SPEED"], itemDelays: [63, 263, 329] }, // L47 1:55.4
  { from: 3753, dur: 550, icon: <IconGate />, kicker: "JUNE 12", title: "EXPORT CONTROLS", items: ["Restrict foreign nationals", "Inside & outside the US", "→ both models pulled"], itemDelays: [207, 321, 477] }, // L51 2:05.3
  { from: 4524, dur: 420, icon: <IconChange />, kicker: "LET'S BE PRECISE", title: "NOT AN OPEN-SOURCE WIPE", items: ["HuggingFace weights: untouched", "GitHub repos: untouched", "Local models: not banned"], itemDelays: [156, 216, 237] }, // L60 2:31
  { from: 5390, dur: 700, icon: <IconChip />, kicker: "SO WHAT IS IT?", title: "STRATEGIC TECHNOLOGY", items: ["Treated like advanced chips", "Export controls & national security", "→ the lever is now ACCESS"], itemDelays: [160, 250, 607] }, // L71 2:59.7
  { from: 6310, dur: 460, icon: <IconGate />, kicker: "THE NEW RISK", title: "ACCESS IS CONDITIONAL", items: ["On your nationality", "On where you live", "On your compliance", "→ a hidden single point of failure"], itemDelays: [63, 137, 175, 376] }, // L84 3:30
  { from: 6690, dur: 470, icon: <IconGauge />, kicker: "SO — CAN THEY BAN IT?", title: "NO FULL BAN", items: ["No full open-source ban", "But access can be restricted fast", "The closest test case yet"], itemDelays: [96, 270, 366] }, // L91 3:43.2
  { from: 7173, dur: 1150, icon: <IconGauge />, kicker: "THREE WAYS TO READ IT", title: "3 READS", items: ["1 · Safety — may reduce harm", "2 · Overreach — dangerous precedent", "3 · Unintended — builders route around"], itemDelays: [69, 585, 1053] }, // L96 3:59.1
  { from: 8358, dur: 520, icon: <IconRoute />, kicker: "BUILDERS ROUTE AROUND", title: "FIND ANOTHER ROAD", items: ["Cheaper models", "Local models", "Chinese models — GLM 5.2, Kimi"], itemDelays: [312, 336, 399] }, // L112 4:38.6
  { from: 9123, dur: 400, icon: <IconGlobe />, kicker: "CHINA ISN'T RISK-FREE", title: "DIFFERENT RISKS", items: ["Different jurisdiction", "Different government risk", "But builders are pragmatic"], itemDelays: [48, 90, 189] }, // L121 5:04.3
  { from: 10268, dur: 460, icon: <IconChange />, kicker: "NEXT TIME…", title: "IT MAY BE QUIETER", items: ["Prompts routed to a weaker model", "Regions get gated", "Usage behind credits", "Compliance rules change"], itemDelays: [88, 148, 217, 287] }, // L137 5:42.5
  { from: 10820, dur: 550, icon: <IconSilent />, kicker: "THE DANGEROUS PART", title: "IT CAN BE SILENT", items: ["Agent still runs", "Dashboard still green", "But the model is weaker underneath", "→ that's POLICY RISK"], itemDelays: [52, 154, 217, 421] }, // L146 6:00.9
  { from: 11390, dur: 340, icon: <IconChange />, kicker: "SHOULD YOU PANIC-SWITCH?", title: "NO", items: ["Switching one vendor for another…", "…just changes the logo on the risk"], itemDelays: [154, 274] }, // L153 6:18.3
  { from: 11960, dur: 240, icon: <IconStack />, kicker: "THE REAL VULNERABILITY", title: "A SINGLE POINT OF FAILURE", items: ["Single vendor", "Single jurisdiction", "Single failure point"], itemDelays: [30, 90, 130] }, // L159 6:38.9
  { from: 12210, dur: 420, icon: <IconRoute />, kicker: "THE DECISION RULE", title: "WHICH NEED A FALLBACK", items: ["Revenue-critical", "Customer-facing", "Hard to recover manually"], itemDelays: [10, 70, 110] }, // L165 6:47
  { from: 12846, dur: 700, icon: <IconGauge />, kicker: "MODEL THE FAILURE NOW", title: "ASK 3 QUESTIONS", items: ["Provider goes dark → what breaks?", "Routes to a weaker model → what silently degrades?", "Access gets gated → what's your backup?", "→ resilience, or just vibes?"], itemDelays: [102, 180, 348, 531] }, // L186 7:08.4
];

// The full-screen cutaway windows (section cards + the June-9 compare). The final
// cut uses these to show a corner PiP of the presenter while a cutaway covers the
// main footage. Outro is intentionally excluded so the subscribe screen is clean.
export const CUTAWAY_WINDOWS: { from: number; dur: number }[] = [
  ...CARDS.map((c) => ({ from: c.from, dur: c.dur })),
  { from: 1626, dur: 560 },
];

// Visual-only track (cards + compare + outro, NO audio). Reused by the vertical
// shorts' bottom panel so the animations play there in sync, without re-triggering
// the SFX/music that live in PolicyRiskVideo below.
export const PolicyRiskVisuals: React.FC = () => {
  return (
    <AbsoluteFill>
      {CARDS.map((c) => (
        <Sequence key={c.from} from={c.from} durationInFrames={c.dur} premountFor={30}>
          <SectionCard kicker={c.kicker} title={c.title} items={c.items} itemDelays={c.itemDelays} icon={c.icon} durationInFrames={c.dur} />
        </Sequence>
      ))}

      {/* 0:54 — June 9: Fable 5 vs Mythos 5 (right column delayed to "mythos 5…" @ 1:05.8) */}
      <Sequence from={1626} durationInFrames={560} premountFor={30}>
        <CompareCard
          kicker="JUNE 9 — RELEASED"
          left={{ title: "Fable 5", items: ["The public model", "Heavier safeguards"], accent: "#C15F3C", mark: "★" }}
          right={{ title: "Mythos 5", items: ["Fewer safeguards", "Trusted Glasgow partners"], accent: "#F59E0B", mark: "◆" }}
          leftDelay={234}
          rightDelay={348}
          durationInFrames={560}
        />
      </Sequence>

      {/* 7:29 — outro / subscribe */}
      <Sequence from={13560} durationInFrames={890} premountFor={30}>
        <Fable5Outro durationInFrames={890} kicker="BUILD WITH AI AGENTS?" tag="Model the failure now — before it's forced on you" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const PolicyRiskVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PolicyRiskVisuals />

      {/* ===== BACKGROUND MUSIC (public/music/*.MP3) ================================
          Cut into short low beds over KEY sections only — music enters for the
          emotional peaks and drops out under the demos, so it never drones. */}
      <MusicBed src={staticFile("music/calm.MP3")}    from={60}    durationInFrames={760}  volume={0.07} fadeOutFrames={90} />{/* the hook */}
      <MusicBed src={staticFile("music/tension.MP3")} from={2771}  durationInFrames={760}  volume={0.08} fadeInFrames={45} fadeOutFrames={120} />{/* national-security stakes */}
      <MusicBed src={staticFile("music/calm.MP3")}    from={5390}  durationInFrames={920}  volume={0.06} fadeInFrames={45} fadeOutFrames={120} startFrom={900} />{/* strategic technology / access */}
      <MusicBed src={staticFile("music/tension.MP3")} from={10268} durationInFrames={1500} volume={0.085} fadeInFrames={45} fadeOutFrames={140} />{/* it may be quieter → policy risk */}
      <MusicBed src={staticFile("music/outro.MP3")}   from={13560} durationInFrames={900}  volume={0.075} fadeInFrames={45} />{/* outro / subscribe */}

      {/* ===== SOUND EFFECTS =====
          Clearly audible but under the (×3 boosted) VO — the voice leads, the
          hits land. The export loudnorm master lifts the mix to ~-14 LUFS. */}
      {/* whoosh on every cutaway + compare + outro */}
      {[...CARDS.map((c) => c.from), 1626, 13560].map((f) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} />
      ))}
      {/* tick as each card bullet appears */}
      {CARDS.flatMap((c) => (c.itemDelays ?? []).map((d) => (
        <SfxCue key={`t-${c.from}-${d}`} from={c.from + d + 6} src={SFX.switch} volume={0.25} />
      )))}
      {/* whip as the June-9 compare columns snap in */}
      {[1860, 1974].map((f) => (
        <SfxCue key={`wp-${f}`} from={f} src={SFX.whip} volume={0.35} />
      ))}
      {/* page-turn on the structural pivots — "3 reads" and the decision rule */}
      {[7173, 12210].map((f) => (
        <SfxCue key={`pt-${f}`} from={f} src={SFX.pageTurn} volume={0.35} />
      ))}
      {/* dings on the punch beats */}
      {[1495, 6686, 7056, 12089, 13377, 13560].map((f) => (
        <SfxCue key={`d-${f}`} from={f} src={SFX.ding} volume={0.45} />
      ))}
      {/* dramatic hits: "went dark", "both models pulled", "it can be silent", panic-switch "NO" */}
      {[628, 4230, 10826, 11396].map((f) => (
        <SfxCue key={`s-${f}`} from={f} src={SFX.shutter} volume={0.4} />
      ))}
      {/* deep boom on THE turn — "a national-security issue" */}
      <SfxCue from={2777} src={SFX.boom} volume={0.45} />
    </AbsoluteFill>
  );
};
