import "./index.css";
import { Composition } from "remotion";
import { ShortsCompositions, SHORTS_ENABLED } from "./shorts";
import { StyleDemo } from "./StyleDemo";
import { TemplateLab, TEMPLATE_LAB_DUR } from "./TemplateLab";
import { EditKitDemo, EDITKIT_DEMO_DUR } from "./EditKitDemo";
import { ArchivedVideoCompositions, SHOW_ARCHIVE } from "./archive";
import { CalculateMetadataFunction } from "remotion";
import { AiWeeklyVideo, AI_WEEKLY_DUR } from "./AiWeeklyVideo";
import { AiWeeklyFinal } from "./AiWeeklyFinal";
import { TutorialFinal, TUTORIAL_DUR } from "./TutorialFinal";
import { AiNews2Video, AI_NEWS2_DUR } from "./AiNews2Video";
import { AiNews2Final } from "./AiNews2Final";

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

      <Composition
        // Model-review edit-kit catalog (CameraPunchIn, ModelComparison,
        // PriceComparison, BenchmarkBar, EffortSelector, DecisionFramework,
        // KineticText, SectionTransition) — ~3s each. CLAUDE.md §15.
        id="EditKitDemo"
        component={EditKitDemo}
        durationInFrames={EDITKIT_DEMO_DUR}
        fps={30}
        width={1920}
        height={1080}
      />



      {/* ── CURRENT: AI news — 5 labs, one day; which stories are real? (Aug 2026) ── */}
      <Composition id="AiNews2Video" component={AiNews2Video} durationInFrames={AI_NEWS2_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AiNews2Final" component={AiNews2Final} durationInFrames={AI_NEWS2_DUR} fps={30} width={1920} height={1080} />

      {/* ── AI news this week — 3 stories that matter, 2 that don't (July 2026) ── */}
      <Composition id="AiWeeklyVideo" component={AiWeeklyVideo} durationInFrames={AI_WEEKLY_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AiWeeklyFinal" component={AiWeeklyFinal} durationInFrames={AI_WEEKLY_DUR} fps={30} width={1920} height={1080} />

      {/* ── HOW-TO: Claude Code password-generator tutorial — reframed 16:9 (July 2026) ── */}
      <Composition id="TutorialFinal" component={TutorialFinal} durationInFrames={TUTORIAL_DUR} fps={30} width={1920} height={1080} />

      {/* Previous videos — hidden unless SHOW_ARCHIVE (src/archive) is true */}
      {SHOW_ARCHIVE && <ArchivedVideoCompositions />}
    </>
  );
};
