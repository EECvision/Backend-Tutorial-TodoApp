# Migration System Implementation Plan

## Goal
Set up a database migration system using `node-pg-migrate` to manage schema changes in a version-controlled way.

## Background
Currently, the application manually executes `schema.sql` on startup. This approach:
- Doesn't track migration history
- Can't be rolled back
- Doesn't support collaborative development
- Makes it hard to deploy schema changes

## Proposed Changes

### Dependencies
Install `node-pg-migrate`:
```bash
npm install node-pg-migrate
```

### Configuration

#### package.json
Add migration scripts:
```json
{
  "scripts": {
    "migrate:create": "node-pg-migrate create",
    "migrate:up": "node-pg-migrate up",
    "migrate:down": "node-pg-migrate down"
  }
}
```

### Initial Migration

Create initial migration to move `schema.sql` into migration format:
- Migration file: `migrations/[timestamp]_init-schema.js`
- Content: Create `todos` table with existing schema

### Code Changes

#### index.js
Remove:
- Manual `schema.sql` loading
- `fs` and `path` imports
- `startServer` function

The app will assume migrations have been run separately.

## Migration Workflow

1. **Create Migration**: `npm run migrate:create -- migration-name`
2. **Edit Migration**: Define `up` and `down` functions
3. **Apply Migration**: `npm run migrate:up`
4. **Rollback (if needed)**: `npm run migrate:down`

## Verification Plan

1. Run initial migration
2. Verify `todos` table exists
3. Start server successfully
4. Test CRUD operations

## Benefits

- **Version Control**: Each schema change is tracked
- **Rollback**: Can undo changes with `down` migrations
- **Collaboration**: Team members can share schema changes
- **Deployment**: Automated migration on deploy
- **History**: Complete audit trail of schema changes
