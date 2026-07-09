import React from "react";
import { AbsoluteFill, Easing, getRemotionEnvironment, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ShortSpec } from "./types";
import { ThemeProvider } from "../theme";
import { VerticalStage } from "./VerticalStage";
import { AnimationPanel } from "./AnimationPanel";
import { TopBar } from "./TopBar";
import { HookTitle } from "./HookTitle";
import { Captions } from "./Captions";
import { captionsFor } from "./captionsRegistry";
import { ShortOutro } from "./ShortOutro";
import { LowerThird } from "./LowerThird";
import { MusicBed } from "../components/MusicBed";
import { SFX, SfxCue } from "../components/Sfx";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ANIM_H = 838; // height of the top animation band when split (~44%)
const FULL_H = 1920; // seam all the way down = animation takes the whole screen
const OUTRO = 96; // last ~3.2s

// One 1080×1920 short. Cartoon animations on TOP, talking head on BOTTOM, with a
// dynamic reframe: FULL-SCREEN face for the hook + CTA, SPLIT for the body, and
// FULL-SCREEN ANIMATION during `spec.fullscreen` spans (reveals / punchlines /
// payoffs — CLAUDE.md §9: never force every beat into split). Text stays off the
// face; sound fires on every visual change; the brand style comes from
// spec.style ("cinematic" default | "bold").
// Platform-UI safe zones (right ~12%, bottom ~18%) — flip `showSafeZones` in
// the Studio props panel while designing; it can never appear in a render.
const SafeZones: React.FC = () => {
  if (getRemotionEnvironment().isRendering) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "12%", background: "rgba(255,90,241,0.12)", borderLeft: "2px dashed #FF5AF1" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "18%", background: "rgba(255,90,241,0.12)", borderTop: "2px dashed #FF5AF1" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 190, borderBottom: "2px dashed rgba(255,90,241,0.5)" }} />
    </AbsoluteFill>
  );
};

