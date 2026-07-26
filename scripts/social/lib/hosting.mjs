// Instagram needs the video at a PUBLIC URL (it fetches it server-side). Rather
// than hand-roll fragile S3 signing, we shell out to a command YOU configure:
//   SOCIAL_UPLOAD_CMD  — uploads $FILE, prints the public URL on stdout
//   SOCIAL_UNHOST_CMD  — (optional) removes $URL afterwards
// Examples (.env):
//   SOCIAL_UPLOAD_CMD=aws s3 cp "$FILE" s3://my-bucket/social/ --acl public-read >/dev/null && echo "https://my-bucket.s3.amazonaws.com/social/$BASENAME"
//   SOCIAL_UPLOAD_CMD=rclone copy "$FILE" r2:bucket/social && rclone link r2:bucket/social/$BASENAME
import { execSync } from "node:child_process";
import path from "node:path";

export async function hostFile(file, env) {
  if (!env.SOCIAL_UPLOAD_CMD) {
    throw new Error("Instagram needs a public URL. Set SOCIAL_UPLOAD_CMD in .env (see scripts/social/lib/hosting.mjs).");
  }
  const cmdEnv = { ...env, FILE: path.resolve(file), BASENAME: path.basename(file) };
  const url = execSync(env.SOCIAL_UPLOAD_CMD, { env: cmdEnv, encoding: "utf8", shell: true }).trim().split("\n").pop().trim();
  if (!/^https?:\/\//.test(url)) throw new Error(`SOCIAL_UPLOAD_CMD did not print a URL, got: ${url}`);
  return { url, handle: url };
}

export async function unhostFile(handle, env) {
  if (!env.SOCIAL_UNHOST_CMD || !handle) return;
  execSync(env.SOCIAL_UNHOST_CMD, { env: { ...env, URL: handle }, encoding: "utf8", shell: true });
}
