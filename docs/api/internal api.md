# Internal API
사이트들 간의 (taiko.wiki <-> rating.taiko.wiki) API

## Key
헤더로 `X-Internal-Key` 를 보내야함. 헤더가 없으면 401, 일치하지 않으면 403 코드로 응답.

## 목록
### `POST` `/api/internal/delete-user/`
```ts
type Body = {
    UUID: string
}
```
특정 유저를 삭제할 때 사용. DB에서 해당 유저와 관련된 모든 데이터 삭제.