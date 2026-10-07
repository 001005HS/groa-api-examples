// 연결된 네이버 계정 상태 (읽기 전용) / Bound Naver account (read-only)
import { GroaClient } from "./groa.ts";

console.log(JSON.stringify(await new GroaClient().naverAccount(), null, 2));
