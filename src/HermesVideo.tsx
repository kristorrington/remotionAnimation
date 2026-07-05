import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HermesHook } from "./HermesHook";
import { DemoPreview } from "./components/DemoPreview";
import { SectionCard } from "./components/SectionCard";
import { FlowDiagram } from "./components/FlowDiagram";
import { HermesRecap } from "./components/HermesRecap";
import { HermesVideoOutro } from "./components/HermesVideoOutro";

// HermesVideo — full-length overlay track for the Hermes × Playwright MCP video
// (~8m06s, 14600f @ 30fps). Branded full-screen animated segments (each with an
// AnimatedBackground) land on the conceptual / transition beats; everything else
// is TRANSPARENT so the screen recording of the live demo shows through.
//
// Render transparent (ProRes 4444) — see Root.tsx calculateMetadata.
export const HermesVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0:00–0:17 — INTRO HOOK (problem → solution), reuses the standalone hook */}
      <Sequence  durationInFrames={520} premountFor={30}>
        <HermesHook showCaptions={false} />
      </Sequence>

      {/* 0:17–0:27 — "by the end Hermes will…" three-demo preview */}
      <Sequence from={522} durationInFrames={283} premountFor={30}>
        <DemoPreview durationInFrames={283} />
      </Sequence>

      {/* 0:27 — SETUP section card */}
      <Sequence from={808} durationInFrames={97} premountFor={30}>
        <SectionCard kicker="LET'S BUILD IT" title="SETUP" durationInFrames={97} />
      </Sequence>

      {/* …transparent: terminal setup (WSL, mkdir, npm, install, sudo, chrome check, nano config)… */}

      {/* 2:01 — "this is the big difference" */}
      <Sequence from={3640} durationInFrames={120} premountFor={30}>
        <SectionCard kicker="NO MORE FALLING APART" title="THE BIG DIFFERENCE" durationInFrames={120} />
      </Sequence>

      {/* 2:09 — TEST 1 card */}
      <Sequence from={3880} durationInFrames={130} premountFor={30}>
        <SectionCard kicker="TEST 1" title="Read a page" durationInFrames={130} />
      </Sequence>

      {/* 2:19 — example.com round-trip flow diagram */}
      <Sequence from={4180} durationInFrames={380} premountFor={30}>
        <FlowDiagram durationInFrames={380} />
      </Sequence>

      {/* 2:32 — TEST 2 card */}
      <Sequence from={4570} durationInFrames={140} premountFor={30}>
        <SectionCard kicker="TEST 2" title="Do a task" durationInFrames={140} />
      </Sequence>

      {/* …transparent: TodoMVC demo… */}

      {/* 3:41 — "no longer just reading" */}
      <Sequence from={6647} durationInFrames={203} premountFor={30}>
        <SectionCard
          title="NOT JUST READING"
          items={["Observes the page", "Interacts with the UI", "Verifies the result"]}
          itemDelays={[43, 65, 120]}
          durationInFrames={203}
        />
      </Sequence>

      {/* 3:55 — TEST 3 card */}
      <Sequence from={7050} durationInFrames={160} premountFor={30}>
        <SectionCard kicker="TEST 3" title="Real-world site" durationInFrames={160} />
      </Sequence>

      {/* …transparent: Rotten Tomatoes demo… */}

      {/* 4:59 — TEST 4 card */}
      <Sequence from={8971} durationInFrames={199} premountFor={30}>
        <SectionCard kicker="TEST 4 · THE HARDEST" title="Amazon" durationInFrames={199} />
      </Sequence>

      {/* …transparent: Amazon demo… */}

      {/* 7:00–7:46 — RECAP (what we built · 4 workflows · the takeaway) */}
      <Sequence from={12604} durationInFrames={1376} premountFor={30}>
        <HermesRecap durationInFrames={1376} />
      </Sequence>

      {/* 7:46–8:06 — OUTRO (subscribe + next-video teaser) */}
      <Sequence from={13999} durationInFrames={601} premountFor={30}>
        <HermesVideoOutro durationInFrames={601} />
      </Sequence>
    </AbsoluteFill>
  );
};
