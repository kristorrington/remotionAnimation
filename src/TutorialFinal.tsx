import React from "react";
import { AbsoluteFill } from "remotion";
import { TutorialReframe, Shot } from "./motion/ReframeDirector";

// TutorialFinal — the reframed 16:9 cut of the Claude Code password-generator
// how-to (source: claude-code-tutorial-final.mp4, 3840×1080 32:9 → reframed per
// CLAUDE.md §16 / AGENTS.md §13). Layouts switch on the spoken content; the demo
// goes full-screen whenever text must be read, the face is full-screen for the
// hook/verdict/outro, PIP while narrating a screen action. Frames are 30fps,
// pinned to the tutorial transcript.

export const TUTORIAL_DUR = 6320; // ~3:31 @ 30fps
const SRC = "claude-code-tutorial-final.mp4";

// Kris (July 2026): the screen is 1920 native, so full-demo is sharp — DON'T zoom
// (zooms upscaled + mis-centred). Screen beats = the full demo (app on the right
// is fine); face for hook/verdict/outro; PIP while Claude works.
const SHOTS: Shot[] = [
  // ── INTRO (face hook → teaser of the finished app → into it) ──
  { from: 0, to: 290, layout: "face", label: "HOW TO USE CLAUDE CODE" }, // "build a working password generator / for beginners"
  { from: 290, to: 410, layout: "screen", showFrame: 5100, label: "THE FINISHED APP" }, // teaser: the settled app (right side of the demo)
  { from: 410, to: 454, layout: "face" }, // "so let's get into it"

  // ── STARTING POINT ──
  { from: 454, to: 749, layout: "screen", label: "STARTING FROM AN EMPTY FOLDER" }, // "Claude Code open + empty folder"

  // ── THE PROMPT (full demo — the prompt is readable at native res) ──
  { from: 749, to: 1010, layout: "screen", label: "THE PROMPT" }, // typing begins
  { from: 1010, to: 1835, layout: "screen" }, // the full prompt + rules type in
  { from: 1835, to: 2168, layout: "pip", pipCorner: "br" }, // "keep it beginner friendly / explain how to run"

  // ── PICK THE MODEL ──
  { from: 2168, to: 2468, layout: "screen", label: "PICK THE MODEL" }, // "/model → Fable/Opus/Sonnet/Haiku"
  { from: 2468, to: 2681, layout: "pip", pipCorner: "br" }, // "default recommendation, Opus 4.8"

  // ── CLAUDE BUILDS IT (presenter PIP while he narrates the build) ──
  { from: 2681, to: 2846, layout: "pip", pipCorner: "br", label: "CLAUDE BUILDS IT" }, // "click go and watch"
  { from: 2846, to: 3431, layout: "pip", pipCorner: "br" }, // "thinking / creating index.html, style.css, script.js"
  { from: 3431, to: 3662, layout: "pip", pipCorner: "br" }, // "created the files in the project"
  { from: 3662, to: 4187, layout: "screen" }, // reading what each file does (full read)

  // ── RUNNING THE APP ──
  { from: 4187, to: 4676, layout: "screen", label: "RUNNING THE APP" }, // "how to run it / open the file" → the app appears

  // ── TESTING THE APP (full demo; the generator sits on the right) ──
  { from: 4676, to: 5495, layout: "screen", label: "TESTING THE APP" }, // length / options / generate / copy

  // ── PAYOFF + OUTRO (face) ──
  { from: 5495, to: 5819, layout: "face", label: "KEY TAKEAWAY" }, // "that's how easy it is / just prompt Claude"
  { from: 5819, to: TUTORIAL_DUR, layout: "face", label: "SUBSCRIBE" }, // "subscribe / full Claude guide coming"
];

export const TutorialFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TutorialReframe src={SRC} shots={SHOTS} volume={1.0} />
    </AbsoluteFill>
  );
};
