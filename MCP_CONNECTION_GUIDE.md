# Monday.com MCP 연결 가이드

이 가이드는 Claude Code에 Monday.com MCP 서버를 연결하는 방법을 설명합니다.

## 📋 현재 상황

- ✅ **Claude Web UI**: Monday.com MCP 연결됨 → 모든 기능 작동
- ❌ **Claude Code**: MCP 미연결 → API 토큰 필요

## 🎯 목표

Claude Code에도 Monday.com MCP를 연결하여 Web UI와 동일하게 사용

---

## 🔧 연결 방법

### 방법 1: Claude Code 설정에서 연결 (권장)

#### 단계 1: 설정 열기

Claude Code에서:
```
메뉴 → Settings (또는 Preferences)
→ Integrations (또는 MCP Servers)
```

또는 단축키:
- macOS: `Cmd + ,`
- Windows/Linux: `Ctrl + ,`

#### 단계 2: MCP 서버 추가

1. **"Add MCP Server"** 또는 **"Add Custom Integration"** 클릭
2. 다음 정보 입력:

```
Server URL: https://mcp.monday.com/sse
Server Type: SSE (Server-Sent Events)
```

#### 단계 3: OAuth 인증

1. **"Connect"** 또는 **"Authorize"** 클릭
2. 브라우저에서 Monday.com 로그인 페이지 열림
3. Monday.com에 로그인
4. 권한 승인:
   - ✅ 워크스페이스 접근
   - ✅ 보드 읽기/쓰기
   - ✅ 아이템 관리
5. **"Allow"** 또는 **"Authorize"** 클릭

#### 단계 4: 연결 확인

설정 화면에서 확인:
```
✅ Monday.com MCP
   Status: Connected
   Type: SSE
   URL: https://mcp.monday.com/sse
```

---

### 방법 2: 구성 파일 직접 편집

Claude Code의 MCP 설정 파일을 직접 편집할 수도 있습니다.

#### 설정 파일 위치

**macOS/Linux:**
```bash
~/.config/claude-code/mcp-config.json
```

**Windows:**
```
%APPDATA%\claude-code\mcp-config.json
```

#### 설정 추가

파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "monday": {
      "type": "sse",
      "url": "https://mcp.monday.com/sse",
      "name": "Monday.com",
      "description": "Monday.com workspace management"
    }
  }
}
```

설정 저장 후 Claude Code 재시작하면 OAuth 인증 프롬프트가 나타납니다.

---

## ✅ 연결 확인

### 테스트 1: 사용 가능한 도구 확인

Claude Code에서 물어보세요:
```
"What Monday.com tools are available?"
```

예상 응답:
```
Available Monday.com MCP tools:
- monday_get_workspaces
- monday_get_boards
- monday_create_board
- monday_create_item
- monday_update_item
- ...
```

### 테스트 2: 간단한 작업 수행

```
"List my Monday.com workspaces"
```

또는

```
"Show me all boards in my Monday.com workspace"
```

성공하면 ✅ MCP 연결 완료!

---

## 🎉 연결 후 사용 방법

### 직접 명령어 사용

MCP가 연결되면 자연어로 Monday.com 작업을 요청할 수 있습니다:

```
"Create a new board called 'Q1 Projects' in Monday.com"

"Add an item 'Design mockups' to the 'Planning' group"

"List all items in the 'Sprint 1' board"

