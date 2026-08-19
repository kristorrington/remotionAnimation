# EDIT PLAN — "Claude's Invisible Watermark — Everything You Need to Know"

Merged from Kris's two direction docs (editor brief w/ 41 asset points + the
full editing-style brief, Aug 19 2026). SOURCE OF TRUTH = the final cleaned
transcript/recording (NOT YET DELIVERED — timings below are the brief's
approximate stamps; every `at` gets re-pinned to whisper words on arrival).
House rules apply on top (CLAUDE.md §8/§13/§15); where this plan and the spoken
recording differ, follow the recording.

**Feel:** Kris explains → evidence appears → Kris reacts → visual explanation →
back to Kris. Premium AI-news doc style. NOT wall-to-wall b-roll.

**Rhythm:** first 30s = change every 3–6s; after = every 6–10s. Kris never
covered >15–20s in explanatory runs. Punch-ins: minor 105–110%, major ≤115%.

**A-ROLL KEEP LIST (never cover):** hook open · "part that matters most" ·
"Except that's not really what the watermark tells you" (reversal #1) ·
"proves something much narrower" · "So why roll this out globally?" · "this is
where the story becomes much more interesting" · "The watermark itself can't
tell you which situation" · "Then we get to the other big limitation" ·
"That's Anthropic's own wording, not mine" · "That is very different…" ·
"The simplest way I can put it is this" · "Catching the watermark doesn't
catch somebody cheating" · "And those two are very different things" · CTA.

---

## Captured assets (all verified real, manifested; raws in _broll-raw/broll_claude-s-invisible-watermrk…)

| File | Serves |
|---|---|
| wm-anthropic-blog.png (+ pack full-page dupes) | announcement receipt · "not highly robust" · Aug 2 default · pi/secret-key passage · no-PII section |
| pack: support.claude.com "How Claude marks AI-generated content" | Article 50(2) commitments box · What's covered (incl. AWS/GCP/Foundry line) · Limitations "not fully conclusive" |
| wm-tweet-anthropic.png | @AnthropicAI EU-compliance FAQ (4.7K, Aug 15) — "why now" |
| wm-tweet-m1astra.png | @M1Astra public reaction (5.4K, Aug 11) — "travels with the text" |
| pack: EU digital-strategy page | Code of Practice · signatory list · Article 50(2) zooms (used twice: rollout + "compliance ≠ durability") |
| pack: DeepMind SynthID blog + wm-synthid-docs.png + wm-synthid-github.png | SynthID origin sequence (logo → page → diagram → repo, 5–8s total) |
| wm-github-cleaner.png + wm-github-cleaner-commits.png | removal tools; commits page shows Aug 11 timestamps (days after blog) |
| wm-github-remover.png | second repo; show only what's visible — never invent stars |
| wm-forbes.png | backlash/cancellations + schools concern (crop headline + key-facts bullets) |
| pack: TechCrunch Aug 15 (+ Aug 11) | rollout surfaces list · C2PA layer explainer |
| wm-aws-claude.png / wm-gcp-claude.png / wm-foundry-claude.png | marketplace surfaces (quick establishing crops if needed — the ecosystem GRAPHIC carries the list) |
| wm-c2pa.png | C2PA ≠ watermark split |
| habits-cc-montage.mp4 (official Anthropic film, manifested) | Claude Code terminal footage |
| claude-code-tutorial-280726.mp4 master (KRIS-OWNED screen rec) | real Claude Code usage; crop left region 1920×1080 for product-footage beats + the C2PA split (CC terminal beside chat panel) |
| Pack logos: Anthropic·Claude·OpenAI·Google·DeepMind·Meta·Microsoft·Mistral·AWS·GCloud | 6-signatories layout · ecosystem graphic |
| DROPPED: BleepingComputer (Cloudflare wall) | its lines covered by the repos + Anthropic's own phrase |

## Graphics kit to build (all conceptual, clearly non-product; NEWS palette + Claude burnt-orange #D97757 accent; premium-minimal, no bounce)

1. `DetectionCardScene` — clearly-conceptual "CLAUDE WATERMARK DETECTED" card → "CLAUDE WROTE THIS?" → CASE CLOSED stamp (hook; extremely short beats)
2. `WordForkScene` — GREY→OVERCAST branch (+ quick COLD→WINTRY); probability BARS WITHOUT NUMBERS (label ILLUSTRATION); the nudge; one word wins; "Paris is the capital of ___" no-fork collapse; pi digits beside the blog passage
3. `InspectScene` — clean paragraph, zoom between words, "NO HIDDEN TAG" crossed subtly; later reused for "looks completely normal" side-by-side + YOU CAN'T SEE IT
4. `EcosystemScene` — CLAUDE center; API/APP/CODE/COWORK/AWS/GCP/MICROSOFT chips build on as named
5. `WorldwideScene` — flat map, pins light (US/EU/APAC), "WORLDWIDE"; Ohio⇄Berlin same-mark variant
6. `SplitLayerScene` — TEXT WATERMARK | C2PA METADATA → "NOT THE SAME THING" (pair w/ real CC footage split)
7. `TimelineScene` (reuse, retitled) — Aug 2 → Aug 15 silence gap; OLDER→TRANSITIONING / NEWER→WATERMARKED variant
8. `SixLabsScene` — signed-doc mockup: 6 real logos under one clause; "6 MAJOR AI COMPANIES"; EU-vs-global "ONE GLOBAL SYSTEM wins" variant
9. `ContactFlowScene` — TEXT → CLAUDE → TEXT+fingerprint; "CLAUDE TOUCHED IT" ≠ "WROTE ALL OF IT"; PROOFREAD/TRANSLATE/SUMMARISE/EDIT → SAME DETECTION SIGNAL panel (the video's key graphic — make it impossible to misunderstand); student-essay 3-step; reused tiny at the end
10. `NoIdScene` — USER ID ✕ / ORG ID ✕ / CONVERSATION ID ✕; fingerprint stops before account icon
11. `RewriteBreakScene` — CLAUDE OUTPUT → SECOND MODEL → REWRITTEN → signal ✕ (strongest explainer; obvious in 2–3s)
12. `LifecycleFadeScene` — GENERATED ✓ → EDITED → REWRITTEN → TRANSLATED → ANOTHER MODEL, signal fading; "DURABILITY ≠ REQUIREMENT"
13. `TwoColumnScene` (reuse) — COMPLIANCE ✓ | TAMPER-PROOF AUTHORSHIP DETECTOR ✕ (exact wording per brief)
14. `EvidenceStackScene` — WATERMARK HIT alone (small) → + DRAFT HISTORY + ACCOUNT DATA (strong); "CORROBORATING EVIDENCE"; cards build one at a time
15. Metaphor beats: coin-flip ≠ signed confession; metal detector/gold bars (from brief #1) — only if the lines survive in the final VO
16. Contextual micro-montage: essay → CV → legal paperwork (0.7–1s each, tasteful, no courtroom melodrama)

## Sound/music
Subtle: soft click on word-swap, quiet stamp on CASE CLOSED, gentle tick on
evidence cards; whooshes only on pull-left span starts (house). Music ducked
under "not highly robust" + finale; doc-style beds (main/caveat rotation).

## Pipeline on footage arrival
1. Proxy 30fps CFR → **LIP-SYNC CHECK on plosives FIRST** (090826/160826 both needed +133ms)
2. Whisper → freeze captions-<date>.ts → registry; proofread (watch for
   "SynthID"→"synth ID", "C2PA"→"C to PA", "Anthropic" mishears)
3. Re-pin every beat below to whisper words (from ≈ spoken−6); build kit scenes;
   receipts get from/to/waypoints/notes crops per §10 (claim dominant, no glyph
   slicing, stickers on whitespace only)
4. QC: stills of every new scene + every receipt settled state; **sweep sheets
   2×2 MAX (≥900px tiles)** — new rule; then render (user-gated: Kris's brief =
   the go), loudnorm master, deliver + packaging.
