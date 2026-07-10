import React from "react";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { BLUE, CYAN, FONT, MONO, WHITE } from "./components/overlayUI";

// ============================================================================
// VIDEO STYLES. Two brand looks, switchable per video and per short:
//   "cinematic" — warm charcoal space, aurora + grid, Claude-terracotta glow,
//                 Inter. (default; rebranded to Claude Code colours 07/2026)
//   "bold"      — flat slate, chunky cream display type (Anton), yellow tape
//                 banners, terracotta numerics, boxed typewriter kickers.
// Choose by wrapping a composition in <ThemeProvider style="bold"> (main
// videos) or setting `style: "bold"` on a ShortSpec (shorts). Components read
// the active theme via useTheme(); the default context is "cinematic", so
// existing videos render unchanged.
// ============================================================================

const { fontFamily: antonFamily } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });

export type VideoStyle = "cinematic" | "bold";

export type Theme = {
  name: VideoStyle;
  flat: boolean; // true = flat editorial backdrop (no aurora/grid/motes)
  bg: string; // backdrop color (flat styles)
  ink: string; // dark text used ON accent surfaces (tape, buttons)
  text: string; // main text color
  textDim: string; // de-emphasized text
  accent: string; // primary accent (Claude terracotta | yellow)
  accent2: string; // secondary accent (deep clay | terracotta)
  fontDisplay: string; // big titles
  fontBody: string; // items / paragraphs
  fontKicker: string; // kickers / small labels
  titleWeight: number; // Anton only ships 400 (it is inherently ultra-bold)
  glow: boolean; // text glows / neon shadows (cinematic only)
};

export const THEMES: Record<VideoStyle, Theme> = {
  cinematic: {
    name: "cinematic",
    flat: false,
    bg: "#0e0d0c",
    ink: "#0a0908",
    text: WHITE,
    textDim: "rgba(255,255,255,0.65)",
    accent: CYAN,
    accent2: BLUE,
    fontDisplay: FONT,
    fontBody: FONT,
    fontKicker: FONT,
    titleWeight: 800,
    glow: true,
  },
  bold: {
    name: "bold",
    flat: true,
    bg: "#404656",
    ink: "#1A1C22",
    text: "#F1EAD9",
    textDim: "rgba(241,234,217,0.45)",
    accent: "#F0E12B",
    accent2: "#D97757",
    fontDisplay: antonFamily,
    fontBody: FONT,
    fontKicker: MONO,
    titleWeight: 400,
    glow: false,
  },
};

const ThemeCtx = React.createContext<Theme>(THEMES.cinematic);

export const ThemeProvider: React.FC<{ style?: VideoStyle; children: React.ReactNode }> = ({
  style = "cinematic",
  children,
}) => <ThemeCtx.Provider value={THEMES[style]}>{children}</ThemeCtx.Provider>;

export const useTheme = () => React.useContext(ThemeCtx);

// Colors a title's numeric tokens ("5", "4.8", "50%") in the theme's secondary
// accent — the bold style's signature ("FABLE 5", "OPUS 4.8"). No-op visually
// when the token colors match (cinematic titles stay all-white).
export const TitleTokens: React.FC<{ text: string }> = ({ text }) => {
  const t = useTheme();
  const numeric = /^[\d.,%+xX]+$/;
  return (
    <>
      {text.split(" ").map((tok, i) => (
        <span key={i} style={{ color: t.name === "bold" && numeric.test(tok) ? t.accent2 : undefined }}>
          {i > 0 ? " " : ""}
          {tok}
        </span>
      ))}
    </>
  );
};
