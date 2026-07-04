import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { SectionCard } from "./components/SectionCard";
import { Fable5Timeline } from "./components/Fable5Timeline";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { ClaudeMark, IconBlock, IconGauge, IconGuard, IconContext, IconPrice, IconCalendar, IconChange } from "./components/Cartoons";
import { SFX, SfxCue } from "./components/Sfx";
import { MusicBed } from "./components/MusicBed";

// Fable5Video — transparent overlay track for the "Fable 5 is back" explainer
// (~5m27s, 9810f @ 30fps). Each cutaway's TITLE is anchored to the frame the
// narrator actually says it (frame = sec×30), and items to each spoken line, so
// nothing appears ahead of the voiceover. Transparent gaps = talking head.
// Render transparent (ProRes 4444); SFX included.

type Card = { from: number; dur: number; kicker?: string; title: string; items?: string[]; itemDelays?: number[]; icon?: React.ReactNode };

const CARDS: Card[] = [
  { from: 0, dur: 170, icon: <ClaudeMark size={150} />, kicker: "FABLE 5 IS BACK", title: "BUT FIRST…" }, // L1 "fable 5 is back" 0:00
  { from: 320, dur: 330, icon: <IconBlock />, title: "THE RULES CHANGED", items: ["Some requests may be blocked", "Answers handled differently", "Shorter free window than you think"], itemDelays: [87, 133, 214] }, // L5 "rules…changed" 0:10.8
  { from: 774, dur: 346, icon: <IconGauge />, kicker: "THE REAL QUESTION", title: "CAN YOU RELY ON IT?", items: ["What's changed", "How to access it", "When to use — and avoid"], itemDelays: [193, 231, 260] }, // L11 "can you actually rely on it" 0:26
  { from: 1277, dur: 83, kicker: "THE TAKEAWAY", title: "DON'T BUILD ON ONE MODEL", items: ["It can change overnight"], itemDelays: [28] }, // L18-19 "around one model…change overnight" 0:42.8
  { from: 2370, dur: 720, icon: <IconGuard />, kicker: "IT'S BACK — WITH A CATCH", title: "NOW: MORE GUARDRAILS", items: ["May refuse requests more often", "May route to other models", "Can feel inconsistent"], itemDelays: [278, 415, 588] }, // L35 "more guardrails" 1:19
  { from: 4401, dur: 255, icon: <IconGauge />, kicker: "THE PART PEOPLE MISS", title: "POWER ≠ RELIABILITY" }, // L64 2:26.9
  { from: 4770, dur: 910, icon: <IconContext />, kicker: "THE BIG STRENGTH", title: "HUGE CONTEXT WINDOW", items: ["Long documents", "Complex codebases", "Reasons across all of it"], itemDelays: [209, 245, 300] }, // L70 "large amounts of context" 2:39.2
  { from: 5748, dur: 640, icon: <IconPrice />, kicker: "THE TRADE-OFF", title: "NOT CHEAP — NOT FOR BASICS", items: ["Skip it for short messages", "Skip it for small summaries", "Use it only when needed"], itemDelays: [228, 297, 480] }, // L84 "not cheap" 3:11.8
  { from: 6563, dur: 460, icon: <ClaudeMark size={120} />, kicker: "HOW TO ACCESS", title: "MODEL PICKER IN CLAUDE", items: ["Open the model selector", "Choose Fable 5", "Ready to go"], itemDelays: [127, 148, 177] }, // L96 "model picker in Claude" 3:38.9
  { from: 7026, dur: 680, icon: <IconCalendar />, kicker: "FREE WINDOW ENDS", title: "JULY 7", items: ["Free for certain users — until Jul 7", "Then a credit-based system", "Don't wait — test it now"], itemDelays: [10, 108, 269] }, // L102 "until July 7th" 3:54.4
  { from: 8384, dur: 750, icon: <IconChange />, kicker: "THE REAL LESSON", title: "EVERYTHING CAN CHANGE", items: ["Access can change", "Rules can change", "Pricing can change"], itemDelays: [6, 46, 91] }, // L121-122 "access/rules/pricing can change" 4:39.7
];

