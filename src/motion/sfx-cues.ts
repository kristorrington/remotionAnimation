// ============================================================================
// SCENE ACTION CUES — each scene's internal action beats, derived from the SAME
// timing formulas the scenes use. The video shell maps these to SfxCues, so
// retiming a scene retimes its sound automatically (no hand-synced frame lists).
// When a scene's choreography changes, update its entry HERE in the same commit.
// ============================================================================

export type SfxKind = "boom" | "ding" | "whip" | "switch" | "whoosh";
export type ActionCue = { at: number; type: SfxKind };

export const sceneActionCues = (scene: string, from: number, dur: number): ActionCue[] => {
  const cues: { at: number; type: SfxKind }[] = [];
  switch (scene) {
    case "heroLaunch":
      cues.push({ at: 34 + 26, type: "boom" }, { at: 110, type: "whoosh" }); // bolt lands, launch
      break;
    case "boredMatters":
      cues.push({ at: 56, type: "boom" }); // wake slam
      break;
    case "stackCollapse":
      cues.push({ at: 205, type: "boom" }); // the pile topples
      break;
    case "obstacles":
      cues.push({ at: Math.round(dur * 0.52), type: "whip" }, { at: Math.round(dur * 0.52) + 6, type: "whip" }); // walls drop
      break;
    case "notMagic":
      cues.push({ at: 34, type: "whip" }); // wand rejected
      break;
    case "hiddenCost":
      cues.push({ at: Math.round(dur * 0.38), type: "whip" }); // the climb-back starts
      break;
    case "speedWall":
      cues.push({ at: 88, type: "boom" }); // the crash
      break;
    case "cheaperServe":
      cues.push({ at: 105, type: "whip" }, { at: 290, type: "ding" }); // cross-out, then the check
      break;
    case "lessPain":
      cues.push({ at: 70, type: "whip" }, { at: 120, type: "whip" }, { at: 170, type: "whip" }); // pain badges pop
      break;
    case "benchLie":
      cues.push({ at: Math.round(dur * 0.4), type: "boom" }); // the placard drops
      break;
    case "migrateStop":
      cues.push({ at: Math.round(dur * 0.34), type: "boom" }, { at: dur - 66, type: "ding" }); // STOP slam, test-bench arrival
      break;
    case "thresholdGate":
      cues.push({ at: 84, type: "whip" }, { at: Math.round(dur * 0.52) + 52, type: "ding" }); // trapdoor, gate opens
      break;
    case "plumbing":
      cues.push({ at: Math.round(dur * 0.44) + 24, type: "ding" }); // leak fixed
      break;
    case "workOverTokens":
      cues.push({ at: Math.round(dur * 0.55), type: "ding" }); // crosses the line
      break;
    case "finishCheck":
      cues.push({ at: 96, type: "ding" }); // crosses the flag
      break;
    // ——— Claude-wealth scenes (fractions track the instance props used) ———
    case "questionFlip":
      if (dur === 330) cues.push({ at: 130, type: "whip" }); // routing instance: crossAt=130
      else cues.push({ at: Math.round(dur * 0.62), type: "whip" }); // the cross-out
      break;
    case "toolStack":
      cues.push({ at: Math.round(dur * 0.16), type: "boom" }, { at: Math.round(dur * 0.78), type: "switch" }, { at: Math.round(dur * 0.97), type: "switch" }); // blocks thud in
      break;
    case "scaleTrust":
      cues.push({ at: Math.round(dur * 0.93), type: "boom" }); // the crack
      break;
    case "adFlood":
      cues.push({ at: Math.round(dur * 0.57), type: "whip" }); // fake personas flip
      break;
    case "expectation":
      if (dur === 540) cues.push({ at: 69, type: "whip" }, { at: 230, type: "ding" }); // routing instance: leftAt=39/rightAt=206
      else cues.push({ at: Math.round(dur * 0.33), type: "whip" }, { at: Math.round(dur * 0.6), type: "ding" }); // cross, then the check
      break;
    case "gapBridge":
      cues.push({ at: Math.round(dur * 0.58), type: "boom" }, { at: Math.round(dur * 0.79), type: "ding" }); // bridge lands, robot arrives
      break;
    case "dataCenter":
      cues.push({ at: Math.round(dur * 0.25), type: "whip" }, { at: Math.round(dur * 0.72), type: "ding" }); // overheat, then fixed
      break;
    case "nearBottleneck":
      cues.push({ at: Math.round(dur * 0.76), type: "ding" }); // coins land on the constraint
      break;
    case "breakthrough":
      cues.push({ at: 88, type: "boom" }); // punches THROUGH
      break;
    case "missingPieces":
      cues.push({ at: Math.round(dur * 0.17), type: "whip" }, { at: Math.round(dur * 0.76), type: "boom" }); // pull, collapse
      break;
    case "solidStack":
      cues.push({ at: Math.round(dur * 0.64), type: "ding" }); // the stamp
      break;
    // ——— Model-routing scenes (dur-keyed timings track the overlay instances) ———
    case "pickCheaper":
      cues.push({ at: 24, type: "whip" }, { at: 94, type: "boom" }); // rigs drop in, hero lands
      break;
    case "processAround": {
      const bolts = dur === 350 ? [168, 229, 311] : [135, 145, 184];
      bolts.forEach((b) => cues.push({ at: b + 26, type: "boom" })); // modules bolt on
      break;
    }
    case "leakDoc":
      cues.push({ at: 171, type: "boom" }, { at: 534, type: "ding" }); // UNVERIFIED slam, behaviour highlighted
      break;
    case "effortDial":
      if (dur === 880) [8, 196, 371, 522, 815].forEach((s) => cues.push({ at: s, type: "switch" })); // notch clicks
      else [150, 400, 444].forEach((s) => cues.push({ at: s, type: "switch" })); // sweep chips (thinking/slower/tokens)
      break;
    case "overkill":
      cues.push({ at: 200, type: "boom" }); // OVERKILL stamp
      break;
    case "routingLanes": {
      const inst = dur === 890
        ? { cards: [41, 65, 320, 418, 560, 796], escalate: 850 }
        : { cards: [46, 166, 267, 386], escalate: 480 };
      inst.cards.forEach((c) => cues.push({ at: c + 14, type: "switch" })); // cards land on lanes
      cues.push({ at: inst.escalate + 10, type: "boom" }); // fable gate opens
      break;
    }
    case "accessWindow":
      cues.push({ at: 164, type: "boom" }, { at: 199, type: "whip" }, { at: 435, type: "switch" }); // slam, reopen, credits
      break;
    case "rateCard":
      cues.push({ at: 16, type: "whip" }, { at: 360, type: "switch" }, { at: 400, type: "switch" }, { at: 440, type: "switch" }); // bars in, multipliers
      break;
    case "rule8020":
      cues.push({ at: 248, type: "ding" }, { at: 275, type: "switch" }, { at: 458, type: "boom" }); // check, sonnet chip, the missing 20%
      break;
    case "yesRun":
      cues.push({ at: 253, type: "ding" }, { at: 360, type: "ding" }, { at: 475, type: "ding" }, { at: 622, type: "boom" }); // yes, yes, yes, ABSOLUTELY
      break;
    default:
      break;
  }
  return cues.filter((c) => c.at > 0 && c.at < dur).map((c) => ({ at: from + c.at, type: c.type }));
};
