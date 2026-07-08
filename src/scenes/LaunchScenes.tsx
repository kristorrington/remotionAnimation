import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { ModelBlock, SpeedModule, SpeedTrails } from "../motion/objects";
import { Sparks, CYAN, WHITE, GREEN, AMBER } from "../motion/subjects";
import { LightLeak } from "../motion/cinematics";
import { DeepSeekMark } from "../components/Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// HERO: the DSpark speed module flies in, BOLTS onto the V4 block, powers up —
// then the whole rig accelerates off with speed trails. Title rides below.
export const HeroLaunchScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; logo?: React.ReactNode; blockLabel?: string; moduleLabel?: string }> = ({ durationInFrames, kicker, title, logo, blockLabel = "V4", moduleLabel = "DSPARK" }) => {
  const frame = useCurrentFrame();
  const boltAt = 34;
  const launchAt = 110;
  // launch: anticipation (pull back) then dash right
  const antic = interpolate(frame, [launchAt - 10, launchAt], [0, -26], CLAMP);
  const dash = interpolate(frame, [launchAt, launchAt + 26], [0, 560], { ...CLAMP, easing: (t) => t * t });
  const rigX = antic + dash;
  const showTrails = frame >= launchAt + 4;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xd5} depth impacts={[boltAt + 26, launchAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ opacity: interpolate(frame, [0, 12], [0, 1], CLAMP) }}>
          {logo ?? <DeepSeekMark size={110} />}
        </div>
        {/* the rig: block + bolted module */}
        <div style={{ position: "relative", height: 200, width: 900 }}>
          <div style={{ position: "absolute", left: 250, top: 0, transform: `translateX(${rigX}px)` }}>
            <div style={{ position: "relative" }}>
              <ModelBlock label={blockLabel} width={300} />
              <div style={{ position: "absolute", left: -150, top: 56 }}>
                <SpeedModule at={boltAt} label={moduleLabel} />
              </div>
              {showTrails && (
                <div style={{ position: "absolute", left: -210, top: 66 }}>
                  <SpeedTrails width={200} />
                </div>
              )}
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={96} />
      </div>
      {/* the ONE premium light-leak moment of the video — the hero launch */}
      <LightLeak at={launchAt} dur={56} warm={false} />
    </SceneShell>
  );
};

// A SPEED LAYER: the module powers up ON the block (activation focus) while a
// turbo gauge needle sweeps up. No launch — this beat is about the layer itself.
export const SpeedLayerScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; subtitle?: string; blockLabel?: string; moduleLabel?: string; tint?: string }> = ({ durationInFrames, kicker, title, subtitle, blockLabel = "V4", moduleLabel = "DSPARK", tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const needle = spring({ frame: frame - 60, fps, config: { stiffness: 60, damping: 13 }, durationInFrames: 50 });
  const deg = interpolate(needle, [0, 1], [-80, 62]);
  const subOp = interpolate(frame, [26, 38], [0, 1], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa7} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
          <div style={{ position: "relative" }}>
            <ModelBlock label={blockLabel} width={280} />
            <div style={{ position: "absolute", left: -140, top: 52 }}>
              <SpeedModule at={14} label={moduleLabel} />
            </div>
          </div>
          {/* turbo gauge */}
          <svg width={220} height={150} viewBox="0 0 220 150" style={{ overflow: "visible" }}>
            <path d="M20 130 A90 90 0 0 1 200 130" stroke="rgba(255,255,255,0.16)" strokeWidth={14} fill="none" strokeLinecap="round" />
            <path d="M20 130 A90 90 0 0 1 92 46" stroke={GREEN} strokeWidth={14} fill="none" strokeLinecap="round" />
            <path d="M128 46 A90 90 0 0 1 200 130" stroke={AMBER} strokeWidth={14} fill="none" strokeLinecap="round" />
            <line x1={110} y1={130} x2={110} y2={56} stroke={WHITE} strokeWidth={7} strokeLinecap="round" transform={`rotate(${deg} 110 130)`} />
            <circle cx={110} cy={130} r={10} fill={CYAN} />
          </svg>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} />
        {subtitle ? <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,0.75)", opacity: subOp, marginTop: -18 }}>{subtitle}</span> : null}
      </div>
    </SceneShell>
  );
};

