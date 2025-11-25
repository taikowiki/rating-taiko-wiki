# Public API
外部での使用を目的としたAPI

## 一覧
### `POST` `/api/v1/rating/upload`
```ts
type Header = {
    Cookie: {
        // サイトで使用する認証クッキー
        'auth-user': string;
    }
};
type Body = {
    taikoProfile: User.TaikoProfile;
    scoreData?: User.ScoreData;
    clearData?: ClearData[]; // from 'hiroba-js'
}
type ReturnBody = {
    currentRatingScore: number | null;
}
```
レーティング計算用のデータをアップロードします。
サーバーはアップロードされたデータで新しくレーティングを計算して更新します。
clearDataが存在する場合、taiko.wikiのDBにあるclearDataを更新します。
- 認証
    - ユーザーが確認できない場合は403で応答します。
- 圧縮
    - LZUTF8 base64
