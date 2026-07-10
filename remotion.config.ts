// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// OffthreadVideo frame extraction from the footage can stall past the 30s
// default under load (or when OneDrive rehydrates the file), killing renders
// with "Loading <Img> with src=blob:…" delayRender timeouts. Also covers
// browser page-load on this OneDrive-throttled tree (cldflt slows every file
// op ~2-5x even with OneDrive.exe stopped). Generous on purpose.
Config.setTimeoutInMilliseconds(300000);
// The OffthreadVideo compositor sizes its frame cache off free RAM — on this
// 32-core/64GB box it grew past 10GB on the 13.9k-frame side-hustles render,
// pushed Windows into paging and the render from ~145 frames/min to ~9 (looks
// like a stall/timeout). Cap it: 2GB ≈ 250 cached 1080p frames, plenty for the
// two footage tracks (Director + PiP) which read mostly monotonically.
Config.setOffthreadVideoCacheSizeInBytes(2 * 1024 * 1024 * 1024);
Config.overrideWebpackConfig((config) => {
  const withTailwind = enableTailwind(config);
  // Node 25 feeds `undefined` into webpack's snapshot CONTENT hashing
  // (ERR_INVALID_ARG_TYPE in FileSystemInfo.js → Hash.update). The fix: make
  // webpack snapshot by file TIMESTAMP instead of content hash, which skips the
  // crashing code path entirely. Also force Node's native crypto (sha256) and
  // disable the persistent cache. Do NOT set `managedPaths: []` — that force-
  // hashes every dependency and re-triggers the crash.
  return {
    ...withTailwind,
    cache: false,
    output: {
      ...withTailwind.output,
      hashFunction: "sha256",
    },
    snapshot: {
      ...withTailwind.snapshot,
      module: { timestamp: true, hash: false },
      resolve: { timestamp: true, hash: false },
      resolveBuildDependencies: { timestamp: true, hash: false },
      buildDependencies: { timestamp: true, hash: false },
    },
  };
});
