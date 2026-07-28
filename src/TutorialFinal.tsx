import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TutorialReframe, Shot, R } from "./motion/ReframeDirector";
import { FONT } from "./components/overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A YouTube-style SUBSCRIBE button that springs in over the outro, gets a cursor
// "click" (ripple + bell ring), then holds with a soft pulse.
const SubscribeCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 170, damping: 14, mass: 0.8 }, durationInFrames: 26 });
  const CLICK = 44;
  const press = interpolate(frame, [CLICK, CLICK + 5, CLICK + 12], [1, 0.92, 1], CLAMP);
  const ripple = interpolate(frame, [CLICK, CLICK + 26], [0, 1], CLAMP);
  const rippleOp = interpolate(frame, [CLICK, CLICK + 26], [0.5, 0], CLAMP);
  const bell = frame >= CLICK ? Math.sin((frame - CLICK) * 0.9) * Math.max(0, interpolate(frame, [CLICK, CLICK + 22], [12, 0], CLAMP)) : 0;
  const pulse = 1 + 0.02 * Math.sin(frame * 0.12);
  const cursorX = interpolate(frame, [8, CLICK], [180, 24], CLAMP);
  const cursorY = interpolate(frame, [8, CLICK], [140, 34], CLAMP);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96, pointerEvents: "none" }}>
      <div style={{ position: "relative", transform: `scale(${interpolate(pop, [0, 1], [0.7, 1]) * press * pulse})`, opacity: interpolate(frame, [0, 10], [0, 1], CLAMP) }}>
        {/* ripple */}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 360, height: 360, marginLeft: -180, marginTop: -180, borderRadius: "50%", border: "6px solid #E03E36", transform: `scale(${interpolate(ripple, [0, 1], [0.3, 1.5])})`, opacity: rippleOp }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 40px", borderRadius: 16, background: "#E03E36", boxShadow: "0 18px 50px rgba(224,62,54,0.5)" }}>
          <svg width="42" height="42" viewBox="0 0 24 24" style={{ transform: `rotate(${bell}deg)`, transformOrigin: "50% 20%" }}>
            <path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-5v-1l-1.5-1.5V10a5.5 5.5 0 0 0-4-5.29V4a1.5 1.5 0 0 0-3 0v.71A5.5 5.5 0 0 0 6.5 10v3.5L5 15v1Z" />
          </svg>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: "#fff" }}>SUBSCRIBE</span>
        </div>
        {/* cursor */}
        {frame < CLICK + 40 && (
          <svg width="40" height="40" viewBox="0 0 24 24" style={{ position: "absolute", left: cursorX, top: cursorY, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
            <path fill="#fff" stroke="#000" strokeWidth="1" d="M4 2l7 18 2.5-7.5L21 10 4 2z" />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};

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

  // ── THE PROMPT (establish, then ZOOM in and highlight each line as read) ──
  { from: 749, to: 850, layout: "screen", label: "THE PROMPT" }, // typing begins (full window)
  { from: 850, to: 1835, layout: "screen", zoom: R.PROMPT, highlights: [
    // box shows the TOP first (build a → create → files)…
    { rect: { x: 748, y: 762, w: 740, h: 26 }, at: 20, dur: 80 }, // "build a simple password generator…" (~870)
    { rect: { x: 748, y: 800, w: 160, h: 24 }, at: 150, dur: 60 }, // "Create:" (~1000)
    { rect: { x: 748, y: 819, w: 240, h: 24 }, at: 200, dur: 60 }, // "index.html" (~1050)
    { rect: { x: 748, y: 838, w: 220, h: 24 }, at: 250, dur: 60 }, // "styles.css" (~1100)
    { rect: { x: 748, y: 858, w: 200, h: 24 }, at: 300, dur: 70 }, // "script.js" (~1150)
    // …then it scrolls to the rules (measured at f1424, stable through 1787)
    { rect: { x: 748, y: 817, w: 500, h: 24 }, at: 574, dur: 100 }, // "password length slider from 8 to 32" (1424)
    { rect: { x: 748, y: 836, w: 670, h: 24 }, at: 690, dur: 70 }, // "options for uppercase, lowercase, numbers, symbols" (1540)
    { rect: { x: 748, y: 855, w: 410, h: 24 }, at: 767, dur: 60 }, // "a generate password button" (1617)
    { rect: { x: 748, y: 874, w: 370, h: 24 }, at: 821, dur: 70 }, // "a copy password button" (1671)
    { rect: { x: 748, y: 894, w: 330, h: 24 }, at: 937, dur: 100 }, // "a clean, dark interface" (1787)
  ] },
  { from: 1835, to: 2168, layout: "pip", pipCorner: "br" }, // "keep it beginner friendly / explain how to run"

  // ── PICK THE MODEL (establish, then zoom the open list) ──
  { from: 2168, to: 2346, layout: "screen", label: "PICK THE MODEL" }, // "click the forward slash, select our model"
  { from: 2346, to: 2468, layout: "screen", zoom: R.MODEL }, // zoom the open list: Fable/Opus/Sonnet/Haiku
  { from: 2468, to: 2681, layout: "pip", pipCorner: "br" }, // "default recommendation, Opus 4.8"

  // ── CLAUDE BUILDS IT (presenter PIP while he narrates the build) ──
  { from: 2681, to: 2846, layout: "pip", pipCorner: "br", label: "CLAUDE BUILDS IT" }, // "click go and watch"
  { from: 2846, to: 3431, layout: "pip", pipCorner: "br" }, // "thinking / creating index.html, style.css, script.js"
  { from: 3431, to: 3662, layout: "pip", pipCorner: "br" }, // "created the files in the project"
  { from: 3662, to: 4187, layout: "screen", highlights: [
    { rect: { x: 405, y: 474, w: 600, h: 28 }, at: 12, dur: 200 }, // index.html — structure (3674)
    { rect: { x: 405, y: 492, w: 420, h: 26 }, at: 241, dur: 120 }, // styles.css — dark theme (3903)
    { rect: { x: 405, y: 510, w: 580, h: 26 }, at: 375, dur: 130 }, // script.js — generation logic (4037)
  ] }, // reading what each file does

  // ── RUNNING THE APP (presenter PIP while the demo works — bottom-left, clear of the app on the right) ──
  { from: 4187, to: 4676, layout: "pip", pipCorner: "bl", label: "RUNNING THE APP" }, // "how to run it / open the file" → the app appears

  // ── TESTING THE APP (PIP + highlight each control as he uses it) ──
  { from: 4676, to: 5495, layout: "pip", pipCorner: "bl", label: "TESTING THE APP", highlights: [
    { rect: { x: 1300, y: 500, w: 420, h: 66 }, at: 234, dur: 130 }, // "change the length" — Length slider (4910)
    { rect: { x: 1290, y: 698, w: 430, h: 62 }, at: 644, dur: 90 }, // "generate a new password" — button (5320)
    { rect: { x: 1600, y: 428, w: 120, h: 52 }, at: 750, dur: 80 }, // "copy it" — Copy button (5426)
  ] },

  // ── PAYOFF + OUTRO (face) ──
  { from: 5495, to: 5819, layout: "face", label: "KEY TAKEAWAY" }, // "that's how easy it is / just prompt Claude"
  { from: 5819, to: TUTORIAL_DUR, layout: "face", label: "SUBSCRIBE" }, // "subscribe / full Claude guide coming"
];

export const TutorialFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TutorialReframe src={SRC} shots={SHOTS} volume={1.0} />
      {/* SUBSCRIBE — springs in over the outro on "make sure to subscribe" (~5850) */}
      <Sequence from={5880} durationInFrames={TUTORIAL_DUR - 5880}>
        <SubscribeCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
