# Claude.ai/code 웹 환경 솔루션

## 🌐 현재 환경

- **사용 중**: `claude.ai/code` (웹 브라우저)
- **제약**: MCP 서버 직접 연결 불가
- **Claude Web UI** (`claude.ai`): Monday.com MCP 연결됨 ✅
- **Claude Code** (`claude.ai/code`): MCP 설정 없음 ❌

---

## 💡 해결 방법

### 방법 1: 새 Personal API Token 생성 (권장)

웹 환경에서는 Direct API만 사용 가능하므로, 올바른 권한을 가진 토큰이 필요합니다.

#### Step 1: Monday.com에서 새 토큰 생성

1. **Monday.com 접속**
   - https://monday.com 로그인

2. **Admin 페이지로 이동**
   - 우측 상단 프로필 클릭
   - **Admin** 선택
   - 좌측 메뉴에서 **API** 선택

3. **Personal API Token 생성**
   - **"Generate"** 또는 **"Create new token"** 클릭
   - 토큰 이름 입력: `"Board Workflow API"`

4. **권한(Scopes) 선택** ⭐ 중요!
   ```
   ✅ boards:read       - 보드 조회
   ✅ boards:write      - 보드 생성/수정
   ✅ workspaces:read   - 워크스페이스 조회
   ✅ users:read        - 사용자 정보 (선택사항)
   ```

5. **토큰 생성 및 복사**
   - **"Generate Token"** 클릭
   - 생성된 토큰 전체 복사 (한 번만 표시됨!)

#### Step 2: 환경 변수 업데이트

`.env` 파일을 새 토큰으로 수정:

```bash
MONDAY_API_TOKEN=eyJhbGciOiJIUzI1NiJ9.새로운_토큰_내용...
MONDAY_API_VERSION=2024-10
```

#### Step 3: 토큰 확인

```bash
# 토큰 권한 확인
npm run test:token
```

출력 예시 (성공):
```
--- Permissions ---
Scopes: boards:read,boards:write,workspaces:read
```

#### Step 4: 전체 기능 테스트

```bash
# 종합 기능 테스트
npm test
```

모든 테스트가 통과하면 ✅ 완료!

---

### 방법 2: Claude Web UI 활용

`claude.ai/code`는 코딩용이고, `claude.ai`(일반 채팅)는 MCP가 연결되어 있으므로 역할 분담:

#### 사용 전략

**빠른 조회/확인 작업:**
→ `claude.ai` (일반 웹 UI) 사용
```
"Monday.com에서 내 보드 목록 보여줘"
"Sprint 보드에 아이템 추가해줘"
```

**코드 작성/자동화/테스트:**
→ `claude.ai/code` (현재 환경) 사용
```bash
npm test
npm run dev
```

---

## 🎯 권장 워크플로우

### 시나리오 1: 빠른 확인 및 간단한 작업

**환경**: `claude.ai` (일반 웹 UI)
```
"내 Monday.com 워크스페이스에 있는 모든 보드 보여줘"
"Q1 프로젝트 보드에 새 작업 3개 추가해줘"
```

### 시나리오 2: 복잡한 보드 구조 생성

**환경**: `claude.ai/code` (현재)
```bash
# 1. 올바른 토큰으로 .env 업데이트
# 2. 테스트 실행
npm test

# 3. 워크플로우 실행
npm run dev
```

### 시나리오 3: 대량 작업 자동화

**환경**: `claude.ai/code` + 스크립트
```typescript
// 사용자 정의 워크플로우 작성
const workflow = new BoardSetupWorkflow();
await workflow.createBoardStructure(myConfig);
```

---

## 📊 환경별 비교

| 기능 | claude.ai (Web UI) | claude.ai/code (현재) |
|------|-------------------|----------------------|
| Monday MCP | ✅ 연결됨 | ❌ 불가능 |
| 자연어 명령 | ✅ 사용 가능 | ❌ 불가능 |
| 코드 작성 | ⚠️ 제한적 | ✅ 완전 지원 |
| Direct API | ⚠️ 수동 구현 | ✅ 이미 구현됨 |
| 자동화 스크립트 | ❌ 불가능 | ✅ 가능 |
| 테스트 실행 | ❌ 불가능 | ✅ 가능 |
| Git 통합 | ❌ 불가능 | ✅ 가능 |

