import React from "react";
import { Composition } from "remotion";
import { SHORTS } from "./specs";
import { VerticalShort } from "./VerticalShort";

// ── Master switch ──────────────────────────────────────────────────────────
// Flip to false to remove ALL shorts from the Studio sidebar and renders.
// (Everything shorts-related is isolated in this src/shorts/ folder.)
export const SHORTS_ENABLED = true;

// Every ShortSpec becomes its own 1080×1920 (9:16) composition, so each clip is
// previewable and renderable on its own. Registered in Root via <ShortsCompositions/>.
export const ShortsCompositions: React.FC = () => (
  <>
    {SHORTS.map((spec) => (
      <Composition
        key={spec.id}
        id={spec.id}
        component={VerticalShort}
        durationInFrames={spec.durationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ spec }}
      />
    ))}
  </>
);