// NOT A NEW BRAIN: the core brain stays IDENTICAL while outer shell segments
// click on around it. The core never changes color — the point, visualised.
export const SameCoreScene: React.FC<{ durationInFrames: number; kicker?: string; title: string }> = ({ durationInFrames, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const corePulse = 0.6 + 0.4 * Math.sin(frame * 0.1);
  const segs = [0, 90, 180, 270];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb2}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* constant core */}
          <svg width={150} height={150} viewBox="0 0 100 100" style={{ position: "absolute", filter: `drop-shadow(0 0 ${16 * corePulse}px ${CYAN})` }}>
            <path d="M40 24 C28 24 22 34 26 42 C18 46 18 58 28 62 C28 72 40 78 47 70 V30 C47 26 44 24 40 24 Z" stroke={CYAN} strokeWidth={5} fill="rgba(6,182,212,0.12)" />
            <path d="M60 24 C72 24 78 34 74 42 C82 46 82 58 72 62 C72 72 60 78 53 70 V30 C53 26 56 24 60 24 Z" stroke={CYAN} strokeWidth={5} fill="rgba(6,182,212,0.12)" />
          </svg>
          {/* outer segments click on around it */}
          <svg width={320} height={320} viewBox="0 0 320 320" style={{ position: "absolute", overflow: "visible" }}>
            {segs.map((deg, i) => {
              const at = 26 + i * 16;
              const e = spring({ frame: frame - at, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 16 });
              const r = interpolate(e, [0, 1], [190, 128]);
              const op = interpolate(e, [0, 0.4], [0, 1]);
              return (
                <g key={deg} transform={`rotate(${deg + 45} 160 160)`} opacity={op}>
                  <path d={`M 160 ${160 - r} A ${r} ${r} 0 0 1 ${160 + r * 0.7} ${160 - r * 0.7}`} stroke={AMBER} strokeWidth={13} fill="none" strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
          <Sparks at={42} x={160} y={40} />
          <Sparks at={74} x={280} y={160} color={CYAN} />
          {/* label pinned to the core */}
          <span style={{ position: "absolute", bottom: -6, fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: CYAN }}>SAME CORE</span>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} />
      </div>
    </SceneShell>
  );
};

// JUST FASTER: two lanes, the SAME brain block — the top one crawls, the bottom
// one flies with trails. Same brain, faster path.
export const RaceFasterScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; slowLabel?: string; fastLabel?: string; blockLabel?: string }> = ({ durationInFrames, kicker, title, slowLabel = "BEFORE", fastLabel = "WITH DSPARK", blockLabel = "V4" }) => {
  const frame = useCurrentFrame();
  const loop = durationInFrames * 0.55;
  const slowX = interpolate(frame % loop, [0, loop], [0, 300]);
  const fastX = interpolate(frame % loop, [0, loop], [0, 860]);
  const lane = (label: string, x: number, fast: boolean, y: number) => (
    <div style={{ position: "absolute", top: y, left: 0, right: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 66, height: 3, background: "rgba(255,255,255,0.12)" }} />
      <span style={{ position: "absolute", left: 4, top: 8, fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: fast ? CYAN : "rgba(255,255,255,0.5)" }}>{label}</span>
      <div style={{ position: "absolute", left: 130 + x, top: 14 }}>
        <div style={{ position: "relative" }}>
          <ModelBlock label={blockLabel} width={150} />
          {fast && <div style={{ position: "absolute", left: -150, top: 26 }}><SpeedTrails width={150} /></div>}
        </div>
      </div>
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc4}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ position: "relative", width: 1240, height: 300 }}>
          {lane(slowLabel, slowX, false, 0)}
          {lane(fastLabel, fastX, true, 160)}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} />
      </div>
    </SceneShell>
  );
};
