"""Minimal Groa public API client (standard library + requests).

Set GROA_API_KEY in the environment. GROA_BASE_URL is optional (default https://groa.im).
"""
from __future__ import annotations

import os
import uuid
from typing import Any

import requests


class GroaError(RuntimeError):
    def __init__(self, status: int, body: Any):
        super().__init__(f"Groa API error {status}: {body}")
        self.status = status
        self.body = body


class GroaClient:
    def __init__(self, api_key: str | None = None, base_url: str | None = None, timeout: float = 30.0):
        self.api_key = api_key or os.environ.get("GROA_API_KEY")
        if not self.api_key:
            raise SystemExit("GROA_API_KEY 환경변수를 설정하세요 / set GROA_API_KEY")
        self.base_url = (base_url or os.environ.get("GROA_BASE_URL") or "https://groa.im").rstrip("/")
        self.timeout = timeout

    def _request(self, method: str, path: str, *, json: dict | None = None, idempotency_key: str | None = None) -> Any:
        headers = {"X-Api-Key": self.api_key}
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        resp = requests.request(method, self.base_url + path, json=json, headers=headers, timeout=self.timeout)
        if resp.status_code >= 400:
            try:
                body = resp.json()
            except ValueError:
                body = resp.text
            raise GroaError(resp.status_code, body)
        return resp.json() if resp.content else None

    # 블로그 글 / Blog posts
    def create_post(self, payload: dict, idempotency_key: str | None = None) -> dict:
        return self._request("POST", "/api/v1/posts", json=payload, idempotency_key=idempotency_key or str(uuid.uuid4()))

    def get_post(self, post_id: str) -> dict:
        return self._request("GET", f"/api/v1/posts/{post_id}")

    # 카페 글 / Cafe posts
    def create_cafe_post(self, payload: dict, idempotency_key: str | None = None) -> dict:
        return self._request("POST", "/api/v1/cafe/posts", json=payload, idempotency_key=idempotency_key or str(uuid.uuid4()))

    def get_cafe_post(self, post_id: str) -> dict:
        return self._request("GET", f"/api/v1/cafe/posts/{post_id}")

    # 연결 계정 / Bound Naver account (read-only)
    def naver_account(self) -> dict:
        return self._request("GET", "/api/v1/naver/account")
