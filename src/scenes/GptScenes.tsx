import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, Puff, impulse, glassCard, CYAN, WHITE, RED, AMBER, GREEN } from "../motion/subjects";
import { ConveyorBelt, LockGate } from "../motion/objects";
import { SourceChip } from "../motion/charts";
import benchData from "../../public/assets/external/charts/terminal-bench-gpt56.json";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// GPT-5.6 SCENES — the "sandbox it before you scale it" video's new subjects
// (backlog builds: BalanceScale, InspectionScanner + the three-gates rule and
// a recreated Terminal-Bench chart per CLAUDE.md §10.3). Paper-theme aware.
// ============================================================================

const chip = (color: string, fontSize = 24): React.CSSProperties => ({
  padding: "8px 18px", borderRadius: 10, ...glassCard(color),
  fontFamily: FONT, fontWeight: 800, fontSize, letterSpacing: 1, color: WHITE, transform: "translateZ(0)", whiteSpace: "nowrap",
});

// TRADEOFF — the balance scale: the EFFICIENCY chip drops on one pan, the
// CHEATED badge slams the other; the beam tips hard to the risk side and the
// robot goes alarmed. `stampText` stamps the verdict on the spoken word.
export const BalanceScaleScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  leftLabel?: string; rightLabel?: string; dropLeftAt?: number; dropRightAt?: number; tipAt?: number;
  stampText?: string; stampAt?: number; tint?: string; subject?: boolean;
}> = ({ durationInFrames, kicker, title, leftLabel = "EFFICIENT", rightLabel = "IT CHEATED", dropLeftAt = 24, dropRightAt = 96, tipAt = 128, stampText, stampAt = 220, tint, subject = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dropL = spring({ frame: frame - dropLeftAt, fps, config: { stiffness: 120, damping: 12 }, durationInFrames: 24 });
  const dropR = spring({ frame: frame - dropRightAt, fps, config: { stiffness: 120, damping: 12 }, durationInFrames: 24 });
  const tip = spring({ frame: frame - tipAt, fps, config: { stiffness: 110, damping: 13 }, durationInFrames: 30 });
  // beam starts level, dips LEFT a little when efficiency lands, then slams RIGHT
  const rot = interpolate(dropL, [0, 1], [0, -5]) + interpolate(tip, [0, 1], [0, 14]);
  const shake = impulse(frame, tipAt, 9, 14);
  const stamp = spring({ frame: frame - stampAt, fps, config: { stiffness: 240, damping: 12 }, durationInFrames: 18 });
  const beamW = 640;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x561} impacts={[dropRightAt, tipAt]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 70 }}>
          <div style={{ position: "relative", width: 780, height: 430, transform: `translateX(${shake}px)` }}>
            {/* pivot post */}
            <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: 22, height: 190, borderRadius: 10, ...glassCard(CYAN, 2) }} />
            <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: 190, height: 14, borderRadius: 8, background: "rgba(120,112,102,0.5)" }} />
            {/* beam + pans rotate around the pivot */}
            <div style={{ position: "absolute", left: "50%", bottom: 186, width: beamW, height: 0, transform: `translateX(-50%) rotate(${rot}deg)`, transformOrigin: "50% 50%" }}>
              <div style={{ position: "absolute", left: 0, top: -8, width: beamW, height: 16, borderRadius: 8, ...glassCard(CYAN, 2) }} />
              {/* left pan (efficiency) */}
              <div style={{ position: "absolute", left: -8, top: 8, width: 16, height: 74, background: "rgba(120,112,102,0.5)" }} />
              <div style={{ position: "absolute", left: -74, top: 82, width: 148, height: 18, borderRadius: "0 0 20px 20px", ...glassCard(GREEN, 2) }} />
              {frame >= dropLeftAt && (
                <div style={{ position: "absolute", left: -66, top: interpolate(dropL, [0, 1], [-160, 34]), transform: `scale(${interpolate(dropL, [0.8, 1], [1.12, 1], CLAMP)})` }}>
                  <div style={chip(GREEN, 22)}>{leftLabel}</div>
                </div>
              )}
              {/* right pan (risk) */}
              <div style={{ position: "absolute", right: -8, top: 8, width: 16, height: 74, background: "rgba(120,112,102,0.5)" }} />
              <div style={{ position: "absolute", right: -74, top: 82, width: 148, height: 18, borderRadius: "0 0 20px 20px", ...glassCard(RED, 2) }} />
              {frame >= dropRightAt && (
                <div style={{ position: "absolute", right: -70, top: interpolate(dropR, [0, 1], [-190, 30]), transform: `rotate(-3deg) scale(${interpolate(dropR, [0.8, 1], [1.2, 1], CLAMP)})` }}>
                  <div style={chip(RED, 22)}>{rightLabel}</div>
                </div>
              )}
            </div>
            <Sparks at={tipAt + 4} x={640} y={240} color={RED} size={150} />
            <Puff at={dropRightAt + 16} x={620} y={200} size={110} />
            {/* the verdict stamp */}
            {stampText && frame >= stampAt && (
              <div style={{ position: "absolute", left: "50%", top: 6, transform: `translateX(-50%) rotate(-4deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`, opacity: interpolate(stamp, [0, 0.3], [0, 1]), padding: "10px 26px", border: `5px solid ${AMBER}`, borderRadius: 12, background: "rgba(6,9,16,0.45)", boxShadow: `0 0 26px ${AMBER}66` }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: WHITE, transform: "translateZ(0)" }}>{stampText}</span>
              </div>
            )}
          </div>
          {subject && (
            <div style={{ transform: `translateY(${-Math.abs(impulse(frame, tipAt, 10, 16))}px)` }}>
              <CartoonRobot pose={frame < tipAt ? "thinking" : "alarmed"} size={230} accent={frame < tipAt ? CYAN : RED} lookX={-8} />
            </div>
          )}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// RECEIPT CHART — the Terminal-Bench bars, recreated natively from public data
