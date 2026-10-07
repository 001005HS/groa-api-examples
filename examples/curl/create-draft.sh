#!/usr/bin/env bash
# 블로그 글 초안 등록 / Create a blog post draft
# POST /api/v1/posts  (status "draft" = 네이버에 바로 발행하지 않음 / not published to Naver yet)
set -euo pipefail
: "${GROA_API_KEY:?GROA_API_KEY 환경변수를 설정하세요 / set GROA_API_KEY}"
BASE="${GROA_BASE_URL:-https://groa.im}"
IDEMPOTENCY_KEY="${IDEMPOTENCY_KEY:-$(uuidgen 2>/dev/null || date +%s%N)}"

curl -sS -X POST "$BASE/api/v1/posts" \
  -H "X-Api-Key: $GROA_API_KEY" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @"$(dirname "$0")/../payloads/post-draft.json"
echo
