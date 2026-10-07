// Minimal Groa public API client for Node 18+ (built-in fetch).
// Set GROA_API_KEY in the environment. GROA_BASE_URL is optional (default https://groa.im).
import { randomUUID } from "node:crypto";

export interface PostCreate {
  title: string;
  content: string;
  contentFormat?: "html" | "markdown";
  tags?: string[];
  category?: string | null;
  thumbnailUrl?: string | null;
  status?: "draft" | "publish";
  publishAt?: string | null; // ISO 8601
}

export interface CafePostCreate extends Omit<PostCreate, "category"> {
  cafeId?: string | null;
  cafeName?: string | null;
  menuId?: string | null;
}

export class GroaError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`Groa API error ${status}: ${JSON.stringify(body)}`);
  }
}

export class GroaClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey = process.env.GROA_API_KEY, baseUrl = process.env.GROA_BASE_URL ?? "https://groa.im") {
    if (!apiKey) throw new Error("GROA_API_KEY 환경변수를 설정하세요 / set GROA_API_KEY");
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(method: string, path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
    const headers: Record<string, string> = { "X-Api-Key": this.apiKey };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
    const res = await fetch(this.baseUrl + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new GroaError(res.status, data);
    return data as T;
  }

  /** 블로그 글 등록 / Create a blog post (POST /api/v1/posts) */
  createPost(post: PostCreate, idempotencyKey: string = randomUUID()) {
    return this.request<Record<string, unknown>>("POST", "/api/v1/posts", post, idempotencyKey);
  }

  /** 블로그 글 조회 / Get a blog post (GET /api/v1/posts/{id}) */
  getPost(postId: string) {
    return this.request<Record<string, unknown>>("GET", `/api/v1/posts/${encodeURIComponent(postId)}`);
  }

  /** 카페 글 등록 / Create a cafe post (POST /api/v1/cafe/posts) */
  createCafePost(post: CafePostCreate, idempotencyKey: string = randomUUID()) {
    return this.request<Record<string, unknown>>("POST", "/api/v1/cafe/posts", post, idempotencyKey);
  }

  /** 연결된 네이버 계정 (읽기 전용) / Bound Naver account (GET /api/v1/naver/account) */
  naverAccount() {
    return this.request<Record<string, unknown>>("GET", "/api/v1/naver/account");
  }
}
