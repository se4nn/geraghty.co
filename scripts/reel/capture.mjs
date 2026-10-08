// Films one showreel shot from the stage (src/pages/lab/reel/[shot].astro)
// frame by frame, so every frame is exact however long it takes to draw.
//
//   node scripts/reel/capture.mjs <shot> <seconds> [out.mp4] [--fps 60] [--seed 1] [--base http://localhost:4321]
//
// Needs the dev server. Headless, so no window opens.
//
// Time is stepped, not waited for: Playwright's clock drives timers,
// requestAnimationFrame and performance.now (the scripted motion and the
// WebGL gradient), and every CSS animation, transition and Web Animation is
// paused and set to the same clock. Math.random is seeded, so a shot comes
// out the same every time it's filmed.
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [, value] = args.splice(i, 2);
  return value;
};
const fps = Number(flag('fps', 60));
const seed = Number(flag('seed', 1));
const base = flag('base', 'http://localhost:4321');
const [shot, seconds, outArg] = args;
if (!shot || !seconds) {
  console.log('node scripts/reel/capture.mjs <shot> <seconds> [out.mp4] [--fps 60] [--seed 1]');
  process.exit(1);
}
const out = outArg || `scripts/reel/out/${shot}.mp4`;
mkdirSync(path.dirname(out), { recursive: true });

// The Mac's GPU through Metal: the WebGL gradients draw ten times faster
// than in software
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1416, height: 800 }, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.log('pageerror:', e.message));

// A seeded Math.random (mulberry32) before any page script runs
await page.addInitScript((s) => {
  let a = s >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}, seed);
await page.clock.install({ time: new Date('2026-10-08T09:00:00Z') });

await page.goto(`${base}/lab/reel/${shot}/`, { waitUntil: 'networkidle' });
// The dev server can reload a page once while it optimises new
// dependencies; a reload mid-film would restart the shot, so stop instead
let reloaded = false;
page.on('framenavigated', (frame) => {
  if (frame === page.mainFrame()) reloaded = true;
});
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
// The clock runs in real time until it's paused; from here only runFor moves it
await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);

// Every animation is held and set from the page clock. One first seen
// between frames starts from the frame it was first seen on.
await page.evaluate(() => {
  const born = new WeakMap();
  window.reelSync = () => {
    const now = performance.now();
    for (const a of document.getAnimations()) {
      // Scroll-driven ones follow the (still) stage, not time
      if (a.timeline !== document.timeline) continue;
      if (!born.has(a)) {
        born.set(a, now);
        a.pause();
      }
      const elapsed = now - born.get(a);
      const end = a.effect?.getComputedTiming().endTime ?? Infinity;
      if (elapsed >= end && Number.isFinite(end)) a.finish();
      else a.currentTime = elapsed;
    }
  };
});

await page.evaluate(() => window.reelStart());
// Let the stage settle into place before the first frame
await page.clock.runFor(1);
await page.evaluate(() => window.reelSync());

const frames = Math.round(Number(seconds) * fps);
const ff = spawn(
  'ffmpeg',
  [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', out,
  ],
  { stdio: ['pipe', 'inherit', 'inherit'] },
);

const step = 1000 / fps;
for (let i = 0; i < frames; i++) {
  if (reloaded) throw new Error(`${shot}: the page reloaded while filming; film it again`);
  if (i > 0) await page.clock.runFor(step);
  await page.evaluate(() => window.reelSync());
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % fps === 0) console.log(`${shot}: ${i / fps}s of ${seconds}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log('done', out, frames, 'frames');
