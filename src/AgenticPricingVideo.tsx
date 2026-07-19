import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { BalanceScaleScene } from "./scenes/GptScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { glassCard } from "./motion/subjects";
import { FONT, SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";

// AgenticPricingVideo — transparent cutaway overlay for "Should You Charge
// Clients More for 'Agentic' Automations? The Honest Answer" (~4m12s, 7566f
// @ 30fps). Receipt-forward business/persuasion cut: 12 official/independent
// receipts (Gartner, Fortune, Ellvero/BCG, Forbes, Deloitte, Zendesk, Growth
// Unhinged, ai-agentsplus) + a muted SAP Sapphire Joule keynote clip, each
// keyframe-zoomed into its claim; kinetic-type payoffs carry the argument.
// Every `at` is whisper-pinned (captionsData, 2026-07-19).

export const AGP_DUR = 7566;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // ── HOOK · the $800 proposal ──
  { scene: "hookInvoice", from: 90, dur: 320, fullscreen: true }, // "proposal open… 'Agentic Workflow +$800'… thumb on delete (21-260)"
  // ── CH1 · the scary stats ──
  { scene: "gartner40", from: 474, dur: 300 }, // "Gartner just said over 40% of these agentic projects get cancelled by 2027 (474-660)"
  { scene: "gartner130", from: 1264, dur: 220 }, // "only about 130 vendors out of thousands (1264-1470)"
  { scene: "gartnerWashing", from: 1484, dur: 236 }, // "everybody else is agent-washing, slapping the word on ordinary automation (1484-1650)"
  { scene: "washKinetic", from: 1724, dur: 170, fullscreen: true }, // "relabelled workflows wearing a new coat of paint (1560-1720)… fear justified for YOUR work"
  { scene: "homeworkKinetic", from: 2110, dur: 190, fullscreen: true }, // "your client already did their homework before your quote landed (2200-2300)"
  // ── CH2 · your client did the homework ──
  { scene: "fortune95", from: 2341, dur: 320 }, // "MIT's NANDA research, reported by Fortune, 95% of pilots show zero impact (2341-2560)"
  { scene: "ellvero26", from: 2819, dur: 320 }, // "only 26% of companies say AI actually paid off (2819-3020)"
  // ── CH3 · the twist / the diagnosis ──
  { scene: "forbes40", from: 3313, dur: 340 }, // "Forbes went back and dug into the same 40% — a management & strategy failure (3313-3560)"
  { scene: "scopeKinetic", from: 3690, dur: 250, fullscreen: true }, // "a badly scoped agentic project fails like a website build. Nobody blames HTML (3660-3830)"
  { scene: "undercutKinetic", from: 4060, dur: 250, fullscreen: true }, // "consultants undercut themselves… shave the number down… guilt-pricing (4060-4300)"
  { scene: "guiltScale", from: 4430, dur: 420, fullscreen: true }, // "small businesses weigh the OUTCOME far more than the label (4400-4600)… doesn't need a discount"
  // ── CH4 · the market already settled it ──
  { scene: "deloitte", from: 4952, dur: 300 }, // "Deloitte published accounting guidance on outcome-based pricing for agentic AI (4952-5200)"
  { scene: "sapJoule", from: 5279, dur: 121, fullscreen: true }, // OFFICIAL FILM — "SAP's own Joule agents now bill on consumption, not seats (5279-5400)"
  { scene: "zendesk", from: 5400, dur: 236 }, // "Zendesk charges $1.50 to $2 per automated resolution (5400-5620)"
  { scene: "growthunhinged", from: 5649, dur: 320 }, // "the biggest software vendors moved from pricing on hours to pricing on outcomes (5649-5870)"
  // ── CH5 · the number ──
  { scene: "ratesTable", from: 5996, dur: 200 }, // "2026 rate guides put agentic automation work at $50 to $250-plus an hour (5996-6190)"
  { scene: "ratesPremium", from: 6199, dur: 470 }, // "5+ shipped projects → 30-50% premium (6199)… specialised industry → another 20-40% (6496)"
  // ── CLOSING ──
  { scene: "closingKinetic", from: 6702, dur: 320, fullscreen: true }, // "the $800 was never the question — it's whether you have the shipped work + outcome (6702-6980)"
  { scene: "priceKinetic", from: 7035, dur: 300, fullscreen: true }, // "deliver outcomes with agentic workflows and price like you actually can (7035-7300)"
];

