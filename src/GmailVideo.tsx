import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { GmailHook } from "./components/GmailHook";
import { SectionCard } from "./components/SectionCard";
import { GmailOutro } from "./components/GmailOutro";
import { SFX, SfxCue } from "./components/Sfx";

// GmailVideo — full-length transparent cutaway track for the "Connect Hermes to
// Gmail via MCP" video (~9m26s, 16990f @ 30fps). Timings = sec×30 from the FINAL
// transcript. Branded full-screen segments at the conceptual / transition beats;
// transparent elsewhere. Pair with GmailAnnotations. Render transparent (audio
// is included). SFX are hosted (network needed at render time).
export const GmailVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0:00–0:19 — INTRO HOOK */}
      <Sequence  durationInFrames={584} premountFor={30}>
        <GmailHook />
      </Sequence>

      {/* 0:19 — SETUP */}
      <Sequence from={600} durationInFrames={110} premountFor={30}>
        <SectionCard kicker="STEP 1" title="SETUP" durationInFrames={110} />
      </Sequence>

      {/* 0:53 — GOOGLE CLOUD */}
      <Sequence from={1612} durationInFrames={120} premountFor={30}>
        <SectionCard kicker="STEP 2" title="GOOGLE CLOUD" durationInFrames={120} />
      </Sequence>

      {/* 3:46 — INSTALL GMAIL MCP */}
      <Sequence from={6784} durationInFrames={120} premountFor={30}>
        <SectionCard kicker="STEP 3" title="INSTALL GMAIL MCP" durationInFrames={120} />
      </Sequence>

      {/* 5:08 — CONNECT TO HERMES */}
      <Sequence from={9251} durationInFrames={120} premountFor={30}>
        <SectionCard kicker="STEP 4" title="CONNECT TO HERMES" durationInFrames={120} />
      </Sequence>

      {/* 6:21 — TEST IT */}
      <Sequence from={11431} durationInFrames={120} premountFor={30}>
        <SectionCard kicker="STEP 5" title="TEST IT" durationInFrames={120} />
      </Sequence>

      {/* 8:48 — RECAP */}
      <Sequence from={15849} durationInFrames={590} premountFor={30}>
        <SectionCard
          kicker="CONNECTED ✓"
          title="HERMES ✕ GMAIL"
          items={["Search your inbox", "Triage important emails", "Draft replies you control"]}
          itemDelays={[325, 410, 489]}
          durationInFrames={590}
        />
      </Sequence>

      {/* 9:08 — OUTRO */}
      <Sequence from={16449} durationInFrames={540} premountFor={30}>
        <GmailOutro durationInFrames={540} />
      </Sequence>

      {/* ===== SOUND ===== */}
      {/* hook: camera flash, brand slam, payoff */}
      <SfxCue from={16} src={SFX.shutter} volume={0.5} />
      <SfxCue from={185} src={SFX.whoosh} volume={0.6} />
      <SfxCue from={388} src={SFX.ding} volume={0.5} />
      {/* section cards */}
      <SfxCue from={600} src={SFX.whoosh} volume={0.55} />
      <SfxCue from={1612} src={SFX.whoosh} volume={0.55} />
      <SfxCue from={6784} src={SFX.whoosh} volume={0.55} />
      <SfxCue from={9251} src={SFX.whoosh} volume={0.55} />
      <SfxCue from={11431} src={SFX.whoosh} volume={0.55} />
      {/* recap + outro */}
      <SfxCue from={15849} src={SFX.whoosh} volume={0.55} />
      <SfxCue from={16174} src={SFX.ding} volume={0.45} />
      <SfxCue from={16449} src={SFX.whoosh} volume={0.55} />
      <SfxCue from={16500} src={SFX.ding} volume={0.5} />
    </AbsoluteFill>
  );
};
