import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FakeTerminal, InstallPayoff, WordPops } from "./components/HookOverlays";
import { OpeningHook } from "./components/OpeningHook";
import { Agenda } from "./components/Agenda";
import { StepLowerThird } from "./components/StepLowerThird";
import { CommandChip } from "./components/CommandChip";
import { CodeTermChips, RulesFanOut, SkillBadge } from "./components/KeyTermPops";
import { Outro } from "./components/Outro";
import { AnimatedBackground } from "./components/AnimatedBackground";

const STEP_DUR = 110;

// All timings derived from the narration transcript at 30fps (frame = sec×30).
// Step lower-thirds announce each section as the narrator reaches it.
const STEPS = [
  { from: 979, step: "STEP 01", title: "Create the project" }, // 0:32.6 "first open your terminal"
  { from: 1761, step: "STEP 02", title: "Setup prompts" }, // 0:58.7 "a few setup prompts"
  { from: 2466, step: "STEP 03", title: "Install the skill" }, // 1:22.2 "where to install it"
  { from: 4143, step: "STEP 04", title: "Install dependencies" }, // 2:18.1 "install the project dependencies"
  { from: 5304, step: "STEP 05", title: "Inside the skill" }, // 2:56.8 "what actually happened"
  { from: 6604, step: "STEP 06", title: "Run the studio" }, // 3:40.1 "see the project run"
  { from: 7027, step: "STEP 07", title: "Build with Claude Code" }, // 3:54.2 "for the fun part"
  { from: 10105, step: "STEP 08", title: "Export" }, // 5:36.8 "to export the animation"
];

// Command chips slide in from the right exactly as the narrator says the command.
const CHIPS = [
  { from: 1121, command: "npx create-video@latest my-project", durationInFrames: 165 }, // 0:37.4
  { from: 4293, command: "npm install", durationInFrames: 120 }, // 2:23.1
  { from: 4749, command: "npx skills add remotion-dev/skills", durationInFrames: 150 }, // 2:38.3
  { from: 6753, command: "npm run dev", durationInFrames: 120 }, // 3:45.1
];

// Transcript-synced overlay track.
//   • 0:00–0:32 (f0–960): branded cinematic intro + agenda — full AnimatedBackground.
//   • 0:32–6:02: transparent overlays (steps, chips, key-terms) annotating the
//     live screen recording — the key-term callouts are intentionally NOT full
//     backgrounds, because the narrator is demonstrating real files on screen.
//   • 6:02–6:11 (f10865–11145): branded outro — full AnimatedBackground.
export const TutorialOverlays: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ===== INTRO + OVERVIEW — branded full-screen moment (0:00–0:32) ===== */}
      <Sequence  durationInFrames={960} premountFor={30}>
        <AnimatedBackground durationInFrames={960} />

        {/* HOOK — choreographed to line 1's words: charge-up → ignite on
            "this" (f53) → supernova on "or this" (f63) → title on "using AI" (f74) */}
        <Sequence  durationInFrames={125}>
          <OpeningHook />
        </Sequence>
        <Sequence from={125} durationInFrames={167}>
          <FakeTerminal durationInFrames={167} />
        </Sequence>
        <Sequence from={292} durationInFrames={175}>
          <WordPops durationInFrames={175} />
        </Sequence>
        <Sequence from={467} durationInFrames={75}>
          <InstallPayoff durationInFrames={75} />
        </Sequence>

        {/* OVERVIEW agenda */}
        <Sequence from={542} durationInFrames={408}>
          <Agenda durationInFrames={408} />
        </Sequence>
      </Sequence>

      {/* ===== STEP LOWER-THIRDS (transparent, over screen recording) ===== */}
      {STEPS.map((s) => (
        <Sequence key={s.step} from={s.from} durationInFrames={STEP_DUR} premountFor={30}>
          <StepLowerThird step={s.step} title={s.title} durationInFrames={STEP_DUR} />
        </Sequence>
      ))}

      {/* ===== COMMAND CHIPS (transparent) ===== */}
      {CHIPS.map((c) => (
        <Sequence key={c.from} from={c.from} durationInFrames={c.durationInFrames} premountFor={30}>
          <CommandChip command={c.command} durationInFrames={c.durationInFrames} />
        </Sequence>
      ))}

      {/* ===== KEY-TERM POPS (transparent callouts over the live file demo) ===== */}
      {/* 3:03.1 "you'll see a skill dot MD file" */}
      <Sequence from={5492} durationInFrames={420} premountFor={30}>
        <SkillBadge durationInFrames={420} />
      </Sequence>
      {/* 3:19.2 "if we expand the rules folder ... compositions, timings, transitions, text" */}
      <Sequence from={5977} durationInFrames={600} premountFor={30}>
        <RulesFanOut durationInFrames={600} />
      </Sequence>
      {/* 4:44.4 "use current frame, interpolate, and spring" */}
      <Sequence from={8531} durationInFrames={200} premountFor={30}>
        <CodeTermChips durationInFrames={200} />
      </Sequence>

      {/* ===== OUTRO — branded full-screen moment (6:02–6:11) ===== */}
      <Sequence from={10865} durationInFrames={285} premountFor={30}>
        <AnimatedBackground durationInFrames={285} />
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