export const Fable5Video: React.FC = () => {
  return (
    <AbsoluteFill>
      {CARDS.map((c) => (
        <Sequence key={c.from} from={c.from} durationInFrames={c.dur} premountFor={30}>
          <SectionCard kicker={c.kicker} title={c.title} items={c.items} itemDelays={c.itemDelays} icon={c.icon} durationInFrames={c.dur} />
        </Sequence>
      ))}

      {/* 0:45 — the timeline (nodes appear on the dates) */}
      <Sequence from={1364} durationInFrames={1006} premountFor={30}>
        <Fable5Timeline durationInFrames={1006} />
      </Sequence>

      {/* 1:58 — simple vs complex (right column delayed to "more complex" @ 2:04.7) */}
      <Sequence from={3540} durationInFrames={800} premountFor={30}>
        <CompareCard
          kicker="WHERE IT MATTERS"
          left={{ title: "Simple tasks", items: ["Chatting", "Basic writing", "Barely any difference"], accent: "#34D399", mark: "✓" }}
          right={{ title: "Complex work", items: ["Running a workflow", "Large documents", "Be more careful"], accent: "#F59E0B", mark: "!" }}
          leftDelay={70}
          rightDelay={200}
          durationInFrames={800}
        />
      </Sequence>

      {/* 4:17 — should you switch? (left "use it" @ 4:23.3, right "avoid" @ 4:31.9) */}
      <Sequence from={7720} durationInFrames={620} premountFor={30}>
        <CompareCard
          kicker="SHOULD YOU SWITCH?"
          left={{ title: "Use it", items: ["Deeper understanding", "Larger inputs", "Long docs & hard problems"], accent: "#34D399", mark: "✓" }}
          right={{ title: "Avoid it", items: ["Repetitive tasks", "Low-value work", "No fallback plan"], accent: "#EF4444", mark: "✗" }}
          leftDelay={180}
          rightDelay={437}
          durationInFrames={620}
        />
      </Sequence>

      {/* 5:14 — outro / subscribe (lands on "subscribe" @ 5:17) */}
      <Sequence from={9420} durationInFrames={390} premountFor={30}>
        <Fable5Outro durationInFrames={390} />
      </Sequence>

      {/* ===== SOUND EFFECTS ===== */}
      {/* whoosh on each card (compare cards + timeline get their own accents below) */}
      {[0, 320, 774, 1277, 2370, 4401, 4770, 5748, 6563, 7026, 8384, 9420].map((f) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.5} />
      ))}
      {/* soft tick as each card bullet appears */}
      {CARDS.flatMap((c) => (c.itemDelays ?? []).map((d) => (
        <SfxCue key={`tk-${c.from}-${d}`} from={c.from + d + 6} src={SFX.switch} volume={0.3} />
      )))}
      {/* page-turn as the timeline unrolls */}
      <SfxCue from={1364} src={SFX.pageTurn} volume={0.4} />
      {/* whip as each compare card's columns snap in */}
      {[3540, 3740, 7720, 8157].map((f) => (
        <SfxCue key={`wp-${f}`} from={f} src={SFX.whip} volume={0.4} />
      ))}
      {/* boom on the big "catch" reveal — NOW: MORE GUARDRAILS */}
      <SfxCue from={2376} src={SFX.boom} volume={0.4} />
      {/* timeline node dings (Jun 9 / Jun 12 / Jun 30 / Jul 1) */}
      {[1500, 1758, 2136, 2264].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.ding} volume={0.45} />
      ))}
      <SfxCue from={7036} src={SFX.ding} volume={0.55} />
      <SfxCue from={9420} src={SFX.ding} volume={0.5} />

      {/* ===== BACKGROUND MUSIC (public/music/*.MP3) ================================
          Cut into short low beds over KEY sections only — music enters for the
          emotional peaks and drops out under the demos, so it never drones. */}
      <MusicBed src={staticFile("music/calm.MP3")}    from={0}    durationInFrames={900}  volume={0.07} fadeOutFrames={90}  />{/* hook / setup */}
      <MusicBed src={staticFile("music/calm.MP3")}    from={4770} durationInFrames={900}  volume={0.06} fadeInFrames={45} fadeOutFrames={120} startFrom={900} />{/* the big strength */}
      <MusicBed src={staticFile("music/tension.MP3")} from={7026} durationInFrames={1300} volume={0.085} fadeInFrames={45} fadeOutFrames={120} />{/* July-7 deadline / should you switch */}
      <MusicBed src={staticFile("music/outro.MP3")}   from={8384} durationInFrames={1426} volume={0.075} fadeInFrames={45} />{/* the real lesson → outro */}
    </AbsoluteFill>
  );
};