// (CLAUDE.md §10.3); each bar grows ON its spoken frame, the source chip rides
// along. Data lives in public/assets/external/charts (manifested).
export const BenchBarsScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string; barAts?: number[]; tint?: string;
  data?: { label: string; value: number }[]; sourceName?: string; sourceUrl?: string;
}> = ({ durationInFrames, kicker, title, barAts = [40, 120, 200], tint, data, sourceName, sourceUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = (data ?? benchData.data) as { label: string; value: number }[];
  const max = 100;
  const W = 1040;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x562} impacts={[barAts[0]]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, width: W, borderRadius: 20, ...glassCard(CYAN, 2), padding: "34px 40px" }}>
          {bars.map((b, i) => {
            const at = barAts[i] ?? barAts[barAts.length - 1] + 40 * (i - 2);
            const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 16 }, durationInFrames: 28 });
            const colors = [CYAN, "#9C8AFF", "#6FB5FF"];
            const c = i === 0 ? CYAN : colors[i];
            const val = interpolate(e, [0, 1], [0, b.value]);
            return (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 18, opacity: interpolate(frame, [at, at + 6], [0, 1], CLAMP) }}>
                <span style={{ width: 250, textAlign: "right", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: WHITE, transform: "translateZ(0)" }}>{b.label}</span>
                <div style={{ position: "relative", flex: 1, height: 46, borderRadius: 10, background: "rgba(120,112,102,0.25)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(val / max) * 100}%`, borderRadius: 10, background: `linear-gradient(90deg, ${c}88, ${c})`, boxShadow: `0 0 18px ${c}66` }} />
                </div>
                <span style={{ width: 120, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: i === 0 ? c : WHITE, transform: "translateZ(0)" }}>{val.toFixed(1)}%</span>
                {i === 0 && frame >= at + 24 && <Sparks at={at + 24} x={-60} y={20} color={c} size={110} />}
              </div>
            );
          })}
          <div style={{ alignSelf: "flex-end" }}>
            <SourceChip name={sourceName ?? benchData.sourceName} url={sourceUrl ?? benchData.sourceUrl} at={barAts[0] + 10} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// FEDERAL PIPELINE — the model card rides the belt through the CAIS scan arch:
