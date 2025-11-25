# Private API
API used internally on the site.

## List
### `POST` `/api/private/profile`
```ts
type Body = User.Profile;
```
Updates the profile.

### `POST` `/api/private/start`
If the user is logged in but does not have a profile, it creates one.
