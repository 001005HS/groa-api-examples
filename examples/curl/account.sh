#!/usr/bin/env bash
# 키에 연결된 네이버 계정 상태 조회 (읽기 전용) / Read the Naver account bound to this key (read-only)
# GET /api/v1/naver/account
set -euo pipefail
: "${GROA_API_KEY:?set GROA_API_KEY}"
BASE="${GROA_BASE_URL:-https://groa.im}"
curl -sS "$BASE/api/v1/naver/account" -H "X-Api-Key: $GROA_API_KEY"
echo
