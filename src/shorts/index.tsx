import React from "react";
import { Composition } from "remotion";
import { SHORTS } from "./specs";
import { ARCHIVED_SHORTS } from "./archivedSpecs";
import { SHOW_ARCHIVE } from "../archive";
import { VerticalShort } from "./VerticalShort";

// ── Master switch ──────────────────────────────────────────────────────────
// Flip to false to remove ALL shorts from the Studio sidebar and renders.
// (Everything shorts-related is isolated in this src/shorts/ folder.)
export const SHORTS_ENABLED = true;

// Every ShortSpec becomes its own 1080×1920 (9:16) composition, so each clip is
// previewable and renderable on its own. A spec with `hookAlt` also registers a
// `<id>-B` variant (identical except the hook) for A/B testing. Toggle
// `showSafeZones` in the Studio props panel to see platform-UI safe zones.
// Only the CURRENT video's shorts register; SHOW_ARCHIVE brings back the rest.
export const ShortsCompositions: React.FC = () => (
  <>
    {[...SHORTS, ...(SHOW_ARCHIVE ? ARCHIVED_SHORTS : [])].flatMap((spec) => {
      const variants = [
        { id: spec.id, spec },
        ...(spec.hookAlt ? [{ id: `${spec.id}-B`, spec: { ...spec, hook: spec.hookAlt } }] : []),
      ];
      return variants.map((v) => (
        <Composition
          key={v.id}
          id={v.id}
          component={VerticalShort}
          durationInFrames={spec.durationInFrames}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ spec: v.spec, showSafeZones: false }}
        />
      ));
    })}
  </>
);
