import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, SpeechBubble, Sparks, glassCard, impulse, CYAN, WHITE, RED, AMBER, GREEN } from "../motion/subjects";
import { ConveyorBelt } from "../motion/objects";
import { ImpactStamp } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// SKILLS-RANKING SCENES — the 80% trap (Loop Library) and the slop factory
// (Taste) for the "5 Claude Code skills ranked" video (July 2026). Every `at`
// prop is pinned to whisper word frames by the caller (CLAUDE.md golden rule).
// ============================================================================

// THE 80% TRAP — the progress bar races to 80% and STOPS; the robot celebrates
// "DONE!" anyway; the missing fifth flashes hazard-red and the truth stamps in.
export const EightyPercentScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  doneAt: number; gapAt: number; tint?: string;
}> = ({ durationInFrames, kicker, title, doneAt, gapAt, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(frame, [12, doneAt - 8], [0, 0.8], { ...CLAMP, easing: (t) => 1 - (1 - t) * (1 - t) });
  const gapOn = frame >= gapAt;
  const gapPulse = gapOn ? 0.5 + 0.5 * Math.sin((frame - gapAt) * 0.35) : 0;
  const stamp = spring({ frame: frame - gapAt - 8, fps, config: { stiffness: 210, damping: 13 }, durationInFrames: 20 });
  const pose = frame < doneAt ? "thinking" : gapOn ? "confused" : "celebrate";
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x515} impacts={[doneAt, gapAt]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <div style={{ position: "relative", width: 760, height: 220, display: "flex", alignItems: "center" }}>
            {/* the task bar — glass rail, 80% fill, hazard gap for the rest */}
            <div style={{ position: "relative", width: 760, height: 64, borderRadius: 32, ...glassCard(CYAN), overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `linear-gradient(90deg, ${GREEN}cc, ${GREEN})`, boxShadow: `0 0 24px ${GREEN}88` }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "20%", opacity: gapOn ? 0.55 + 0.45 * gapPulse : 0.16, background: `repeating-linear-gradient(-45deg, ${RED}, ${RED} 14px, transparent 14px, transparent 28px)` }} />
              <span style={{ position: "absolute", left: "40%", top: 16, fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: WHITE, transform: "translateZ(0)" }}>{Math.round(fill * 100)}%</span>
            </div>
            {/* the truth about the last fifth */}
            <div style={{ position: "absolute", right: -30, top: -74, opacity: interpolate(stamp, [0, 0.3], [0, 1]), transform: `rotate(-4deg) scale(${interpolate(stamp, [0, 1], [1.7, 1])})` }}>
              <div style={{ borderRadius: 14, ...glassCard(RED, 2.5), padding: "12px 22px" }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 1.5, color: WHITE, transform: "translateZ(0)" }}>YOUR 20%</span>
              </div>
            </div>
            <Sparks at={gapAt + 8} x={700} y={40} color={RED} size={130} />
          </div>
          <div style={{ transform: `translateY(${-Math.abs(impulse(frame, doneAt, 12, 18))}px)`, position: "relative" }}>
            <CartoonRobot pose={pose} size={240} accent={gapOn ? RED : frame >= doneAt ? GREEN : CYAN} lookX={-8} />
            {frame >= doneAt && !gapOn && (
              <div style={{ position: "absolute", top: -66, left: 150 }}>
                <SpeechBubble text="DONE!" at={doneAt} />
              </div>
            )}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={gapOn ? RED : GREEN} />
      </div>
    </SceneShell>
  );
};

// THE SLOP FACTORY — identical AI-generic UI cards roll off the belt one after
// another; the third gets stamped SAME AGAIN and the robot facepalms.
export const SlopFactoryScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  cardAts: [number, number, number]; stampAt: number; tint?: string;
}> = ({ durationInFrames, kicker, title, cardAts, stampAt, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamped = frame >= stampAt;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x52a} impacts={[...cardAts, stampAt]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          <div style={{ position: "relative", width: 900, height: 300 }}>
            {/* identical generic UI cards, landing on the belt one by one */}
            {cardAts.map((at, i) => {
              const drop = spring({ frame: frame - at, fps, config: { stiffness: 150, damping: 12 }, durationInFrames: 24 });
              if (frame < at) return null;
              const squash = interpolate(drop, [0.7, 0.85, 1], [1, 0.86, 1], CLAMP);
              return (
                <div key={at} style={{ position: "absolute", left: 40 + i * 290, bottom: 74, transform: `translateY(${interpolate(drop, [0, 1], [-240, 0])}px) scaleY(${squash})`, transformOrigin: "bottom center" }}>
                  <div style={{ width: 240, borderRadius: 14, ...glassCard(CYAN), overflow: "hidden" }}>
                    {/* the same gradient header + oversized heading, every time */}
                    <div style={{ height: 58, background: "linear-gradient(90deg, #7c5cff, #46b3ff)" }} />
                    <div style={{ padding: "14px 16px 18px" }}>
                      <div style={{ width: "84%", height: 20, borderRadius: 6, background: "rgba(255,255,255,0.85)" }} />
                      <div style={{ width: "58%", height: 10, borderRadius: 5, background: "rgba(255,255,255,0.3)", marginTop: 10 }} />
                      <div style={{ width: "70%", height: 10, borderRadius: 5, background: "rgba(255,255,255,0.3)", marginTop: 8 }} />
                    </div>
                  </div>
                  {i === 2 && <Sparks at={stampAt} x={120} y={70} color={RED} size={140} />}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, bottom: 30 }}>
              <ConveyorBelt width={900} speed={stamped ? 1.4 : 3.2} color={AMBER} />
            </div>
            {/* the verdict slams across the row */}
            <div style={{ position: "absolute", left: 300, bottom: 150 }}>
              <ImpactStamp text="SAME AGAIN." at={stampAt} color={RED} />
            </div>
          </div>
          <div style={{ marginBottom: 8, transform: `translateY(${-Math.abs(impulse(frame, stampAt, 10, 16))}px)` }}>
            <CartoonRobot pose={stamped ? "facepalm" : "waiting"} size={230} accent={stamped ? RED : CYAN} lookX={-9} lookY={2} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={stamped ? RED : AMBER} />
      </div>
    </SceneShell>
  );
};
