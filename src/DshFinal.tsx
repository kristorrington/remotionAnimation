import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { DshVideo, DSH_WINDOWS, DSH_FULLSCREEN, DSH_CUTS, DSH_PIP } from "./DshVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";
import { DSH, DSH_FONT, DSH_MONO } from "./scenes/DshScenes";

// DshFinal — DeepSeek Harness tutorial. A-roll narration spine (FootageDirector)
// with real demo footage full-screen (DshVideo) + Kris as corner PiP during
// demos. Cold-open flying logo, no-box keyword captions, section labels, chapter
// progress. Premium AI-tech: cool-dark + DeepSeek periwinkle. DUR 23440.
const FOOTAGE = "talking-head-dsh.mp4";

const CHAPTERS: Chapter[] = [
  { label: "Overview", from: 0 },
  { label: "Prerequisites", from: 1707 },
  { label: "Install", from: 3129 },
  { label: "Setup", from: 5233 },
  { label: "Using It", from: 7298 },
  { label: "Permissions & Models", from: 12843 },
  { label: "Settings & Plugins", from: 15341 },
  { label: "Web Search", from: 19846 },
  { label: "Wrap", from: 20702 },
];

const COVERS = [...DSH_WINDOWS].sort((a, b) => a.from - b.from);
const CUTS = [...new Set([...DSH_CUTS, ...DSH_FULLSCREEN.map((f) => f.from)])].sort((a, b) => a - b);

// §15.2 punch-ins — selective, on the lines that matter
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 40, level: "emphasis", hold: 90 }, // hook
  { at: 453, level: "strong", hold: 60 }, // "let me show you exactly how"
  { at: 1264, level: "emphasis", hold: 60 }, // "quick heads-up"
  { at: 9028, level: "strong", hold: 56 }, // "something more interesting"
  { at: 10658, level: "strong", hold: 56 }, // "one step further"
  { at: 12633, level: "emphasis", hold: 60 }, // "particularly important"
  { at: 19583, level: "strong", hold: 60 }, // "live web search"
  { at: 21362, level: "emphasis", hold: 56 }, // "that's DeepSeek Harness"
  { at: 23340, level: "emphasis", hold: 60 }, // "thanks for watching"
];

// No-box keyword captions on A-roll (white + one blue word), sparse
const FACE_CAPTIONS: { at: number; dur: number; pre?: string; hot: string; post?: string; mono?: boolean }[] = [
  { at: 531, dur: 56, pre: "AN", hot: "AI CODING AGENT" },
  { at: 1336, dur: 66, hot: "DEVELOPER PREVIEW" },
  { at: 2467, dur: 60, hot: "platform.deepseek.com", mono: true },
  { at: 2912, dur: 60, pre: "BILLED BY", hot: "DEEPSEEK" },
  { at: 6227, dur: 64, hot: "KEEP KEYS PRIVATE" },
  { at: 12806, dur: 56, hot: "PERMISSIONS" },
  { at: 22786, dur: 70, hot: "COMMANDS", post: "IN THE DESCRIPTION" },
];

const SECTIONS: { at: number; text: string }[] = [
  { at: 1713, text: "Prerequisites" },
  { at: 3135, text: "Install" },
  { at: 5239, text: "Setup" },
  { at: 7304, text: "Using it" },
  { at: 12806, text: "Permissions" },
  { at: 14167, text: "Models" },
  { at: 15739, text: "Agent presets" },
  { at: 18439, text: "Plugins" },
  { at: 19664, text: "Web search" },
];

