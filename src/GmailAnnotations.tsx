import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CmdChip } from "./components/CmdChip";
import { ActionBadge } from "./components/ActionBadge";
import { ChatPrompt } from "./components/ChatPrompt";
import { ProcessChecklist } from "./components/ProcessChecklist";
import { ConfigCallout, ConfigLine } from "./components/ConfigCallout";
import { AuthCommand } from "./components/AuthCommand";
import { SFX, SfxCue } from "./components/Sfx";

// GmailAnnotations — transparent demo-annotation track. Timings = sec×30 from the
// FINAL transcript. Layer on top of GmailVideo. Render transparent (audio
// included; SFX are hosted, so network is needed at render time).

type Pos = "tl" | "tr" | "bl" | "br" | "tc" | "bc";

const CMDS: { from: number; dur: number; command: string }[] = [
  { from: 715, dur: 120, command: "wsl" }, // L9 0:19.9
  { from: 825, dur: 100, command: "node -v" }, // L11 0:27.2
  { from: 935, dur: 100, command: "npm -v" }, // L11
  { from: 1116, dur: 110, command: "mkdir -p ~/.gmail-mcp" }, // L14 0:37.1
  { from: 1240, dur: 150, command: "whoami" }, // L15 0:41.3
  { from: 5840, dur: 300, command: "ls /mnt/c/Users/lko_8/Downloads/client_secret*.json" }, // L66-67 3:14
  { from: 6310, dur: 280, command: "mv …/client_secret*.json ~/.gmail-mcp/gcp-oauth.keys.json" }, // L70-73 3:30
  { from: 6600, dur: 230, command: "ls ~/.gmail-mcp" }, // L74 3:35
  { from: 6940, dur: 100, command: "cd ~/mcp-servers" }, // L79 3:51
  { from: 7025, dur: 90, command: "npm init -y" }, // L80 3:54
  { from: 7120, dur: 130, command: "npm install @shinzolabs/gmail-mcp" }, // L81 3:57
  { from: 9400, dur: 220, command: "nano ~/.hermes/config.yaml" }, // L107 5:13
  { from: 11555, dur: 150, command: "hermes chat" }, // L130 6:21
];

const PROMPTS: { from: number; dur: number; text: string }[] = [
  { from: 11640, dur: 300, text: "What MCP servers are configured?" }, // L132 6:27.9
  { from: 12310, dur: 300, text: "Use the Gmail MCP server to list my Gmail labels" }, // L140-141 6:50
  { from: 13150, dur: 340, text: "Find important emails from the last 7 days" }, // L150-151 7:19
  { from: 14790, dur: 360, text: "Find the latest email that needs a reply and draft a response — don't send it" }, // L171-174 8:12
];

