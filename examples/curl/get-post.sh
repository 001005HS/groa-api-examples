#!/usr/bin/env bash
# 등록한 글 상태 조회 / Get a post and its publishing status
# GET /api/v1/posts/{post_id}
set -euo pipefail
: "${GROA_API_KEY:?set GROA_API_KEY}"
POST_ID="${1:?usage: get-post.sh <post_id>}"
BASE="${GROA_BASE_URL:-https://groa.im}"
curl -sS "$BASE/api/v1/posts/$POST_ID" -H "X-Api-Key: $GROA_API_KEY"
echo
