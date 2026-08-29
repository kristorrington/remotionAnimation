// Instagram Reels adapter — Graph API create-container -> publish. IG has NO
// scheduling field, so the CLI only fires this when an entry's publishAt is DUE
// (dispatch/scheduler check the clock). IG fetches the video from a PUBLIC URL,
// so we first host the file (SOCIAL_UPLOAD_CMD) and tear it down after.
// Needs (in .env): IG_USER_ID, IG_ACCESS_TOKEN (long-lived), SOCIAL_UPLOAD_CMD.
import { hostFile, unhostFile } from "../lib/hosting.mjs";

const GRAPH = "https://graph.facebook.com/v21.0";

// entry: { file, caption, publishAt }
export async function dispatch(entry, env, dryRun) {
  if (dryRun) {
    return { status: "published", remoteId: "(dry-run)", detail: `would host ${entry.file}, create a REELS container, then publish now (IG has no native scheduling)` };
  }
  for (const k of ["IG_USER_ID", "IG_ACCESS_TOKEN"]) if (!env[k]) throw new Error(`missing ${k} in .env`);

  const { url, handle } = await hostFile(entry.file, env);
  try {
    // 1) create the media container
    const create = await fetch(`${GRAPH}/${env.IG_USER_ID}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ media_type: "REELS", video_url: url, caption: entry.caption || "", ...(Number.isFinite(entry.coverAtMs) ? { thumb_offset: String(entry.coverAtMs) } : {}), access_token: env.IG_ACCESS_TOKEN }),
    });
    const cj = await create.json();
    if (!cj.id) throw new Error(`IG container failed: ${JSON.stringify(cj)}`);
    // 2) poll until the container has finished processing
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      const st = await (await fetch(`${GRAPH}/${cj.id}?fields=status_code&access_token=${env.IG_ACCESS_TOKEN}`)).json();
      if (st.status_code === "FINISHED") { ready = true; break; }
      if (st.status_code === "ERROR") throw new Error(`IG processing error: ${JSON.stringify(st)}`);
    }
    if (!ready) throw new Error("IG container not ready after ~2min");
    // 3) publish
    const pub = await fetch(`${GRAPH}/${env.IG_USER_ID}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ creation_id: cj.id, access_token: env.IG_ACCESS_TOKEN }),
    });
    const pj = await pub.json();
    if (!pj.id) throw new Error(`IG publish failed: ${JSON.stringify(pj)}`);
    return { status: "published", remoteId: pj.id, detail: `published IG media ${pj.id}` };
  } finally {
    await unhostFile(handle, env).catch(() => {});
  }
}
