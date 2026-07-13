import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CYAN } from "../components/overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// TRANSITION KIT (editing-research pass, July 2026) — kinetic cover-boundary
// transitions for the FINAL cut. Each renders a short (~16f) full-screen
// effect centred on `at` (the cut frame): the first half covers the outgoing
// content, the second half reveals the incoming scene. Rotate kinds between
// cuts (never the same twice in a row); every use pairs with the whoosh that
// already fires per cover. CLAUDE.md §8 "Transitions v2".
// ============================================================================

export type TransitionKind = "whip" | "iris" | "bar" | "swipe";

// WHIP PAN — a horizontally-streaked ivory sweep, like a fast camera whip.
const Whip: React.FC<{ t: number }> = ({ t }) => {
  const x = interpolate(t, [0, 1], [-120, 120]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translateX(${x}%) skewX(-14deg) scaleX(2.4)` }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,238,230,0.55) 18%, #F0EEE6 42%, #F0EEE6 58%, rgba(240,238,230,0.55) 82%, transparent 100%)",
        }}
      />
      {/* motion streaks riding the sweep */}
      {[0.22, 0.38, 0.62, 0.78].map((p, i) => (
        <div key={i} style={{ position: "absolute", top: `${12 + i * 24}%`, left: `${p * 100}%`, width: "26%", height: 5, borderRadius: 3, background: `${CYAN}66`, filter: "blur(2px)" }} />
      ))}
    </AbsoluteFill>
  );
};

// IRIS — an ivory circle slams shut over the cut, then opens on the new scene.
const Iris: React.FC<{ t: number }> = ({ t }) => {
  // radius: full → 0 (close) → full (open); expressed as the visible hole
  const hole = t < 0.5 ? interpolate(t, [0, 0.5], [150, 0], CLAMP) : interpolate(t, [0.5, 1], [0, 150], CLAMP);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(circle at 50% 46%, transparent ${hole}%, #F0EEE6 ${hole}%)`,
      }}
    />
  );
};

// BAR WIPE — a coral ink bar sweeps down covering the cut (editorial page-turn).
const Bar: React.FC<{ t: number }> = ({ t }) => {
  const y = interpolate(t, [0, 1], [-115, 115]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translateY(${y}%)` }}>
      <AbsoluteFill style={{ background: "#F0EEE6" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: -8, height: 12, background: CYAN, boxShadow: `0 0 24px ${CYAN}88` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -8, height: 12, background: CYAN, boxShadow: `0 0 24px ${CYAN}88` }} />
    </AbsoluteFill>
  );
};

// SWIPE LEFT — an ivory page swipes in from the right and off to the left
// (phone-gesture feel); coral leading/trailing edges + a soft shadow sell the
// direction. Reads as "the old scene got swiped away".
const SwipeLeft: React.FC<{ t: number }> = ({ t }) => {
  const x = interpolate(t, [0, 1], [115, -115]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translateX(${x}%)` }}>
      <AbsoluteFill style={{ background: "#F0EEE6", boxShadow: "-48px 0 90px rgba(31,30,29,0.3), 48px 0 90px rgba(31,30,29,0.3)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: -8, width: 12, background: CYAN, boxShadow: `0 0 24px ${CYAN}88` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: -8, width: 12, background: CYAN, boxShadow: `0 0 24px ${CYAN}88` }} />
    </AbsoluteFill>
  );
};

// One transition instance at an absolute cut frame (place in the FINAL's tree,
// above the overlay + PiP). `dur` ~16f: fast enough to feel like a cut, slow
// enough to read as intentional (the "minimal but kinetic" research finding).
export const SceneTransition: React.FC<{ at: number; kind?: TransitionKind; dur?: number }> = ({ at, kind = "whip", dur = 16 }) => {
  const frame = useCurrentFrame();
  if (frame < at - dur / 2 || frame > at + dur / 2) return null;
  const t = interpolate(frame, [at - dur / 2, at + dur / 2], [0, 1], CLAMP);
  if (kind === "iris") return <Iris t={t} />;
  if (kind === "bar") return <Bar t={t} />;
  if (kind === "swipe") return <SwipeLeft t={t} />;
  return <Whip t={t} />;
};

// ZOOM PUNCH — wrap a scene's content: it lands with a fast 1.10 → 1.00 settle
// (jump-cut energy without a hard snap). Use on covers that follow a
// transition so the incoming scene "arrives" instead of appearing.
export const ZoomPunchIn: React.FC<{ children: React.ReactNode; dur?: number }> = ({ children, dur = 14 }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [1.1, 1], { ...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};
