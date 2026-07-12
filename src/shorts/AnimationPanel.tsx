import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ShortAnimation } from "./ShortAnimation";
import { useTheme } from "../theme";
import { PanelLayout } from "./panelLayout";
import { Beat } from "./types";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The animation zone of a short: a branded panel of animated beat scenes driven
// by the clip's beats. Fills its parent zone; the parent (VerticalShort) sizes it
// and passes `zoom` so scenes (sized for the split band) scale up when the
// animation takes the full screen.
export const AnimationPanel: React.FC<{ beats: Beat[]; zoom?: number; panelH?: number }> = ({ beats, zoom = 1, panelH = 838 }) => {
  const t = useTheme();
  // split mode: bias the content DOWN so the top-anchored BeatLabel clears the
  // seam-docked caption pill above it (overlap rule, CLAUDE.md §9 — "too
  // close"); eases back to centered as the panel zooms to full screen
  const shift = interpolate(zoom, [1, 1.32], [48, 0], CLAMP);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: t.flat ? t.bg : "#0d0c0b", borderTop: `2px solid ${t.accent}66` }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateY(${shift}px)` }}>
        <PanelLayout.Provider value={{ zoom, shift, panelH }}>
          <ShortAnimation beats={beats} />
        </PanelLayout.Provider>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
