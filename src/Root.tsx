import "./index.css";
import { Composition } from "remotion";
import { ShortsCompositions, SHORTS_ENABLED } from "./shorts";
import { StyleDemo } from "./StyleDemo";
import { TemplateLab, TEMPLATE_LAB_DUR } from "./TemplateLab";
import { ArchivedVideoCompositions, SHOW_ARCHIVE } from "./archive";
import { CalculateMetadataFunction } from "remotion";
import { KimiVideo, KIMI_DUR } from "./KimiVideo";
import { KimiFinal } from "./KimiFinal";

export const transparentDefaults: CalculateMetadataFunction<
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


      {/* ── CURRENT: Kimi K3 — the new king? (July 2026) ── */}
      <Composition id="KimiVideo" component={KimiVideo} durationInFrames={KIMI_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="KimiFinal" component={KimiFinal} durationInFrames={KIMI_DUR} fps={30} width={1920} height={1080} />

      {/* Previous videos — hidden unless SHOW_ARCHIVE (src/archive) is true */}
      {SHOW_ARCHIVE && <ArchivedVideoCompositions />}
    </>
  );
};
