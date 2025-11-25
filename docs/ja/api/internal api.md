# Internal API
サイト間のAPI (taiko.wiki <-> rating.taiko.wiki)

## キー
ヘッダーとして `X-Internal-Key` を送信する必要があります。ヘッダーがない場合は401、一致しない場合は403コードで応答します。

## 一覧
### `POST` `/api/internal/delete-user/`
```ts
type Body = {
    UUID: string;
}
```
特定のユーザーを削除するために使用します。DBからそのユーザーに関連するすべてのデータを削除します。
