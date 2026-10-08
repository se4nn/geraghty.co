// Assembles the showreel from scripts/reel/edit.json (docs/SHOWREEL-PLAN.md).
//
//   node scripts/reel/build.mjs            the master, scripts/reel/out/reel-master.mp4
//   node scripts/reel/build.mjs --publish  also the site's files in public/img/reel/
//
// Each entry in the cut is one of:
//   { "shot": "format-opener", "in": 0.5, "out": 6.2 }   a stage shot from capture.mjs ("dur" for out - in)
//   { "film": "public/img/...mp4", "in": 0, "out": 4, "fit": "cover" | "contain", "bg": "#hex", "scale": 1 }
//   { "still": "src/assets/...jpg", "dur": 0.8 }           cropped to fill the frame
// and can end with "off": true, the CRT switching off on its last frame.
//
// Cuts are hard; the only transition is a switch off, and the next chapter's
// tile switches on (filmed on the stage, the case study's power-on).
import { spawnSync } from 'child_process';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const edit = JSON.parse(readFileSync(path.join(root, 'scripts/reel/edit.json'), 'utf8'));
const [W, H] = edit.size;
const FPS = edit.fps;
const BG = edit.bg;
const work = path.join(root, 'scripts/reel/out/build');
mkdirSync(work, { recursive: true });

const ffmpeg = (args) => {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
};
const probeDuration = (file) =>
  Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).stdout.toString());

// Every piece is encoded the same way so they join without re-encoding
const piece = ['-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', '-an'];

// Frame-exact times: everything lands on a frame
const frames = (s) => Math.round(s * FPS);
const secs = (f) => (f / FPS).toFixed(6);

const fill = `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}`;
const fit = (bg, scale = 1) =>
  `scale=${Math.round(W * scale)}:${Math.round(H * scale)}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${bg}`;

function render(entry, i) {
  const out = path.join(work, `${String(i).padStart(3, '0')}.mp4`);
  if (entry.shot || entry.film) {
    const src = entry.shot ? path.join(root, 'scripts/reel/out', `${entry.shot}.mp4`) : path.join(root, entry.film);
    if (!existsSync(src)) throw new Error(`missing ${src}${entry.shot ? ' (film it with capture.mjs)' : ''}`);
    const from = frames(entry.in ?? 0);
    const to = entry.dur ? from + frames(entry.dur) : frames(entry.out ?? probeDuration(src));
    const vf = entry.shot || entry.fit === 'cover' ? fill : fit(entry.bg ?? BG, entry.scale);
    ffmpeg(['-i', src, '-ss', secs(from), '-t', secs(to - from), '-vf', `fps=${FPS},${vf}`, ...piece, out]);
  } else if (entry.still) {
    ffmpeg(['-loop', '1', '-i', path.join(root, entry.still), '-t', secs(frames(entry.dur)), '-vf', `fps=${FPS},${fill}`, ...piece, out]);
  } else throw new Error(`entry ${i}: no shot, film or still`);
  return out;
}

