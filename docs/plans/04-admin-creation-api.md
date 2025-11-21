# Admin User Creation via API

## Goal
Enable creation of admin users through the API (specifically for Swagger testing) with proper security.

## Security Approach

Use an `ADMIN_SECRET` environment variable to gate admin creation.

### Configuration
Add to `.env`:
```
ADMIN_SECRET=super_secret_admin_key
```

### API Changes

#### Update POST /auth/signup

Accept optional fields:
- `role`: 'user' or 'admin'
- `adminSecret`: Secret key for admin creation

**Logic**:
```javascript
if (role === 'admin') {
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return 403 Forbidden
    }
}
const userRole = role === 'admin' ? 'admin' : 'user';
// Create user with userRole
```

### Swagger Documentation

Update `/auth/signup` schema:
```yaml
properties:
  username:
    type: string
  password:
    type: string
  role:
    type: string
    enum: [user, admin]
  adminSecret:
    type: string
```

Add response codes:
- 403: Invalid admin secret

## Security Considerations

- Admin secret stored in environment variable
- Not exposed in error messages
- Regular users cannot elevate to admin without secret
- Secret should be rotated regularly in production

## Verification Plan

1. Create user without role → should be 'user'
2. Create admin without adminSecret → should return 403
3. Create admin with wrong adminSecret → should return 403
4. Create admin with correct adminSecret → should succeed with role='admin'
