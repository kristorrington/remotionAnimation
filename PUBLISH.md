# Publish copy — "The 5 habits of people who manage AI agents well" (2026-07-26)

Footage: `talking-head.mp4` · Long-form: `HabitsFinal` (25749f ≈ 14:18) ·
Shorts: `Short-VagueBrief`, `Short-CleanMeans`, `Short-WrongRow`, `Short-EarnedAutonomy`.

---

## Long-form (YouTube)

**Title**
> The 5 Habits of People Who Manage AI Agents Well

**Alt titles**
- Stop Blaming the Model: The 5 Habits That Make AI Agents Reliable
- Manage AI Agents Like a Great Boss — Not a Vague One

**Description**
> Most people manage AI agents like an intern they brief once and abandon — then
> call the agent "unreliable" and go hunting for a smarter model. The real fix
> isn't a bigger model; it's a management system built from five habits, used in
> order: the brief, the checkpoint, the evidence, the correction, and the
> permission level.
>
> This is the full system, with Anthropic's own guidance as the backbone:
> brief the agent like a new employee, review the plan before consequential
> actions, reward evidence over confident wording, turn repeat corrections into
> standing rules (CLAUDE.md), and expand autonomy only after proven success —
> the Earned Autonomy Rule.
>
> Chapters:
> 0:00 The Setup
> 0:49 Habit 1 — The Brief
> 3:34 Habit 2 — The Checkpoint
> 5:53 Habit 3 — The Evidence
> 8:10 Habit 4 — The Correction
> 10:33 Habit 5 — Earned Autonomy
> 13:03 The Payoff
>
> Sources: Anthropic prompt-engineering, Building Effective Agents, reduce-
> hallucinations, Claude Code permission modes + memory docs, and the Auto Mode
> launch (docs.claude.com, anthropic.com, code.claude.com, claude.com) · the
> official "Introducing Claude Code" film. Used for commentary/reference.

**Tags:** AI agents, Claude, Claude Code, prompt engineering, agent management,
CLAUDE.md, Auto Mode, AI automation, AI reliability, agentic workflows

**Pinned comment**
> The order matters: brief → checkpoint → evidence → correction → permission.
> The first four habits create the proof; the fifth spends it. Which habit are
> you skipping right now? 👇

---

## Shorts

### 1 · `Short-VagueBrief`  (~30s)
**Title:** You're Managing AI Agents Wrong
**Description:**
> Hire five brilliant interns, give one vague instruction, walk away, then blame
> them — that's how most people run AI agents. The fix isn't a smarter model.
> #AIagents #Claude #AIautomation #promptengineering #AI

### 2 · `Short-CleanMeans`  (~38s)
**Title:** Your AI Agent Is Just Guessing
**Description:**
> "Clean up this spreadsheet" means four different jobs. The agent only has your
> words — so brief it like a new employee: outcome, boundaries, proof of done.
> #AIagents #Claude #promptengineering #AItips #automation

### 3 · `Short-WrongRow`  (~38s)
**Title:** Confident AI Answers Aren't Correct Answers
**Description:**
> A polished answer with a number and a recommendation — from the wrong row.
> "Are you sure?" just gets more confidence. Ask where the claim came from.
> #AIagents #Claude #AIhallucinations #dataanalysis #AItips

### 4 · `Short-EarnedAutonomy`  (~38s)
**Title:** The Rule for Trusting an AI Agent
**Description:**
> One good run is one data point. The Earned Autonomy Rule: expand freedom only
> after repeated, evidence-backed success at the current level. Earn it, then
> expand it. #AIagents #Claude #ClaudeCode #AIautomation #AI

---

## Render commands (RUN BY KRIS — renders are user-gated)

Long-form (chunked; the proxy is dense-keyframe so seeks are cheap):
```
node scripts/render-long.mjs HabitsFinal out/habits-final.mp4 25749 3500
```

Subtitles (upload with the long-form video — don't rely on YouTube auto-captions):
```
node scripts/make-srt.mjs talking-head.mp4 out/habits-final.srt 25749
```

Shorts (each ~1080×1920):
```
npx remotion render Short-VagueBrief      out/short-vague-brief.mp4
npx remotion render Short-CleanMeans      out/short-clean-means.mp4
npx remotion render Short-WrongRow        out/short-wrong-row.mp4
npx remotion render Short-EarnedAutonomy  out/short-earned-autonomy.mp4
```

Preview first: `npx remotion studio` → scrub `HabitsFinal` + the four `Short-*`
comps. VO boost is 2.4× (source peaked −10.7 dB); render-long masters to ≈ −14 LUFS.
