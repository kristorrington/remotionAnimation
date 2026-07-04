import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CmdChip } from "./components/CmdChip";
import { ActionBadge } from "./components/ActionBadge";
import { ChatPrompt } from "./components/ChatPrompt";
import { ProcessChecklist } from "./components/ProcessChecklist";
import { ConfigCallout } from "./components/ConfigCallout";

// HermesAnnotations — a SECOND transparent overlay track that annotates the
// hands-on demo stretches HermesVideo leaves empty. Corner command chips,
// chat-prompt bubbles and progressing checklists sit over the screen recording;
// none repeat HermesVideo's full-screen cutaways. Layer this on top of (or
// instead of) HermesVideo. All timings are frame = sec×30 from the transcript.
//
// Render transparent (ProRes 4444) — see Root.tsx calculateMetadata.

// Terminal commands during setup (bottom-left chips).
const COMMANDS: { from: number; dur: number; command: string }[] = [
  { from: 910, dur: 180, command: "wsl" }, // f0:28 "type WSL"
  { from: 1100, dur: 145, command: "mkdir -p ~/playwright-mcp" }, // f0:36 "make Directory"
  { from: 1250, dur: 105, command: "cd ~/playwright-mcp" }, // f0:41 "CD command"
  { from: 1360, dur: 120, command: "npm init -y" }, // f0:45 "new node project"
  { from: 1485, dur: 155, command: "npm install @playwright/mcp@latest playwright@latest" }, // f0:49 "install"
  { from: 1645, dur: 230, command: "npx playwright install --with-deps chromium" }, // f0:54 "MCP server + browser tools"
  { from: 2300, dur: 210, command: "/opt/google/chrome/chrome --version" }, // f1:16 "ensure Chrome installed → returns path"
  { from: 2635, dur: 200, command: "nano hermes-config.yaml" }, // f1:27 "open config by running Nano"
];

export const HermesAnnotations: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ===== SETUP (0:30–2:01) ===== */}
      {COMMANDS.map((c) => (
        <Sequence key={c.from} from={c.from} durationInFrames={c.dur} premountFor={30}>
          <CmdChip command={c.command} durationInFrames={c.dur} />
        </Sequence>
      ))}

      <Sequence from={1630} durationInFrames={185} premountFor={30}>
        <ActionBadge text="Installs the MCP server + browser tools" pos="tr" durationInFrames={185} />
      </Sequence>
      <Sequence from={1850} durationInFrames={155} premountFor={30}>
        <ActionBadge text="Enter your sudo password" pos="tr" durationInFrames={155} />
      </Sequence>
      <Sequence from={2065} durationInFrames={165} premountFor={30}>
        <ActionBadge text="Headless Chromium ready" pos="tr" check durationInFrames={165} />
      </Sequence>

      {/* nano config edit (1:35–1:48) */}
      <Sequence from={2840} durationInFrames={430} premountFor={30}>
        <ConfigCallout durationInFrames={430} />
      </Sequence>
      <Sequence from={3290} durationInFrames={210} premountFor={30}>
        <ActionBadge text="Save: Ctrl+O → Enter → Ctrl+X" pos="bc" durationInFrames={210} />
      </Sequence>

      {/* ===== TEST 1 — example.com (2:04–2:30) ===== */}
      <Sequence from={3765} durationInFrames={110} premountFor={30}>
        <CmdChip command="hermes chat" durationInFrames={110} />
      </Sequence>
      <Sequence from={4015} durationInFrames={165} premountFor={30}>
        <ChatPrompt text="Use Playwright MCP to open example.com and tell me the page title" durationInFrames={165} />
      </Sequence>

      {/* ===== TEST 2 — TodoMVC (2:37–3:41) ===== */}
      <Sequence from={4715} durationInFrames={300} premountFor={30}>
        <ChatPrompt text="Go to the TodoMVC demo and add: record video, edit thumbnail, upload tutorial" durationInFrames={300} />
      </Sequence>
      <Sequence from={5300} durationInFrames={1160} premountFor={30}>
        <ProcessChecklist
          title="TODOMVC"
          steps={[
            { text: "Navigate to the site", at: 10 }, // f2:58
            { text: "Snapshot + scan the page", at: 55 }, // f3:00
            { text: "Find the task input", at: 224 }, // f3:08
            { text: "Type the 3 tasks", at: 264 }, // f3:09
            { text: "Submit each task", at: 710 }, // f3:20
            { text: "Verify all 3 listed", at: 728 }, // f3:20
            { text: "Confirm in chat", at: 930 }, // f3:24
          ]}
          durationInFrames={1160}
        />
      </Sequence>

      {/* ===== TEST 3 — Rotten Tomatoes (3:57–4:59) ===== */}
      <Sequence from={7215} durationInFrames={340} premountFor={30}>
        <ChatPrompt text="Go to Rotten Tomatoes, open the top 3 movies this week, extract their scores and summarise" durationInFrames={340} />
      </Sequence>
      <Sequence from={7880} durationInFrames={1090} premountFor={30}>
        <ProcessChecklist
          title="ROTTEN TOMATOES"
          steps={[
            { text: "Page loads", at: 4 }, // f4:12
            { text: "Dismiss privacy pop-up", at: 55 }, // f4:22
            { text: "Scan the movie titles", at: 131 }, // f4:27
            { text: "Open the top 3", at: 257 }, // f4:31
            { text: "Extract Tomatometer + Audience", at: 317 }, // f4:33
            { text: "Flag any missing data", at: 521 }, // f4:40
            { text: "Summarise from the live page", at: 865 }, // f4:51
          ]}
          durationInFrames={1090}
        />
      </Sequence>

      {/* ===== TEST 4 — Amazon (5:03–6:46) ===== */}
      <Sequence from={9175} durationInFrames={400} premountFor={30}>
        <ChatPrompt text="Search Amazon for a PS5 Pro — get the price and tell me if it's sold by Amazon or 3rd-party" durationInFrames={400} />
      </Sequence>
      <Sequence from={9730} durationInFrames={2090} premountFor={30}>
        <ProcessChecklist
          title="AMAZON"
          steps={[
            { text: "Locate search box + submit", at: 3 }, // f5:44
            { text: "Identify the listing", at: 126 }, // f5:48
            { text: "Check title + price", at: 219 }, // f5:51
            { text: "Open the product page", at: 312 }, // f5:54
            { text: "Inspect the buy box", at: 1205 }, // f6:04
            { text: "Add to cart / Buy now?", at: 1320 }, // f6:09
            { text: "Only 3rd-party sellers", at: 1770 }, // f6:13
          ]}
          durationInFrames={2090}
        />
      </Sequence>
      <Sequence from={11850} durationInFrames={400} premountFor={30}>
        <ActionBadge text="Not available directly from Amazon — 3rd-party only" pos="bc" check durationInFrames={400} />
      </Sequence>
    </AbsoluteFill>
  );
};
