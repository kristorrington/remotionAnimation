import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, SpeechBubble, Sparks, glassCard, impulse, poseTimeline, CYAN, WHITE, RED, GREEN } from "../motion/subjects";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// AI-NEWS SCENES — custom beats for the weekly AI-news / GPT-5.6 super-app
// video (July 2026). Every `at` prop is pinned to whisper word frames.
// ============================================================================

// ── GPT-LIVE: the robot talks to a live voice panel, use-case stickers pop,
// then it INTERRUPTS mid-sentence — the wave flattens, listens, and picks the
// thread back up (the spoken "interrupt it and see if it keeps track" test).
export const VoiceLiveScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  chipLabels?: [string, string, string]; chipAts?: [number, number, number];
  interruptAt?: number; resumeAt?: number; tint?: string;
}> = ({ durationInFrames, kicker, title, chipLabels = ["WALK + BRAINSTORM", "PRACTICE A TALK", "TABLETOP GAME"], chipAts = [35, 92, 162], interruptAt = 239, resumeAt = 337, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = impulse(frame, interruptAt);
  const pose = poseTimeline(frame, [[0, "thinking"], [interruptAt - 8, "pointing"], [resumeAt, "celebrate"]]);
  // the voice wave: alive → near-flat while it absorbs the interruption → alive
  const amp = frame < interruptAt ? 1 : frame < resumeAt ? interpolate(frame, [interruptAt, interruptAt + 8], [1, 0.1], CLAMP) : interpolate(frame, [resumeAt, resumeAt + 10], [0.1, 1], CLAMP);
  const panelPop = spring({ frame: frame - 6, fps, config: { stiffness: 120, damping: 14 }, durationInFrames: 26 });
  const check = spring({ frame: frame - resumeAt, fps, config: { stiffness: 240, damping: 14 }, durationInFrames: 18 });
  const label = (size: number, color = WHITE): React.CSSProperties => ({
    fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 1.5, color, transform: "translateZ(0)", whiteSpace: "nowrap",
  });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa1} tint={tint} depth impacts={[interruptAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 70, transform: `translateX(${kick * 7}px)` }}>
          <div style={{ position: "relative" }}>
            <CartoonRobot pose={pose} size={250} accent={frame >= resumeAt ? GREEN : CYAN} lookX={0.8} />
            {frame >= interruptAt && frame < resumeAt && (
              <div style={{ position: "absolute", top: -96, left: 130 }}>
                <SpeechBubble text="CHANGE THAT—" at={interruptAt} shout fontSize={30} />
              </div>
            )}
          </div>
          {/* the live voice panel */}
          <div style={{ transform: `scale(${interpolate(panelPop, [0, 1], [0.5, 1])})`, opacity: interpolate(panelPop, [0, 0.3], [0, 1]) }}>
            <div style={{ ...glassCard(CYAN, 2), borderRadius: 22, width: 620, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, background: RED, opacity: 0.55 + 0.45 * Math.sin(frame * 0.25), boxShadow: `0 0 10px ${RED}` }} />
                <span style={label(22)}>GPT-LIVE</span>
                <span style={{ ...label(16, "rgba(255,255,255,0.55)"), marginLeft: "auto", fontWeight: 600 }}>real-time voice</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, height: 88 }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const h = 10 + Math.abs(Math.sin(frame * 0.29 + i * 0.83)) * 62 * amp;
                  return <div key={i} style={{ width: 12, height: h, borderRadius: 6, background: frame >= resumeAt ? GREEN : CYAN, opacity: 0.85 }} />;
                })}
              </div>
              {frame >= resumeAt && (
                <div style={{ alignSelf: "center", transform: `scale(${interpolate(check, [0, 1], [1.7, 1])})` }}>
                  <div style={{ border: `3px solid ${GREEN}`, background: `${GREEN}26`, borderRadius: 10, padding: "6px 18px" }}>
                    <span style={label(22, GREEN)}>KEPT THE THREAD ✓</span>
                  </div>
                </div>
              )}
              <Sparks at={resumeAt} x={310} y={40} color={GREEN} />
            </div>
          </div>
        </div>
        {/* use-case stickers slam in on their spoken words */}
        <div style={{ display: "flex", gap: 34 }}>
          {chipLabels.map((c, i) => {
            const e = spring({ frame: frame - chipAts[i], fps, config: { stiffness: 170, damping: 14 }, durationInFrames: 24 });
            if (frame < chipAts[i]) return <div key={c} style={{ width: 10 }} />;
            return (
              <div key={c} style={{ transform: `scale(${interpolate(e, [0, 1], [1.6, 1])}) rotate(${[-3, 2, -2][i]}deg)`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
                <div style={{ ...glassCard(CYAN, 2), borderRadius: 12, padding: "10px 22px" }}>
                  <span style={label(22)}>{c}</span>
                </div>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};
