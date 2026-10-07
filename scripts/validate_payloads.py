"""예제 요청 본문이 docs/openapi.json 스키마에 맞는지 검사합니다 (네트워크 호출 없음).
Validates every example request body against docs/openapi.json (no network calls).

    pip install jsonschema && python scripts/validate_payloads.py
"""
import json
import pathlib
import sys

from jsonschema import Draft202012Validator

ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = json.loads((ROOT / "docs/openapi.json").read_text(encoding="utf-8"))

CASES = {
    "examples/payloads/post-draft.json": "PostCreate",
    "examples/payloads/cafe-post-draft.json": "CafePostCreate",
}


def schema_for(name: str) -> dict:
    # Resolve "#/components/schemas/..." refs against the whole spec.
    return {"$ref": f"#/components/schemas/{name}", "components": spec["components"]}


failed = 0
for rel, name in CASES.items():
    body = json.loads((ROOT / rel).read_text(encoding="utf-8"))
    errors = list(Draft202012Validator(schema_for(name)).iter_errors(body))
    print(("OK  " if not errors else "FAIL"), rel, "->", name)
    for e in errors:
        print("    ", e.message)
    failed += bool(errors)
sys.exit(1 if failed else 0)
