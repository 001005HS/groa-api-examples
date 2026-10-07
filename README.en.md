# Groa API examples

[Groa](https://groa.im) lets marketing teams draft, schedule and publish across many Naver Blog and Cafe accounts, and manage blog neighbors, from one workspace.
This repository shows how to call the Groa **public API** (`/api/v1`) from your own systems. The service itself is closed source.

[한국어 README](README.md)

- API docs: https://groa.im/api/v1/docs
- OpenAPI spec: https://groa.im/api/v1/openapi.json (copy: [docs/openapi.json](docs/openapi.json))

## Getting started

1. Sign in to Groa and issue an API key. Each key is bound to one Naver account.
2. Pass the key through an environment variable. Never commit it.

```bash
export GROA_API_KEY="your_key"
# optional: export GROA_BASE_URL="https://groa.im"
```

## Examples

| Language | File | What it does |
|---|---|---|
| curl | [examples/curl/create-draft.sh](examples/curl/create-draft.sh) | Create a blog post draft |
| curl | [examples/curl/create-cafe-draft.sh](examples/curl/create-cafe-draft.sh) | Create a cafe post draft |
| curl | [examples/curl/get-post.sh](examples/curl/get-post.sh) | Check a post's status |
| curl | [examples/curl/account.sh](examples/curl/account.sh) | Read the bound account (read-only) |
| Python | [examples/python/create_draft.py](examples/python/create_draft.py) | Create a blog post draft |
| Python | [examples/python/account.py](examples/python/account.py) | Read the bound account |
| TypeScript (Node 18+) | [examples/typescript/create-draft.ts](examples/typescript/create-draft.ts) | Create a blog post draft |
| TypeScript (Node 18+) | [examples/typescript/account.ts](examples/typescript/account.ts) | Read the bound account |

```bash
# curl
bash examples/curl/create-draft.sh

# Python
cd examples/python && pip install -r requirements.txt && python create_draft.py

# TypeScript
cd examples/typescript && npm install && npm run create-draft
```

A post created with `status: "draft"` is not sent to Naver yet. `"publish"` publishes right away, and adding `publishAt` (ISO 8601) schedules it.

The sample post text is in Korean because Groa publishes to Korean platforms.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| POST | `/api/v1/posts` | Create a blog post (draft, publish now, or schedule) |
| GET / PATCH / DELETE | `/api/v1/posts/{post_id}` | Read, update or delete a blog post |
| POST | `/api/v1/cafe/posts` | Create a cafe post |
| GET / PATCH / DELETE | `/api/v1/cafe/posts/{post_id}` | Read, update or delete a cafe post |
| POST | `/api/v1/naver/login` | Start a Naver sign-in (202, then poll) |
| GET | `/api/v1/naver/operations/{operation_id}` | Status of an async operation |
| GET | `/api/v1/naver/account` | Naver account bound to the key |
| POST | `/api/v1/naver/account/refresh` | Refresh the account status |
| GET | `/api/v1/research/dcinside/...` | Research (DCInside real-time best) |

## Good to know

- **Auth**: every request needs the `X-Api-Key` header.
- **Idempotency**: creating a post (POST) requires an `Idempotency-Key` header. Retrying with the same key never creates a second post.
- **Published as written**: bodies sent through the API are not rewritten by AI.
- **Async responses**: scheduled publishing and sign-in return `202`; poll the read endpoints for the result.
- **Rate limits** (per key): 60 requests/min in general, 5 publishes/min, 5 sign-ins per 10 minutes.
- **Errors**: responses look like `{"error": "...", "code": "INVALID_API_KEY"}`, a readable message plus a stable code.

## Validate the example bodies

Check that the example request bodies match the OpenAPI schema, without any network call:

```bash
pip install jsonschema && python scripts/validate_payloads.py
```

## Contact

admin@groa.im · [Privacy Policy](https://groa.im/en/privacy) · [Terms of Service](https://groa.im/en/terms)

## License

[MIT](LICENSE)
