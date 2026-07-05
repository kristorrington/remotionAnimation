import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#0a0a0a";
const ACCENT = "#3B82F6";
const FONT_FAMILY =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// 1. 0-1s — subtle dot pattern fades in to a low opacity.
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1 * fps], [0, 0.07], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `radial-gradient(${ACCENT} 1.4px, transparent 1.4px)`,
        backgroundSize: "44px 44px",
      }}
    />
  );
};

// 2. 1-3s — a thin horizontal line draws itself from left to right.
const CenterLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const draw = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 1.6 * fps,
  });

  const scaleX = interpolate(draw, [0, 1], [0, 1]);
  const opacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          width: 620,
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          opacity,
          transform: `translateY(-150px) scaleX(${scaleX})`,
          transformOrigin: "left center",
        }}
      />
    </AbsoluteFill>
  );
};

// 3. 3-5s — main title slides up from below and fades in.
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 1.5 * fps,
  });

  const translateY = interpolate(rise, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 96,
          letterSpacing: 18,
          color: "#ffffff",
          textTransform: "uppercase",
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        Kris Torrington
      </h1>
    </AbsoluteFill>
  );
};

// 4. 5-7s — secondary subtitle fades in below the name.
const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 1.2 * fps,
  });

  const translateY = interpolate(rise, [0, 1], [24, 0]);
  const opacity = interpolate(frame, [0, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: FONT_FAMILY,
          fontWeight: 300,
          fontSize: 34,
          letterSpacing: 8,
          color: "rgba(255, 255, 255, 0.7)",
          transform: `translateY(${135 + translateY}px)`,
          opacity,
        }}
      >
        AI Automation
      </p>
    </AbsoluteFill>
  );
};

// 5. 7-9s — glowing blue accent bar animates in under the name.
const AccentBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grow = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 1.4 * fps,
  });

  const scaleX = interpolate(grow, [0, 1], [0, 1]);
  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          width: 260,
          height: 4,
          borderRadius: 4,
          backgroundColor: ACCENT,
          boxShadow: `0 0 16px ${ACCENT}, 0 0 32px ${ACCENT}`,
          opacity,
          transform: `translateY(70px) scaleX(${scaleX})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const KrisIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 6. 9-10s — everything gently fades out.
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    {
      easing: Easing.bezier(0.45, 0, 0.55, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: fadeOut }}>
      <Sequence  durationInFrames={durationInFrames}>
        <GridBackground />
      </Sequence>

      <Sequence from={1 * fps} durationInFrames={9 * fps}>
        <CenterLine />
      </Sequence>

      <Sequence from={3 * fps} durationInFrames={7 * fps}>
        <Title />
      </Sequence>

      <Sequence from={5 * fps} durationInFrames={5 * fps}>
        <Subtitle />
      </Sequence>

      <Sequence from={7 * fps} durationInFrames={3 * fps}>
        <AccentBar />
      </Sequence>
    </AbsoluteFill>
  );
};
