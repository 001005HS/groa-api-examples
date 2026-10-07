"""키에 연결된 네이버 계정 상태 조회 (읽기 전용) / Read the bound Naver account (read-only)."""
import json

from groa_client import GroaClient

if __name__ == "__main__":
    print(json.dumps(GroaClient().naver_account(), ensure_ascii=False, indent=2))
