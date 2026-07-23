import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./overlayUI";

// TOP PROGRESS BAR — a thin, understated chapter/progress strip flush with the
// top edge of a long-form Final (Kris, July 2026). It fills left→right with the
// viewer's progress (NO countdown / elapsed / remaining), split into the video's
// chapters by subtle gaps; when a chapter begins its name fades in at top-left
// for ~2s then fades out. One brand accent on a dark, quiet track. Persistent
// chrome — mount it OUTSIDE the SlideLeftPush so it never slides on a cut, and
// LAST so it stays crisp through CutFlash.
export type Chapter = { label: string; from: number };

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TopProgressBar: React.FC<{
  sections: Chapter[];
  accent?: string;
  height?: number;
}> = ({ sections, accent = "#D97757", height = 5 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = durationInFrames - 1;
  const progress = interpolate(frame, [0, end], [0, 1], CLAMP);
  const bound = (i: number) => (i < sections.length ? sections[i].from / end : 1);

  // which chapter is on now → its label fades in (~8f), holds, fades out ~2s in
  let activeIdx = 0;
  for (let i = 0; i < sections.length; i++) if (frame >= sections[i].from) activeIdx = i;
  const since = frame - sections[activeIdx].from;
  const labelOpacity = interpolate(since, [0, 8, 52, 66], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* the bar — one segment per chapter, proportional to its length so the
          fill edge moves at constant real-time speed across the whole strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height, display: "flex", gap: 2 }}>
        {sections.map((s, i) => {
          const from = bound(i);
          const to = bound(i + 1);
          const fill = interpolate(progress, [from, to], [0, 1], CLAMP);
          return (
            <div key={s.label} style={{ flex: Math.max(0.0001, to - from), position: "relative", height, background: "rgba(18,17,16,0.32)", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: accent, boxShadow: `0 0 7px ${accent}77` }} />
            </div>
          );
        })}
      </div>
      {/* chapter indicator — small, bold, understated; dark chip reads on ivory OR footage */}
      <div style={{ position: "absolute", top: height + 12, left: 32, opacity: labelOpacity }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 14px 6px 12px", borderRadius: 8, background: "rgba(14,13,12,0.58)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}` }} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 21, letterSpacing: 1.4, color: "#fff", textTransform: "uppercase", transform: "translateZ(0)" }}>{sections[activeIdx].label}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
