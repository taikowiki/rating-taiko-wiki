# Public API
외부에서 사용을 목적으로 한 API

## 목록
### `POST` `/api/v1/rating/upload`
```ts
type Header = {
    Cookie: {
        // 사이트에서 사용하는 인증 쿠키
        'auth-user': string;
    }
};
type Body = {
    taikoProfile: User.TaikoProfile;
    scoreData: User.ScoreData;
}
type ReturnBody = {
    currentRatingScore: number;
}
```
레이팅 계산을 위한 데이터를 업로드.
서버에서는 업로드한 데이터로 새로 레이팅을 계산하여 업데이트.
- 인증
    - 유저가 확인되지 않으면 403 응답
- 압축
    - LZUTF8 base64