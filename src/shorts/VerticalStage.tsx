import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

// The talking-head footage framed for 9:16. The source is a centered 16:9 medium
// shot, so `objectFit: cover` center-crops it to a native vertical portrait;
// `objectPosition` biases up so the face sits in the upper third. `from` windows
// the footage to the clip's moment (trimBefore = absolute start frame) and the VO
// is boosted the same way as the landscape cut.
export const VerticalStage: React.FC<{ source: string; from: number; volume?: number }> = ({
  source,
  from,
  volume = 3,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(source)}
        trimBefore={from}
        volume={volume}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 30%",
          // No continuous zoom: per-frame sub-pixel scaling reads as a subtle
          // shake/shimmer on the face. The footage stays locked still.
          filter: "contrast(1.06) saturate(1.1) brightness(1.02)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* top + bottom scrims so the hook / captions / CTA read over the footage */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
