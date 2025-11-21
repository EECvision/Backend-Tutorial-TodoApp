# MVC Refactoring Plan

## Goal
Refactor the growing `index.js` file into a well-organized MVC-like architecture for better maintainability and scalability.

## Current Problem
- `index.js` has grown to 600+ lines
- Mixing concerns: routes, controllers, business logic, DB queries, Swagger docs
- Hard to navigate and find specific features
- Difficult to test individual components
- Challenging for multiple developers to work without conflicts

## Architecture Overview

For REST APIs, we'll use a **Routes → Controllers → Services** pattern (a variation of MVC):

```
src/
├── config/             # Configuration files
│   └── swagger.js      # Swagger configuration
├── routes/             # Route definitions
│   ├── index.js        # Main router
│   ├── auth.routes.js  # Authentication routes
│   ├── todo.routes.js  # Todo routes
│   └── admin.routes.js # Admin routes
├── controllers/        # Request/Response handlers
│   ├── auth.controller.js
│   ├── todo.controller.js
│   └── admin.controller.js
├── services/           # Business logic & DB queries
│   ├── auth.service.js
│   ├── todo.service.js
│   └── user.service.js
├── middleware/         # Custom middleware (already exists)
│   ├── auth.js
│   └── admin.js
└── db/                 # Database configuration (already exists)
    └── index.js
```

## Layer Responsibilities

### Routes (`routes/`)
- Define HTTP endpoints (GET, POST, PUT, DELETE)
- Include Swagger/OpenAPI documentation
- Apply middleware (auth, validation, etc.)
- Delegate to controllers
- **No business logic or database queries**

### Controllers (`controllers/`)
- Handle HTTP requests and responses
- Extract data from req (body, params, query, headers)
- Call service layer methods
- Return appropriate HTTP status codes
- Handle errors and format responses
- **No business logic or database queries**

### Services (`services/`)
- Contain all business logic
- Interact with database
- Reusable across controllers
- Independent of HTTP layer
- Can be unit tested easily
- **This is where the "smarts" live**

### Configuration (`config/`)
- Application configuration
- Swagger/OpenAPI setup
- Environment-specific settings

## Proposed Changes

### [NEW] config/swagger.js
Extract Swagger configuration from `index.js`

### [NEW] services/auth.service.js
Functions:
- `createUser(username, password, role)` - Create user in DB
- `authenticateUser(username, password)` - Validate credentials & generate JWT

### [NEW] services/todo.service.js
Functions:
- `getUserTodos(userId)` - Get todos for a user
- `createTodo(userId, task, priority)` - Create todo
- `updateTodo(userId, todoId, updates)` - Update todo
- `deleteTodo(userId, todoId)` - Delete todo
- `getAllTodos()` - Get all todos (admin)

### [NEW] controllers/auth.controller.js
Functions:
- `signup(req, res)` - Handle user registration
- `adminSignup(req, res)` - Handle admin registration
- `login(req, res)` - Handle login

### [NEW] controllers/todo.controller.js
Functions:
- `getTodos(req, res)` - Get user's todos
- `createTodo(req, res)` - Create todo
- `updateTodo(req, res)` - Update todo
- `deleteTodo(req, res)` - Delete todo

### [NEW] controllers/admin.controller.js
Functions:
- `getAllTodos(req, res)` - Get all todos (admin)

### [NEW] routes/auth.routes.js
- `POST /auth/signup` + Swagger docs
- `POST /auth/admin/signup` + Swagger docs
- `POST /auth/login` + Swagger docs

### [NEW] routes/todo.routes.js
- `GET /todos` + Swagger docs
- `POST /todos` + Swagger docs
- `PUT /todos/:id` + Swagger docs
- `DELETE /todos/:id` + Swagger docs
- Apply `auth` middleware

### [NEW] routes/admin.routes.js
- `GET /admin/todos` + Swagger docs
- Apply `auth` and `admin` middleware

### [NEW] routes/index.js
Combine all route modules into main router

### [MODIFY] index.js
Simplify to:
- Load environment variables
- Create Express app
- Configure middleware (CORS, JSON)
- Mount routes
- Setup Swagger UI
- Start server

**Expected size: ~45 lines (down from 600+)**

## Benefits

### 1. Separation of Concerns
- Each file has one clear purpose
- Routes handle HTTP routing
- Controllers handle request/response
- Services handle business logic

### 2. Maintainability
- Easy to find any feature
- Changes are localized
- No "spaghetti code"
- Clear file structure

### 3. Testability
- Services can be unit tested (no HTTP)
- Controllers can be tested with mocked services
- Routes can be integration tested

### 4. Scalability
- Easy to add new features
- Multiple developers can work in parallel
- Clear where new code should go

### 5. Reusability
- Services can be called from anywhere
- Business logic not tied to HTTP
- Easy to add CLI, workers, cron jobs

### 6. Industry Standard
- Follows common Node.js/Express patterns
- Easy onboarding for new developers
- Familiar to most backend developers

## Migration Strategy

1. Create directory structure
2. Extract Swagger config
3. Create service layer (business logic + DB)
4. Create controller layer (request handlers)
5. Create route layer (endpoints + Swagger)
6. Refactor index.js
7. Test all endpoints
8. Run verification scripts

## Verification Plan

### Automated Tests
- Run existing verification scripts:
  - `verify-auth.js`
  - `verify-admin.js`
  - `verify-admin-refactor.js`

### Manual Verification
- Server starts without errors
- All routes respond correctly
- Swagger UI accessible at `/api-docs`
- Hot-reload works with nodemon

### Functionality Check
- User signup/login
- Todo CRUD operations
- Admin features
- Multi-user isolation

## Code Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| index.js lines | 600+ | ~45 | 92% reduction |
| Number of files | 1 | 11 | Better organization |
| Average file size | 600 | ~60 | Easier to understand |
| Concerns per file | Many | 1 | Clear responsibility |

## Next Steps (Future Enhancements)

After MVC refactoring, consider:
1. Add input validation (express-validator)
2. Add unit tests (Jest, Mocha)
3. Add error handling middleware
4. Add request logging (Winston, Pino)
5. Add data validation layer
6. Consider ORM (Sequelize, TypeORM)

## Non-Breaking Change

✅ This refactoring is **completely non-breaking**
- All endpoints remain the same
- All functionality preserved
- All tests should pass
- API contracts unchanged
