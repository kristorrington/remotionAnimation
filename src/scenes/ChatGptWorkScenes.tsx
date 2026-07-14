import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MONO } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { glassCard, impulse, Sparks, Puff, CYAN, WHITE, RED, AMBER, GREEN, PANEL } from "../motion/subjects";
import { ImpactStamp, WarningBadge } from "../motion/primitives";
import { ChatGptMark, ClaudeMark } from "../components/Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// CHATGPT WORK SCENES — custom beats for the "What is ChatGPT Work" video
// (July 2026). Every `at` prop is pinned to whisper word frames by the caller.
// ============================================================================

const label = (size = 22, color = WHITE): React.CSSProperties => ({
  fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 1, color, transform: "translateZ(0)", whiteSpace: "nowrap",
});

// Tiny generic content lines for panels/windows.
const Lines: React.FC<{ w: number; n: number; color?: string }> = ({ w, n, color = "rgba(255,255,255,0.35)" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7, width: w }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{ height: 7, borderRadius: 4, background: color, width: `${[92, 70, 84, 58][i % 4]}%` }} />
    ))}
  </div>
);

// ── 1. HOOK: four work surfaces fly INTO one ChatGPT window ─────────────────
// (plan item 1 — the opener MUST carry the ChatGPT blossom, Kris 07/2026)
export const OneWorkspaceScene: React.FC<{
  durationInFrames: number; title?: string;
  panelAts?: [number, number, number, number]; // doc, apps, files, code fly-ins
  panelNames?: [string, string, string, string]; // relabel the four surfaces
  windowSuffix?: string; // the coloured word after "ChatGPT" in the window header
  mergeAt?: number; stampAt?: number; tint?: string;
}> = ({ durationInFrames, title = "ONE WORKSPACE", panelAts = [10, 26, 42, 58], panelNames = ["DOC", "APPS", "FILES", "CODE"], windowSuffix = "Work", mergeAt = 110, stampAt = 138, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = impulse(frame, mergeAt + 14);
  const panels: { name: string; color: string; x: number; y: number; body: React.ReactNode }[] = [
    { name: panelNames[0], color: CYAN, x: -560, y: -190, body: <Lines w={150} n={4} /> },
    {
      name: panelNames[1], color: GREEN, x: 560, y: -190,
      body: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 34px)", gap: 8 }}>
          {[CYAN, GREEN, AMBER, "#60A5FA", RED, "#A78BFA"].map((c, i) => (
            <div key={i} style={{ width: 34, height: 34, borderRadius: 9, background: `${c}33`, border: `2px solid ${c}` }} />
          ))}
        </div>
      ),
    },
    {
      name: panelNames[2], color: AMBER, x: -560, y: 210,
      body: (
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width={44} height={36} viewBox="0 0 44 36">
              <path d="M2 8 h14 l4 5 h22 v20 h-40 z" fill={`${AMBER}33`} stroke={AMBER} strokeWidth={2.5} />
            </svg>
          ))}
        </div>
      ),
    },
    {
      name: panelNames[3], color: "#60A5FA", x: 560, y: 210,
      body: (
        <div style={{ fontFamily: MONO, fontSize: 15, lineHeight: 1.5, transform: "translateZ(0)" }}>
          <div style={{ color: GREEN }}>+ deploy(work)</div>
          <div style={{ color: RED }}>- copy/paste</div>
        </div>
      ),
    },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc1} tint={tint} impacts={[mergeAt + 14]}>
      <div style={{ position: "relative", width: 1500, height: 720, transform: `translateY(${kick * 6}px)` }}>
        {/* the four surfaces — drift in, then dive into the window and shrink */}
        {panels.map((p, i) => {
          const enter = spring({ frame: frame - panelAts[i], fps, config: { stiffness: 150, damping: 15 }, durationInFrames: 26 });
          const dive = spring({ frame: frame - mergeAt - i * 3, fps, config: { stiffness: 170, damping: 17 }, durationInFrames: 24 });
          const x = p.x * (1 - dive) * interpolate(enter, [0, 1], [1.5, 1]);
          const y = p.y * (1 - dive) * interpolate(enter, [0, 1], [1.4, 1]) - Math.sin(frame * 0.06 + i * 1.7) * 8 * (1 - dive);
          const s = interpolate(enter, [0, 1], [0.4, 1]) * interpolate(dive, [0, 1], [1, 0.12]);
          const op = Math.min(interpolate(enter, [0, 0.3], [0, 1], CLAMP), interpolate(dive, [0.82, 1], [1, 0], CLAMP));
          return (
            <div key={p.name} style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`, opacity: op }}>
              <div style={{ ...glassCard(p.color, 2), borderRadius: 18, padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
                <span style={label(20, p.color)}>{p.name}</span>
                {p.body}
              </div>
            </div>
          );
        })}
        {/* the ChatGPT window they merge into */}
        {(() => {
          const pop = spring({ frame: frame - (mergeAt - 8), fps, config: { stiffness: 120, damping: 14 }, durationInFrames: 28 });
          const grow = 1 + kick * 0.05;
          return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${interpolate(pop, [0, 1], [0.5, 1]) * grow})`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
              <div style={{ ...glassCard(CYAN, 2), borderRadius: 24, width: 640, padding: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                  <ChatGptMark size={46} />
                  <span style={label(26)}>ChatGPT{windowSuffix ? <span style={{ color: CYAN }}> {windowSuffix}</span> : null}</span>
                </div>
                <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <Lines w={560} n={3} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", padding: "12px 20px" }}>
                    <span style={{ ...label(18, "rgba(255,255,255,0.55)"), fontWeight: 600 }}>What would you like to work on?</span>
                  </div>
                </div>
              </div>
              <Sparks at={mergeAt + 14} x={320} y={0} />
            </div>
          );
        })()}
      </div>
      {frame >= stampAt && (
        <div style={{ position: "absolute", top: 130, left: "50%", transform: "translateX(-50%)" }}>
          <ImpactStamp at={stampAt} text={title} />
        </div>
      )}
    </SceneShell>
  );
};