"Update the status of item ID 123 to 'In Progress'"
```

### 이 프로젝트와 함께 사용

이 프로젝트의 코드도 MCP를 사용하도록 수정할 수 있습니다:

```typescript
// MCP를 통해 Claude에게 요청
// 프로그래밍 방식이 아닌 자연어 명령어로 제어
```

또는 기존 Direct API 코드를 계속 사용하되, 필요할 때만 MCP로 전환:
- 빠른 조회/확인 → MCP 사용 (자연어)
- 복잡한 자동화 → Direct API 사용 (코드)

---

## 🔍 문제 해결

### "MCP 서버를 찾을 수 없습니다"

**원인**: Claude Code 버전이 MCP를 지원하지 않을 수 있음

**해결**:
1. Claude Code 업데이트 확인
2. 최신 버전으로 업데이트
3. 재시작 후 다시 시도

### "OAuth 인증 실패"

**원인**: Monday.com 계정 권한 문제

**해결**:
1. Monday.com에서 로그아웃
2. 다시 로그인
3. 워크스페이스 관리자 권한 확인
4. OAuth 승인 재시도

### "연결은 되었지만 작동하지 않음"

**원인**: OAuth 토큰 만료

**해결**:
1. MCP 서버 연결 해제
2. 재연결 및 OAuth 재인증
3. Claude Code 재시작

### "특정 워크스페이스에 접근할 수 없음"

**원인**: OAuth 승인 시 선택한 워크스페이스 제한

**해결**:
1. Monday.com에서 앱 권한 설정 확인
2. Admin → Integrations → Monday MCP
3. 접근 권한 워크스페이스 추가
4. OAuth 재인증

---

## 🆚 MCP vs Direct API 비교

### MCP 방식 (연결 후)

**장점:**
- ✅ OAuth로 자동 인증
- ✅ 자연어 명령어 사용
- ✅ 토큰 관리 불필요
- ✅ Web UI와 동일한 권한
- ✅ Claude가 자동으로 처리

**단점:**
- ⚠️ 초기 연결 설정 필요
- ⚠️ 프로그래밍 방식 제어 제한적

**사용 예:**
```
사용자: "Monday.com에서 내 보드 목록 보여줘"
Claude: [MCP 도구 호출] → 결과 표시
```

### Direct API 방식 (현재 코드)

**장점:**
- ✅ 완전한 프로그래밍 제어
- ✅ 복잡한 자동화 가능
- ✅ 스크립트로 실행 가능
- ✅ CI/CD 통합 가능

**단점:**
- ⚠️ API 토큰 필요 (올바른 권한)
- ⚠️ 토큰 관리 필요
- ⚠️ 직접 GraphQL 쿼리 작성

**사용 예:**
```typescript
const service = new MondayService();
const boards = await service.getBoards();
```

---

## 💡 권장 사용법

### 시나리오별 최적 선택

**빠른 조회/확인 작업**
→ MCP 사용 (자연어로 요청)
```
"이번 주에 마감인 아이템 보여줘"
```

**복잡한 자동화/반복 작업**
→ Direct API 사용 (이 프로젝트 코드)
```typescript
npm test  // 전체 보드 구조 생성
```

**일회성 보드 생성**
→ MCP 사용
```
"프로젝트 관리용 보드 만들어줘"
```

**정기적인 대량 작업**
→ Direct API 사용
```bash
npm run dev  // 스케줄된 작업
```

---

## 🚀 다음 단계

1. **MCP 연결 완료 후:**
   ```
   "Monday.com MCP가 잘 작동하는지 테스트해줘"
   ```

2. **기존 코드와 병행 사용:**
   - 빠른 작업 → MCP (자연어)
   - 자동화 → Direct API (이 프로젝트)

3. **추가 학습:**
   - [Monday.com MCP 문서](https://github.com/mondaycom/mcp)
   - [Claude Code MCP 가이드](https://docs.anthropic.com/claude/docs)

---

## 📚 참고 자료

- [Monday.com MCP GitHub](https://github.com/mondaycom/mcp)
- [Monday.com API 문서](https://developer.monday.com/api-reference/docs)
- [이 프로젝트의 API 코드](./README.md)
- [토큰 설정 가이드](./TOKEN_SETUP_GUIDE.md)

---

## ❓ 자주 묻는 질문

**Q: MCP와 Direct API를 같이 사용할 수 있나요?**
A: 네! 각각 장단점이 있어 상황에 맞게 선택하면 됩니다.

**Q: MCP 연결하면 이 프로젝트 코드는 필요 없나요?**
A: 아닙니다. 복잡한 자동화나 스크립트 실행에는 여전히 유용합니다.

**Q: OAuth 토큰은 어디에 저장되나요?**
A: Claude Code가 안전하게 관리합니다. 직접 관리할 필요 없습니다.

**Q: MCP 없이도 이 프로젝트를 사용할 수 있나요?**
A: 네! 올바른 권한의 Personal API Token만 있으면 됩니다.

---

연결에 문제가 있으면 말씀해주세요! 🙋‍♂️
