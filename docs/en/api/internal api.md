# Internal API
API between sites (taiko.wiki <-> rating.taiko.wiki)

## Key
You must send `X-Internal-Key` as a header. Responds with code 401 if the header is missing, and 403 if it does not match.

## List
### `POST` `/api/internal/delete-user/`
```ts
type Body = {
    UUID: string;
}
```
Used to delete a specific user. Deletes all data related to the user from the DB.
