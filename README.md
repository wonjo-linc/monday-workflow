# Monday.com Workflow

Monday.com 워크스페이스 내 보드 구조를 프로그래밍 방식으로 관리하는 TypeScript 프로젝트입니다.

## 기능

- 워크스페이스 조회
- 보드 생성 및 관리
- 그룹 및 아이템 생성
- 커스텀 컬럼 추가
- 보드 구조 시각화

## 설치

```bash
npm install
```

## 설정

### API 토큰 발급

1. Monday.com에 로그인
2. 우측 상단 프로필 아이콘 클릭
3. **Admin** > **API** 선택
4. **API v2 Token** 섹션에서 새 토큰 생성
5. 필요한 권한(Scopes) 선택:
   - `boards:read` - 보드 읽기
   - `boards:write` - 보드 생성 및 수정
   - `workspaces:read` - 워크스페이스 읽기
   - `users:read` - 사용자 정보 읽기
6. 생성된 토큰 복사

### 환경 변수 설정

`.env` 파일에 Monday.com API 토큰을 설정하세요:

```
MONDAY_API_TOKEN=your_api_token_here
MONDAY_API_VERSION=2024-10
```

### 연결 테스트

API 토큰이 올바르게 설정되었는지 확인:

```bash
npx tsx src/test-connection.ts
```

### 문제 해결

**403 Forbidden 에러가 발생하는 경우:**

1. API 토큰이 올바르게 복사되었는지 확인
2. 토큰에 필요한 권한(Scopes)이 부여되었는지 확인
3. 토큰이 만료되지 않았는지 확인
4. Monday.com 계정의 워크스페이스 접근 권한 확인

## 사용법

### 개발 모드로 실행

```bash
npm run dev
```

### 빌드 및 실행

```bash
npm run build
npm start
```

## 프로젝트 구조

```
monday-workflow/
├── src/
│   ├── config/
│   │   └── monday-config.ts       # Monday.com API 설정
│   ├── services/
│   │   └── monday-service.ts      # Monday.com API 서비스
│   ├── workflows/
│   │   └── board-setup.ts         # 보드 구조 설정 워크플로우
│   ├── types/
│   │   └── monday.types.ts        # TypeScript 타입 정의
│   └── index.ts                   # 메인 엔트리 포인트
├── package.json
├── tsconfig.json
└── .env
```

## API 기능

### MondayService

Monday.com GraphQL API와 상호작용하는 메인 서비스 클래스입니다.

#### 주요 메서드:

- `getWorkspaces()` - 모든 워크스페이스 조회
- `getBoards(workspaceId?)` - 보드 목록 조회
- `createBoard(name, kind, workspaceId?)` - 새 보드 생성
- `getBoardColumns(boardId)` - 보드의 컬럼 조회
- `createColumn(boardId, title, type, defaults?)` - 새 컬럼 생성
- `getBoardGroups(boardId)` - 보드의 그룹 조회
- `createGroup(boardId, groupName)` - 새 그룹 생성
- `createItem(boardId, itemName, groupId?, columnValues?)` - 새 아이템 생성
- `getBoardItems(boardId)` - 보드의 아이템 조회
- `updateColumnValue(boardId, itemId, columnId, value)` - 컬럼 값 업데이트

### BoardSetupWorkflow

보드 구조를 쉽게 생성하고 관리할 수 있는 워크플로우 클래스입니다.

#### 주요 메서드:

- `listWorkspaces()` - 워크스페이스 목록 출력
- `listBoards(workspaceId?)` - 보드 목록 출력
- `createBoardStructure(config)` - 설정에 따라 보드 구조 생성
- `displayBoardStructure(boardId)` - 보드 구조 시각화

## 보드 구조 설정 예제

```typescript
const boardConfig: BoardStructureConfig = {
  name: 'My Project Board',
  description: 'Project tracking board',
  groups: [
    {
      name: 'To Do',
      items: [
        { name: 'Task 1' },
        { name: 'Task 2' }
      ]
    },
    {
      name: 'In Progress',
      items: []
    }
  ],
  columns: [
    {
      title: 'Status',
      type: 'status',
      defaults: {
        labels: {
          0: 'Not Started',
          1: 'In Progress',
          2: 'Done'
        }
      }
    },
    {
      title: 'Due Date',
      type: 'date'
    }
  ]
};

const workflow = new BoardSetupWorkflow();
const board = await workflow.createBoardStructure(boardConfig);
```

## Monday.com 컬럼 타입

지원하는 주요 컬럼 타입:

- `status` - 상태 라벨
- `text` - 텍스트
- `long_text` - 긴 텍스트
- `numbers` - 숫자
- `date` - 날짜
- `people` - 담당자
- `timeline` - 타임라인
- `checkbox` - 체크박스
- `dropdown` - 드롭다운
- `email` - 이메일
- `phone` - 전화번호
- `link` - 링크

## Monday.com MCP 서버 사용

이 프로젝트는 Monday.com REST API를 직접 호출하는 방식으로 구현되어 있습니다.

Monday.com MCP 서버를 Claude Desktop과 함께 사용하려면:

1. Claude Desktop 실행
2. Settings → Integrations 이동
3. "Add custom integration" 클릭
4. MCP 서버 URL 입력: `https://mcp.monday.com/sse`
5. OAuth 인증 완료
6. Claude Desktop에서 Monday.com 도구 사용 가능

MCP 서버를 사용하면 Claude와 대화하면서 Monday.com을 제어할 수 있습니다.

## 참고 자료

- [Monday.com API 문서](https://developer.monday.com/api-reference/docs)
- [Monday.com GraphQL API](https://api.monday.com/v2/docs)
- [Monday.com MCP](https://github.com/mondaycom/mcp)
- [Monday.com API 토큰 생성](https://support.monday.com/hc/en-us/articles/360005144659-Does-monday-com-have-an-API-)

## 현재 상태

### 구현 완료
- ✅ 프로젝트 구조 설정
- ✅ Monday.com API 서비스 구현
- ✅ 보드 생성 및 관리 기능
- ✅ 그룹 및 아이템 관리 기능
- ✅ 컬럼 관리 기능
- ✅ 워크플로우 구현

### 알려진 이슈
- ⚠️ API 토큰 권한 확인 필요 (403 Forbidden 에러 발생 중)
  - 해결방법: Monday.com에서 올바른 권한을 가진 새 API 토큰 생성 필요
  - 필요 권한: `boards:read`, `boards:write`, `workspaces:read`

## 라이선스

MIT
