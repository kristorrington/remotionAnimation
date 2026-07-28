import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TutorialReframe, Shot, R } from "./motion/ReframeDirector";
import { FONT, SERIF } from "./components/overlayUI";
import { SfxCue, SFX } from "./components/Sfx";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CutFlash } from "./components/CutFlash";
import { TUTORIAL_CAPTIONS } from "./tutorialCaptionPhrases";

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
  { from: 290, to: 454, layout: "appteaser", label: "THE FINISHED APP" }, // teaser: face live + app card zooms in on the right (+ whoosh); holds through "so let's get into it" (no double-cut)

  // ── STARTING POINT (presenter PIP while he introduces the empty project) ──
  { from: 454, to: 749, layout: "pip", pipCorner: "bl", screenFrozenImg: "assets/external/screenshots/tutorial-empty.png", label: "STARTING FROM AN EMPTY FOLDER" }, // frozen (source has a torn segment ~f470); screen is idle here

  // ── THE PROMPT (establish, then ZOOM in and highlight each line as read) ──
  { from: 749, to: 850, layout: "screen", label: "THE PROMPT" }, // typing begins (full window)
  { from: 850, to: 1835, layout: "screen", zoom: R.PROMPT, highlights: [
    // box shows the TOP first (build a → create → files)…
    { rect: { x: 748, y: 762, w: 740, h: 26 }, at: 20, dur: 80 }, // "build a simple password generator…" (~870)
    { rect: { x: 748, y: 800, w: 160, h: 24 }, at: 150, dur: 60 }, // "Create:" (~1000)
    { rect: { x: 748, y: 819, w: 240, h: 24 }, at: 200, dur: 45 }, // "index.html" (~1050)
    { rect: { x: 748, y: 838, w: 220, h: 24 }, at: 250, dur: 40 }, // "styles.css" (~1100)
    { rect: { x: 748, y: 858, w: 200, h: 24 }, at: 295, dur: 28 }, // "script.js" — ends before the box scrolls to the rules
    // …then it scrolls to the rules (measured at f1424, stable through 1787)
    { rect: { x: 748, y: 817, w: 500, h: 24 }, at: 574, dur: 100 }, // "password length slider from 8 to 32" (1424)
    { rect: { x: 748, y: 836, w: 670, h: 24 }, at: 690, dur: 70 }, // "options for uppercase, lowercase, numbers, symbols" (1540)
    { rect: { x: 748, y: 855, w: 410, h: 24 }, at: 767, dur: 60 }, // "a generate password button" (1617)
    { rect: { x: 748, y: 874, w: 370, h: 24 }, at: 821, dur: 70 }, // "a copy password button" (1671)
    { rect: { x: 748, y: 894, w: 330, h: 24 }, at: 937, dur: 100 }, // "a clean, dark interface" (1787)
  ] },
  { from: 1835, to: 2168, layout: "pip", pipCorner: "bl" }, // "keep it beginner friendly / explain how to run"

  // ── PICK THE MODEL (presenter PIP as he explains, then zoom the open list) ──
  { from: 2168, to: 2346, layout: "pip", pipCorner: "bl", label: "PICK THE MODEL" }, // "click the forward slash, select our model"
  { from: 2346, to: 2468, layout: "screen", zoom: R.MODEL }, // zoom the open list: Fable/Opus/Sonnet/Haiku
  { from: 2468, to: 2681, layout: "pip", pipCorner: "bl" }, // "default recommendation, Opus 4.8"

  // ── CLAUDE BUILDS IT (presenter PIP while he narrates the build) ──
  { from: 2681, to: 2846, layout: "pip", pipCorner: "bl", label: "CLAUDE BUILDS IT" }, // "click go and watch"
  { from: 2846, to: 3431, layout: "pip", pipCorner: "bl" }, // "thinking / creating index.html, style.css, script.js"
  { from: 3431, to: 3662, layout: "pip", pipCorner: "bl" }, // "created the files in the project"
  { from: 3662, to: 4187, layout: "pip", pipCorner: "bl", highlights: [
    { rect: { x: 405, y: 474, w: 600, h: 28 }, at: 12, dur: 200 }, // index.html — structure (3674)
    { rect: { x: 405, y: 492, w: 420, h: 26 }, at: 241, dur: 120 }, // styles.css — dark theme (3903)
    { rect: { x: 405, y: 510, w: 580, h: 26 }, at: 375, dur: 130 }, // script.js — generation logic (4037)
  ] }, // reading what each file does

  // ── RUNNING THE APP (presenter PIP bottom-right, same as the rest; app card sits above it) ──
  { from: 4187, to: 4676, layout: "pip", pipCorner: "bl", label: "RUNNING THE APP" }, // "how to run it / open the file" → the app appears

  // ── TESTING THE APP (PIP + highlight each control as he uses it) ──
  { from: 4676, to: 5495, layout: "pip", pipCorner: "bl", label: "TESTING THE APP", highlights: [
    { rect: { x: 1300, y: 500, w: 420, h: 66 }, at: 234, dur: 130 }, // "change the length" — Length slider (4910)
    { rect: { x: 1290, y: 698, w: 430, h: 62 }, at: 644, dur: 90 }, // "generate a new password" — button (5320)
    { rect: { x: 1600, y: 428, w: 120, h: 52 }, at: 750, dur: 80 }, // "copy it" — Copy button (5426)
  ] },

  // ── PAYOFF + OUTRO (face + the finished app recap) ──
  { from: 5495, to: 5819, layout: "appteaser", label: "YOU BUILT THIS" }, // "that's how easy it is / just prompt Claude" — recap the app

  { from: 5819, to: TUTORIAL_DUR, layout: "face", label: "SUBSCRIBE" }, // "subscribe / full Claude guide coming"
];

