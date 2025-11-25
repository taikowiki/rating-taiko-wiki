# Public API
API intended for external use.

## List
### `POST` `/api/v1/rating/upload`
```ts
type Header = {
    Cookie: {
        // Authentication cookie used on the site
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
Uploads data for rating calculation.
The server calculates and updates the rating with the uploaded data.
If clearData exists, it updates the clearData in the taiko.wiki DB.
- Authentication
    - Responds with 403 if the user is not verified.
- Compression
    - LZUTF8 base64
