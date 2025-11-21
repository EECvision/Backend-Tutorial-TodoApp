# Admin Creation Refactor - Separate Endpoint

## Goal
Refactor admin creation to use a dedicated endpoint with header-based authentication instead of mixing concerns in the signup endpoint.

## Problem with Current Approach
The current `/auth/signup` endpoint:
- Handles both regular and admin user creation
- Mixes concerns (public signup + privileged admin creation)
- Requires conditional logic based on role field
- Confusing in API documentation

## Proposed Changes

### Revert POST /auth/signup
Simplify to only create regular users:
- Remove `role` field
- Remove `adminSecret` field
- Always create users with role='user'

### New Endpoint: POST /auth/admin/signup

**Headers**:
- `x-admin-secret`: Required, must match `ADMIN_SECRET` env var

**Body**:
```json
{
  "username": "admin_user",
  "password": "password"
}
```

**Logic**:
1. Check `req.headers['x-admin-secret']` === `process.env.ADMIN_SECRET`
2. If invalid, return 403
3. Create user with role='admin'

### Swagger Documentation

#### POST /auth/signup
```yaml
summary: Register a new user
security: []  # No auth required
requestBody:
  properties:
    username:
      type: string
    password:
      type: string
```

#### POST /auth/admin/signup
```yaml
summary: Register a new admin user
security: []  # No JWT, but requires header
parameters:
  - in: header
    name: x-admin-secret
    required: true
requestBody:
  properties:
    username:
      type: string
    password:
      type: string
responses:
  403:
    description: Invalid admin secret
```

## Benefits

1. **Separation of Concerns**: Clear distinction between user and admin signup
2. **Better Security**: Admin creation is explicitly separate
3. **Cleaner API**: No role field in public signup
4. **Industry Standard**: Header-based secrets common for admin operations
5. **Better Documentation**: Swagger shows clear difference

## Production Best Practices

This approach (header-based secret) is standard in production for:
- Service-to-service authentication
- CI/CD pipelines
- Admin provisioning
- Infrastructure automation

Alternative production approaches:
- OAuth2/OIDC for third-party integrations
- Service accounts seeded via database
- Infrastructure-as-Code (Terraform, CloudFormation)
- Secrets management (AWS Secrets Manager, Vault)

## Verification Plan

1. Test regular signup (should create user role)
2. Test admin signup without header (should return 403)
3. Test admin signup with wrong header (should return 403)
4. Test admin signup with correct header (should create admin)
