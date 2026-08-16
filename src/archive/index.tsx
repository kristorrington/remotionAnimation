import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { KimiVideo, KIMI_DUR } from "../KimiVideo";
import { KimiFinal } from "../KimiFinal";
import { KrisIntro } from "../KrisIntro";
import { KrisHero } from "../KrisHero";
import { TutorialOverlays } from "../TutorialOverlays";
import { HookIntro, hookIntroSchema } from "../HookIntro";
import { HermesHook, hermesHookSchema } from "../HermesHook";
import { HermesVideo } from "../HermesVideo";
import { HermesAnnotations } from "../HermesAnnotations";
import { GmailVideo } from "../GmailVideo";
import { GmailAnnotations } from "../GmailAnnotations";
import { GmailAuthCommand } from "../GmailAuthCommand";
import { GmailLiveTests } from "../GmailLiveTests";
import { Fable5Video } from "../Fable5Video";
import { PolicyRiskVideo } from "../PolicyRiskVideo";
import { PolicyRiskFinal } from "../PolicyRiskFinal";
import { DSparkVideo } from "../DSparkVideo";
import { DSparkFinal } from "../DSparkFinal";
import { ClaudeWealthVideo, CLAUDE_WEALTH_DUR } from "../ClaudeWealthVideo";
import { ClaudeWealthFinal } from "../ClaudeWealthFinal";
import { ModelRoutingVideo, MODEL_ROUTING_DUR } from "../ModelRoutingVideo";
import { ModelRoutingFinal } from "../ModelRoutingFinal";
import { FableCountdownVideo, FABLE_COUNTDOWN_DUR } from "../FableCountdownVideo";
import { FableCountdownFinal } from "../FableCountdownFinal";
import { SideHustleVideo, SIDE_HUSTLE_DUR } from "../SideHustleVideo";
import { GptSandboxVideo, GPT_SANDBOX_DUR } from "../GptSandboxVideo";
import { GptSandboxFinal } from "../GptSandboxFinal";
import { SideHustleFinal } from "../SideHustleFinal";
import { N8nHybridVideo, N8N_HYBRID_DUR } from "../N8nHybridVideo";
import { N8nHybridFinal } from "../N8nHybridFinal";
import { ChatGptWorkVideo, CHATGPT_WORK_DUR } from "../ChatGptWorkVideo";
import { ChatGptWorkFinal } from "../ChatGptWorkFinal";
import { AiNewsVideo, AINEWS_DUR } from "../AiNewsVideo";
import { AiNewsFinal } from "../AiNewsFinal";
import { GoLocalVideo, GOLOCAL_DUR } from "../GoLocalVideo";
import { SkillsVideo, SKILLS_DUR } from "../SkillsVideo";
import { SkillsFinal } from "../SkillsFinal";
import { GoLocalFinal } from "../GoLocalFinal";
import { ReposVideo, REPOS_DUR } from "../ReposVideo";
import { ReposFinal } from "../ReposFinal";
import { AgenticPricingVideo, AGP_DUR } from "../AgenticPricingVideo";
import { AgenticPricingFinal } from "../AgenticPricingFinal";
import { FablePermanentVideo, FP_DUR } from "../FablePermanentVideo";
import { FablePermanentFinal } from "../FablePermanentFinal";
import { QwenMaxVideo, QWEN_DUR } from "../QwenMaxVideo";
import { QwenMaxFinal } from "../QwenMaxFinal";
import { RogueAgentVideo, ROGUE_DUR } from "../RogueAgentVideo";
import { RogueAgentFinal } from "../RogueAgentFinal";
import { Opus5Video, OPUS5_DUR } from "../Opus5Video";
import { Opus5Final } from "../Opus5Final";
import { HabitsVideo, HABITS_DUR } from "../HabitsVideo";
import { HabitsFinal } from "../HabitsFinal";
import { AstraVideo, ASTRA_DUR } from "../AstraVideo";
import { AstraFinal } from "../AstraFinal";
import { GemRoboticsVideo, GEMROB_DUR } from "../GemRoboticsVideo";
import { GemRoboticsFinal } from "../GemRoboticsFinal";
import { AiWeeklyVideo, AI_WEEKLY_DUR } from "../AiWeeklyVideo";
import { AiWeeklyFinal } from "../AiWeeklyFinal";
import { AiNews2Video, AI_NEWS2_DUR } from "../AiNews2Video";
import { AiNews2Final } from "../AiNews2Final";

// ============================================================================
// THE ARCHIVE — compositions from PREVIOUS videos. When a new video starts,
// its predecessor's <Composition> entries move HERE from Root.tsx (and its
// ShortSpecs move to src/shorts/archivedSpecs.ts), so the Studio sidebar only
// shows the CURRENT video. Flip SHOW_ARCHIVE to true to re-render anything
// old — footage stays in public/ (rotated names) and captions stay correct
// via captionsRegistry. See AGENTS.md "Archiving previous videos".
// ============================================================================
export const SHOW_ARCHIVE = false;