---

## 🔑 현재 토큰 문제

**제공된 토큰:**
```json
{
  "per": "me:write",  ← 권한 부족
  "tid": 580064378,
  "uid": 74519333
}
```

**필요한 토큰:**
```json
{
  "per": "boards:read,boards:write,workspaces:read",  ← 올바른 권한
  "tid": 580064378,
  "uid": 74519333
}
```

---

## ✅ 즉시 실행 가능한 단계

### 1. Monday.com Admin 페이지 열기

브라우저에서:
```
https://[your-workspace].monday.com/admin/integrations/api
```

또는:
```
Monday.com → 프로필 → Admin → API
```

### 2. 새 토큰 생성

화면에서:
- "Create new token" 또는 "Generate" 버튼
- 토큰 이름: `Board Workflow`
- 권한 선택: `boards:read`, `boards:write`, `workspaces:read`
- "Generate" 클릭
- **토큰 복사** (중요: 한 번만 표시됨!)

### 3. 토큰 교체

`claude.ai/code`에서 `.env` 파일 수정:
```bash
MONDAY_API_TOKEN=새_토큰_여기_붙여넣기
```

### 4. 테스트

```bash
# 터미널에서
npm run test:token
```

성공 메시지:
```
✅ Scopes: boards:read,boards:write,workspaces:read
```

### 5. 전체 기능 실행

```bash
npm test
```

예상 결과:
```
Total Tests: 12
✅ Passed: 12
Success Rate: 100.0%
```

---

## 🆘 도움이 필요한 경우

### 토큰 생성 페이지를 찾을 수 없음

**URL 직접 접속:**
```
https://monday.com/admin/integrations/api
```

또는 이메일로 워크스페이스 관리자에게 요청

### 권한 선택 옵션이 없음

**원인**: 계정 권한 부족

**해결**:
- 워크스페이스 관리자 권한 필요
- 관리자에게 토큰 생성 요청

### 토큰 생성했지만 여전히 403 에러

**확인 사항:**
```bash
# 1. 토큰이 정확히 복사되었는지 확인
npm run test:token

# 2. 권한 확인
# 출력에서 "per" 필드 확인
# 예상: "boards:read,boards:write,workspaces:read"
```

---

## 📚 관련 문서

- [TOKEN_SETUP_GUIDE.md](./TOKEN_SETUP_GUIDE.md) - 토큰 설정 상세 가이드
- [TEST_RESULTS.md](./TEST_RESULTS.md) - 테스트 결과 분석
- [README.md](./README.md) - 프로젝트 전체 가이드

---

## 🎉 성공 후 할 수 있는 것

올바른 토큰으로 설정하면:

```bash
# 1. 워크스페이스 및 보드 조회
npm run dev

# 2. 전체 기능 테스트
npm test

# 3. 사용자 정의 보드 생성
# src/index.ts 파일에서 주석 해제 후
npm run dev
```

**예시 출력:**
```
=== Listing Workspaces ===
1. My Workspace (ID: 123456)

=== Listing Boards ===
1. Sprint Planning (ID: 789012)
2. Product Roadmap (ID: 345678)

=== Creating Board: Project Management Board ===
✓ Board created
✓ Columns created
✓ Groups created
✓ Items created
```

---

## 💡 최종 정리

### claude.ai/code 웹 환경에서는:

❌ **불가능:**
- MCP 서버 직접 연결
- 설정 파일 수정
- OAuth 인증

✅ **가능:**
- Direct API 사용 (올바른 토큰 필요)
- 코드 작성 및 실행
- 자동화 스크립트
- Git 통합

### 해결책:

**→ Monday.com에서 올바른 권한을 가진 새 Personal API Token 생성**

권한:
- `boards:read` ✅
- `boards:write` ✅
- `workspaces:read` ✅

그러면 모든 기능이 작동합니다! 🎉

---

토큰 생성에 어려움이 있으시면 구체적인 단계를 더 자세히 안내해드리겠습니다!
