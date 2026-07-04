import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ChatPrompt } from "./components/ChatPrompt";
import { ProcessChecklist } from "./components/ProcessChecklist";
import { ActionBadge } from "./components/ActionBadge";
import { ResultCard } from "./components/ResultCard";
import { SFX, SfxCue } from "./components/Sfx";

// GmailLiveTests — standalone animation for the three live Gmail tests.
// Zero-based (frame 0 = transcript L139 "the first test is simple", 6:48.2), so
// drop it on your timeline at 6:48.2 and every beat lands on its line.
// Internal offsets = transcript time minus 6:48.2, ×30. Transparent + SFX.
//
//   TEST 1 — list labels   L139–148  (6:48–7:12)
//   TEST 2 — triage inbox  L149–169  (7:15–8:07)
//   TEST 3 — draft a reply L170–183  (8:08–8:46)

const TRIAGE = { from: 1420, steps: [
  { text: "Search Gmail", at: 0 }, // L157 7:35.6
  { text: "Broaden the search", at: 74 }, // L158-159 7:38
  { text: "Inspect recent messages", at: 297 }, // L161-162 7:45.5
  { text: "Summarise priority items", at: 502 }, // L163-165 7:52.3
] };
const DRAFT = { from: 2845, steps: [
  { text: "Search Gmail", at: 0 }, // L175 8:23.1
  { text: "Find an email needing a reply", at: 49 }, // L176 8:24.7
  { text: "Create a draft", at: 144 }, // L177 8:27.9
  { text: "Draft saved", at: 262 }, // L178 8:31.8
  { text: "Open Gmail → Drafts", at: 348 }, // L179 8:34.7
] };

export const GmailLiveTests: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ===== TEST 1 — LIST LABELS ===== */}
      <Sequence from={0} durationInFrames={210} premountFor={30}>
        <ActionBadge text="TEST 1 · LIST LABELS" pos="tl" durationInFrames={210} />
      </Sequence>
      <Sequence from={60} durationInFrames={320} premountFor={30}>
        <ChatPrompt text="Use the Gmail MCP server to list my Gmail labels" durationInFrames={320} />
      </Sequence>
      <Sequence from={440} durationInFrames={300} premountFor={30}>
        <ResultCard title="Gmail labels" items={["Inbox", "Sent", "Drafts", "Important", "Starred"]} durationInFrames={300} />
      </Sequence>
      <Sequence from={700} durationInFrames={210} premountFor={30}>
        <ActionBadge text="Connected to Gmail ✓" pos="bc" check durationInFrames={210} />
      </Sequence>

      {/* ===== TEST 2 — TRIAGE INBOX ===== */}
      <Sequence from={800} durationInFrames={200} premountFor={30}>
        <ActionBadge text="TEST 2 · TRIAGE INBOX" pos="tl" durationInFrames={200} />
      </Sequence>
      <Sequence from={935} durationInFrames={360} premountFor={30}>
        <ChatPrompt text="Find important emails from the last 7 days" durationInFrames={360} />
      </Sequence>
      <Sequence from={TRIAGE.from} durationInFrames={620} premountFor={30}>
        <ProcessChecklist title="TRIAGE INBOX" steps={TRIAGE.steps} durationInFrames={620} />
      </Sequence>
      <Sequence from={1920} durationInFrames={440} premountFor={30}>
        <ResultCard title="Needs your attention" items={["Deadlines", "Invoices", "Awaiting a reply"]} accent="#F59E0B" durationInFrames={440} />
      </Sequence>

      {/* ===== TEST 3 — DRAFT A REPLY ===== */}
      <Sequence from={2400} durationInFrames={200} premountFor={30}>
        <ActionBadge text="TEST 3 · DRAFT A REPLY" pos="tl" durationInFrames={200} />
      </Sequence>
      <Sequence from={2535} durationInFrames={360} premountFor={30}>
        <ChatPrompt text="Find the latest email that needs a reply and draft a response — don't send it" durationInFrames={360} />
      </Sequence>
      <Sequence from={DRAFT.from} durationInFrames={620} premountFor={30}>
        <ProcessChecklist title="DRAFT A REPLY" steps={DRAFT.steps} durationInFrames={620} />
      </Sequence>
      <Sequence from={3290} durationInFrames={300} premountFor={30}>
        <ResultCard title="Draft saved — not sent" items={["Replies to the latest thread", "Short, professional tone", "Waiting in your Drafts folder"]} accent="#34D399" durationInFrames={300} />
      </Sequence>

      {/* ===== SOUND ===== */}
      {/* test labels */}
      <SfxCue from={0} src={SFX.switch} volume={0.4} />
      <SfxCue from={800} src={SFX.switch} volume={0.4} />
      <SfxCue from={2400} src={SFX.switch} volume={0.4} />
      {/* prompts */}
      <SfxCue from={60} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={935} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={2535} src={SFX.whoosh} volume={0.5} />
      {/* result cards (whoosh in + ding) */}
      <SfxCue from={440} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={520} src={SFX.ding} volume={0.45} />
      <SfxCue from={1920} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={1995} src={SFX.ding} volume={0.45} />
      <SfxCue from={3290} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={3360} src={SFX.ding} volume={0.5} />
      {/* success badges */}
      <SfxCue from={704} src={SFX.ding} volume={0.5} />
      {/* checklist ticks */}
      {[...TRIAGE.steps.map((s) => TRIAGE.from + s.at), ...DRAFT.steps.map((s) => DRAFT.from + s.at)].map((f) => (
        <SfxCue key={`tick-${f}`} from={f + 6} src={SFX.switch} volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};