const CHECKLISTS: { from: number; dur: number; title: string; steps: { text: string; at: number }[] }[] = [
  {
    from: 1780, dur: 1060, title: "GOOGLE CLOUD PROJECT",
    steps: [
      { text: "Project selector → New Project", at: 0 }, // L20-21 0:59
      { text: "Name: Hermes Gmail MCP", at: 159 }, // L22 1:04.6
      { text: "Select the project", at: 369 }, // L24-25 1:11.6
      { text: "APIs & Services → Enable", at: 519 }, // L26-27 1:16.6
      { text: "Search + Enable Gmail API", at: 789 }, // L29-31 1:25.6
    ],
  },
  {
    from: 3070, dur: 1120, title: "OAUTH CONSENT",
    steps: [
      { text: "OAuth consent → Get started", at: 110 }, // L36-37 1:46
      { text: "App name: Hermes Gmail MCP", at: 288 }, // L38 1:51.9
      { text: "User support email", at: 411 }, // L39-40 1:58
      { text: "Audience: External", at: 694 }, // L42 2:05.5
      { text: "Add contact email", at: 798 }, // L43 2:08.9
      { text: "Tick policy → Create", at: 970 }, // L45-46 2:14.7
    ],
  },
  {
    from: 4200, dur: 1140, title: "OAUTH CLIENT",
    steps: [
      { text: "Go to Clients", at: 267 }, // L49 2:28.9
      { text: "Create OAuth Client", at: 362 }, // L50 2:32.1
      { text: "Type: Desktop App", at: 458 }, // L51 2:35.3
      { text: "Name: …Desktop Client", at: 601 }, // L52-53 2:40
      { text: "Click Create", at: 776 }, // L54 2:45.9
      { text: "Download the JSON", at: 1019 }, // L57-60 2:53.9
    ],
  },
  {
    from: 7990, dur: 1250, title: "GOOGLE SIGN-IN",
    steps: [
      { text: "Browser opens sign-in", at: 0 }, // L90-91 4:26
      { text: "Choose your Google account", at: 153 }, // L92-93 4:31.4
      { text: "Review permissions", at: 261 }, // L94 4:35
      { text: "Read · draft · send email", at: 341 }, // L95-96 4:37.7
      { text: "Click Allow → localhost", at: 583 }, // L97-98 4:45.8
      { text: "Authentication successful", at: 694 }, // L99 4:49.5
      { text: "credentials.json saved ✓", at: 797 }, // L100-101 4:52.9
    ],
  },
  {
    from: 13667, dur: 1000, title: "TRIAGE INBOX",
    steps: [
      { text: "Search Gmail", at: 0 }, // L157 7:35.6
      { text: "Broaden the search", at: 74 }, // L158-159 7:38
      { text: "Inspect recent messages", at: 297 }, // L161-162 7:45.5
      { text: "Summarise priority items", at: 502 }, // L163-165 7:52.3
    ],
  },
  {
    from: 15092, dur: 620, title: "DRAFT A REPLY",
    steps: [
      { text: "Search Gmail", at: 0 }, // L175 8:23.1
      { text: "Find an email needing a reply", at: 49 }, // L176 8:24.7
      { text: "Create a draft", at: 144 }, // L177 8:27.9
      { text: "Draft saved", at: 262 }, // L178 8:31.8
      { text: "Open Gmail → Drafts", at: 348 }, // L179 8:34.7
    ],
  },
];

const BADGES: { from: number; dur: number; text: string; pos: Pos; check?: boolean }[] = [
  { from: 1040, dur: 150, text: "node + npm return versions ✓", pos: "tr", check: true }, // L12-13
  { from: 1410, dur: 200, text: "Note your home path for the config", pos: "tr" }, // L16-17
  { from: 2845, dur: 180, text: "Gmail API enabled ✓", pos: "tr", check: true }, // L32 1:33.7
  { from: 6620, dur: 200, text: "Expect: only gcp-oauth.keys.json", pos: "tr" }, // L75-77 3:41
  { from: 10844, dur: 220, text: "Port 3001 (3000 is used by WhatsApp)", pos: "tl" }, // L122-125 6:01
  { from: 11200, dur: 220, text: "Save: Ctrl+O → Enter → Ctrl+X", pos: "bc" }, // L126-128 6:13
  { from: 11960, dur: 230, text: "Gmail MCP server detected ✓", pos: "tr", check: true }, // L134-136 6:34.5
  { from: 12710, dur: 220, text: "Inbox · Sent · Drafts", pos: "tr", check: true }, // L145-146 7:03.5
  { from: 15545, dur: 260, text: "Draft created in Gmail ✓", pos: "bc", check: true }, // L180-181 8:38
];

