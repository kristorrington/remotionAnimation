import React from "react";
import { AbsoluteFill } from "remotion";
import { AuthCommand } from "./components/AuthCommand";
import { SFX, SfxCue } from "./components/Sfx";

const DUR = 740;

// GmailAuthCommand — standalone animation of the Gmail MCP auth command, with
// each path spotlighted as the narrator explains it (transcript L82–89).
// Transparent overlay (render ProRes 4444); SFX included. ~24.7s @ 30fps.
export const GmailAuthCommand: React.FC = () => {
  return (
    <AbsoluteFill>
      <AuthCommand durationInFrames={DUR} />

      {/* sound: whoosh on appear, tick as each path lights up */}
      <SfxCue from={0} src={SFX.whoosh} volume={0.5} />
      <SfxCue from={134} src={SFX.switch} volume={0.4} />
      <SfxCue from={267} src={SFX.switch} volume={0.4} />
      <SfxCue from={409} src={SFX.switch} volume={0.4} />
      <SfxCue from={528} src={SFX.switch} volume={0.4} />
    </AbsoluteFill>
  );
};
