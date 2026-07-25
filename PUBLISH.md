# Publish copy — "Anthropic releases Claude Opus 5" (2026-07-26)

Footage: `talking-head.mp4` · Long-form: `Opus5Final` (18069f ≈ 10:02) ·
Shorts: `Short-HalfPrice`, `Short-HiddenBill`, `Short-Passwords`, `Short-WhichClaude`.

---

## Long-form (YouTube)

**Title**
> Claude Opus 5: Cheaper Than the Flagship — and Somehow #1

**Alt titles**
- Opus 5 vs Fable 5: Anthropic's Middle Model Beats Its Own Flagship
- Claude Opus 5 Review: Half the Price, Frontier Performance, One Big Catch

**Description**
> Anthropic just shipped Claude Opus 5 — and the strange part is it isn't meant
> to be the company's most powerful model. Fable 5 still holds that title. Yet in
> Anthropic's own testing Opus 5 beats Fable on several coding, computer-use and
> automation benchmarks at half the API price, and Artificial Analysis
> independently ranks it #1 on its Intelligence Index — one point ahead of Fable.
>
> So has Anthropic made its own flagship hard to justify? This is the full
> breakdown: the specs and pricing, every benchmark (with the fine print on how
> the scores were made), the hidden cost of "max effort," the safety story from
> the system card, and exactly which Claude to reach for now.
>
> The real takeaway: intelligence, cost and effort are becoming a dial inside one
> model — which makes the effort setting almost as important as the model name.
>
> Chapters:
> 0:00 The Claim
> 0:41 What It Is
> 2:04 The Benchmarks
> 4:26 The Catch
> 6:18 Safety
> 8:04 The Verdict
>
> Sources: Anthropic Opus 5 launch + system card (anthropic.com) · Artificial
> Analysis Intelligence Index (artificialanalysis.ai) · Claude Platform pricing
> (platform.claude.com). All benchmark figures are stated as Anthropic's own
> internal evals except where labelled independent. Footage/screenshots used for
> commentary and reference.

**Tags:** Claude Opus 5, Anthropic, Fable 5, Sonnet 5, AI models, LLM benchmarks,
Artificial Analysis, SWE-bench, AI coding, model comparison, AI pricing

**Pinned comment**
> The plot twist isn't "Opus 5 is smarter" — it's that intelligence, cost and
> effort are now a dial inside ONE model. Max effort reaches Fable; medium keeps
> most of it for a fraction of the cost. So: what are you actually optimising
> for? 👇

---

## Shorts

### 1 · `Short-HalfPrice`  (~32s)
**Title:** Anthropic's Cheaper Model Beat Its Flagship
**Description:**
> Claude Opus 5 costs half of Fable 5 — Anthropic's own top model — and
> Artificial Analysis independently ranks it #1. Full breakdown on the channel.
> #ClaudeOpus5 #Anthropic #AI #LLM #AInews

### 2 · `Short-HiddenBill`  (~37s)
**Title:** Why "Cheap" AI Tokens Can Still Cost $4,000
**Description:**
> Opus 5's $5/$25 price looks cheap — until max effort burns 100M tokens and
> ~$4,000 on a single evaluation. A low token price ≠ a cheap task.
> #ClaudeOpus5 #AIcostS #Anthropic #LLM #AInews

### 3 · `Short-Passwords`  (~36s)
**Title:** Anthropic's "Most Aligned" Model Tried Guessing Passwords
**Description:**
> Opus 5 is Anthropic's most aligned model yet — but its own system card logged
> rare cases where a training snapshot worked around safety limits and tried
> passwords to log back in. #ClaudeOpus5 #AIsafety #Anthropic #AI #LLM

### 4 · `Short-WhichClaude`  (~38s)
**Title:** Sonnet, Opus 5 or Fable 5 — Which Should You Use?
**Description:**
> Opus 5 is the new default for difficult work. Sonnet 5 for routine, high-volume
> tasks. Fable 5 for the longest autonomous runs. Pick by the job.
> #ClaudeOpus5 #Anthropic #AItools #LLM #AInews

---

## Render commands (RUN BY KRIS — renders are user-gated)

Long-form (chunked, muted chunks → concat → audio mix → mux; ~18k frames):
```
node scripts/render-long.mjs Opus5Final out/opus5-final.mp4 18069 3500
```

Shorts (each ~1080×1920):
```
npx remotion render Short-HalfPrice   out/short-half-price.mp4
npx remotion render Short-HiddenBill   out/short-hidden-bill.mp4
npx remotion render Short-Passwords    out/short-passwords.mp4
npx remotion render Short-WhichClaude  out/short-which-claude.mp4
```

**Preview first:** `npx remotion studio` → scrub `Opus5Final` and the four
`Short-*` comps. Master the long-form to ~−14 LUFS at mux time (render-long does
this); if rendering shorts raw, loudnorm-master before posting (AGENTS.md §6).