const FaceCaption: React.FC<{ dur: number; pre?: string; hot: string; post?: string; mono?: boolean }> = ({ dur, pre, hot, post, mono }) => {
  const frame = useCurrentFrame();
  const riseY = interpolate(frame, [0, 12], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const op = Math.min(interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(frame, [dur - 8, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const fam = mono ? DSH_MONO : DSH_FONT;
  const sz = mono ? 40 : 46;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", paddingLeft: 130, paddingBottom: 130, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: "0.34em", transform: `translateY(${riseY}px)`, opacity: op, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
        {pre ? <span style={{ fontFamily: fam, fontWeight: 700, fontSize: sz, letterSpacing: mono ? 0 : 0.5, color: DSH.text, textTransform: mono ? "none" : "uppercase" }}>{pre}</span> : null}
        <span style={{ fontFamily: fam, fontWeight: 700, fontSize: sz, letterSpacing: mono ? 0 : 0.5, color: DSH.accent, textTransform: mono ? "none" : "uppercase" }}>{hot}</span>
        {post ? <span style={{ fontFamily: fam, fontWeight: 700, fontSize: sz, letterSpacing: 0.5, color: DSH.text, textTransform: "uppercase" }}>{post}</span> : null}
      </div>
    </AbsoluteFill>
  );
};

const SectionLabel: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const dur = 70;
  const x = interpolate(frame, [0, 12], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const op = Math.min(interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(frame, [dur - 12, dur - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 64, top: 130, display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 9, background: "rgba(10,12,16,0.85)", border: `1px solid ${DSH.line}`, backdropFilter: "blur(6px)", transform: `translateX(${x}px)`, opacity: op }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: DSH.accent }} />
        <span style={{ fontFamily: DSH_FONT, fontWeight: 600, fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: DSH.text }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

const FlyingLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 84;
  const e = spring({ frame, fps, config: { stiffness: 80, damping: 18 }, durationInFrames: 34 });
  const scale = interpolate(e, [0, 1], [0.55, 1]);
  const blur = interpolate(e, [0, 0.7, 1], [20, 4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(frame, [dur - 18, dur - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const drift = interpolate(frame, [0, dur], [0, -10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // top band, clear of the face (brief: beside/behind, never covering)
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, pointerEvents: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `translateY(${drift}px) scale(${scale})`, filter: `blur(${blur}px)`, opacity: op }}>
        <Img src={staticFile("assets/external/logos/dsh-deepseek-logo.png")} style={{ width: 150, filter: `drop-shadow(0 16px 40px ${DSH.accent}77)` }} />
        <span style={{ fontFamily: DSH_FONT, fontWeight: 800, fontSize: 62, letterSpacing: 6, textTransform: "uppercase", color: DSH.text, textShadow: "0 4px 30px rgba(0,0,0,0.85)" }}>DeepSeek Harness</span>
      </div>
    </AbsoluteFill>
  );
};

export const DshFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let footage: React.ReactNode = (
    <FootageDirector footage={FOOTAGE} volume={1.25} framing={[
      { at: 0, scale: 1.04, y: 0 },
      { at: 40, scale: 1.1, y: -1 },
      { at: 150, scale: 1.0, y: 0 },
      { at: 453, scale: 1.09, y: -1 },
      { at: 560, scale: 1.0, y: 0 },
      { at: 1264, scale: 1.07, y: 0 },
      { at: 1400, scale: 1.0, y: 0 },
      { at: 6900, scale: 1.06, y: 0 },
      { at: 7020, scale: 1.0, y: 0 },
      { at: 9028, scale: 1.1, y: -1 },
      { at: 9160, scale: 1.0, y: 0 },
      { at: 10658, scale: 1.1, y: -1 },
      { at: 10800, scale: 1.0, y: 0 },
      { at: 12211, scale: 1.06, y: 0 },
      { at: 12340, scale: 1.0, y: 0 },
      { at: 12633, scale: 1.08, y: -1 },
      { at: 12760, scale: 1.0, y: 0 },
      { at: 19583, scale: 1.1, y: -1 },
      { at: 19720, scale: 1.0, y: 0 },
      { at: 21362, scale: 1.06, y: 0 },
      { at: 21500, scale: 1.0, y: 0 },
      { at: 23340, scale: 1.06, y: -1 },
      { at: 23440, scale: 1.0, y: 0 },
    ]} />
  );
  for (const p of PUNCHES) {
    footage = (<CameraPunchIn at={p.at} level={p.level} hold={p.hold} ramp={12}>{footage}</CameraPunchIn>);
  }

  return (
    <ThemeProvider style="cinematic">
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <AbsoluteFill style={{ backgroundColor: DSH.bg }} />
        {frame < 26 && <AnimatedBackground durationInFrames={30} fade={false} />}
        <SlideLeftPush cuts={CUTS}>
          <AbsoluteFill style={{ transform: `scale(${introZoom})`, transformOrigin: "50% 40%", borderRadius: introRadius, overflow: "hidden", boxShadow: introZoom < 1 ? "0 24px 70px rgba(10,12,16,0.4)" : undefined }}>
            {footage}
          </AbsoluteFill>

          {COVERS.map((s) => (
            <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.dur}>
              <AbsoluteFill style={{ backgroundColor: DSH.bg }} />
            </Sequence>
          ))}

          <DshVideo />

          {DSH_PIP.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
        </SlideLeftPush>

        {/* Cold-open flying logo over Kris */}
        <Sequence from={12} durationInFrames={84}><FlyingLogo /></Sequence>

        {FACE_CAPTIONS.map((c) => (
          <Sequence key={`fc-${c.at}`} from={c.at} durationInFrames={c.dur}>
            <FaceCaption dur={c.dur} pre={c.pre} hot={c.hot} post={c.post} mono={c.mono} />
          </Sequence>
        ))}

        {SECTIONS.map((s) => (
          <Sequence key={`sec-${s.at}`} from={s.at} durationInFrames={70}><SectionLabel text={s.text} /></Sequence>
        ))}

        <CutFlash at={96} peak={0.45} />

        <Sequence from={1699} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={3121} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={5225} durationInFrames={14}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={12625} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={19475} durationInFrames={16}><SectionTransition kind="section" /></Sequence>

        <TopProgressBar sections={CHAPTERS} accent={DSH.accent} />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
