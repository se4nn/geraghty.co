#!/bin/sh
# Builds the showreel stage on its own and serves it on port 4341, for
# capture.mjs --base http://localhost:4341. A static build can't hot-reload
# mid-film when files change. Ctrl-C to stop.
set -e
cd "$(dirname "$0")/../.."
OUT="${TMPDIR:-/tmp}/geraghty-reel-stage"
REEL_STAGE=1 npx astro build --outDir "$OUT"
cd "$OUT" && python3 -m http.server 4341
