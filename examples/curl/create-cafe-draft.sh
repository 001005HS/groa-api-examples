#!/usr/bin/env bash
# 카페 글 초안 등록 / Create a cafe post draft
# POST /api/v1/cafe/posts
set -euo pipefail
: "${GROA_API_KEY:?set GROA_API_KEY}"
BASE="${GROA_BASE_URL:-https://groa.im}"
IDEMPOTENCY_KEY="${IDEMPOTENCY_KEY:-$(uuidgen 2>/dev/null || date +%s%N)}"
curl -sS -X POST "$BASE/api/v1/cafe/posts" \
  -H "X-Api-Key: $GROA_API_KEY" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @"$(dirname "$0")/../payloads/cafe-post-draft.json"
echo
