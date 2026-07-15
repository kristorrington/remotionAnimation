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
    // ── n8n-hybrid video (July 2026) ──
    case "n8nOpenShot": cues.push({ at: 8, type: "whip" }); break;
    case "tenfold": cues.push({ at: 43, type: "ding" }); break;
    case "klarnaOpenProof": cues.push({ at: 16, type: "whip" }, { at: 26, type: "switch" }); break;
    case "hybridIntro": cues.push({ at: 193, type: "boom" }); break; // agent module docks
    case "blurProof": cues.push({ at: 18, type: "whip" }, { at: 40, type: "switch" }); break;
    case "zapierNoCode": cues.push({ at: 12, type: "whip" }, { at: 24, type: "switch" }); break;
    case "predictable": cues.push({ at: 179, type: "switch" }, { at: 216, type: "switch" }, { at: 295, type: "switch" }); break;
    case "messFunnel": cues.push({ at: 117, type: "switch" }, { at: 152, type: "switch" }, { at: 178, type: "switch" }, { at: 210, type: "ding" }); break;
    case "bothCompare": cues.push({ at: 22, type: "whip" }, { at: 94, type: "ding" }); break;
    case "intelVsRely": cues.push({ at: 20, type: "boom" }); break;
    case "klarnaStats": cues.push({ at: 176, type: "switch" }); break;
    case "klarnaPrProof": cues.push({ at: 8, type: "whip" }, { at: 34, type: "switch" }); break;
    case "qualityWall": cues.push({ at: 88, type: "boom" }); break; // the crash
    case "splitWork": cues.push({ at: 111, type: "switch" }); break;
    case "tooMuchTrust": cues.push({ at: 40, type: "switch" }, { at: 77, type: "whip" }, { at: 112, type: "boom" }, { at: 213, type: "ding" }); break;
    case "moneyRound": cues.push({ at: 118, type: "switch" }, { at: 209, type: "switch" }, { at: 432, type: "switch" }); break;
    case "onePlace": cues.push({ at: 78, type: "switch" }, { at: 97, type: "switch" }, { at: 120, type: "switch" }, { at: 156, type: "switch" }, { at: 170, type: "whip" }); break;
    case "zapierBet": cues.push({ at: 42, type: "switch" }); break;
    case "surveyHype": cues.push({ at: 10, type: "whip" }, { at: 32, type: "switch" }); break;
    case "zapierAgentsRoll": cues.push({ at: 16, type: "whip" }, { at: 40, type: "switch" }); break;
    case "controlLayer": cues.push({ at: Math.round(dur * 0.44) + 24, type: "ding" }); break; // leak fixed
    // screenshot receipts: whip on the zoom, switch on the highlight sweep
    case "klarnaRehireProof": cues.push({ at: 18, type: "whip" }, { at: 71, type: "switch" }); break;
    case "seriesCProof": cues.push({ at: 22, type: "whip" }, { at: 56, type: "switch" }); break;
    case "zapierPostProof": cues.push({ at: 8, type: "whip" }, { at: 26, type: "switch" }); break;
    case "akeneoProof": cues.push({ at: 20, type: "whip" }, { at: 121, type: "switch" }); break;
    case "gartnerProof": cues.push({ at: 16, type: "whip" }, { at: 44, type: "switch" }); break;
    case "selloffProof": cues.push({ at: 22, type: "whip" }, { at: 54, type: "switch" }); break;
    case "n8nProductRoll": cues.push({ at: 30, type: "whip" }); break;
    case "mckinseyGap": cues.push({ at: 34, type: "whip" }, { at: 184, type: "switch" }); break;
    case "gapHurts": cues.push({ at: 100, type: "switch" }, { at: 135, type: "switch" }, { at: 161, type: "switch" }); break;
    case "fortyForty": cues.push({ at: 30, type: "switch" }, { at: 242, type: "whip" }, { at: 292, type: "boom" }); break;
    case "bothHappen": cues.push({ at: 20, type: "boom" }); break;
    case "sellOff": cues.push({ at: 28, type: "boom" }); break;
    case "knownSteps": cues.push({ at: 147, type: "switch" }, { at: 194, type: "switch" }, { at: 222, type: "switch" }); break;
    case "boundedGates": cues.push({ at: 179, type: "ding" }, { at: 226, type: "ding" }, { at: 259, type: "ding" }, { at: 291, type: "ding" }); break;
    case "hybridPayoff": cues.push({ at: 87, type: "boom" }, { at: 146, type: "switch" }, { at: 168, type: "switch" }, { at: 188, type: "switch" }, { at: 200, type: "switch" }, { at: 221, type: "switch" }); break;
    case "oneFramework": cues.push({ at: 22, type: "whip" }, { at: 145, type: "ding" }); break;
    case "autonomyMatters": cues.push({ at: 193, type: "boom" }); break;
    // ── ChatGPT Work video (July 2026) ──
    case "oneWorkspace": cues.push({ at: 100 + 14, type: "boom" }, { at: 140, type: "ding" }); break; // panels merge, stamp
    case "dirPan": cues.push({ at: 12, type: "whip" }); break;
    case "launchProof": cues.push({ at: 16, type: "whip" }, { at: 30, type: "switch" }); break;
    case "codexMergeProof": cues.push({ at: 16, type: "whip" }, { at: 34, type: "switch" }); break;
    case "classicProof": cues.push({ at: 14, type: "whip" }, { at: 31, type: "switch" }); break;
    case "rivalry": cues.push({ at: 10, type: "switch" }, { at: 45, type: "switch" }, { at: 78, type: "switch" }, { at: 219, type: "boom" }); break;
    case "modelsProof": cues.push({ at: 12, type: "whip" }, { at: 19, type: "switch" }); break;
    case "staggerProof": cues.push({ at: 14, type: "whip" }, { at: 28, type: "switch" }); break;
    case "reviewScopeProof": cues.push({ at: 14, type: "whip" }, { at: 20, type: "switch" }); break;
    case "accessProof": cues.push({ at: 14, type: "whip" }, { at: 22, type: "switch" }); break;
    case "billPrinter": cues.push({ at: 40, type: "switch" }, { at: Math.round(dur * 0.6), type: "boom" }); break;
    case "noPriceProof": cues.push({ at: 18, type: "whip" }); break;
    case "directoryPan": cues.push({ at: 14, type: "whip" }, { at: 130, type: "switch" }); break;
    case "strategyProof": cues.push({ at: 16, type: "whip" }); break;
    case "unverifiedCard": cues.push({ at: 16, type: "whip" }, { at: 60, type: "switch" }); break;
    case "solIncident": cues.push({ at: 58, type: "switch" }, { at: 92, type: "boom" }, { at: 172, type: "boom" }); break;
    case "backupRule": cues.push({ at: 40, type: "boom" }, { at: 148, type: "switch" }, { at: 158, type: "boom" }); break;
    case "sandbox":
      if (dur === 330) cues.push({ at: 60, type: "whip" }, { at: 134, type: "switch" }, { at: 198, type: "switch" }, { at: 248, type: "switch" }); // go-local: privacy boundary
      else cues.push({ at: 100, type: "whip" }, { at: 120, type: "switch" }, { at: 145, type: "switch" }, { at: 245, type: "boom" });
      break;
    // ── go-local video (July 2026) ──
    case "stanfordProof": cues.push({ at: 14, type: "whip" }); break;
    case "gpuCatch": cues.push({ at: 12, type: "switch" }, { at: 42, type: "switch" }, { at: 72, type: "switch" }, { at: 43, type: "whip" }); break;
    case "threeGates": cues.push({ at: 92, type: "ding" }, { at: 134, type: "ding" }, { at: 177, type: "ding" }, { at: 242, type: "boom" }); break; // three open, ONE WRONG slams
    case "delangueProof": cues.push({ at: 16, type: "whip" }); break;
    case "tier1": cues.push({ at: 30, type: "boom" }, { at: 142, type: "switch" }, { at: 303, type: "switch" }, { at: 410, type: "switch" }); break;
    case "tier2": cues.push({ at: 112, type: "switch" }, { at: 209, type: "switch" }, { at: 324, type: "switch" }, { at: 340, type: "ding" }); break; // rent coin lands
    case "nvidiaProof": cues.push({ at: 16, type: "whip" }, { at: 26, type: "switch" }); break;
    case "tier3": cues.push({ at: 38, type: "switch" }, { at: 144, type: "whip" }, { at: 195, type: "boom" }); break; // laptop crossed out, stamp
    case "askTier": cues.push({ at: 20, type: "boom" }); break;
    case "controlSteps": cues.push({ at: 67, type: "switch" }, { at: 103, type: "switch" }, { at: 145, type: "switch" }); break;
    case "freeKinetic": cues.push({ at: 145, type: "boom" }); break;
    case "mitProof": cues.push({ at: 16, type: "whip" }, { at: 103, type: "switch" }); break;
    case "sameLabKinetic": cues.push({ at: 87, type: "boom" }); break;
    case "minimaxProof": cues.push({ at: 18, type: "whip" }, { at: 125, type: "switch" }); break;
    case "qwenGate": cues.push({ at: 223, type: "boom" }); break; // the gate slams
    case "fableProof": cues.push({ at: 16, type: "whip" }, { at: 120, type: "switch" }); break;
    case "fableGate": cues.push({ at: 127, type: "boom" }, { at: 176, type: "switch" }); break; // slam + warn chip
    case "stackRisk": cues.push({ at: 26, type: "switch" }, { at: 51, type: "switch" }, { at: 76, type: "switch" }, { at: 110, type: "boom" }); break;
    case "ownVsRent": cues.push({ at: 6, type: "switch" }, { at: 96, type: "switch" }); break;
    case "cloudKinetic": cues.push({ at: 106, type: "boom" }); break;
    case "pickSmallest": cues.push({ at: 42, type: "switch" }, { at: 67, type: "switch" }, { at: 92, type: "switch" }, { at: 132, type: "ding" }); break;
    case "fitSteps": cues.push({ at: 113, type: "switch" }, { at: 167, type: "switch" }, { at: 200, type: "switch" }); break;
    case "rentKinetic": cues.push({ at: 53, type: "boom" }); break;
    case "askThree": cues.push({ at: 26, type: "switch" }, { at: 85, type: "switch" }, { at: 129, type: "switch" }); break;
    // ── AI-news / GPT-5.6 super-app video (July 2026) ──
    case "heroProof": cues.push({ at: 14, type: "whip" }); break;
    case "oneApp": cues.push({ at: 131 + 14, type: "boom" }, { at: 145, type: "ding" }); break; // panels merge, stamp
    case "modeDoors": cues.push({ at: 12 + 12, type: "switch" }, { at: 48 + 12, type: "switch" }); break;
    case "workFlow": cues.push({ at: 64, type: "switch" }, { at: 103, type: "switch" }, { at: 133, type: "switch" }, { at: 163, type: "whip" }); break;
    case "codexSteps": cues.push({ at: 129, type: "switch" }, { at: 163, type: "switch" }, { at: 193, type: "switch" }, { at: 223, type: "switch" }); break;
    case "newstackProof": cues.push({ at: 16, type: "whip" }, { at: 36, type: "switch" }); break;
    case "modeCompare": cues.push({ at: 30, type: "switch" }, { at: 146, type: "switch" }); break;
    case "gptliveProof": cues.push({ at: 14, type: "whip" }, { at: 47, type: "switch" }); break;
    case "voiceLive": cues.push({ at: 35, type: "switch" }, { at: 92, type: "switch" }, { at: 162, type: "switch" }, { at: 239, type: "boom" }, { at: 337, type: "ding" }); break;
    case "aaProof": cues.push({ at: 18, type: "whip" }, { at: 52, type: "switch" }); break;
    case "statRace": cues.push({ at: 77, type: "switch" }, { at: 115, type: "switch" }, { at: 243, type: "switch" }, { at: 278, type: "switch" }); break;
    case "sixthFifth": cues.push({ at: 63, type: "boom" }); break;
    case "econScale": cues.push({ at: 17, type: "switch" }, { at: 135, type: "whip" }, { at: 190, type: "boom" }, { at: 225, type: "ding" }); break;
    case "tierDoors": cues.push({ at: 30 + 12, type: "switch" }, { at: 73 + 12, type: "switch" }, { at: 100 + 12, type: "switch" }, { at: 303 + 22, type: "ding" }); break;
    case "gdpvalProof": cues.push({ at: 16, type: "whip" }, { at: 103, type: "switch" }); break;
    case "browsecompProof": cues.push({ at: 14, type: "whip" }, { at: 34, type: "switch" }); break;
    case "efficiencyNotIq": cues.push({ at: 93, type: "boom" }); break;
    case "xaiProof": cues.push({ at: 14, type: "whip" }, { at: 36, type: "switch" }); break;
    case "premiumTrio": cues.push({ at: 10, type: "switch" }, { at: 63, type: "switch" }, { at: 115, type: "switch" }); break;
    case "fableAccessProof": cues.push({ at: 16, type: "whip" }, { at: 46, type: "switch" }); break;
    case "testBoth": cues.push({ at: 43, type: "switch" }, { at: 90, type: "switch" }, { at: 344, type: "boom" }); break;
    case "coworkProof": cues.push({ at: 14, type: "whip" }, { at: 36, type: "switch" }); break;
    case "envAssembles": [26, 42, 58, 74].forEach((s) => cues.push({ at: s + 6, type: "switch" })); break; // segments click on
    case "seedreamProof": cues.push({ at: 12, type: "whip" }); break;
    case "museProof": cues.push({ at: 12, type: "whip" }, { at: 36, type: "switch" }); break;
    case "remixProof": cues.push({ at: 12, type: "whip" }); break;
    case "takeCompare": cues.push({ at: 10, type: "switch" }, { at: 42, type: "switch" }); break;
    case "threeMeters": cues.push({ at: 6, type: "switch" }, { at: 65, type: "switch" }, { at: 136, type: "switch" }, { at: 266, type: "boom" }); break;
    // ── GPT-5.6 video (July 2026) ──
    case "speedBoost":
      cues.push({ at: 40, type: "boom" }, { at: 70, type: "whoosh" }); // SOL module bolts on, gauge sweep
      break;
    case "balance":
      if (dur === 244) cues.push({ at: 12, type: "switch" }, { at: 74, type: "whip" }, { at: 130, type: "boom" }, { at: 160, type: "ding" }); // go-local: worth-it scale
      else cues.push({ at: 24, type: "switch" }, { at: 94, type: "whip" }, { at: 124, type: "boom" }, { at: 231, type: "ding" }); // drops, tip, rule stamp
      break;
    case "tiersDoors":
      cues.push({ at: 38 + 12, type: "switch" }, { at: 65 + 12, type: "switch" }, { at: 96 + 12, type: "switch" }); // the three tier doors land
      break;
    case "benchBars":
      cues.push({ at: 67, type: "whip" }, { at: 232, type: "switch" }, { at: 308, type: "switch" }); // bars grow on their scores
      break;
    case "scanner":
      if (dur === 205) cues.push({ at: 40, type: "switch" }, { at: 175, type: "ding" }); // go-local: Kimi licence check
      else if (dur === 264) cues.push({ at: 40, type: "switch" }, { at: 119, type: "ding" }); // go-local: exact-release check
      else cues.push({ at: 181, type: "switch" }, { at: 350, type: "ding" }); // scan starts, precedent tag
      break;
    case "systemBreak":
      cues.push({ at: 170, type: "boom" }, { at: 194, type: "whip" }, { at: 275, type: "whip" }); // the chain breaks, badges slam
      break;
    case "takeawayCapable":
      cues.push({ at: 95, type: "boom" }); // GATE IT stamp
      break;
    case "comparePerms":
      cues.push({ at: 20, type: "whip" }, { at: 168, type: "ding" }); // leaderboard ✗, permissions ✓
      break;
    case "race":
      cues.push({ at: 46, type: "whoosh" }); // the fast lane takes off
      break;
    case "gates":
      if (dur === 320) cues.push({ at: 126, type: "ding" }, { at: 179, type: "ding" }, { at: 256, type: "ding" }); // go-local: licence step, all open
      else cues.push({ at: 139, type: "ding" }, { at: 179, type: "ding" }, { at: 230, type: "ding" }, { at: 294, type: "boom" }); // three gates open, one slams
      break;
    case "signals":
      cues.push({ at: 122, type: "switch" }, { at: 293, type: "switch" }); // the two signals land
      break;
    case "takeawayFinale":
      cues.push({ at: 152, type: "boom" }); // THEN SCALE stamp
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
      if (dur === 147) cues.push({ at: 65, type: "whip" }, { at: 95, type: "switch" }, { at: 125, type: "switch" }); // AI-news: chips pinned
      else cues.push({ at: Math.round(dur * 0.38), type: "whip" }); // the climb-back starts
      break;
    case "speedWall":
      cues.push({ at: 88, type: "boom" }); // the crash
      break;
    case "cheaperServe":
      if (dur === 248) cues.push({ at: 120, type: "whip" }, { at: 235, type: "ding" }); // AI-news: crossAt/checkAt pinned
      else cues.push({ at: 105, type: "whip" }, { at: 290, type: "ding" }); // cross-out, then the check
      break;
    case "lessPain":
      cues.push({ at: 70, type: "whip" }, { at: 120, type: "whip" }, { at: 170, type: "whip" }); // pain badges pop
      break;
    case "benchLie":
      cues.push({ at: Math.round(dur * 0.4), type: "boom" }); // the placard drops
      break;
    case "benchLieFinePrint": // go-local: reveal + chips whisper-pinned (revealAt/messAts props)
      cues.push({ at: 110, type: "boom" }, { at: 119, type: "whip" }, { at: 140, type: "whip" }, { at: 195, type: "whip" });
      break;
    // ── Claude-skills ranking video (July 2026) ──
    case "hookDoors": cues.push({ at: 8, type: "switch" }, { at: 32, type: "switch" }, { at: 56, type: "switch" }, { at: 80, type: "switch" }, { at: 104, type: "switch" }); break;
    case "rankCriteria": cues.push({ at: 8, type: "switch" }, { at: 47, type: "switch" }, { at: 117, type: "switch" }); break;
    case "skillDef": cues.push({ at: 78, type: "boom" }, { at: 87, type: "switch" }, { at: 206, type: "switch" }, { at: 234, type: "switch" }); break; // cartridge clunks in, runs pop
    case "reachProof": cues.push({ at: 16, type: "whip" }, { at: 131, type: "switch" }); break;
    case "reachFlow": cues.push({ at: 20, type: "switch" }, { at: 45, type: "switch" }, { at: 70, type: "switch" }, { at: 95, type: "switch" }, { at: 358, type: "whoosh" }, { at: 505, type: "boom" }); break;
    case "oneRepoStack": cues.push({ at: 203, type: "whip" }, { at: 229, type: "whip" }, { at: 249, type: "whip" }, { at: 283, type: "boom" }); break;
    case "fitKinetic": cues.push({ at: 90, type: "boom" }); break;
    case "loopProof": cues.push({ at: 16, type: "whip" }, { at: 40, type: "switch" }); break;
    case "eightyPercent": cues.push({ at: 121, type: "ding" }, { at: 222, type: "boom" }); break; // premature DONE, then the gap
    case "loopGates": cues.push({ at: 247, type: "switch" }, { at: 303, type: "switch" }); break;
    case "acceptableKinetic": cues.push({ at: 110, type: "boom" }); break;
    case "loopFits": cues.push({ at: 49, type: "whip" }, { at: 231, type: "whip" }, { at: 290, type: "boom" }, { at: 320, type: "ding" }); break;
    case "pxProof": cues.push({ at: 16, type: "whip" }, { at: 55, type: "switch" }); break;
    case "contextCost": cues.push({ at: 55, type: "whip" }, { at: 69, type: "whip" }, { at: 95, type: "whip" }, { at: 137, type: "whip" }); break;
    case "imageSwap": cues.push({ at: 8, type: "whip" }, { at: 40, type: "whip" }, { at: 72, type: "whip" }, { at: 84, type: "boom" }); break; // docs pour, the PNG pops
    case "seventyProof": cues.push({ at: 16, type: "whip" }, { at: 61, type: "switch" }); break;
    case "whoBenefits": cues.push({ at: 207, type: "switch" }, { at: 410, type: "whip" }); break; // gate opens, small one drops
    case "rankThirdKinetic": cues.push({ at: 78, type: "boom" }); break;
    case "tasteProof": cues.push({ at: 16, type: "whip" }, { at: 73, type: "switch" }); break;
    case "slopFactory": cues.push({ at: 15, type: "whip" }, { at: 38, type: "whip" }, { at: 59, type: "whip" }, { at: 170, type: "boom" }); break; // cards thud, SAME AGAIN slams
    case "abSteps": cues.push({ at: 156, type: "switch" }, { at: 208, type: "switch" }, { at: 283, type: "switch" }); break;
    case "examplesProof": cues.push({ at: 14, type: "whip" }, { at: 30, type: "switch" }); break;
    case "superProof": cues.push({ at: 16, type: "whip" }, { at: 62, type: "switch" }); break;
    case "osKinetic": cues.push({ at: 123, type: "boom" }); break;
    case "slowJump": cues.push({ at: 132, type: "switch" }, { at: 197, type: "switch" }, { at: 265, type: "switch" }); break;
    case "recapDoors": cues.push({ at: 22, type: "switch" }, { at: 76, type: "ding" }, { at: 90, type: "switch" }, { at: 166, type: "switch" }, { at: 258, type: "switch" }, { at: 334, type: "switch" }); break; // winner's door opens at 54+22
    case "wrongPathKinetic": cues.push({ at: 95, type: "boom" }); break;
    case "oneComparisonKinetic": cues.push({ at: 59, type: "boom" }); break; // ONE COMPARISON stamp
    case "notProven": // go-local: wand rejected + denied badges whisper-pinned
      cues.push({ at: 34, type: "whip" }, { at: 59, type: "whip" }, { at: 145, type: "whip" });
      break;
    case "migrateStop":
      if (dur === 177) cues.push({ at: 40, type: "boom" }, { at: dur - 66, type: "ding" }); // n8n open: slam pinned via stopAtFrame
      else if (dur === 194) cues.push({ at: 36, type: "boom" }, { at: dur - 66, type: "ding" }); // AI-news: slam pinned via stopAtFrame
      else if (dur === 248) cues.push({ at: 46, type: "boom" }, { at: dur - 66, type: "ding" }); // go-local: unclear-licence stop
      else cues.push({ at: Math.round(dur * 0.34), type: "boom" }, { at: dur - 66, type: "ding" }); // STOP slam, test-bench arrival
      break;
    case "thresholdGate":
      if (dur === 222) cues.push({ at: 74, type: "whip" }, { at: 164, type: "ding" }); // side-hustles open: drop on "waste", lift on "prompt packs"
      else cues.push({ at: 84, type: "whip" }, { at: Math.round(dur * 0.52) + 52, type: "ding" }); // trapdoor, gate opens
      break;
    case "plumbing":
      cues.push({ at: Math.round(dur * 0.44) + 24, type: "ding" }); // leak fixed
      break;
    case "workOverTokens":
      cues.push({ at: Math.round(dur * 0.55), type: "ding" }); // crosses the line
      break;
    case "finishCheck":
      cues.push({ at: 96, type: "ding" }); // crosses the flag
      if (dur === 227) cues.push({ at: 100, type: "boom" }); // AI-news: REAL REASON stamp
      if (dur === 280) cues.push({ at: 165, type: "boom" }); // go-local: GREAT OPTION stamp
      break;
    // ——— Claude-wealth scenes (fractions track the instance props used) ———
    case "questionFlip":
      if (dur === 330) cues.push({ at: 130, type: "whip" }); // routing instance: crossAt=130
      else if (dur === 211) cues.push({ at: 82, type: "whip" }); // countdown instance: crossAt=82
      else if (dur === 182) cues.push({ at: 61, type: "whip" }); // side-hustle instance: crossAt=61
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
        : dur === 445
          ? { cards: [83, 155, 245, 395], escalate: 70 } // countdown instance
          : { cards: [46, 166, 267, 386], escalate: 480 };
      inst.cards.forEach((c) => cues.push({ at: c + 14, type: "switch" })); // cards land on lanes
      cues.push({ at: inst.escalate + 10, type: "boom" }); // fable gate opens
      break;
    }
    case "accessWindow":
      if (dur === 292) cues.push({ at: 36, type: "boom" }, { at: 172, type: "switch" }); // countdown instance: slam, credits
      else cues.push({ at: 164, type: "boom" }, { at: 199, type: "whip" }, { at: 435, type: "switch" }); // slam, reopen, credits
      break;
    // ——— Fable-countdown scenes (timings track the overlay instance props) ———
    case "cdHook":
      cues.push({ at: 148, type: "whip" }, { at: 242, type: "boom" }); // panel slams, gate slams
      break;
    case "cdPrice":
      cues.push({ at: 8, type: "whip" }, { at: 96, type: "boom" }); // $10 in, $50 lands
      break;
    case "cdExtension":
      cues.push({ at: 123, type: "whip" }); // the window flag lands on July 12
      break;
    case "cdPromo":
      cues.push({ at: 88, type: "switch" }, { at: 186, type: "ding" }); // donut fills, nothing-to-claim check
      break;
    case "cdCapacity":
      cues.push({ at: 32, type: "switch" }, { at: 76, type: "switch" }, { at: 160, type: "switch" }, { at: 128, type: "whip" }); // chips + overheat
      break;
    case "cdDrama":
      [119, 151, 193].forEach((s) => cues.push({ at: s, type: "whip" })); // station landings (hop lands ~10f after the spoken stop)
      cues.push({ at: 281, type: "boom" }); // DRAMA stamp
      break;
    case "cdJune":
      [75, 513, 552].forEach((s) => cues.push({ at: s, type: "switch" })); // date cards slam
      break;
    case "cdClassifier":
      cues.push({ at: 185, type: "whip" }, { at: 265, type: "ding" }, { at: 326, type: "boom" }); // bounce, 99%, crack
      break;
    case "cdJenga":
      cues.push({ at: 222, type: "boom" }, { at: 324, type: "switch" }, { at: 354, type: "switch" }, { at: 380, type: "switch" }); // pull + risk stickers
      break;
    case "cdReroute":
      cues.push({ at: 103, type: "boom" }, { at: 191, type: "whip" }); // the arm flips the card, the reveal
      break;
    case "cdSpecialist":
      cues.push({ at: 30, type: "whip" }, { at: 170, type: "whip" }, { at: 304, type: "switch" }, { at: 359, type: "switch" }); // pop-in, handoff, chips
      break;
    case "cdWording":
      cues.push({ at: 61, type: "whip" }, { at: 192, type: "ding" }, { at: 230, type: "boom" }); // cross, check, THE SIGNAL
      break;
    case "takeaway":
      cues.push({ at: 132, type: "boom" }); // LEVERAGE stamp
      break;
    // ——— Side-hustle scenes (timings track the overlay instance props) ———
    case "takeawayThink":
      cues.push({ at: 75, type: "boom" }); // STRONG FIT stamp
      break;
    case "takeaway30":
      cues.push({ at: 92, type: "boom" }); // PICK ONE. GO.
      break;
    case "pathDoors":
      [30, 45, 60, 75, 90].forEach((s) => cues.push({ at: s + 12, type: "switch" })); // doors land
      break;
    case "pathDoors2":
      [183, 307, 468, 581, 668].forEach((s) => cues.push({ at: s + 12, type: "switch" })); // named doors land
      break;
    case "draftPolish":
      cues.push({ at: 500, type: "whip" }, { at: 531, type: "ding" }); // handoff, outcome check
      break;
    case "docFunnel":
      [191, 208, 226, 244].forEach((s) => cues.push({ at: s, type: "switch" })); // docs drop
      cues.push({ at: 310, type: "ding" }); // the report pops out
      break;
    case "appFlow":
      [19, 60, 90, 99, 160].forEach((s) => cues.push({ at: s, type: "switch" })); // tiles land
      cues.push({ at: 317, type: "whip" }, { at: 774, type: "boom" }); // the wire draws, steps collapse
      break;
    case "firstDesk":
      [311, 337, 361].forEach((s) => cues.push({ at: s, type: "switch" })); // questions land
      break;
    case "skillCart":
      cues.push({ at: 456, type: "whip" }); // cartridge clicks in
      [610, 660, 710].forEach((s) => cues.push({ at: s, type: "switch" })); // identical runs
      break;
    case "threeBuyers":
      cues.push({ at: 351, type: "boom" }); // JUST AN IDEA stamp
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
