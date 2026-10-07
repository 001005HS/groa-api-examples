# 그로아 API 예제

[그로아](https://groa.im)는 여러 네이버 블로그·카페 계정의 글 작성, 예약 발행, 이웃 관리를 한 화면에서 운영하는 서비스입니다.
이 저장소는 그로아 **공개 API**(`/api/v1`)를 자체 시스템에서 호출하는 예제를 담고 있습니다. 서비스 본체 코드는 비공개입니다.

[English README](README.en.md)

- API 문서: https://groa.im/api/v1/docs
- OpenAPI 명세: https://groa.im/api/v1/openapi.json (사본: [docs/openapi.json](docs/openapi.json))

## 시작하기

1. 그로아에 로그인해 API 키를 발급받습니다. 키는 네이버 계정 하나에 연결됩니다.
2. 환경변수로 키를 넘깁니다. 키를 코드나 저장소에 넣지 마세요.

```bash
export GROA_API_KEY="발급받은_키"
# 선택: export GROA_BASE_URL="https://groa.im"
```

## 예제

| 언어 | 파일 | 하는 일 |
|---|---|---|
| curl | [examples/curl/create-draft.sh](examples/curl/create-draft.sh) | 블로그 글 초안 등록 |
| curl | [examples/curl/create-cafe-draft.sh](examples/curl/create-cafe-draft.sh) | 카페 글 초안 등록 |
| curl | [examples/curl/get-post.sh](examples/curl/get-post.sh) | 글 상태 조회 |
| curl | [examples/curl/account.sh](examples/curl/account.sh) | 연결 계정 조회 (읽기 전용) |
| Python | [examples/python/create_draft.py](examples/python/create_draft.py) | 블로그 글 초안 등록 |
| Python | [examples/python/account.py](examples/python/account.py) | 연결 계정 조회 |
| TypeScript (Node 18+) | [examples/typescript/create-draft.ts](examples/typescript/create-draft.ts) | 블로그 글 초안 등록 |
| TypeScript (Node 18+) | [examples/typescript/account.ts](examples/typescript/account.ts) | 연결 계정 조회 |

```bash
# curl
bash examples/curl/create-draft.sh

# Python
cd examples/python && pip install -r requirements.txt && python create_draft.py

# TypeScript
cd examples/typescript && npm install && npm run create-draft
```

`status: "draft"`로 등록하면 네이버에 바로 올라가지 않습니다. `"publish"`는 즉시 발행, `publishAt`(ISO 8601)을 함께 주면 예약 발행입니다.

## 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/v1/posts` | 블로그 글 등록 (초안·즉시 발행·예약) |
| GET / PATCH / DELETE | `/api/v1/posts/{post_id}` | 블로그 글 조회·수정·삭제 |
| POST | `/api/v1/cafe/posts` | 카페 글 등록 |
| GET / PATCH / DELETE | `/api/v1/cafe/posts/{post_id}` | 카페 글 조회·수정·삭제 |
| POST | `/api/v1/naver/login` | 네이버 로그인 접수 (202 후 폴링) |
| GET | `/api/v1/naver/operations/{operation_id}` | 비동기 작업 상태 |
| GET | `/api/v1/naver/account` | 키에 연결된 네이버 계정 상태 |
| POST | `/api/v1/naver/account/refresh` | 계정 상태 새로고침 |
| GET | `/api/v1/research/dcinside/...` | 리서치(DCInside 실시간 베스트) |

## 알아둘 점

- **인증**: 모든 요청에 `X-Api-Key` 헤더가 필요합니다.
- **중복 방지**: 글 등록(POST)에는 `Idempotency-Key` 헤더가 필수입니다. 같은 키로 다시 보내면 글이 두 번 만들어지지 않습니다.
- **본문 그대로 발행**: API로 보낸 본문은 AI로 다시 쓰지 않습니다.
- **비동기 응답**: 예약 발행과 로그인은 `202`로 접수되며, 이후 조회 엔드포인트로 상태를 확인합니다.
- **호출 한도**(키별): 일반 분당 60회, 발행 분당 5회, 로그인 10분당 5회.
- **오류 형식**: `{"error": "...", "code": "INVALID_API_KEY"}` 처럼 사람이 읽는 메시지와 코드가 함께 옵니다.

## 예제 본문 검증

예제 요청 본문이 OpenAPI 스키마에 맞는지 네트워크 호출 없이 확인할 수 있습니다.

```bash
pip install jsonschema && python scripts/validate_payloads.py
```

## 문의

admin@groa.im · [개인정보처리방침](https://groa.im/privacy) · [이용약관](https://groa.im/terms)

## 라이선스

[MIT](LICENSE)
