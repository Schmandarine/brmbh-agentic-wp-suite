#!/usr/bin/env bash
# Uses the project's local sass binary with Bootstrap 5.x deprecation silencing.
# A global sass on PATH may not recognise the same --silence-deprecation IDs.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SASS_BIN="$ROOT/node_modules/.bin/sass"

if [ ! -x "$SASS_BIN" ]; then
  echo "sass not found at $SASS_BIN — run npm install in the theme directory." >&2
  exit 1
fi

exec "$SASS_BIN" \
  --load-path="$ROOT/assets/src/scss" \
  --load-path="$ROOT/my-acf-blocks" \
  --quiet-deps \
  --silence-deprecation=import \
  --silence-deprecation=global-builtin \
  --silence-deprecation=color-functions \
  --silence-deprecation=if-function \
  --silence-deprecation=function-units \
  --silence-deprecation=abs-percent \
  "$@"
