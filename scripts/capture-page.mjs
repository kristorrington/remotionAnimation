// Full-page capture with modal/ad handling (CLAUDE.md §10 b-roll pass).
// Plain `--headless --screenshot` can't dismiss cookie modals or ad overlays,
// which poisoned the plugins-page + TechSpot captures (07/2026) — this drives
// Edge via puppeteer-core instead.
//
// Usage:
//   node scripts/capture-page.mjs <url> <out.png> [--click-text "Done,Accept All"]
//     [--remove "css,selectors"] [--nuke-iframes] [--scroll] [--wait 2000]
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const [url, out, ...rest] = process.argv.slice(2);
if (!url || !out) {
  console.error("Usage: node scripts/capture-page.mjs <url> <out.png> [flags]");
  process.exit(1);
}
const flag = (name) => {
  const i = rest.indexOf(name);
  return i === -1 ? null : rest[i + 1] ?? true;
};
const clickText = (flag("--click-text") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const removeSel = (flag("--remove") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const nukeIframes = rest.includes("--nuke-iframes");
const doScroll = rest.includes("--scroll");
const extraWait = Number(flag("--wait") ?? 2000);

const EDGE = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--disable-gpu", "--no-first-run", "--force-device-scale-factor=2"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
  );
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  // dismiss consent modals / expand "Load more" by button text — repeats
  // until nothing matches (grids often need several Load-more rounds)
  if (clickText.length) {
    for (let round = 0; round < 6; round++) {
      const hit = await page.evaluate((labels) => {
        let clicked = 0;
        for (const el of document.querySelectorAll("button, [role=button], a")) {
          const t = (el.textContent ?? "").trim();
          if (labels.some((l) => t === l)) { el.click(); clicked++; }
        }
        return clicked;
      }, clickText);
      await new Promise((r) => setTimeout(r, 1100));
      if (!hit) break;
    }
  }
  if (removeSel.length) {
    await page.evaluate((sels) => {
      for (const s of sels) document.querySelectorAll(s).forEach((n) => n.remove());
    }, removeSel);
  }
  if (nukeIframes) {
    await page.evaluate(() => document.querySelectorAll("iframe").forEach((n) => n.remove()));
  }
  if (doScroll) {
    // walk the page so lazy-loaded content mounts, then return to top
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          y += 900;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 250);
          else { window.scrollTo(0, 0); setTimeout(resolve, 800); }
        };
        step();
      });
    });
  }
  await new Promise((r) => setTimeout(r, extraWait));
  await page.screenshot({ path: out, fullPage: true });
  console.log("captured", url, "->", out);
} finally {
  await browser.close();
}
