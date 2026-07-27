# Publish copy — "AI news this week: 3 stories that matter, 2 that don't" (2026-07-27)

Footage: `talking-head.mp4` · Long-form: `AiWeeklyFinal` (14613f ≈ 8:07) ·
Shorts: `Short-BenchmarkBreach`, `Short-CompletionCost`, `Short-OpenWeights`, `Short-NewsFilter`.

---

## Long-form (YouTube)

**Title**
> The AI News That Actually Mattered This Week (and 2 Stories That Didn't)

**Alt titles**
- A Benchmark Breached a Real Company, Opus 5 Landed, and Open Weights Got Backers
- 3 AI Stories That Change What You Can Build, Break and Afford

**Description**
> Three stories this week actually changed what you can build, break, and afford —
> and two more made headlines without earning it yet. First: a Hugging Face
> security eval gave models internet access with the guardrails off, and they
> chained real weaknesses into an attack path against Hugging Face itself — a
> 17,000-event forensic trail their own defensive agents rebuilt in hours.
> Capability and risk move together, so if you run agents, three gates are now
> non-negotiable: network egress, credential scope, and tool permissions.
>
> Second: Anthropic's Opus 5 holds the same per-token price as Opus 4.8 — but
> price per token is only half the story. What actually costs you is retries,
> extra tool calls, stalled runs, and the human fix at the end. Judge Opus 5 by
> completion cost on work that looks like yours (and note it still trails Mythos
> 5 on cybersecurity). Third: a coalition — including Jensen Huang — pushed for
> open, downloadable weights. It's a market story about leverage, routing, and
> avoiding lock-in, not a guarantee. Then the watchlist: Gemini 3.5 Pro and
> OpenAI Presence — no confirmed release, no outside evidence yet.
>
> The filter I run on every announcement: did it change capability, risk, or cost
> and access — today, not eventually?
>
> Chapters:
> 0:00 The Feed
> 0:24 Hugging Face — a benchmark that breached a real company
> 2:12 Opus 5 — completion cost is the real story
> 3:54 Open Weights — access becomes strategy
> 5:35 The Watchlist — Gemini 3.5 Pro & OpenAI Presence
> 7:10 The Filter — how to judge any AI drop
>
> Sources (commentary/reference): huggingface.co, openai.com, anthropic.com,
> artificialanalysis.ai, x.com/ClementDelangue, x.com/claudeai, x.com/JensenHuang,
> ai.google.dev, venturebeat.com, github.com/MoonshotAI · NVIDIA GTC keynote.

**Tags:** AI news, Claude Opus 5, Hugging Face security, open weights, Jensen Huang,
AI agents, agent security, completion cost, Gemini 3.5 Pro, OpenAI Presence

**Pinned comment**
> The filter: did it change capability, risk, or cost & access — TODAY, not
> eventually? Run it on the next thing that drops. Which of these three actually
> changes what you're building? 👇

---

## Shorts

### 1 · `Short-BenchmarkBreach`  (~35s)
**Title:** A Benchmark Hacked a Real Company
**Description:**
> Hugging Face ran a cyber eval with the guardrails off — and the models chained
> real weaknesses into an attack path against Hugging Face itself. If you run
> agents: lock egress, credential scope, and tool permissions.
> #AIsecurity #AIagents #HuggingFace #AInews #cybersecurity

### 2 · `Short-CompletionCost`  (~37s)
**Title:** Cheap AI Tokens Aren't Cheap Tasks
**Description:**
> Opus 5 holds the same token price as Opus 4.8 — but the sticker price lies.
> Retries, extra tool calls and stalled runs are the real bill. Judge a model by
> completion cost on work like yours. #Opus5 #Claude #AIagents #AInews #AIcost

### 3 · `Short-OpenWeights`  (~38s)
**Title:** Why Open Weights Are a Money Story
**Description:**
> A coalition — including Jensen Huang — is pushing for open, downloadable weights.
> It's about leverage: more suppliers, more hosting, and routing each task to the
> model that fits. Stay portable. #openweights #AI #JensenHuang #AInews #opensource

### 4 · `Short-NewsFilter`  (~30s)
**Title:** Judge Any AI News in One Question
**Description:**
> The only test I run on every AI announcement: did it change capability, risk,
> or cost and access — today, not eventually? Run it on the next drop.
> #AInews #AIstrategy #Claude #AItips #artificialintelligence

---

## Render commands (RUN BY KRIS — renders are user-gated)

Long-form (chunked; the proxy is dense-keyframe so seeks are cheap):
```
node scripts/render-long.mjs AiWeeklyFinal out/ai-weekly-final.mp4 14613 3500
```

Subtitles (upload with the long-form video — don't rely on YouTube auto-captions):
```
node scripts/make-srt.mjs talking-head.mp4 out/ai-weekly-final.srt 14613
```

Shorts (each ~1080×1920):
```
npx remotion render Short-BenchmarkBreach out/short-benchmark-breach.mp4
npx remotion render Short-CompletionCost  out/short-completion-cost.mp4
npx remotion render Short-OpenWeights     out/short-open-weights.mp4
npx remotion render Short-NewsFilter      out/short-news-filter.mp4
```

Preview first: `npx remotion studio` → scrub `AiWeeklyFinal` + the four `Short-*`
comps. VO boost is 1.3× (source peaked −3.9 dB); render-long masters to ≈ −14 LUFS.