export const AGP_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const AGP_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const AGP_EXTRA_CUTS = [474, 1264, 1484, 2341, 2819, 3313, 4952, 5400, 5649, 5996, 6199];

const SHOT = "assets/external/screenshots";
const CLIPS = "assets/external/clips";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AMBER = "#C9913D";
const RED = "#C65B52";
const GREEN = "#4FA98A";
const INK = "#1F1E1D";

// THE HOOK — the proposal on screen: line items fade in, the "Agentic Workflow
// $800" line highlights with a blinking cursor, and a delete-key hovers with a
// nervous shake (the subject = the invoice + the tempted cursor).
const HookInvoiceScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const items = [
    { label: "Discovery + scoping", price: "$300" },
    { label: "n8n build + testing", price: "$650" },
    { label: "Agentic Workflow", price: "$800", hot: true },
  ];
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  const delShake = frame >= 150 ? Math.sin(frame * 0.5) * 3 * Math.max(0, 1 - (frame - 150) / 120) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x811} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* the proposal document */}
        <div style={{ width: 1080, borderRadius: 16, padding: "34px 44px", background: "rgba(253,251,246,0.97)", border: "1px solid rgba(31,30,29,0.18)", boxShadow: "0 26px 64px rgba(31,30,29,0.22)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid rgba(31,30,29,0.12)", paddingBottom: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, color: INK }}>Proposal</span>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: "rgba(31,30,29,0.5)" }}>DRAFT</span>
          </div>
          {items.map((it, i) => {
            const at = 14 + i * 22;
            const op = interpolate(frame, [at, at + 10], [0, 1], CLAMP);
            const hot = it.hot && frame >= 70;
            return (
              <div key={it.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 16px", borderRadius: 10, opacity: op, background: hot ? "rgba(224,62,54,0.10)" : "transparent", border: hot ? "2px solid rgba(224,62,54,0.55)" : "2px solid transparent", transform: `translateX(${hot ? delShake : 0}px)` }}>
                <span style={{ fontFamily: FONT, fontWeight: it.hot ? 800 : 600, fontSize: 34, color: it.hot ? "#B4322C" : "rgba(31,30,29,0.82)" }}>{it.label}</span>
                <span style={{ display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: it.hot ? "#B4322C" : INK }}>
                  {it.price}
                  {it.hot && <span style={{ marginLeft: 4, width: 4, height: 40, background: cursorOn ? "#B4322C" : "transparent" }} />}
                </span>
              </div>
            );
          })}
        </div>
        {/* the delete key hovering (the temptation) */}
        {frame >= 150 && (
          <div style={{ transform: `translateY(${delShake}px) rotate(${delShake * 0.4}deg)`, padding: "14px 30px", borderRadius: 12, ...glassCard(RED, 2.5), display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: "#fff", transform: "translateZ(0)" }}>⌫ DELETE?</span>
          </div>
        )}
        <SceneHeadline kicker="THE PAUSE BEFORE YOU HIT SEND" title="IS $800 FAIR?" titleSize={60} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// OFFICIAL LAUNCH-FILM CLIP — muted SAP Sapphire Joule keynote, play-framed
// film card on paper (editorial headline above; text never on the footage).
const ClipFilmScene: React.FC<{ durationInFrames: number; kicker: string; title: string; src: string; tint: string; accent?: string; label?: string }> = ({ durationInFrames, kicker, title, src, tint, accent = "#D97757", label = "SAP SAPPHIRE · KEYNOTE" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 22 });
  const cardW = 1180;
  const cardH = Math.round((cardW * 9) / 16);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x11} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={accent} />
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 16, overflow: "hidden", border: `2px solid ${accent}`, boxShadow: "0 24px 60px rgba(31,30,29,0.28)", background: "#0e0d0c", transform: `scale(${interpolate(pop, [0, 1], [0.93, 1])})`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
          <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 22, top: 22, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 10, background: "rgba(14,13,12,0.74)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#E03E36", boxShadow: "0 0 8px #E03E36" }} />
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: 2, color: "#fff", transform: "translateZ(0)" }}>{label}</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// AGENT-WASHING gag — an ordinary "AUTOMATION" box gets an "AGENTIC" sticker
// slapped on with a paint sweep (the relabelled workflow in a new coat of paint).
const WashScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slap = spring({ frame: frame - 44, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 16 });
  const paint = interpolate(frame, [30, 70], [0, 100], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x812} impacts={[60]} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <div style={{ position: "relative", width: 560, height: 360, borderRadius: 20, ...glassCard("rgba(120,112,102,0.6)", 2.5), display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {/* the plain automation box */}
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 3, color: "rgba(255,255,255,0.5)", transform: "translateZ(0)" }}>AUTOMATION</span>
          {/* the fresh coat of "agentic" paint sweeping across */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${paint}%`, background: "linear-gradient(90deg, rgba(217,119,87,0.85), rgba(217,119,87,0.65))" }} />
          {/* the AGENTIC sticker slaps on */}
          {frame >= 44 && (
            <div style={{ position: "absolute", transform: `rotate(-4deg) scale(${interpolate(slap, [0, 1], [1.8, 1])})`, padding: "12px 30px", borderRadius: 10, background: "rgba(253,251,246,0.97)", border: `4px solid ${RED}`, boxShadow: "0 10px 26px rgba(31,30,29,0.2)" }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, letterSpacing: 2, color: INK, transform: "translateZ(0)" }}>"AGENTIC"</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker="A NEW COAT OF PAINT" title="AGENT-WASHING" titleSize={62} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

export const AgenticPricingVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* HOOK — the $800 proposal */}
      <Sequence from={90} durationInFrames={320} premountFor={30}>
        <HookInvoiceScene durationInFrames={320} />
      </Sequence>

      {/* CH1 0:16 — Gartner: >40% cancelled by 2027 */}
      <Sequence from={474} durationInFrames={300} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={300} kicker="GARTNER · PRESS RELEASE" title="40% CANCELLED BY 2027" fullBleed={false} tint={RED} src={`${SHOT}/gartner-40-wide.png`} url="gartner.com/newsroom" imageW={3644} imageH={1948} to={{ x: 140, y: 60, w: 2000, h: 1070 }} waypoints={[{ rect: { x: 0, y: 0, w: 3644, h: 1948 }, at: 0 }, { rect: { x: 140, y: 60, w: 2000, h: 1070 }, at: 26 }]} highlight={{ x: 170, y: 90, w: 1960, h: 300 }} highlightAt={40} />
      </Sequence>
      {/* 0:42 — only ~130 real vendors */}
      <Sequence from={1264} durationInFrames={220} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={220} kicker="GARTNER · THE MARKET" title="ONLY ~130 REAL" fullBleed={false} tint={AMBER} src={`${SHOT}/gartner-130-wide.png`} url="gartner.com/newsroom" imageW={3840} imageH={2052} to={{ x: 440, y: 940, w: 1820, h: 973 }} waypoints={[{ rect: { x: 300, y: 800, w: 2400, h: 1283 }, at: 0 }, { rect: { x: 440, y: 940, w: 1820, h: 973 }, at: 26 }]} highlight={{ x: 470, y: 1075, w: 1720, h: 100 }} highlightAt={40} />
      </Sequence>
      {/* 0:49 — agent washing */}
      <Sequence from={1484} durationInFrames={236} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={236} kicker="GARTNER · WARNING" title="AGENT-WASHING" fullBleed={false} tint={RED} src={`${SHOT}/gartner-washing-wide.png`} url="gartner.com/newsroom" imageW={3840} imageH={2052} to={{ x: 420, y: 40, w: 1820, h: 973 }} waypoints={[{ rect: { x: 0, y: 0, w: 3840, h: 2052 }, at: 0 }, { rect: { x: 420, y: 40, w: 1820, h: 973 }, at: 26 }]} highlight={{ x: 480, y: 90, w: 1700, h: 210 }} highlightAt={40} />
      </Sequence>
      <Sequence from={1724} durationInFrames={170} premountFor={30}>
        <WashScene durationInFrames={170} />
      </Sequence>
      <Sequence from={2110} durationInFrames={190} premountFor={30}>
        <FinalTakeawayScene durationInFrames={190} kicker="BEFORE YOUR QUOTE LANDED" title="THEY DID THE HOMEWORK" stamp="THE FEAR IS REAL" stampAt={130} accent={AMBER} />
      </Sequence>

      {/* CH2 1:18 — MIT/Fortune 95% */}
      <Sequence from={2341} durationInFrames={320} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={320} kicker="FORTUNE · MIT NANDA" title="95% SHOW ZERO IMPACT" fullBleed={false} tint={RED} src={`${SHOT}/fortune-95-wide.png`} url="fortune.com" imageW={3840} imageH={2052} to={{ x: 480, y: 90, w: 1500, h: 802 }} waypoints={[{ rect: { x: 0, y: 0, w: 3840, h: 2052 }, at: 0 }, { rect: { x: 480, y: 90, w: 1500, h: 802 }, at: 26 }]} highlight={{ x: 520, y: 120, w: 1320, h: 280 }} highlightAt={40} />
      </Sequence>
      {/* 1:34 — BCG 26% */}
      <Sequence from={2819} durationInFrames={320} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={320} kicker="ELLVERO · BCG 2026" title="ONLY 26% PAID OFF" fullBleed={false} tint={AMBER} src={`${SHOT}/ellvero-26-wide.png`} url="ellvero.com" imageW={2080} imageH={1112} to={{ x: 70, y: 300, w: 1700, h: 812 }} waypoints={[{ rect: { x: 0, y: 0, w: 2080, h: 1112 }, at: 0 }, { rect: { x: 70, y: 300, w: 1700, h: 812 }, at: 26 }]} highlight={{ x: 230, y: 500, w: 1560, h: 150 }} highlightAt={40} />
      </Sequence>

      {/* CH3 1:50 — Forbes reframes the 40% */}
      <Sequence from={3313} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="FORBES · THE TWIST" title="A STRATEGY FAILURE" fullBleed={false} tint={GREEN} src={`${SHOT}/forbes-40-wide.png`} url="forbes.com" imageW={2500} imageH={1336} to={{ x: 80, y: 170, w: 2340, h: 1252 }} waypoints={[{ rect: { x: 0, y: 0, w: 2500, h: 1336 }, at: 0 }, { rect: { x: 80, y: 170, w: 2340, h: 1252 }, at: 26 }]} highlight={{ x: 120, y: 200, w: 2280, h: 320 }} highlightAt={40} />
      </Sequence>
      <Sequence from={3690} durationInFrames={250} premountFor={30}>
        <FinalTakeawayScene durationInFrames={250} kicker="A BADLY SCOPED PROJECT FAILS LIKE A WEBSITE BUILD" title="NOBODY BLAMES HTML" stamp="IT'S THE SCOPE" stampAt={150} accent={GREEN} />
      </Sequence>
      <Sequence from={4060} durationInFrames={250} premountFor={30}>
        <FinalTakeawayScene durationInFrames={250} kicker="CONSULTANTS SHAVE THE NUMBER DOWN" title="STOP GUILT-PRICING" stamp="THAT'S THE MISTAKE" stampAt={150} accent={RED} />
      </Sequence>
      {/* 2:28 — the scale: outcome outweighs the label */}
      <Sequence from={4430} durationInFrames={420} premountFor={30}>
        <BalanceScaleScene durationInFrames={420} kicker="WHAT SMALL BUSINESSES WEIGH" title="OUTCOME > THE LABEL" leftLabel="THE WORD" rightLabel="THE OUTCOME" dropLeftAt={40} dropRightAt={150} tipAt={210} stampText="NO DISCOUNT" stampAt={300} tint={GREEN} />
      </Sequence>

      {/* CH4 2:45 — Deloitte accounting guidance */}
      <Sequence from={4952} durationInFrames={300} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={300} kicker="DELOITTE · JUNE 2026" title="OUTCOME-BASED, OFFICIAL" fullBleed={false} tint="#6E93BD" src={`${SHOT}/deloitte-outcome-wide.png`} url="dart.deloitte.com" imageW={3840} imageH={2052} to={{ x: 1240, y: 640, w: 1900, h: 1016 }} waypoints={[{ rect: { x: 1000, y: 500, w: 2500, h: 1337 }, at: 0 }, { rect: { x: 1240, y: 640, w: 1900, h: 1016 }, at: 26 }]} highlight={{ x: 1280, y: 720, w: 1810, h: 250 }} highlightAt={40} />
      </Sequence>
      {/* 2:56 — SAP Joule: consumption, not seats (official film) */}
      <Sequence from={5279} durationInFrames={121} premountFor={30}>
        <ClipFilmScene durationInFrames={121} kicker="SAP · JOULE AGENTS" title="BILL ON CONSUMPTION" src={`${CLIPS}/sap-joule-clip.mp4`} tint="#6E93BD" accent="#6E93BD" />
      </Sequence>
      {/* 3:00 — Zendesk per-resolution */}
      <Sequence from={5400} durationInFrames={236} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={236} kicker="ZENDESK · NEWSROOM" title="PAY PER RESOLUTION" fullBleed={false} tint={GREEN} src={`${SHOT}/zendesk-pricing-wide.png`} url="zendesk.com/newsroom" imageW={3840} imageH={2052} to={{ x: 980, y: 60, w: 2100, h: 1123 }} waypoints={[{ rect: { x: 900, y: 40, w: 2400, h: 1283 }, at: 0 }, { rect: { x: 980, y: 60, w: 2100, h: 1123 }, at: 26 }]} highlight={{ x: 1000, y: 600, w: 1600, h: 130 }} highlightAt={44} />
      </Sequence>
      {/* 3:08 — Growth Unhinged: hybrid/outcome is the new default */}
      <Sequence from={5649} durationInFrames={320} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={320} kicker="GROWTH UNHINGED · 2026" title="OUTCOMES, NOT HOURS" fullBleed={false} tint="#6E93BD" src={`${SHOT}/growthunhinged-shift-wide.png`} url="growthunhinged.com" imageW={2432} imageH={1300} to={{ x: 60, y: 40, w: 2312, h: 1236 }} waypoints={[{ rect: { x: 0, y: 0, w: 2432, h: 1300 }, at: 0 }, { rect: { x: 900, y: 300, w: 1400, h: 748 }, at: 120 }]} highlight={{ x: 1460, y: 490, w: 460, h: 580 }} highlightAt={130} />
      </Sequence>

      {/* CH5 3:20 — the rate table */}
      <Sequence from={5996} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="2026 RATE GUIDE" title="$50–$250+ / HOUR" fullBleed={false} tint={GREEN} src={`${SHOT}/rates-table-wide.png`} url="ai-agentsplus.com" imageW={2694} imageH={1440} to={{ x: 440, y: 320, w: 1860, h: 995 }} waypoints={[{ rect: { x: 0, y: 0, w: 2694, h: 1440 }, at: 0 }, { rect: { x: 440, y: 320, w: 1860, h: 995 }, at: 26 }]} highlight={{ x: 460, y: 380, w: 1830, h: 700 }} highlightAt={44} />
      </Sequence>
      {/* 3:27 — the premiums: shipped proof + specialisation */}
      <Sequence from={6199} durationInFrames={470} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={470} kicker="THE PREMIUM" title="PROOF > THE WORD" fullBleed={false} tint={GREEN} src={`${SHOT}/rates-premium-wide.png`} url="ai-agentsplus.com" imageW={2960} imageH={1582} to={{ x: 380, y: 40, w: 2100, h: 1123 }} waypoints={[{ rect: { x: 0, y: 0, w: 2960, h: 1582 }, at: 0 }, { rect: { x: 380, y: 300, w: 1900, h: 1016 }, at: 26 }, { rect: { x: 380, y: 20, w: 1900, h: 1016 }, at: 300 }]} highlight={{ x: 500, y: 500, w: 1780, h: 130 }} highlightAt={44} />
      </Sequence>

      {/* CLOSING 3:43 — the $800 was never the question */}
      <Sequence from={6702} durationInFrames={320} premountFor={30}>
        <FinalTakeawayScene durationInFrames={320} kicker="GO BACK TO THAT PROPOSAL" title="$800 WAS NEVER IT" stamp="SHIPPED WORK + OUTCOME" stampAt={200} accent={AMBER} />
      </Sequence>
      <Sequence from={7035} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="DON'T APOLOGISE FOR THE WORD" title="PRICE LIKE YOU CAN" stamp="DELIVER OUTCOMES" stampAt={200} accent={GREEN} />
      </Sequence>

      {/* 4:06 OUTRO — anchored to the spoken "subscribe" (7381) */}
      <Sequence from={7369} durationInFrames={AGP_DUR - 7369} premountFor={30}>
        <Fable5Outro durationInFrames={AGP_DUR - 7369} kicker="THE BUSINESS SIDE OF AI" tag="Drop your agentic rate in the comments — where does it land?" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const AgenticPricingVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <AgenticPricingVisuals />

      {/* ===== MUSIC — short low beds over the peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={780} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={2341} durationInFrames={800} volume={0.075} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={4430} durationInFrames={1000} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={7369} durationInFrames={AGP_DUR - 7369} volume={0.075} fadeInFrames={30} />

      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />
      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.whoosh : pick(SFX_POOLS.entry, i)} volume={b.fullscreen ? 0.42 : 0.36} rate={vary(i)} />
      ))}
      <SfxCue from={7369} src={SFX.whoosh} volume={0.42} />
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.34 : cue.type === "whip" ? 0.26 : cue.type === "tick" ? 0.22 : 0.3} rate={vary(i + 2)} />
      ))}
      <SfxCue from={7381} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