// Top progress bar chapters (viewer-facing steps).
const CHAPTERS: Chapter[] = [
  { label: "Intro", from: 0 },
  { label: "The Prompt", from: 749 },
  { label: "Pick Model", from: 2168 },
  { label: "Claude Builds", from: 2681 },
  { label: "Run", from: 4187 },
  { label: "Test", from: 4676 },
  { label: "Done", from: 5495 },
];

// Opening title over the hook.
const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
  const op = Math.min(interpolate(frame, [6, 20], [0, 1], CLAMP), interpolate(frame, [120, 138], [1, 0], CLAMP));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, opacity: op, pointerEvents: "none" }}>
      <div style={{ transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 76, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,0.8)", letterSpacing: 0.5 }}>Build a Password Generator</div>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 12, padding: "8px 20px", borderRadius: 10, background: "rgba(217,119,87,0.92)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: "#fff", textTransform: "uppercase" }}>with Claude Code · no coding</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Burned-in captions — the current phrase, docked low (muted-viewing / retention).
const TutorialCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const cap = TUTORIAL_CAPTIONS.find((c) => frame >= c.from - 4 && frame <= c.to + 8);
  if (!cap) return null;
  const op = Math.min(interpolate(frame, [cap.from - 4, cap.from + 3], [0, 1], CLAMP), interpolate(frame, [cap.to, cap.to + 8], [1, 0], CLAMP));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 44, pointerEvents: "none" }}>
      <div style={{ maxWidth: 1180, opacity: op, padding: "12px 30px", borderRadius: 12, background: "rgba(12,11,10,0.82)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, lineHeight: 1.15, color: "#fff", textAlign: "center", display: "block" }}>{cap.text}</span>
      </div>
    </AbsoluteFill>
  );
};

// A click ripple at a screen point (output px) at a frame.
const ClickRipple: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 24], [0, 1], CLAMP);
  const op = interpolate(frame, [0, 4, 24], [0, 0.7, 0], CLAMP);
  if (frame > 26) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: "50%", border: "5px solid #fff", transform: `scale(${interpolate(t, [0, 1], [0.2, 1.6])})`, opacity: op, pointerEvents: "none", boxShadow: "0 0 20px rgba(255,255,255,0.6)" }} />
  );
};

export const TutorialFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TutorialReframe src={SRC} shots={SHOTS} volume={1.0} />

      {/* burned-in captions (hidden under the subscribe CTA) */}
      <Sequence from={0} durationInFrames={5840}><TutorialCaptions /></Sequence>

      {/* click ripples on the key actions */}
      <Sequence from={5320} durationInFrames={28}><ClickRipple x={1545} y={748} /></Sequence>{/* Generate */}
      <Sequence from={5426} durationInFrames={28}><ClickRipple x={1700} y={452} /></Sequence>{/* Copy */}

      {/* opening title over the hook */}
      <Sequence from={30} durationInFrames={140}><IntroTitle /></Sequence>

      {/* SUBSCRIBE — springs in over the outro */}
      <Sequence from={5880} durationInFrames={TUTORIAL_DUR - 5880}><SubscribeCTA /></Sequence>

      {/* ── SOUND DESIGN ── */}
      <SfxCue from={293} src={SFX.whoosh} volume={0.5} />{/* app teaser zoom-in */}
      {/* subtle whoosh on each section change */}
      {[454, 749, 2168, 2681, 4187, 4676, 5495].map((f) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.softWhoosh} volume={0.3} />
      ))}
      <SfxCue from={2549} src={SFX.switch} volume={0.4} />{/* model select */}
      <SfxCue from={2686} src={SFX.click} volume={0.45} />{/* click go */}
      <SfxCue from={5320} src={SFX.click} volume={0.5} />{/* generate click */}
      <SfxCue from={5372} src={SFX.ding} volume={0.5} />{/* password appears — success chime */}
      <SfxCue from={5426} src={SFX.click} volume={0.5} />{/* copy click */}
      <SfxCue from={5440} src={SFX.pluck} volume={0.4} />{/* copied confirm */}
      <SfxCue from={5880} src={SFX.pop} volume={0.45} />{/* subscribe pops */}

      {/* subtle flashes at the chapter turns for snap */}
      {[454, 749, 2168, 2681, 4187, 5495].map((f) => (
        <CutFlash key={`f-${f}`} at={f} peak={0.22} />
      ))}

      {/* persistent top progress + step chapters */}
      <TopProgressBar sections={CHAPTERS} accent="#D97757" />
    </AbsoluteFill>
  );
};
