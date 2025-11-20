# Private API
사이트 내부에서 사용하는 API

## 목록 
### `POST` `/api/private/profile`
```ts
type Body = User.Profile;
```
프로필을 업데이트함.

### `POST `/api/private/start`
로그인이 되어 있는데 프로필이 없을 경우 프로필을 생성함.