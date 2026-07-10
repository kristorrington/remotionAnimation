import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT } from "../components/overlayUI";
import { useTheme } from "../theme";
import { CaptionWord } from "./captionsData";

// Burned-in karaoke captions. `words` are in absolute source frames; `clipFrom`
// shifts into clip-local time. Words group into ~3-word chunks; the active chunk
// renders in an OPAQUE pill centered at `centerY` — the parent docks it on the
// face/panel seam when split (~y1082, clear of face and cartoons) and drops it
// to the chest when the face is full-screen.
const CHUNK = 3;

type Chunk = { words: CaptionWord[]; from: number; to: number };

const toChunks = (words: CaptionWord[]): Chunk[] => {
  const chunks: Chunk[] = [];
  for (let i = 0; i < words.length; i += CHUNK) {
    const group = words.slice(i, i + CHUNK);
    chunks.push({ words: group, from: group[0].from, to: group[group.length - 1].to });
  }
  return chunks;
};

export const Captions: React.FC<{ words: CaptionWord[]; clipFrom: number; centerY: number }> = ({
  words,
  clipFrom,
  centerY,
}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const chunks = React.useMemo(() => toChunks(words), [words]);
  const abs = clipFrom + frame;

  const active = chunks.find((c) => abs >= c.from && abs <= c.to + 6);
  if (!active) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: centerY,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 18px",
            maxWidth: 920,
            padding: "16px 34px",
            borderRadius: 18,
            // paper = a WHITE sticker card with near-black type (the reference
            // collage look); dark styles keep the opaque dark pill
            background: t.name === "paper" ? "rgba(255,255,255,0.96)" : "rgba(6,9,16,0.94)",
            border: t.name === "paper" ? "1px solid rgba(31,30,29,0.14)" : "1px solid rgba(255,255,255,0.14)",
            boxShadow: t.name === "paper" ? "0 10px 30px rgba(31,30,29,0.20)" : "0 14px 38px rgba(0,0,0,0.55)",
          }}
        >
          {active.words.map((w, i) => {
            const spoken = abs >= w.from && abs <= w.to + 4;
            return (
              <span
                key={i}
                style={{
                  // Inter stays for captions in both styles — readability first.
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 58,
                  lineHeight: 1.15,
                  letterSpacing: -0.5,
                  textTransform: "uppercase",
                  color: spoken ? t.accent : t.text,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
