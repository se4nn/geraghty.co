// Encrypts a private film so the site can ship it without making it public.
// The Film component decrypts it in the browser once the viewer enters the
// password.
//
//   FILM_PASSWORD='…' node scripts/encrypt-film.mjs <input.mp4> <output.enc>
//
// Format: "SFE1" (4 bytes) | salt (16) | iv (12) | AES-256-GCM ciphertext+tag.
// The key comes from the password with PBKDF2-SHA256, 310,000 iterations,
// the same numbers Film.astro uses. Never commit the plain MP4.
import { readFile, writeFile } from 'node:fs/promises';
import { webcrypto as crypto } from 'node:crypto';

const [input, output] = process.argv.slice(2);
const password = process.env.FILM_PASSWORD;
if (!input || !output || !password) {
  console.error("Usage: FILM_PASSWORD='…' node scripts/encrypt-film.mjs <input.mp4> <output.enc>");
  process.exit(1);
}

const ITERATIONS = 310_000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  material,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);

const plain = await readFile(input);
const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));

const out = new Uint8Array(4 + salt.length + iv.length + cipher.length);
out.set(new TextEncoder().encode('SFE1'), 0);
out.set(salt, 4);
out.set(iv, 20);
out.set(cipher, 32);
await writeFile(output, out);
console.log(`Encrypted ${input} → ${output} (${(out.length / 1e6).toFixed(1)} MB)`);
