// 블로그 글 초안 등록 / Create a blog post draft
//   npm install && GROA_API_KEY=... npm run create-draft
import { GroaClient, type PostCreate } from "./groa.ts";

export const draft: PostCreate = {
  title: "동네 빵집 고르는 5가지 기준",
  content: "## 오전 진열대부터 보세요\n\n갓 구운 빵이 얼마나 채워져 있는지가 첫 번째 기준입니다.",
  contentFormat: "markdown",
  tags: ["빵집", "동네맛집"],
  status: "draft", // "publish" 로 바꾸면 즉시 발행 / set "publish" to publish now
};

const post = await new GroaClient().createPost(draft);
console.log(JSON.stringify(post, null, 2));