// beam sweeps on `scanAt`, the PASSED tag pops on `tagAt`. The robot watches.
export const ScannerScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  cardLabel?: string; archLabel?: string; tagLabel?: string; scanAt?: number; tagAt?: number; tint?: string;
}> = ({ durationInFrames, kicker, title, cardLabel = "GPT-5.6", archLabel = "CAIS", tagLabel = "FIRST THROUGH", scanAt = 120, tagAt = 240, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stageW = 860;
  // the card rides in, PAUSES under the arch for the scan, then rolls on
  const x = interpolate(frame, [0, scanAt - 20, scanAt + 46, scanAt + 90], [40, stageW / 2 - 90, stageW / 2 - 90, stageW - 220], CLAMP);
  const scanning = frame >= scanAt && frame < scanAt + 46;
  const beamY = 40 + ((frame - scanAt) * 6) % 150;
  const tag = spring({ frame: frame - tagAt, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 18 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x563} impacts={[scanAt, tagAt]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          <div style={{ position: "relative", width: stageW, height: 400 }}>
            {/* scan arch */}
            <div style={{ position: "absolute", left: stageW / 2 - 130, bottom: 66, width: 260, height: 300, borderRadius: "26px 26px 0 0", ...glassCard(CYAN, 2.5), overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 16, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: WHITE, transform: "translateZ(0)" }}>{archLabel}</div>
              {scanning && <div style={{ position: "absolute", left: 12, right: 12, top: beamY, height: 5, borderRadius: 3, background: GREEN, boxShadow: `0 0 18px ${GREEN}` }} />}
            </div>
            {/* belt + the model card */}
            <div style={{ position: "absolute", left: 20, bottom: 40 }}>
              <ConveyorBelt width={stageW - 40} speed={scanning ? 0 : 3} color={CYAN} />
            </div>
            <div style={{ position: "absolute", left: x, bottom: 92 }}>
              <div style={{ width: 180, padding: "20px 18px", borderRadius: 14, ...glassCard(scanning ? GREEN : "rgba(255,255,255,0.3)", 2.5), textAlign: "center" }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: WHITE, transform: "translateZ(0)" }}>{cardLabel}</span>
              </div>
            </div>
            {/* the pass tag */}
            {frame >= tagAt && (
              <div style={{ position: "absolute", left: stageW / 2 - 20, top: 0, transform: `rotate(3deg) scale(${interpolate(tag, [0, 1], [1.7, 1])})`, opacity: interpolate(tag, [0, 0.3], [0, 1]) }}>
                <div style={chip(GREEN, 26)}>{tagLabel}</div>
              </div>
            )}
            <Sparks at={tagAt + 6} x={stageW / 2 + 40} y={70} color={GREEN} size={140} />
          </div>
          <CartoonRobot pose={scanning ? "thinking" : frame >= tagAt ? "pointing" : "idle"} size={210} accent={CYAN} lookX={-9} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// THE THREE GATES — sandboxed / reviewed / least-privilege swing open on their
// spoken words; if `missingAt` fires, the middle gate SLAMS shut again and the
// robot stops (stay supervised).
export const GatesScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  gates?: { label: string; at: number }[]; missingAt?: number; missingLabel?: string; tint?: string; subject?: boolean;
}> = ({ durationInFrames, kicker, title, gates = [], missingAt, missingLabel = "STAY SUPERVISED", tint, subject = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = missingAt !== undefined ? spring({ frame: frame - missingAt, fps, config: { stiffness: 260, damping: 12 }, durationInFrames: 16 }) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x564} impacts={missingAt !== undefined ? [missingAt] : gates.map((g) => g.at)} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          {subject && (
            <div style={{ transform: `translateY(${missingAt !== undefined && frame >= missingAt ? -Math.abs(impulse(frame, missingAt, 8, 14)) : 0}px)` }}>
              <CartoonRobot pose={missingAt !== undefined && frame >= missingAt ? "worried" : frame >= (gates[2]?.at ?? 9999) ? "celebrate" : "idle"} size={230} accent={CYAN} lookX={9} />
            </div>
          )}
          <div style={{ display: "flex", gap: 46 }}>
            {gates.map((g, i) => {
              const reslam = missingAt !== undefined && i === 1 && frame >= missingAt;
              return (
                <div key={g.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: reslam ? `translateY(${Math.abs(impulse(frame, missingAt!, 6, 12))}px)` : undefined }}>
                  <LockGate at={reslam ? missingAt! : g.at} action={reslam ? "close" : "open"} size={190} />
                  <div style={{ ...chip(reslam ? RED : frame >= g.at ? GREEN : "rgba(255,255,255,0.3)", 22), opacity: interpolate(frame, [g.at - 14, g.at], [0.55, 1], CLAMP) }}>{g.label}</div>
                  {reslam && <Sparks at={missingAt! + 4} x={0} y={-40} color={RED} size={120} />}
                  {!reslam && frame >= g.at && <Puff at={g.at + 10} x={0} y={40} size={90} />}
                </div>
              );
            })}
          </div>
        </div>
        {missingAt !== undefined && frame >= missingAt + 14 && (
          <div style={{ transform: `rotate(-2deg) scale(${interpolate(slam, [0.6, 1], [1.5, 1], CLAMP)})` }}>
            <div style={chip(AMBER, 28)}>{missingLabel}</div>
          </div>
        )}
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};