// .hermes/config.yaml — Gmail MCP block (lines appear in sync with L114–122).
const GMAIL_CONFIG: ConfigLine[] = [
  { text: "gmail:", indent: 0, at: 10, accent: true }, // L114 paste 5:34.4
  { text: "command: node", indent: 1, at: 140 }, // L115-116 5:39
  { text: "args:", indent: 1, at: 290 }, // L117 5:44
  { text: '- "…/gmail-mcp/dist/index.js"', indent: 2, at: 310 }, // L118
  { text: "env:", indent: 1, at: 520 }, // L119 5:51.7
  { text: "GMAIL_MCP_CONFIG_DIR: ~/.gmail-mcp", indent: 2, at: 540 }, // L120 5:53.8
  { text: "GMAIL_OAUTH_PATH: …/gcp-oauth.keys.json", indent: 2, at: 650 }, // L121 5:57.3
  { text: "GMAIL_CREDENTIALS_PATH: …/credentials.json", indent: 2, at: 670 },
  { text: 'PORT: "3001"', indent: 2, at: 770 }, // L122 6:01.5
];
const CONFIG_FROM = 10040;
const CONFIG_DUR = 1150;

export const GmailAnnotations: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ===== VISUALS ===== */}
      {CMDS.map((c) => (
        <Sequence key={`cmd-${c.from}`} from={c.from} durationInFrames={c.dur} premountFor={30}>
          <CmdChip command={c.command} durationInFrames={c.dur} />
        </Sequence>
      ))}

      {CHECKLISTS.map((c) => (
        <Sequence key={`cl-${c.from}`} from={c.from} durationInFrames={c.dur} premountFor={30}>
          <ProcessChecklist title={c.title} steps={c.steps} durationInFrames={c.dur} />
        </Sequence>
      ))}

      {PROMPTS.map((p) => (
        <Sequence key={`pr-${p.from}`} from={p.from} durationInFrames={p.dur} premountFor={30}>
          <ChatPrompt text={p.text} durationInFrames={p.dur} />
        </Sequence>
      ))}

      {BADGES.map((b) => (
        <Sequence key={`bd-${b.from}`} from={b.from} durationInFrames={b.dur} premountFor={30}>
          <ActionBadge text={b.text} pos={b.pos} check={b.check} durationInFrames={b.dur} />
        </Sequence>
      ))}

      <Sequence from={CONFIG_FROM} durationInFrames={CONFIG_DUR} premountFor={30}>
        <ConfigCallout title=".hermes/config.yaml" lines={GMAIL_CONFIG} width={780} durationInFrames={CONFIG_DUR} />
      </Sequence>

      {/* Gmail MCP auth command — paths spotlighted as narrated (L82–89, 4:01–4:26) */}
      <Sequence from={7250} durationInFrames={740} premountFor={30}>
        <AuthCommand durationInFrames={740} />
      </Sequence>

      {/* ===== SOUND ===== */}
      {/* command chips → mouse click */}
      {CMDS.map((c) => (
        <SfxCue key={`s-cmd-${c.from}`} from={c.from} src={SFX.click} volume={0.45} />
      ))}
      {/* prompts → whoosh */}
      {PROMPTS.map((p) => (
        <SfxCue key={`s-pr-${p.from}`} from={p.from} src={SFX.whoosh} volume={0.5} />
      ))}
      {/* checklist steps → soft switch tick as each checks off */}
      {CHECKLISTS.flatMap((c) =>
        c.steps.map((s) => (
          <SfxCue key={`s-cl-${c.from}-${s.at}`} from={c.from + s.at + 6} src={SFX.switch} volume={0.35} />
        )),
      )}
      {/* success badges → ding */}
      {BADGES.filter((b) => b.check).map((b) => (
        <SfxCue key={`s-bd-${b.from}`} from={b.from + 4} src={SFX.ding} volume={0.5} />
      ))}
      {/* config panel → whoosh */}
      <SfxCue from={CONFIG_FROM} src={SFX.whoosh} volume={0.5} />
      {/* auth command → whoosh on appear, tick as each path lights up */}
      <SfxCue from={7250} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={7384} src={SFX.switch} volume={0.4} />
      <SfxCue from={7517} src={SFX.switch} volume={0.4} />
      <SfxCue from={7659} src={SFX.switch} volume={0.4} />
      <SfxCue from={7778} src={SFX.switch} volume={0.4} />
    </AbsoluteFill>
  );
};
