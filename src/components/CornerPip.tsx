import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A small "webcam" preview of the talking head, shown bottom-right while a
// full-screen animation cutaway covers the main footage — so the presenter is
// never fully absent. `from` is the absolute start frame: because this lives in a
// <Sequence from={from}>, the video would otherwise restart at 0:00, so we
// `trimBefore={from}` to keep it playing in lock-step with the main footage/VO.
const Pip: React.FC<{ footage: string; from: number; dur: number }> = ({ footage, from, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 200, damping: 20, mass: 0.7 }, durationInFrames: 16 });
  const inOp = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const outOp = interpolate(frame, [dur - 12, dur], [1, 0], CLAMP);
  const op = Math.min(inOp, outOp);
  const scale = interpolate(enter, [0, 1], [0.86, 1]) * interpolate(frame, [dur - 12, dur], [1, 0.92], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 54, opacity: op, pointerEvents: "none" }}>
      <div
        style={{
          width: 384,
          height: 216,
          borderRadius: 18,
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "bottom right",
          border: "2px solid rgba(255,255,255,0.9)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.55), 0 0 0 4px rgba(6,182,212,0.35)",
        }}
      >
        <OffthreadVideo
          src={staticFile(footage)}
          muted
          trimBefore={from}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.18)", // punch in so the face reads in the small box
            filter: "contrast(1.06) saturate(1.1) brightness(1.02)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const CornerPip: React.FC<{ footage: string; from: number; dur: number }> = ({ footage, from, dur }) => (
  <Sequence from={from} durationInFrames={dur}>
    <Pip footage={footage} from={from} dur={dur} />
  </Sequence>
);
