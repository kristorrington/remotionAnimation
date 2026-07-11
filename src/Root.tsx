import "./index.css";
import { CalculateMetadataFunction, Composition } from "remotion";
import { ShortsCompositions, SHORTS_ENABLED } from "./shorts";
import { StyleDemo } from "./StyleDemo";
import { TemplateLab, TEMPLATE_LAB_DUR } from "./TemplateLab";
import { N8nHybridVideo, N8N_HYBRID_DUR } from "./N8nHybridVideo";
import { N8nHybridFinal } from "./N8nHybridFinal";
import { ArchivedVideoCompositions, SHOW_ARCHIVE } from "./archive";

// Default this composition to a transparent ProRes 4444 export so it composites
// cleanly over screen-recorded footage straight from Studio's render button.
const transparentDefaults: CalculateMetadataFunction<
  Record<string, unknown>
> = () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

// The sidebar shows TOOLS + the CURRENT video + its shorts. Previous videos
// live in src/archive (long-form) and src/shorts/archivedSpecs.ts (shorts) —
// flip SHOW_ARCHIVE in src/archive to bring them back for a re-render.
// Rule: when a NEW video starts, the outgoing video's entries move to the
// archive in the same change (AGENTS.md "Archiving previous videos").

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical shorts (TikTok / Reels / Shorts) — current video's set */}
      {SHORTS_ENABLED && <ShortsCompositions />}

      <Composition
        // Style reference — the "bold" brand look on landscape cards.
        id="StyleDemoBold"
        component={StyleDemo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // Component catalog — every reusable subject/object/chart, ~3s each.
        id="TemplateLab"
        component={TemplateLab}
        durationInFrames={TEMPLATE_LAB_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // CURRENT: n8n vs agents "hybrid stack" — transparent overlay track.
        id="N8nHybridVideo"
        component={N8nHybridVideo}
        durationInFrames={N8N_HYBRID_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // CURRENT: n8n-hybrid — the finished combined cut (footage + overlay).
        id="N8nHybridFinal"
        component={N8nHybridFinal}
        durationInFrames={N8N_HYBRID_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Previous videos — hidden unless SHOW_ARCHIVE (src/archive) is true */}
      {SHOW_ARCHIVE && <ArchivedVideoCompositions />}
    </>
  );
};
