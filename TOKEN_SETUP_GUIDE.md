# Monday.com API 토큰 설정 가이드

## 현재 문제

현재 토큰의 권한: `me:write` (자신의 사용자 정보만 수정 가능)

```json
{
  "tid": 580064378,
  "aai": 11,
  "uid": 74519333,
  "iad": "2025-10-29T13:45:32.000Z",
  "per": "me:write",  ← 이 권한으로는 보드 작업이 불가능
  "actid": 28962835,
  "rgn": "apse2"
}
```

## 필요한 권한

보드 워크플로우를 사용하려면 다음 권한(Scopes)이 필요합니다:

- ✅ `boards:read` - 보드 목록 조회 및 내용 읽기
- ✅ `boards:write` - 보드 생성, 수정, 아이템 추가
- ✅ `workspaces:read` - 워크스페이스 조회
- ✅ `users:read` - 사용자 정보 조회 (선택사항)

## 새 API 토큰 생성 방법

### 1. Monday.com에 로그인

웹 브라우저에서 https://monday.com 접속 후 로그인

### 2. Admin 페이지로 이동

1. 우측 상단의 프로필 아이콘 클릭
2. **Admin** 선택
3. 좌측 메뉴에서 **API** 선택

또는 직접 링크: https://[your-workspace].monday.com/admin/integrations/api

### 3. 새 Personal API Token 생성

**API v2 Token** 섹션에서:

1. **Generate** 또는 **Create Token** 버튼 클릭
2. 토큰 이름 입력 (예: "Board Workflow API")
3. **Scopes** 선택:
   ```
   ✓ boards:read
   ✓ boards:write
   ✓ workspaces:read
   ✓ users:read (선택사항)
   ```

### 4. 토큰 저장

1. **Generate Token** 클릭
2. 생성된 토큰 전체를 복사
3. `.env` 파일에 붙여넣기:
   ```bash
   MONDAY_API_TOKEN=your_new_token_here
   ```

⚠️ **중요**: 토큰은 생성 시 한 번만 표시됩니다. 반드시 안전한 곳에 저장하세요!

## 토큰 확인

새 토큰을 설정한 후 다음 명령어로 확인:

```bash
# 토큰 정보 디코딩
npx tsx src/decode-token.ts

# API 연결 테스트
npx tsx src/test-connection.ts
```

성공적으로 설정되면 다음과 같이 표시됩니다:

```
--- Permissions ---
Scopes: boards:read,boards:write,workspaces:read
```

## 워크플로우 실행

토큰이 올바르게 설정되면:

```bash
# 워크스페이스 및 보드 목록 조회
npm run dev

# 또는 샘플 보드 생성 (src/index.ts에서 주석 해제 필요)
npm run dev
```

## 문제 해결

### 여전히 403 에러가 발생하는 경우

1. **토큰이 완전히 복사되었는지 확인**
   - 토큰 끝에 공백이나 줄바꿈이 없는지 확인
   - 전체 토큰이 한 줄로 `.env`에 입력되었는지 확인

2. **권한이 올바르게 선택되었는지 확인**
   ```bash
   npx tsx src/decode-token.ts
   ```
   출력에서 `"per"` 필드를 확인

3. **토큰이 활성화되었는지 확인**
   - Monday.com Admin > API 페이지에서 토큰 상태 확인
   - 비활성화되거나 삭제된 토큰은 사용할 수 없음

4. **계정 권한 확인**
   - 워크스페이스에서 보드를 생성할 권한이 있는지 확인
   - 일부 워크스페이스는 관리자만 보드를 생성할 수 있음

### 만료 시간 확인

현재 토큰에는 만료 시간(`exp`)이 없어 무기한 사용 가능합니다.
새 토큰도 Personal API Token이면 만료되지 않습니다.

## OAuth Apps vs Personal API Token

### Personal API Token (권장)
- ✅ 영구적으로 사용 가능
- ✅ 간단한 설정
- ✅ 이 프로젝트에 적합

### OAuth Apps
- 여러 사용자가 사용하는 앱 개발 시 사용
- 토큰 갱신 필요
- 복잡한 설정

**이 프로젝트에는 Personal API Token을 사용하세요.**

## 참고 자료

- [Monday.com API Documentation](https://developer.monday.com/api-reference/docs)
- [API Token 생성 가이드](https://support.monday.com/hc/en-us/articles/360005144659)
- [API Scopes 설명](https://developer.monday.com/api-reference/docs/authentication#scopes)