const transparentDefaults: CalculateMetadataFunction<
  Record<string, unknown>
> = () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

export const ArchivedVideoCompositions: React.FC = () => {
  return (
    <>
      {/* ── Astra ten-proofs fact-check (Aug 2026) ── */}
      <Composition id="AstraVideo" component={AstraVideo} durationInFrames={ASTRA_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AstraFinal" component={AstraFinal} durationInFrames={ASTRA_DUR} fps={30} width={1920} height={1080} />

      {/* ── Gemini Robotics 2 — breakthrough demo or highlight reel? (Aug 2026) ── */}
      <Composition id="GemRoboticsVideo" component={GemRoboticsVideo} durationInFrames={GEMROB_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="GemRoboticsFinal" component={GemRoboticsFinal} durationInFrames={GEMROB_DUR} fps={30} width={1920} height={1080} />

      {/* ── AI news #2 — DeepSeek/OpenAI/Qwen, 3-level evidence rule (Aug 2026) ── */}
      <Composition id="AiNews2Video" component={AiNews2Video} durationInFrames={AI_NEWS2_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AiNews2Final" component={AiNews2Final} durationInFrames={AI_NEWS2_DUR} fps={30} width={1920} height={1080} />

      {/* ── AI news this week — 3 stories that matter, 2 that don't (July 2026) ── */}
      <Composition id="AiWeeklyVideo" component={AiWeeklyVideo} durationInFrames={AI_WEEKLY_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AiWeeklyFinal" component={AiWeeklyFinal} durationInFrames={AI_WEEKLY_DUR} fps={30} width={1920} height={1080} />

      {/* ── The 5 habits of managing AI agents well (July 2026) ── */}
      <Composition id="HabitsVideo" component={HabitsVideo} durationInFrames={HABITS_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="HabitsFinal" component={HabitsFinal} durationInFrames={HABITS_DUR} fps={30} width={1920} height={1080} />

      {/* ── Qwen 3.8 Max — "second only to Fable 5" (July 2026) ── */}
      <Composition id="QwenMaxVideo" component={QwenMaxVideo} durationInFrames={QWEN_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="QwenMaxFinal" component={QwenMaxFinal} durationInFrames={QWEN_DUR} fps={30} width={1920} height={1080} />
      <Composition id="RogueAgentVideo" component={RogueAgentVideo} durationInFrames={ROGUE_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="RogueAgentFinal" component={RogueAgentFinal} durationInFrames={ROGUE_DUR} fps={30} width={1920} height={1080} />
      <Composition id="Opus5Video" component={Opus5Video} durationInFrames={OPUS5_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="Opus5Final" component={Opus5Final} durationInFrames={OPUS5_DUR} fps={30} width={1920} height={1080} />

      {/* ── Claude Fable 5 is now permanent (July 2026) ── */}
      <Composition id="FablePermanentVideo" component={FablePermanentVideo} durationInFrames={FP_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="FablePermanentFinal" component={FablePermanentFinal} durationInFrames={FP_DUR} fps={30} width={1920} height={1080} />

      {/* ── Should you charge more for 'agentic'? (July 2026) ── */}
      <Composition id="AgenticPricingVideo" component={AgenticPricingVideo} durationInFrames={AGP_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AgenticPricingFinal" component={AgenticPricingFinal} durationInFrames={AGP_DUR} fps={30} width={1920} height={1080} />

      {/* ── Kimi K3 — the new king? (July 2026) ── */}
      <Composition id="KimiVideo" component={KimiVideo} durationInFrames={KIMI_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="KimiFinal" component={KimiFinal} durationInFrames={KIMI_DUR} fps={30} width={1920} height={1080} />

      {/* ── 7 GitHub repos for Claude Code (July 2026) ── */}
      <Composition id="ReposVideo" component={ReposVideo} durationInFrames={REPOS_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="ReposFinal" component={ReposFinal} durationInFrames={REPOS_DUR} fps={30} width={1920} height={1080} />

      {/* ── 5 Claude Code skills ranked (July 2026) ── */}
      <Composition id="SkillsVideo" component={SkillsVideo} durationInFrames={SKILLS_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="SkillsFinal" component={SkillsFinal} durationInFrames={SKILLS_DUR} fps={30} width={1920} height={1080} />

      {/* ── "Just go local" solves nothing (July 2026) ── */}
      <Composition id="GoLocalVideo" component={GoLocalVideo} durationInFrames={GOLOCAL_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="GoLocalFinal" component={GoLocalFinal} durationInFrames={GOLOCAL_DUR} fps={30} width={1920} height={1080} />

      {/* ── AI-news / GPT-5.6 super-app roundup (July 2026) ── */}
      <Composition id="AiNewsVideo" component={AiNewsVideo} durationInFrames={AINEWS_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="AiNewsFinal" component={AiNewsFinal} durationInFrames={AINEWS_DUR} fps={30} width={1920} height={1080} />

      {/* ── "What is ChatGPT Work" (July 2026) ── */}
      <Composition id="ChatGptWorkVideo" component={ChatGptWorkVideo} durationInFrames={CHATGPT_WORK_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="ChatGptWorkFinal" component={ChatGptWorkFinal} durationInFrames={CHATGPT_WORK_DUR} fps={30} width={1920} height={1080} />

      {/* ── n8n vs agents "hybrid stack" (July 2026) ── */}
      <Composition id="N8nHybridVideo" component={N8nHybridVideo} durationInFrames={N8N_HYBRID_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="N8nHybridFinal" component={N8nHybridFinal} durationInFrames={N8N_HYBRID_DUR} fps={30} width={1920} height={1080} />

      {/* ── GPT-5.6: sandbox it before you scale it (July 2026) ── */}
      <Composition id="GptSandboxVideo" component={GptSandboxVideo} durationInFrames={GPT_SANDBOX_DUR} fps={30} width={1920} height={1080} calculateMetadata={transparentDefaults} />
      <Composition id="GptSandboxFinal" component={GptSandboxFinal} durationInFrames={GPT_SANDBOX_DUR} fps={30} width={1920} height={1080} />

      {/* ── Side-hustles: 5 beginner Claude paths (July 2026) ── */}
      <Composition
        id="SideHustleVideo"
        component={SideHustleVideo}
        durationInFrames={SIDE_HUSTLE_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="SideHustleFinal"
        component={SideHustleFinal}
        durationInFrames={SIDE_HUSTLE_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Fable-countdown: the July 12 window (July 2026) ── */}
      <Composition
        id="FableCountdownVideo"
        component={FableCountdownVideo}
        durationInFrames={FABLE_COUNTDOWN_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="FableCountdownFinal"
        component={FableCountdownFinal}
        durationInFrames={FABLE_COUNTDOWN_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Model routing: Opus vs Fable 5 (July 2026) ── */}
      <Composition
        id="ModelRoutingVideo"
        component={ModelRoutingVideo}
        durationInFrames={MODEL_ROUTING_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="ModelRoutingFinal"
        component={ModelRoutingFinal}
        durationInFrames={MODEL_ROUTING_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Claude wealth-stories (July 2026) ── */}
      <Composition
        id="ClaudeWealthVideo"
        component={ClaudeWealthVideo}
        durationInFrames={CLAUDE_WEALTH_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="ClaudeWealthFinal"
        component={ClaudeWealthFinal}
        durationInFrames={CLAUDE_WEALTH_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DeepSeek DSpark (July 2026) ── */}
      <Composition
        id="DSparkVideo"
        component={DSparkVideo}
        durationInFrames={11967}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="DSparkFinal"
        component={DSparkFinal}
        durationInFrames={11967}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Fable 5 explainer ── */}
      <Composition
        id="Fable5Video"
        component={Fable5Video}
        durationInFrames={9810}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      {/* ── "AI depends on policy" ── */}
      <Composition
        id="PolicyRiskVideo"
        component={PolicyRiskVideo}
        durationInFrames={14500}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="PolicyRiskFinal"
        component={PolicyRiskFinal}
        durationInFrames={14453}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Hermes ── */}
      <Composition
        id="HermesVideo"
        component={HermesVideo}
        durationInFrames={14600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="HermesAnnotations"
        component={HermesAnnotations}
        durationInFrames={14600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="HermesHook"
        component={HermesHook}
        durationInFrames={520}
        fps={30}
        width={1920}
        height={1080}
        schema={hermesHookSchema}
        defaultProps={{ showCaptions: true }}
      />

      {/* ── Gmail ── */}
      <Composition
        id="GmailVideo"
        component={GmailVideo}
        durationInFrames={16990}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="GmailAnnotations"
        component={GmailAnnotations}
        durationInFrames={16990}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="GmailAuthCommand"
        component={GmailAuthCommand}
        durationInFrames={740}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="GmailLiveTests"
        component={GmailLiveTests}
        durationInFrames={3560}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      {/* ── Early one-offs ── */}
      <Composition
        id="HookIntro"
        component={HookIntro}
        durationInFrames={140}
        fps={30}
        width={1920}
        height={1080}
        schema={hookIntroSchema}
        defaultProps={{ showCaptions: true }}
      />
      <Composition
        id="TutorialOverlays"
        component={TutorialOverlays}
        durationInFrames={11150}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="KrisHero"
        component={KrisHero}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KrisIntro"
        component={KrisIntro}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
