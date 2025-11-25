# Private API
サイト内部で使用するAPI

## 一覧
### `POST` `/api/private/profile`
```ts
type Body = User.Profile;
```
プロフィールを更新します。

### `POST` `/api/private/start`
ログインしているがプロフィールがない場合にプロフィールを作成します。