// ── 2. RIVALRY: three work-AI columns, subject enlarged ─────────────────────
export const RivalryScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  colAts?: [number, number, number]; emphasizeAt?: number; tint?: string;
  cols?: { name: string; sub: string; color: string; mark?: React.ReactNode; fromY?: number }[];
}> = ({ durationInFrames, kicker, title, colAts = [16, 30, 44], emphasizeAt = 120, tint, cols: colsProp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const defaultCols = [
    { name: "CHATGPT", sub: "WORK", color: CYAN, mark: <ChatGptMark size={76} glow />, fromY: -420 },
    { name: "CLAUDE", sub: "COWORK", color: "#D97757", mark: <ClaudeMark size={64} />, fromY: 420 },
    { name: "COPILOT", sub: "COWORK", color: "#60A5FA", mark: (
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#60A5FA22", border: "2px solid #60A5FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={label(30, "#60A5FA")}>C</span>
        </div>
      ), fromY: -420 },
  ];
  // custom columns (e.g. the premium-tier trio) — mark falls back to a letter tile
  const cols = (colsProp ?? defaultCols).map((c, i) => ({
    fromY: i % 2 === 0 ? -420 : 420,
    mark: (
      <div style={{ width: 64, height: 64, borderRadius: 16, background: `${c.color}22`, border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={label(30, c.color)}>{c.name.slice(0, 1)}</span>
      </div>
    ),
    ...c,
  }));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc2} tint={tint} impacts={[emphasizeAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
        <div style={{ display: "flex", gap: 44, alignItems: "flex-end" }}>
          {cols.map((c, i) => {
            const enter = spring({ frame: frame - colAts[i], fps, config: { stiffness: 140, damping: 15 }, durationInFrames: 26 });
            const hero = i === 0 ? spring({ frame: frame - emphasizeAt, fps, config: { stiffness: 160, damping: 14 }, durationInFrames: 22 }) : 0;
            const s = interpolate(enter, [0, 1], [0.6, 1]) * (1 + hero * 0.09);
            const dim = i !== 0 ? 1 - hero * 0.28 : 1;
            return (
              <div key={c.name} style={{ transform: `translateY(${c.fromY * (1 - enter)}px) scale(${s})`, opacity: interpolate(enter, [0, 0.3], [0, 1]) * dim }}>
                <div style={{ ...glassCard(c.color, 2), borderRadius: 22, width: 330, padding: "26px 26px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  {c.mark}
                  <div style={{ textAlign: "center" }}>
                    <div style={label(30)}>{c.name}</div>
                    <div style={label(20, c.color)}>{c.sub}</div>
                  </div>
                  <div style={{ ...glassCard("rgba(255,255,255,0.35)", 1), borderRadius: 12, padding: "14px 18px" }}>
                    <Lines w={210} n={3} />
                  </div>
                </div>
                {i === 0 && hero > 0.4 && <Sparks at={emphasizeAt} x={165} y={-30} />}
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

// ── 3. SOL INCIDENT: mock agent run deletes files (clearly an illustration) ──
export const SolIncidentScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  deleteAt?: number; warnAt?: number; freezeAt?: number; tint?: string;
}> = ({ durationInFrames, kicker, title, deleteAt = 60, warnAt = 96, freezeAt, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frozen = freezeAt !== undefined && frame >= freezeAt;
  const files = [
    { name: "Project Copy", gone: deleteAt },
    { name: "Test Notes", gone: deleteAt + 18 },
    { name: "Sample Data", gone: undefined },
  ];
  const shake = impulse(frame, warnAt);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc3} tint={tint} mood="danger" impacts={[warnAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
        <div style={{ position: "relative", transform: `translateX(${shake * 7}px)` }}>
        <div style={{ filter: frozen ? "grayscale(0.85) blur(1.6px) brightness(0.75)" : undefined }}>
          <div style={{ ...glassCard(RED, 2), borderRadius: 22, width: 760, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
              <ChatGptMark size={34} />
              <span style={label(20)}>agent run — cleanup task</span>
              <span style={{ ...label(15, AMBER), marginLeft: "auto", border: `2px solid ${AMBER}`, borderRadius: 8, padding: "3px 10px" }}>ILLUSTRATION</span>
            </div>
            <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
              {files.map((f) => {
                const going = f.gone !== undefined ? spring({ frame: frame - f.gone, fps, config: { stiffness: 200, damping: 18 }, durationInFrames: 18 }) : 0;
                return (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 14, opacity: 1 - going, transform: `translateX(${going * 60}px) scaleY(${1 - going * 0.6})` }}>
                    <svg width={34} height={28} viewBox="0 0 44 36">
                      <path d="M2 8 h14 l4 5 h22 v20 h-40 z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} />
                    </svg>
                    <span style={{ ...label(22), fontWeight: 700 }}>{f.name}</span>
                    {f.gone !== undefined && frame >= f.gone && <span style={label(18, RED)}>deleted</span>}
                  </div>
                );
              })}
              {frame >= warnAt && (
                <div style={{ alignSelf: "center", marginTop: 6, transform: `scale(${interpolate(spring({ frame: frame - warnAt, fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 16 }), [0, 1], [1.6, 1])})` }}>
                  <div style={{ border: `3px solid ${RED}`, background: `${RED}26`, borderRadius: 12, padding: "10px 26px" }}>
                    <span style={label(26, RED)}>FILES REMOVED</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: "10px 22px", background: "rgba(0,0,0,0.45)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ ...label(15, "rgba(255,255,255,0.75)"), fontWeight: 700 }}>UNVERIFIED REPORT — NO OFFICIAL OPENAI CONFIRMATION</span>
            </div>
          </div>
        </div>
          {/* the stamp sits OUTSIDE the filtered wrapper — a CSS filter blurs
              ALL descendants, so a child can't opt back out with filter:none */}
          {frozen && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ImpactStamp at={freezeAt!} text="NOT OFFICIALLY CONFIRMED" />
            </div>
          )}
        </div>
        {frozen && (
          <span style={{ ...label(20, "rgba(31,30,29,0.6)"), fontWeight: 700 }}>no official OpenAI acknowledgement located</span>
        )}
      </div>
    </SceneShell>
  );
};

// ── 4. THE RULE: no backup, no agent ─────────────────────────────────────────
export const NoBackupNoAgentScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  stopAt?: number; copyAt?: number; goAt?: number; stampAt?: number; tint?: string;
}> = ({ durationInFrames, kicker, title, stopAt = 46, copyAt = 84, goAt = 130, stampAt = 160, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const approach = interpolate(frame, [8, stopAt], [430, 205], { ...CLAMP, easing: (t) => 1 - (1 - t) * (1 - t) });
  const resume = spring({ frame: frame - goAt, fps, config: { stiffness: 120, damping: 16 }, durationInFrames: 30 });
  const cursorX = approach - resume * 165;
  const stopKick = impulse(frame, stopAt);
  const dup = spring({ frame: frame - copyAt, fps, config: { stiffness: 140, damping: 15 }, durationInFrames: 26 });
  const Folder: React.FC<{ color: string; tag: string; tagColor?: string }> = ({ color, tag, tagColor = WHITE }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width={190} height={140} viewBox="0 0 190 140">
        <path d="M10 30 h60 l16 18 h94 v82 h-170 z" fill={`${color}2b`} stroke={color} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <span style={{ ...label(22, tagColor), border: `2px solid ${tagColor}55`, borderRadius: 10, padding: "5px 14px", background: PANEL }}>{tag}</span>
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc4} tint={tint} impacts={[stopAt, stampAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
        <div style={{ position: "relative", width: 1240, height: 360, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
          <div style={{ transform: `translateX(${stopKick * 5}px)` }}>
            <Folder color={AMBER} tag={frame < copyAt + 10 ? "ONLY COPY" : "WORKING COPY"} tagColor={frame < copyAt + 10 ? AMBER : GREEN} />
            {frame >= copyAt && <Puff at={copyAt} x={95} y={70} />}
          </div>
          {/* backup duplicate slides out */}
          <div style={{ opacity: interpolate(dup, [0, 0.35], [0, 1]), transform: `translateX(${interpolate(dup, [0, 1], [-190, 0])}px) scale(${interpolate(dup, [0, 1], [0.6, 1])})` }}>
            <Folder color={GREEN} tag="BACKUP" tagColor={GREEN} />
          </div>
          {/* the agent cursor — a blossom-badged pointer */}
          <div style={{ position: "absolute", right: cursorX, top: 96, display: "flex", alignItems: "center", gap: 10 }}>
            <ChatGptMark size={56} glow />
            <svg width={34} height={40} viewBox="0 0 34 40" style={{ transform: "rotate(-18deg)" }}>
              <path d="M4 2 L30 22 L18 24 L24 38 L16 38 L12 26 L4 30 Z" fill={WHITE} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
            </svg>
          </div>
          {/* STOP flash between cursor and folder */}
          {frame >= stopAt && frame < goAt && (
            <div style={{ position: "absolute", right: 175, top: 8, transform: `scale(${1 + stopKick * 0.15})` }}>
              <WarningBadge label="NO BACKUP" danger delay={stopAt} />
            </div>
          )}
          {frame >= goAt && (
            <div style={{ position: "absolute", right: 175, top: 66 }}>
              <span style={label(26, GREEN)}>OK — GO</span>
            </div>
          )}
        </div>
        {frame >= stampAt && (
          <div style={{ position: "absolute", bottom: 120, left: "50%", transform: "translateX(-50%)" }}>
            <ImpactStamp at={stampAt} text="NO BACKUP, NO AGENT" />
          </div>
        )}
      </div>
    </SceneShell>
  );
};

// ── 5. SANDBOX: copies only, boundary drawn, checklist before write access ──
export const SandboxScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  copyAts?: [number, number, number]; boundaryAt?: number; chipAts?: [number, number, number]; tint?: string;
}> = ({ durationInFrames, kicker, title, copyAts = [30, 44, 58], boundaryAt = 84, chipAts = [120, 150, 180], tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = ["BACKUP", "VERSION HISTORY", "WRITE ACCESS LAST"];
  const boundary = spring({ frame: frame - boundaryAt, fps, config: { stiffness: 110, damping: 16 }, durationInFrames: 30 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc5} tint={tint} impacts={[chipAts[2]]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
        <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
          {/* source folder — ink strokes: this sits on the IVORY paper (§8) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <svg width={170} height={126} viewBox="0 0 190 140">
              <path d="M10 30 h60 l16 18 h94 v82 h-170 z" fill="rgba(31,30,29,0.08)" stroke="rgba(31,30,29,0.65)" strokeWidth={5} strokeLinejoin="round" />
            </svg>
            <span style={label(20, "rgba(31,30,29,0.75)")}>CLIENT FILES</span>
            <span style={label(16, "#0E9F6E")}>stays untouched</span>
          </div>
          {/* copies arc across */}
          <div style={{ position: "relative", width: 200, height: 160 }}>
            {copyAts.map((at, i) => {
              const fly = spring({ frame: frame - at, fps, config: { stiffness: 130, damping: 15 }, durationInFrames: 28 });
              return (
                <div key={i} style={{ position: "absolute", left: interpolate(fly, [0, 1], [-140, 150]), top: 50 + i * 22 - Math.sin(fly * Math.PI) * 70, opacity: interpolate(fly, [0, 0.2], [0, 1], CLAMP) }}>
                  <svg width={40} height={33} viewBox="0 0 44 36">
                    <path d="M2 8 h14 l4 5 h22 v20 h-40 z" fill={`${CYAN}33`} stroke={CYAN} strokeWidth={2.5} />
                  </svg>
                </div>
              );
            })}
          </div>
          {/* sandbox folder inside dotted boundary */}
          <div style={{ position: "relative", padding: 34 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 26, border: `4px dashed ${CYAN}`, opacity: boundary, transform: `scale(${interpolate(boundary, [0, 1], [1.25, 1])})` }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <svg width={190} height={140} viewBox="0 0 190 140">
                <path d="M10 30 h60 l16 18 h94 v82 h-170 z" fill={`${CYAN}2b`} stroke={CYAN} strokeWidth={5} strokeLinejoin="round" />
              </svg>
              <span style={{ ...label(21, "#C15F3C"), fontFamily: MONO }}>sandbox-test</span>
              <span style={label(16, "rgba(31,30,29,0.6)")}>copies only</span>
            </div>
            <Puff at={copyAts[0] + 20} x={95} y={110} />
          </div>
        </div>
        {/* the order of operations */}
        <div style={{ display: "flex", gap: 22 }}>
          {chips.map((c, i) => {
            const pop = spring({ frame: frame - chipAts[i], fps, config: { stiffness: 220, damping: 14 }, durationInFrames: 18 });
            if (frame < chipAts[i]) return <div key={c} style={{ width: 10 }} />;
            return (
              <div key={c} style={{ transform: `scale(${interpolate(pop, [0, 1], [1.5, 1])}) rotate(${[-2, 1.5, -1.5][i]}deg)`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
                <div style={{ ...glassCard(i === 2 ? AMBER : GREEN, 2), borderRadius: 12, padding: "10px 20px" }}>
                  <span style={label(22, i === 2 ? AMBER : GREEN)}>{i + 1}. {c}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
