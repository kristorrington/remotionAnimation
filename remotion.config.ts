// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => {
  const withTailwind = enableTailwind(config);
  // Node 25's WASM hashing trips webpack's default; force Node's native crypto.
  // Node 25 also feeds `undefined` into webpack's filesystem-cache snapshot
  // hashing during render bundling (ERR_INVALID_ARG_TYPE in FileSystemInfo),
  // so disable persistent caching to avoid that code path. Keep node_modules in
  // the default `managedPaths` (i.e. don't force-hash their contents) — forcing
  // it with `managedPaths: []` makes webpack content-hash every dependency file
  // and re-triggers the same undefined-hash crash when a package is added.
  return {
    ...withTailwind,
    cache: false,
    output: {
      ...withTailwind.output,
      hashFunction: "sha256",
    },
  };
});
