#!/usr/bin/env bash
# Serve the design system locally (in-browser Babel needs HTTP, not file://).
# Usage: ./serve.sh [port]
set -e
PORT="${1:-8000}"
cd "$(dirname "$0")"
echo "Silent design system → http://localhost:${PORT}/"
python3 -m http.server "${PORT}"