export const VerticalShort: React.FC<{ spec: ShortSpec; showSafeZones?: boolean }> = ({ spec, showSafeZones = false }) => {
  const { durationInFrames: dur } = useVideoConfig();
  const frame = useCurrentFrame();

  const hookHold = 96; // ~3.2s — the full-screen opening needs room to breathe (2.2s was too quick)
  const seamStart = hookHold - 16;
  const seamEnd = hookHold + 4;

  // OPENING PUNCH-IN (rule, CLAUDE.md §9): the video starts SMALL (scale 0.5,
  // floating on black) and zooms up to full frame over the first ~1s with a
  // whoosh — the shot "arrives" rather than cropping into the face. It ends at
  // exactly 1.0 (normal framing), so the split arrives as usual. Face openers
  // only.
  const introZoom = spec.animHook
    ? 1
    : interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // seam keyframes: hook (face OR full animation) → split → [full-anim spans]
  // → split → CTA (face). Two rules stop the reframe from flickering ("full →
  // split → full way too quick"):
  //   1. spans closer together than MIN_SPLIT MERGE — the split view must
  //      dwell ≥ ~3s or it reads as a glitchy bounce, so it doesn't appear;
  //   2. with animHook, a first span starting < MIN_SPLIT after the hook
  //      settles merges INTO the opening full-screen phase (no face blip).
  // pushKey keeps the input range STRICTLY increasing (nudges collisions).
  const MIN_SPLIT = 90; // ~3s — minimum dwell for the split layout
  const sorted = (spec.fullscreen ?? []).slice().sort((a, b) => a.from - b.from);
  const spans: { from: number; to: number }[] = [];
  for (const s of sorted) {
    const last = spans[spans.length - 1];
    if (last && s.from - last.to < MIN_SPLIT) last.to = Math.max(last.to, s.to);
    else spans.push({ ...s });
  }
  let hookFullTo: number | null = null; // set = hook runs full-screen straight into span 0
  if (spec.animHook && spans.length > 0 && spans[0].from - seamEnd < MIN_SPLIT) {
    hookFullTo = spans[0].to;
    spans.shift();
  }
  // face-first shorts (the house default): the split after the hook must also
  // dwell — a first span starting sooner gets pushed out to seamEnd + MIN_SPLIT
  if (!spec.animHook && spans.length > 0 && spans[0].from - seamEnd < MIN_SPLIT) {
    spans[0] = { from: seamEnd + MIN_SPLIT, to: Math.max(spans[0].to, seamEnd + MIN_SPLIT + 30) };
  }
  const seamIn: number[] = [0, seamStart];
  const seamOut: number[] = spec.animHook ? [FULL_H, FULL_H] : [0, 0];
  const pushKey = (t: number, v: number) => {
    seamIn.push(Math.max(t, seamIn[seamIn.length - 1] + 1));
    seamOut.push(v);
  };
  if (hookFullTo !== null) {
    pushKey(hookFullTo, FULL_H);
    pushKey(hookFullTo + 12, ANIM_H);
  } else {
    pushKey(seamEnd, ANIM_H);
  }
  for (const s of spans) {
    pushKey(s.from - 12, ANIM_H);
    pushKey(s.from, FULL_H);
    pushKey(s.to, FULL_H);
    pushKey(s.to + 12, ANIM_H);
  }
  pushKey(dur - 104, ANIM_H);
  pushKey(dur - 84, 0);
  pushKey(dur, 0);
  const seamY = interpolate(frame, seamIn, seamOut, CLAMP);
  const animOpacity = interpolate(seamY, [30, 260], [0, 1], CLAMP);

  // identity strip: dodge full-anim phases (it sits over the set wall)
  let lowerThirdFrom = hookFullTo !== null ? hookFullTo + 18 : seamEnd + 6;
  for (const s of spans) {
    if (lowerThirdFrom + 150 > s.from - 12 && lowerThirdFrom < s.to + 12) lowerThirdFrom = s.to + 18;
  }

  return (
    <ThemeProvider style={spec.style}>
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {/* BOTTOM — talking head; grows to full screen when seamY → 0. Min height
            1px keeps the video mounted during full-anim spans so the VO plays on. */}
        <div style={{ position: "absolute", top: seamY, left: 0, width: 1080, height: Math.max(1920 - seamY, 1), overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `scale(${introZoom})`, transformOrigin: "50% 30%" }}>
            <VerticalStage source={spec.source} from={spec.from} />
          </AbsoluteFill>
        </div>

        {/* TOP — animated beat scenes; slides in for the split, zooms up when
            the animation takes the full screen */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: Math.max(seamY, 1), overflow: "hidden", opacity: animOpacity }}>
          <AnimationPanel beats={spec.beats} zoom={interpolate(seamY, [ANIM_H, FULL_H], [1, 1.32], CLAMP)} />
        </div>

        {/* captions: split mode ONLY, docked on the seam — not during the hook
            (the hook is the text) and not during the CTA. Less clutter.
            clipFrom includes seamEnd: useCurrentFrame() RESETS inside a Sequence,
            so the absolute-timed captions must add the Sequence's start back or
            every word lags the audio by the hook length. */}
        <Sequence from={seamEnd} durationInFrames={dur - OUTRO - seamEnd}>
          <Captions words={captionsFor(spec.source)} clipFrom={spec.from + seamEnd} centerY={interpolate(seamY, [0, ANIM_H, FULL_H], [1452, ANIM_H, 1560], CLAMP)} />
        </Sequence>

        {/* progress bar (with beat milestone ticks) + topic banner — fades in
            AFTER the hook so the opening stays minimal (hook + context only) */}
        <AbsoluteFill style={{ pointerEvents: "none", opacity: interpolate(frame, [hookHold - 8, hookHold + 8], [0, 1], CLAMP) }}>
          <TopBar topic={spec.topic} beats={spec.beats.map((b) => b.at / dur)} />
        </AbsoluteFill>

        {/* hook, over the full-screen face — with the plain-words context line
            so a cold viewer knows what the video is about */}
        <Sequence  durationInFrames={hookHold} premountFor={20}>
          <HookTitle text={spec.hook} hold={hookHold} context={spec.context} />
        </Sequence>

        {/* identity lower-third, once the split settles (dodges full-anim spans) */}
        <Sequence from={lowerThirdFrom} durationInFrames={150} premountFor={20}>
          <LowerThird dur={150} />
        </Sequence>

        {/* CTA over the full-screen face at the end */}
        <Sequence from={dur - OUTRO} durationInFrames={OUTRO} premountFor={20}>
          <ShortOutro text={spec.outro} dur={OUTRO} />
        </Sequence>

        {/* loop-seam ease: dip the last frames toward dark so the platform
            auto-replay (last frame → first frame) never visibly jumps */}
        <AbsoluteFill style={{ pointerEvents: "none", background: "black", opacity: interpolate(frame, [dur - 9, dur], [0, 0.35], CLAMP) }} />

        {/* design-time safe zones (platform UI) — preview-only, never renders */}
        {showSafeZones && <SafeZones />}

        {/* ===== SOUND — a hit on every visual change, VO always leads ===== */}
        {spec.music && (
          <MusicBed src={staticFile(spec.music)} from={0} durationInFrames={dur} volume={0.05} fadeInFrames={20} fadeOutFrames={40} />
        )}
        {/* opening punch-in whoosh — fires with the zoom as the video begins */}
        {!spec.animHook && <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />}
        {/* hook: typewriter clicks under the word-slam (max 6 words) */}
        {spec.hook.split(" ").slice(0, 6).map((_, i) => (
          <SfxCue key={`hk-${i}`} from={3 + i * 3} src={SFX.click} volume={0.32} />
        ))}
        {/* whoosh on every reframe (hook→split, split↔full-anim, →CTA) */}
        {hookFullTo === null ? (
          <SfxCue from={seamStart + 6} src={SFX.whoosh} volume={0.4} />
        ) : (
          <SfxCue from={hookFullTo} src={SFX.whoosh} volume={0.4} />
        )}
        <SfxCue from={dur - 98} src={SFX.whoosh} volume={0.4} />
        {spans.map((s) => (
          <React.Fragment key={`fs-${s.from}`}>
            <SfxCue from={s.from - 10} src={SFX.whoosh} volume={0.4} />
            <SfxCue from={s.to} src={SFX.whoosh} volume={0.35} />
          </React.Fragment>
        ))}
        {/* per cartoon beat: a whoosh + an alternating accent, plus a boom on beat 0 */}
        {spec.beats.map((b, i) => (
          <React.Fragment key={`sfx-${b.at}`}>
            <SfxCue from={b.at} src={SFX.whoosh} volume={0.45} />
            <SfxCue from={b.at} src={i === 0 ? SFX.boom : i % 2 ? SFX.whip : SFX.ding} volume={i === 0 ? 0.5 : 0.35} />
            <SfxCue from={b.at + 6} src={SFX.switch} volume={0.25} />
          </React.Fragment>
        ))}
        {/* CTA: low boom on the reveal + ding as the button pops */}
        <SfxCue from={dur - OUTRO} src={SFX.boom} volume={0.4} />
        <SfxCue from={dur - OUTRO + 14} src={SFX.ding} volume={0.45} />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
