import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, CYAN, WHITE } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Puff, impulse, poseTimeline, RobotPose } from "../motion/subjects";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const StepRow: React.FC<{ n: number; label: string; at: number; accent: string; last: boolean; railAt?: number }> = ({ n, label, at, accent, last, railAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 210, damping: 18, mass: 0.7 }, durationInFrames: 16 });
  const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  const x = interpolate(e, [0, 1], [-40, 0]);
  // the rail draws just before the NEXT step lands — a connector to an empty
  // slot reads unfinished (improvement pass, July 2026)
  const railFrom = railAt !== undefined ? railAt - 14 : at + 8;
  const rail = interpolate(frame, [railFrom, railFrom + 18], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: op, transform: `translateX(${x}px)` }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", background: `${accent}22`, border: `3px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${accent}55`, transform: `scale(${interpolate(e, [0, 1], [0.4, 1])})` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: WHITE }}>{n}</span>
        </div>
        {!last && <div style={{ position: "absolute", top: 62, width: 4, height: 40 * rail, background: `${accent}66` }} />}
      </div>
      <div style={{ padding: "18px 34px", borderRadius: 14, background: "rgba(12,18,30,0.9)", border: `1px solid ${accent}44`, minWidth: 420, boxShadow: `0 14px 34px rgba(0,0,0,0.4)` }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, color: WHITE }}>{label}</span>
      </div>
    </div>
  );
};

// A process / checklist as an animated numbered timeline (rail grows between
// steps) with a robot SUBJECT who points each step in and celebrates at the
// end — never a bare bullet list. `subject={false}` opts out where space is tight.
export const StepsScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; steps: { label: string; at: number }[]; accent?: string; titleSize?: number; tint?: string; subject?: boolean }> = ({
  durationInFrames,
  kicker,
  title,
  steps,
  accent = CYAN,
  titleSize = 64,
  tint,
  subject = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const poseSteps: [number, RobotPose][] = [[0, "idle"], [Math.max(20, (steps[0]?.at ?? 30) - 14), "thinking"]];
  for (const s of steps) poseSteps.push([s.at, "pointing"], [s.at + 40, "thinking"]);
  const lastStep = steps[steps.length - 1];
  if (lastStep) poseSteps.push([lastStep.at + 44, "celebrate"]);
  // the robot pops in with a dust puff and HOPS as each step lands
  const hop = steps.reduce((a, s) => a + Math.abs(impulse(frame, s.at, 8, 14)), 0);
  const enter = spring({ frame: frame - 6, fps, config: { stiffness: 150, damping: 12 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x5e} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={titleSize} accent={accent} />
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            {steps.map((s, i) => (
              <StepRow key={s.label} n={i + 1} label={s.label} at={s.at} accent={accent} last={i === steps.length - 1} railAt={steps[i + 1]?.at} />
            ))}
          </div>
          {subject && (
            <div style={{ position: "relative", transform: `scale(${enter}) translateY(${-hop}px)` }}>
              <CartoonRobot pose={poseTimeline(frame, poseSteps)} size={250} lookX={-7} accent={accent} />
              <Puff at={16} x={125} y={245} size={130} />
            </div>
          )}
        </div>
      </div>
    </SceneShell>
  );
};
