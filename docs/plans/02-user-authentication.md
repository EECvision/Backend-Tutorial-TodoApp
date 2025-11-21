# User Authentication Implementation Plan

## Goal
Implement JWT-based user authentication to support multiple users with private todo lists.

## Current State
- Single todo list shared by everyone
- No user accounts
- No authentication

## Proposed Changes

### Dependencies
```bash
npm install bcrypt jsonwebtoken
```

### Database Schema

#### Create Users Table
Migration: `migrations/[timestamp]_create-users-table.js`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Link Todos to Users
Migration: `migrations/[timestamp]_add-user-id-to-todos.js`

**Important**: This will delete all existing todos.

```sql
DELETE FROM todos;
ALTER TABLE todos ADD COLUMN user_id INTEGER NOT NULL;
ALTER TABLE todos ADD CONSTRAINT fk_user 
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE;
```

### Authentication Middleware

Create `middleware/auth.js`:
- Extract JWT from `Authorization: Bearer <token>` header
- Verify JWT signature
- Attach user info to `req.user`
- Return 401 if invalid/missing

### API Changes

#### New Endpoints

**POST /auth/signup**
- Body: `{ username, password }`
- Hash password with bcrypt
- Create user in database
- Return user object (without password)

**POST /auth/login**
- Body: `{ username, password }`
- Verify credentials
- Generate JWT with user info
- Return `{ token }`

#### Protected Endpoints

Apply `auth` middleware to all `/todos` routes:
- `GET /todos` - Filter by `user_id`
- `POST /todos` - Set `user_id` from `req.user.id`
- `PUT /todos/:id` - Filter by `user_id`
- `DELETE /todos/:id` - Filter by `user_id`

### Swagger Documentation

Add `bearerAuth` security scheme:
```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

Document auth endpoints and protect todo endpoints.

## Security Considerations

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT signed with `JWT_SECRET` environment variable
- Token expiration: 1 hour
- No password stored in responses
- Foreign key with `ON DELETE CASCADE`

## Verification Plan

1. Create two users
2. Login as User A, create todo
3. Login as User B, verify empty todo list
4. Login as User A, verify todo exists
5. Test invalid tokens return 401

## Breaking Changes

⚠️ **All existing todos will be deleted** during migration.
