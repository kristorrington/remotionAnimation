import React from "react";
import { AbsoluteFill } from "remotion";
import { TutorialReframe, Shot, R } from "./motion/ReframeDirector";

// TutorialFinal — the reframed 16:9 cut of the Claude Code password-generator
// how-to (source: claude-code-tutorial-final.mp4, 3840×1080 32:9 → reframed per
// CLAUDE.md §16 / AGENTS.md §13). Layouts switch on the spoken content; the demo
// goes full-screen whenever text must be read, the face is full-screen for the
// hook/verdict/outro, PIP while narrating a screen action. Frames are 30fps,
// pinned to the tutorial transcript.

export const TUTORIAL_DUR = 6320; // ~3:31 @ 30fps
const SRC = "claude-code-tutorial-final.mp4";

const SHOTS: Shot[] = [
  // ── INTRO (face hook → teaser of the finished app → into it) ──
  { from: 0, to: 290, layout: "face", label: "HOW TO USE CLAUDE CODE" }, // "build a working password generator / for beginners"
  { from: 290, to: 410, layout: "screen", zoom: R.APP, showFrame: 4500, label: "THE FINISHED APP" }, // teaser: "empty folder → working generator"
  { from: 410, to: 454, layout: "face" }, // "so let's get into it"

  // ── STARTING POINT ──
  { from: 454, to: 749, layout: "screen", push: true, label: "STARTING FROM AN EMPTY FOLDER" }, // "Claude Code open + empty folder / CLI in the middle"

  // ── THE PROMPT (establish full, then zoom to read as it types in) ──
  { from: 749, to: 1010, layout: "screen", push: true, label: "THE PROMPT" }, // establish: typing begins
  { from: 1010, to: 1367, layout: "screen", zoom: R.PROMPT, push: true }, // read the prompt + file list
  { from: 1367, to: 1835, layout: "screen", zoom: R.PROMPT, push: true }, // the RULES: slider 8–32, options, buttons, dark UI
  { from: 1835, to: 2168, layout: "pip", pipCorner: "br" }, // "keep it beginner friendly / explain how to run"

  // ── PICK THE MODEL (establish as he clicks /, then zoom the open list) ──
  { from: 2168, to: 2346, layout: "screen", push: true, label: "PICK THE MODEL" }, // "click the forward slash, select our model"
  { from: 2346, to: 2468, layout: "screen", zoom: R.MODEL, push: true }, // the open list: Fable/Opus/Sonnet/Haiku
  { from: 2468, to: 2681, layout: "pip", pipCorner: "br" }, // "default recommendation, Opus 4.8"

  // ── CLAUDE BUILDS IT ──
  { from: 2681, to: 2846, layout: "pip", pipCorner: "br", label: "CLAUDE BUILDS IT" }, // "click go and watch"
  { from: 2846, to: 3113, layout: "screen", zoom: R.BUILD, push: true }, // "thinking / three files"
  { from: 3113, to: 3431, layout: "screen", zoom: R.BUILD }, // creating index.html / style.css / script.js
  { from: 3431, to: 3662, layout: "pip", pipCorner: "br" }, // "created the files in the project"
  { from: 3662, to: 4187, layout: "screen", zoom: R.BUILD, push: true }, // reading what each file does

  // ── RUNNING THE APP ──
  { from: 4187, to: 4475, layout: "screen", zoom: R.BUILD, label: "RUNNING THE APP" }, // "how to run it locally / open the file"
  { from: 4475, to: 4676, layout: "screen", zoom: R.APP_WIDE }, // the app appears in the browser

  // ── TESTING THE APP ──
  { from: 4676, to: 4938, layout: "screen", zoom: R.APP, label: "TESTING THE APP" }, // password / copy / paste
  { from: 4938, to: 5276, layout: "screen", zoom: R.APP }, // length slider 8→32, set 20
  { from: 5276, to: 5495, layout: "screen", zoom: R.APP }, // options → generate → copy ("bam")

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
