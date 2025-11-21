# Admin Feature Implementation Plan

## Goal
Add an admin role that can view all todos from all users.

## Proposed Changes

### Database Schema

#### Add Role Column
Migration: `migrations/[timestamp]_add-role-to-users.js`

```sql
ALTER TABLE users 
ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
```

### JWT Changes

Update `POST /auth/login` to include `role` in JWT payload:
```javascript
const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
);
```

### Admin Middleware

Create `middleware/admin.js`:
- Check `req.user.role === 'admin'`
- Return 403 Forbidden if not admin
- Must be used after `auth` middleware

### New Endpoint

**GET /admin/todos**
- Security: Requires `auth` + `admin` middleware
- Returns all todos from all users
- Include username via JOIN:
  ```sql
  SELECT t.*, u.username 
  FROM todos t 
  JOIN users u ON t.user_id = u.id
  ORDER BY t.created_at DESC
  ```

### Swagger Documentation

Add Admin tag and document:
- Security requirements (bearerAuth)
- 403 response for non-admins
- Response schema with username field

## Creating Admin Users

Initially, admin users must be created manually in the database:
```sql
UPDATE users SET role = 'admin' WHERE username = 'admin_username';
```

Future enhancement: Add admin signup endpoint with secret key.

## Verification Plan

1. Create regular user, verify role is 'user'
2. Manually promote user to admin in database
3. Login as admin, verify role in JWT
4. Test `/admin/todos` with admin token (should work)
5. Test `/admin/todos` with regular user token (should return 403)