// The CRT switching off, on the piece's last frame: the picture collapses
// to a bright line, the line shrinks to a dot, the dot goes out. Quick, as
// exits are (MOTION.md: arrive soft, leave quick). 20 frames at 60fps.
async function switchOff(clip, i) {
  const last = path.join(work, `${String(i).padStart(3, '0')}-last.png`);
  ffmpeg(['-sseof', '-0.1', '-i', clip, '-update', '1', '-q:v', '1', last]);
  const dir = path.join(work, `${String(i).padStart(3, '0')}-off`);
  mkdirSync(dir, { recursive: true });
  const N = 20;
  const ease = (t) => t * t * (3 - 2 * t);
  for (let f = 0; f < N; f++) {
    const t = (f + 1) / N;
    let w = W;
    let h = H;
    let bright = 1;
    let sat = 1;
    if (t <= 0.5) {
      // Collapse to a line, brightening as it goes
      const k = ease(t / 0.5);
      h = Math.max(2, Math.round(H * (1 - k)));
      bright = 1 + 3 * k;
      sat = 1 - k;
    } else if (t <= 0.85) {
      // The line pulls in to a dot
      const k = ease((t - 0.5) / 0.35);
      h = 2;
      w = Math.max(4, Math.round(W * (1 - k)));
      bright = 4;
      sat = 0;
    } else {
      h = 2;
      w = 4;
      bright = 4;
      sat = 0;
      // Out: on the near-black glass, fading is dimming
      bright = 4 * (1 - (t - 0.85) / 0.15);
    }
    const layer = await sharp(last).resize(w, h, { fit: 'fill' }).modulate({ brightness: Math.max(bright, 0.001), saturation: sat }).png().toBuffer();
    await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
      .composite([{ input: layer, left: Math.round((W - w) / 2), top: Math.round((H - h) / 2) }])
      .png()
      .toFile(path.join(dir, `${String(f).padStart(3, '0')}.png`));
  }
  const out = path.join(work, `${String(i).padStart(3, '0')}-off.mp4`);
  ffmpeg(['-framerate', String(FPS), '-i', path.join(dir, '%03d.png'), ...piece, out]);
  return out;
}

const pieces = [];
for (const [i, entry] of edit.cut.entries()) {
  const label = entry.shot ?? entry.film ?? entry.still;
  console.log(`${i}: ${label}`);
  const clip = render(entry, i);
  pieces.push(clip);
  if (entry.off) pieces.push(await switchOff(clip, i));
}

const list = path.join(work, 'list.txt');
writeFileSync(list, pieces.map((p) => `file '${p}'`).join('\n'));
const master = path.join(root, 'scripts/reel/out/reel-master.mp4');
// Re-encoded: joining by stream copy can leave the timestamps out of order
// for a player reading straight through
ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, ...piece, '-movflags', '+faststart', master]);
console.log('master', master, `${probeDuration(master).toFixed(2)}s`);

// The site's files: 30fps (the old reel's rate) keeps them small. AV1 first
// (Chrome, Firefox, newer Apple hardware), HEVC for the rest of Safari; a
// 1280 set for phones, and at 1280 only, H.264 for anything older. The CRT dots in the tiles are
// what costs: at these sizes AV1 and HEVC keep them, H.264 smears them.
// The poster is the ending's first frame, all six tiles lit.
if (process.argv.includes('--publish')) {
  const pub = path.join(root, 'public/img/reel');
  mkdirSync(pub, { recursive: true });
  const out = ['-r', '30', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-an'];
  // A keyframe a second, so playback starts and loops quickly
  const gop = ['-g', '30', '-keyint_min', '30'];
  for (const [name, width] of [['reel', W], ['reel-720', 1280]]) {
    const vf = width === W ? 'null' : `scale=${width}:-2:flags=lanczos`;
    const file = (ext) => path.join(pub, `${name}${ext}`);
    ffmpeg(['-i', master, '-vf', vf, '-c:v', 'libsvtav1', '-preset', '5', '-crf', '44', ...gop, ...out, file('.webm')]);
    ffmpeg(['-i', master, '-vf', vf, '-c:v', 'libx265', '-preset', 'medium', '-crf', '30', '-tag:v', 'hvc1', '-x265-params', 'log-level=error', ...gop, ...out, '-movflags', '+faststart', file('.hevc.mp4')]);
    if (width !== W) ffmpeg(['-i', master, '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-profile:v', 'high', ...gop, ...out, '-movflags', '+faststart', file('.mp4')]);
  }
  const ending = edit.cut.at(-1);
  const posterAt = probeDuration(master) - (ending.out ?? ending.dur) + 0.1;
  ffmpeg(['-ss', posterAt.toFixed(3), '-i', master, '-frames:v', '1', '-q:v', '2', path.join(root, 'src/assets/home/reel-poster.jpg')]);
  console.log('published to public/img/reel/ and src/assets/home/reel-poster.jpg');
}
