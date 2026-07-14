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
import { AnimatedBackground } from "../components/AnimatedBackground";
import { SFX, SfxCue } from "../components/Sfx";
import { SlideLeftPush } from "../motion/transitions";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ANIM_H = 838; // height of the TOP animation band when split (~44%)
const FULL_H = 1920; // seam all the way down = animation takes the whole screen
const OUTRO = 96; // last ~3.2s

// One 1080×1920 short. Cartoon animations on TOP, talking head on BOTTOM
// (Kris's rule, July 2026 — face always owns the BOTTOM half of the split;
// supersedes the earlier face-top layout), with a dynamic reframe: FULL-SCREEN
// face for the hook + CTA, SPLIT for the body, and FULL-SCREEN ANIMATION during
// `spec.fullscreen` spans (reveals / punchlines / payoffs — CLAUDE.md §9: never
// force every beat into split). Text stays off the face; sound fires on every
// visual change; the brand style comes from spec.style ("cinematic" | "bold").
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
  const paper = (spec.style ?? "cinematic") === "paper";

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
  // TRANSITION SPEED (Kris, July 2026 — "too fast"): every layout move takes
  // TRANS frames (~0.9s) and is EASED (in-out cubic per segment below), never
  // the old 12f linear snap. Specs must keep `to ≤ dur − 140` so the last
  // span's exit ramp never collides with the CTA return.
  const TRANS = 26;
  if (hookFullTo !== null) {
    pushKey(hookFullTo, FULL_H);
    pushKey(hookFullTo + TRANS, ANIM_H);
  } else {
    pushKey(seamEnd, ANIM_H);
  }
  for (const s of spans) {
    pushKey(s.from - TRANS, ANIM_H);
    pushKey(s.from, FULL_H);
    pushKey(s.to, FULL_H);
    pushKey(s.to + TRANS, ANIM_H);
  }
  pushKey(dur - 114, ANIM_H);
  pushKey(dur - 84, 0);
  pushKey(dur, 0);
  const seamY = interpolate(frame, seamIn, seamOut, { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const animOpacity = interpolate(seamY, [30, 260], [0, 1], CLAMP);
  // captions crossfade out while the seam TRAVELS between split and full-anim
  // — they used to ride straight through the beat label mid-transition
  const captionOp = interpolate(seamY, [ANIM_H, ANIM_H + 240, FULL_H - 240, FULL_H], [1, 0, 0, 1], CLAMP);

  // identity strip: dodge full-anim phases (it sits over the set wall) AND
  // receipt beats (evidence frames stay lean — Kris, July 2026: "too many
  // text elements on the screen"). 130f so it can fit the split windows
  // between spans; if no window fits before the CTA, it's SKIPPED.
  const LOWER_THIRD_DUR = 130;
  const blockers: { from: number; to: number }[] = [
    ...spans.map((s) => ({ from: s.from - TRANS, to: s.to + TRANS })),
    ...spec.beats
      .map((b, i) => (b.scene === "receipt" ? { from: b.at, to: spec.beats[i + 1]?.at ?? dur } : null))
      .filter((w): w is { from: number; to: number } => w !== null),
  ].sort((a, b) => a.from - b.from);
  let lowerThirdFrom = hookFullTo !== null ? hookFullTo + 18 : seamEnd + 6;
  for (const w of blockers) {
    if (lowerThirdFrom + LOWER_THIRD_DUR > w.from && lowerThirdFrom < w.to) lowerThirdFrom = w.to + 12;
  }

  // PAPER full-face framing (Kris's reference, July 2026): the 9:16 cover-crop
  // of the 16:9 source is far tighter than the reference creators' framing, so
  // in paper style the full-screen face renders as a ROUNDED CARD at ~0.74
  // scale anchored low on the ivory — face ≈ ⅓ of the frame, hook block owns
  // the paper above it. The card expands to the full-bleed band as the split
  // arrives (seam-driven), so the tight crop only ever shows in the split.
  const faceScale = paper ? interpolate(seamY, [0, ANIM_H], [0.74, 1], CLAMP) : 1;
  // face-BOTTOM split: the card stays anchored LOW as it expands into the band
  const faceOriginY = paper ? interpolate(seamY, [0, ANIM_H], [88, 75], CLAMP) : 70;
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);
  const paperRadius = paper ? interpolate(seamY, [0, ANIM_H], [28, 0], CLAMP) : 0;

  return (
    <ThemeProvider style={spec.style}>
      <AbsoluteFill style={{ backgroundColor: paper ? "#F0EEE6" : "black" }}>
        {/* paper style: the ivory dot-grid paper is the permanent base layer —
            the face card and panels float on it */}
        {paper && <AnimatedBackground durationInFrames={dur} fade={false} />}

        {/* CapCut-style pull-left on every seam move into a full-anim span:
            face + panel + captions slide off left, the arrived layout rides in
            from the right (banner/hook/CTA stay fixed like platform UI).
            Window = EXACTLY the 26f seam travel (centred at from+13) so the
            slide-out hides the expanding band — otherwise the new layout
            visibly "loads" before the push starts. */}
        <SlideLeftPush cuts={spans.map((s) => s.from + 13)} dur={26}>

        {/* BOTTOM — talking head; grows to full screen when seamY → 0. Min height
            1px keeps the video mounted during full-anim spans so the VO plays on. */}
        <div style={{ position: "absolute", top: Math.min(seamY, FULL_H - 1), left: 0, width: 1080, height: Math.max(1920 - seamY, 1), overflow: "hidden" }}>
          {/* ambient fill behind the punch-in (dark styles): the SAME shot
              blurred + dimmed, fading out as the zoom lands — frame 0 must read
              as a designed full frame (it doubles as the feed thumbnail), never
              a small video floating on black (§9). Paper style skips it — the
              ivory paper IS the fill. Mounted for the intro only. */}
          {!spec.animHook && !paper && frame < 26 && (
            <AbsoluteFill style={{ transform: "scale(1.15)", filter: "blur(46px) brightness(0.5) saturate(1.25)", opacity: interpolate(frame, [14, 24], [1, 0], CLAMP) }}>
              <VerticalStage source={spec.source} from={spec.from} volume={0} />
            </AbsoluteFill>
          )}
          <AbsoluteFill
            style={{
              transform: `scale(${introZoom * faceScale})`,
              transformOrigin: `50% ${faceOriginY}%`,
              // while small, the shot is a floating CARD: rounded + drop shadow.
              // Dark styles relax to full bleed; paper KEEPS the card at rest.
              borderRadius: Math.max(introRadius, paperRadius),
              overflow: "hidden",
              boxShadow: introZoom * faceScale < 1 ? (paper ? "0 24px 70px rgba(31,30,29,0.30)" : "0 30px 90px rgba(0,0,0,0.55)") : undefined,
            }}
          >
            <VerticalStage source={spec.source} from={spec.from} />
          </AbsoluteFill>
        </div>

        {/* TOP — animated beat scenes; the band DROPS from the top edge for the
            split, grows down when the animation takes the full screen */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: Math.max(seamY, 1), overflow: "hidden", opacity: animOpacity }}>
          <AnimationPanel beats={spec.beats} zoom={interpolate(seamY, [ANIM_H, FULL_H], [1, 1.32], CLAMP)} panelH={seamY} />
        </div>

        {/* captions: split mode ONLY, docked just UNDER the seam on the face
            side — not during the hook (the hook is the text) and not during the
            CTA. Split-mode captions render SMALLER (fontScale — Kris, July
            2026: "reduce the amount of text in split screen mode").
            clipFrom includes seamEnd: useCurrentFrame() RESETS inside a Sequence,
            so the absolute-timed captions must add the Sequence's start back or
            every word lags the audio by the hook length. */}
        <Sequence from={seamEnd} durationInFrames={dur - OUTRO - seamEnd}>
          <AbsoluteFill style={{ opacity: captionOp }}>
            <Captions words={captionsFor(spec.source)} clipFrom={spec.from + seamEnd} centerY={interpolate(seamY, [0, ANIM_H, FULL_H], [1452, ANIM_H + 64, 1560], CLAMP)} fontScale={interpolate(seamY, [ANIM_H, FULL_H], [0.76, 1], CLAMP)} />
          </AbsoluteFill>
        </Sequence>

        </SlideLeftPush>

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

        {/* identity lower-third, once the split settles (dodges full-anim spans;
            SKIPPED when no split window fits — it must never ride into the CTA,
            where the face card puts it over the FACE) */}
        {lowerThirdFrom + LOWER_THIRD_DUR <= dur - 140 && (
          <Sequence from={lowerThirdFrom} durationInFrames={LOWER_THIRD_DUR} premountFor={20}>
            <LowerThird dur={LOWER_THIRD_DUR} />
          </Sequence>
        )}

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
