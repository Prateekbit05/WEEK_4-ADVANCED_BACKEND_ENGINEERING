## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Architecture Layers](#architecture-layers)
4. [Request Flow](#request-flow)
5. [Startup Sequence](#startup-sequence)
6. [Database Architecture](#database-architecture)
7. [Security Architecture](#security-architecture)
8. [Background Jobs Architecture](#background-jobs-architecture)
9. [Error Handling](#error-handling)
10. [Configuration Management](#configuration-management)

---

## Project Overview

### Technology Stack
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache/Queue**: Redis (BullMQ)
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest

### Architecture Pattern
**Layered Architecture**: Controller → Service → Repository → Model

### Key Features
- Professional layered architecture  
- Repository pattern for data access  
- Background job processing (BullMQ)  
- Comprehensive security (Helmet, CORS, Rate Limiting)  
- Request tracing with correlation IDs  
- Structured logging with Winston  
- Input validation with Joi  
- Soft delete support  
- Advanced query engine  

---

## Folder Structure

### Complete Project Structure

```
WEEK_4-ADVANCED_BACKEND_ENGINEERING/
└── backend-api/
    ├── logs/                                    # Application logs
    ├── node_modules/                            # Dependencies
    ├── src/                                     # Source code
    │   │
    │   ├── config/                              # Configuration
    │   │   ├── constants.js                     # App constants
    │   │   ├── database.js                      # Database config
    │   │   ├── index.js                         # Main config loader
    │   │   ├── redis.js                         # Redis config
    │   │   └── swagger.js                       # API documentation config
    │   │
    │   ├── controllers/                         # Request handlers
    │   │   ├── auth.controller.js               # Auth endpoints
    │   │   ├── product.controller.js            # Product CRUD
    │   │   └── user.controller.js               # User CRUD
    │   │
    │   ├── jobs/                                # Background jobs
    │   │   ├── processors/                      # Job processing logic
    │   │   │   └── email.processor.js           # Email processor
    │   │   ├── queues/                          # Queue definitions
    │   │   │   └── email.queue.js               # Email queue
    │   │   ├── schedulers/                      # Scheduled jobs
    │   │   │   └── cleanup.scheduler.js         # Cleanup tasks
    │   │   └── workers/                         # Worker processes
    │   │       └── email.worker.js              # Email worker
    │   │
    │   ├── loaders/                             # Application loaders
    │   │   ├── database.js                      # MongoDB connection
    │   │   ├── express.js                       # Express app setup
    │   │   ├── index.js                         # Main loader
    │   │   ├── mongoose.js                      # Mongoose config
    │   │   ├── redis.js                         # Redis connection
    │   │   └── routes.js                        # Route mounting
    │   │
    │   ├── middlewares/                         # Express middlewares
    │   │   ├── auth.js                          # JWT authentication
    │   │   ├── error.js                         # Global error handler
    │   │   ├── rateLimiter.js                   # Rate limiting
    │   │   ├── requestId.js                     # Correlation ID
    │   │   ├── requestLogger.js                 # Request logging
    │   │   ├── security.js                      # Security (helmet, etc.)
    │   │   └── validate.js                      # Input validation
    │   │
    │   ├── models/                              # Mongoose schemas
    │   │   ├── Product.js                       # Product model
    │   │   └── User.js                          # User model
    │   │
    │   ├── repositories/                        # Data access layer
    │   │   ├── base.repository.js               # Base CRUD operations
    │   │   ├── product.repository.js            # Product queries
    │   │   └── user.repository.js               # User queries
    │   │
    │   ├── routes/                              # API routes
    │   │   ├── auth.routes.js                   # /api/v1/auth
    │   │   ├── health.route.js                  # /api/v1/health
    │   │   ├── index.js                         # Route aggregator
    │   │   ├── product.route.js                 # /api/v1/products
    │   │   └── user.route.js                    # /api/v1/users
    │   │
    │   ├── services/                            # Business logic
    │   │   ├── auth.service.js                  # Authentication logic
    │   │   ├── email.service.js                 # Email operations
    │   │   ├── product.service.js               # Product business logic
    │   │   ├── queryBuilder.service.js          # Dynamic query builder
    │   │   └── user.service.js                  # User business logic
    │   │
    │   ├── utils/                               # Utility functions
    │   │   ├── errors.js                        # Custom error classes
    │   │   ├── jwt.js                           # JWT helpers
    │   │   ├── logger.js                        # Winston logger
    │   │   ├── morgan-stream.js                 # Morgan integration
    │   │   └── responses.js                     # Response formatters
    │   │
    │   ├── validations/                         # Joi schemas
    │   │   ├── auth.validation.js               # Auth validation
    │   │   ├── product.validation.js            # Product validation
    │   │   └── user.validation.js               # User validation
    │   │
    │   ├── app.js                               # Express application
    │   └── server.js                            # Server entry point
    │
    ├── tests/                                   # Test suites
    │   ├── integration/                         # Integration tests
    │   └── unit/                                # Unit tests
    │
    ├── .env.dev                                 # Development environment
    ├── .env.example                             # Environment template
    ├── .env.local                               # Local environment
    ├── .env.prod                                # Production environment
    ├── .gitignore                               # Git ignore rules
    ├── ARCHITECTURE.md                          # This file
    ├── Backend-API-Day3.postman_collection.json # Postman tests
    ├── create-test-user.js                      # Test data script
    ├── ecosystem.config.js                      # PM2 configuration
    ├── fix-slugs.js                             # Utility script
    ├── package.json                             # NPM dependencies
    ├── package-lock.json                        # Dependency lock
    ├── README.md                                # Project documentation
    ├── test-day2.js                             # Day 2 tests
    ├── test-email-job.js                        # Email job test
    └── test-products.js                         # Product test
```

---

## Architecture Layers

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              (Web, Mobile, Third-party APIs)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Helmet  │ │   CORS   │ │Rate Limit│ │   Auth   │       │
│  │ security │ │          │ │          │ │   JWT    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Sanitize  │ │ Validate │ │Request ID│ │  Logger  │       │
│  │XSS/NoSQL │ │   Joi    │ │Correlation│ │ Winston  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                              │
│        /api/v1/auth  |  /users  |  /products  |  /health    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                          │
│     (HTTP Request/Response Handling & Validation)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Auth Controller│  │User Controller│  │Product Ctrl │      │
│  │ - register   │  │ - getUsers    │  │ - getProducts│      │
│  │ - login      │  │ - getById     │  │ - create     │      │
│  │ - getMe      │  │ - update      │  │ - update     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                            │
│          (Business Logic & Data Orchestration)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Auth Service  │  │User Service  │  │Product Service│      │
│  │- Validation  │  │- CRUD logic  │  │- Query engine│      │
│  │- Token gen   │  │- Soft delete │  │- Filtering   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │QueryBuilder  │  │Email Service │                         │
│  │- Filter/Sort │  │- Send emails │                         │
│  └──────────────┘  └──────────────┘                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                           │
│           (Data Access & Database Operations)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Base Repo     │  │User Repo     │  │Product Repo  │      │
│  │- create()    │  │- findByEmail │  │- search()    │      │
│  │- findById()  │  │- credentials │  │- byCategory  │      │
│  │- paginated() │  │- lastLogin   │  │- featured    │      │
│  │- update()    │  │              │  │- updateStock │      │
│  │- delete()    │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      MODEL LAYER                             │
│         (Mongoose Schemas, Hooks, Validations)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  User Model                                          │   │
│  │  - Schema: email, password, role, status            │   │
│  │  - Hooks: hash password (pre-save)                  │   │
│  │  - Virtuals: fullName, isLocked                     │   │
│  │  - Methods: comparePassword, incLoginAttempts       │   │
│  │  - Indexes: email (unique), status+createdAt        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Product Model                                       │   │
│  │  - Schema: name, price, category, stock             │   │
│  │  - Hooks: generate SKU (pre-save)                   │   │
│  │  - Virtuals: isOnSale, discount, inStock            │   │
│  │  - Methods: updateStock, addRating, publish         │   │
│  │  - Indexes: category+status, price, text search     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│              MongoDB Atlas / Local MongoDB                   │
│                    Collections: users, products              │
└─────────────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────────┐
         │      BACKGROUND JOBS (Async)             │
         │  ┌────────────┐  ┌────────────┐         │
         │  │  Queues    │  │  Workers   │         │
         │  │ email.queue│  │email.worker│         │
         │  └────────────┘  └────────────┘         │
         │  ┌────────────┐  ┌────────────┐         │
         │  │ Processors │  │ Schedulers │         │
         │  │email.proc  │  │cleanup.sch │         │
         │  └────────────┘  └────────────┘         │
         │         (BullMQ + Redis)                 │
         └──────────────────────────────────────────┘
```

---

## Request Flow

### Complete Request Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│ 1. CLIENT REQUEST                                            │
│    POST /api/v1/products                                     │
│    Authorization: Bearer <token>                             │
│    Body: { name, price, category }                           │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. MIDDLEWARE PIPELINE (src/loaders/express.js)              │
│    ├─ helmet() → Security headers                            │
│    ├─ cors() → Cross-origin check                            │
│    ├─ rateLimiter → Check request count                      │
│    ├─ express.json() → Parse JSON body                       │
│    ├─ mongoSanitize() → Strip $ and . operators              │
│    ├─ xss() → Sanitize HTML/scripts                          │
│    ├─ hpp() → Prevent parameter pollution                    │
│    ├─ morgan → HTTP request logging                          │
│    └─ requestLogger → Add correlation ID (req.id)            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. ROUTE MATCHING (src/loaders/routes.js)                   │
│    /api/v1 → routes/index.js                                 │
│    /products → routes/product.route.js                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. ROUTE MIDDLEWARES (src/routes/product.route.js)          │
│    router.post('/',                                          │
│       protect,                    ← JWT authentication       │
│       restrictTo('admin'),        ← Role authorization       │
│       validate(productValidation),← Joi validation           │
│       createProduct               ← Controller               │
│    )                                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. CONTROLLER (src/controllers/product.controller.js)       │
│    export const createProduct = asyncHandler(async (req) => {│
│      const product = await productService.createProduct(     │
│        req.body                                              │
│      );                                                       │
│      successResponse(res, product, 'Created', 201);          │
│    });                                                        │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. SERVICE (src/services/product.service.js)                │
│    async createProduct(data) {                               │
│      // Business logic validation here                       │
│      return await productRepository.create(data);            │
│    }                                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. REPOSITORY (src/repositories/product.repository.js)      │
│    async create(data) {                                      │
│      return await this.model.create(data);                   │
│    }                                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 8. MODEL (src/models/Product.js)                            │
│    Pre-save hooks execute:                                   │
│    - Generate SKU if missing                                 │
│    - Validate comparePrice                                   │
│    - Set publishedAt if active                               │
│                                                               │
│    Schema validation:                                        │
│    - Check required fields                                   │
│    - Validate data types                                     │
│    - Check constraints (min, max, enum)                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 9. DATABASE (MongoDB)                                        │
│    - Insert document into products collection                │
│    - Apply indexes                                           │
│    - Return created document                                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 10. RESPONSE FLOW (Reverse direction)                       │
│     Database → Model → Repository → Service → Controller     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 11. RESPONSE FORMATTING (src/utils/responses.js)            │
│     {                                                         │
│       "success": true,                                       │
│       "message": "Product created successfully",             │
│       "data": { ...product },                                │
│       "timestamp": "2025-02-04T12:00:00.000Z"               │
│     }                                                         │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 12. LOGGING (Winston)                                       │
│     logger.http('Request completed', {                       │
│       requestId: req.id,                                     │
│       statusCode: 201,                                       │
│       duration: '45ms'                                       │
│     });                                                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 13. CLIENT RESPONSE                                          │
│     HTTP/1.1 201 Created                                     │
│     X-Request-ID: 7f3b9c2a-...                              │
│     { success: true, data: {...} }                           │
└──────────────────────────────────────────────────────────────┘
```

### Error Flow (if error occurs)

```
Error occurs at any layer
         ↓
Caught by asyncHandler OR Express error handler
         ↓
Passed to Global Error Middleware (src/middlewares/error.js)
         ↓
Error classified & logged
         ↓
Formatted error response sent to client
```

---

## Startup Sequence

### Application Bootstrap Process

```
1. START: node src/server.js
   │
   ├─ Load environment variables (.env.local/.env.dev/.env.prod)
   ├─ Initialize logger (src/utils/logger.js)
   └─ Start startup sequence
   │
   ▼
2. LOADERS EXECUTION (src/loaders/index.js)
   │
   ├─ [Loader 1] Database Connection (src/loaders/database.js)
   │  ├─ Connect to MongoDB
   │  ├─ Set up event handlers (error, disconnected)
   │  └─ Log: "✔ MongoDB Connected: <host>"
   │
   ├─ [Loader 2] Redis Connection (src/loaders/redis.js)
   │  ├─ Connect to Redis
   │  └─ Log: "✔ Redis Connected"
   │
   ├─ [Loader 3] Express App (src/loaders/express.js)
   │  ├─ Load security middlewares
   │  │  ├─ Helmet
   │  │  ├─ CORS
   │  │  └─ Rate limiter
   │  ├─ Load body parsers
   │  ├─ Load sanitization middlewares
   │  │  ├─ mongo-sanitize
   │  │  ├─ xss-clean
   │  │  └─ hpp
   │  ├─ Load logging middlewares
   │  │  ├─ Morgan
   │  │  └─ Request logger
   │  └─ Log: "✔ Middlewares loaded"
   │
   ├─ [Loader 4] Routes (src/loaders/routes.js)
   │  ├─ Mount /api/v1/auth → auth.routes.js
   │  ├─ Mount /api/v1/users → user.route.js
   │  ├─ Mount /api/v1/products → product.route.js
   │  ├─ Mount /api/v1/health → health.route.js
   │  └─ Log: "✔ Routes mounted: 4 route groups"
   │
   └─ [Loader 5] Error Handlers
      ├─ 404 handler
      ├─ Global error middleware
      └─ Log: "✔ Error handlers configured"
   │
   ▼
3. START HTTP SERVER
   │
   ├─ app.listen(PORT)
   └─ Log:
      ========================================
      ✔ Server started on port 5000
      ✔ Environment: development
      ✔ Database connected
      ✔ Middlewares loaded
      ✔ Routes mounted: 23 endpoints
      ========================================
   │
   ▼
4. BACKGROUND WORKERS (Optional)
   │
   ├─ Start email worker (src/jobs/workers/email.worker.js)
   └─ Log: "✔ Email worker started"
   │
   ▼
5. GRACEFUL SHUTDOWN HANDLERS
   │
   ├─ Register SIGTERM handler
   ├─ Register SIGINT handler
   ├─ Register unhandledRejection handler
   ├─ Register uncaughtException handler
   └─ Log: "✔ Shutdown handlers configured"
   │
   ▼
6. READY TO ACCEPT CONNECTIONS 
```

### Console Output Example

```bash
2025-02-05 12:00:00 [INFO]: ========================================
2025-02-05 12:00:00 [INFO]: Starting Backend API Server...
2025-02-05 12:00:00 [INFO]: ========================================
2025-02-05 12:00:00 [INFO]: [1/5] Loading environment: development
2025-02-05 12:00:00 [INFO]: ✔ Environment loaded
2025-02-05 12:00:00 [INFO]: [2/5] Connecting to database...
2025-02-05 12:00:01 [INFO]: ✔ MongoDB Connected: cluster0.mongodb.net
2025-02-05 12:00:01 [INFO]: ✔ Database Name: backend-api
2025-02-05 12:00:01 [INFO]: [3/5] Loading middlewares...
2025-02-05 12:00:01 [INFO]: ✔ Helmet configured
2025-02-05 12:00:01 [INFO]: ✔ CORS configured
2025-02-05 12:00:01 [INFO]: ✔ Rate limiting active
2025-02-05 12:00:01 [INFO]: ✔ Body parsers configured
2025-02-05 12:00:01 [INFO]: ✔ Sanitization active
2025-02-05 12:00:01 [INFO]: ✔ Logging configured
2025-02-05 12:00:01 [INFO]: [4/5] Mounting routes...
2025-02-05 12:00:01 [INFO]: ✔ Routes mounted: /api/v1
2025-02-05 12:00:01 [INFO]: [5/5] Configuring error handlers...
2025-02-05 12:00:01 [INFO]: ✔ Error handlers configured
2025-02-05 12:00:01 [INFO]: ========================================
2025-02-05 12:00:01 [INFO]: ✔ Server started on port 5000
2025-02-05 12:00:01 [INFO]: ✔ Environment: development
2025-02-05 12:00:01 [INFO]: ✔ API Base URL: http://localhost:5000/api/v1
2025-02-05 12:00:01 [INFO]: ✔ Health Check: http://localhost:5000/health
2025-02-05 12:00:01 [INFO]: ========================================
```

---

## Database Architecture

### MongoDB Schema Design

#### User Collection

```javascript
// src/models/User.js
{
  firstName: String (required, max 50),
  lastName: String (required, max 50),
  email: String (required, unique, lowercase),
  password: String (required, min 6, select: false),
  role: String (enum: user/admin/moderator, default: user),
  status: String (enum: active/inactive/suspended, default: active),
  avatar: String (nullable),
  emailVerified: Boolean (default: false),
  lastLogin: Date,
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  deletedAt: Date (soft delete),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `{ email: 1 }` - Unique, for login lookups
- `{ status: 1, createdAt: -1 }` - Compound, for queries
- `{ deletedAt: 1 }` - Sparse, for soft delete filtering
- Text index on firstName, lastName, email - For search

**Hooks**:
- `pre('save')` - Hash password with bcrypt before saving
- `pre('save')` - Set emailVerified to false if email changes
- `post('save')` - Log user creation
- `pre(/^find/)` - Exclude soft-deleted by default

**Virtuals**:
- `fullName` - Computed from firstName + lastName
- `isLocked` - Check if account locked
- `isDeleted` - Check if soft-deleted

**Methods**:
- `comparePassword(candidatePassword)` - Compare hashed password
- `incLoginAttempts()` - Increment failed login attempts
- `resetLoginAttempts()` - Reset attempts after successful login

---

#### Product Collection

```javascript
// src/models/Product.js
{
  name: String (required, max 100),
  description: String (required, max 2000),
  price: Number (required, min 0),
  comparePrice: Number (min 0, nullable),
  category: String (required, enum),
  tags: [String],
  brand: String,
  sku: String (unique, sparse, uppercase),
  stock: Number (default: 0, min 0),
  images: [{
    url: String,
    alt: String
  }],
  ratings: {
    average: Number (0-5, default: 0),
    count: Number (default: 0)
  },
  status: String (enum: draft/active/archived, default: draft),
  featured: Boolean (default: false),
  publishedAt: Date,
  deletedAt: Date,
  metadata: Map,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ status: 1, createdAt: -1 }` - Common queries
- `{ price: 1 }` - Price range queries
- `{ category: 1, status: 1 }` - Category filtering
- `{ featured: 1, status: 1, createdAt: -1 }` - Featured products
- Text index on name, description, tags, brand (weighted) - Search
- `{ deletedAt: 1 }` - Sparse, soft deletes

**Hooks**:
- `pre('save')` - Auto-generate SKU if not provided
- `pre('save')` - Validate comparePrice > price
- `pre('save')` - Set publishedAt when status becomes active
- `post('save')` - Log product creation
- `pre(/^find/)` - Exclude soft-deleted by default

**Virtuals**:
- `isOnSale` - comparePrice exists and > price
- `discount` - Calculate discount percentage
- `inStock` - stock > 0
- `isPublished` - status === active && publishedAt exists
- `isDeleted` - deletedAt exists

**Methods**:
- `updateStock(quantity)` - Add/subtract stock
- `addRating(rating)` - Update average rating
- `publish()` - Set status to active
- `archive()` - Set status to archived

**Statics**:
- `findByCategory(category)` - Get products by category
- `findFeatured(limit)` - Get featured products
- `search(query)` - Full-text search
- `softDelete(id)` - Soft delete product
- `restore(id)` - Restore soft-deleted product
- `getPriceStats(category)` - Aggregation for price statistics

---

### Database Connection Configuration

```javascript
// src/loaders/database.js
mongoose.connect(config.database.uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Connection events
mongoose.connection.on('error', (err) => logger.error(err));
mongoose.connection.on('disconnected', () => logger.warn('Disconnected'));
mongoose.connection.on('reconnected', () => logger.info('Reconnected'));
```

---

## Security Architecture

### Multi-Layer Security Strategy

#### Layer 1: Network Security
```javascript
// src/middlewares/security.js
- Rate Limiting: 100 requests/15 minutes (global)
- Auth Rate Limiting: 5 requests/15 minutes (login endpoints)
- IP Whitelisting: Optional for admin endpoints
- Request Size Limits: 10MB max
```

#### Layer 2: Application Security
```javascript
// src/loaders/express.js
- Helmet: Security HTTP headers
- CORS: Controlled cross-origin access
- XSS Protection: xss-clean middleware
- NoSQL Injection: express-mongo-sanitize
- Parameter Pollution: hpp middleware
```

#### Layer 3: Authentication & Authorization
```javascript
// src/middlewares/auth.js
- JWT Tokens: HS256 algorithm, 7-day expiry
- Password Hashing: bcrypt with 10 salt rounds
- Account Lockout: 5 failed attempts → 2-hour lock
- Role-Based Access: user, admin, moderator roles
```

#### Layer 4: Data Security
```javascript
// src/models/User.js, Product.js
- Password Field: select: false (never returned)
- Input Validation: Joi schemas on all inputs
- Soft Deletes: Audit trail preservation
- Sensitive Data: Sanitized in logs
```

### Security Middleware Stack

```javascript
// Execution order in src/loaders/express.js
app.use(helmet());              // 1. Security headers
app.use(cors(config.cors));     // 2. CORS policy
app.use(rateLimiter);           // 3. Rate limiting
app.use(express.json());        // 4. Parse JSON
app.use(mongoSanitize());       // 5. NoSQL injection
app.use(xss());                 // 6. XSS protection
app.use(hpp());                 // 7. Parameter pollution
app.use(requestLogger);         // 8. Request tracking
```

---

## Background Jobs Architecture

### BullMQ Job System

```
┌─────────────────────────────────────────────────────┐
│              REDIS (Message Broker)                 │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Email Queue  │  │ Report Queue │                │
│  │ - Priority 1 │  │ - Priority 2 │                │
│  └──────────────┘  └──────────────┘                │
└──────────────┬──────────────────────────────────────┘
               │
               ├─────────────┐
               │             │
               ▼             ▼
    ┌─────────────┐   ┌─────────────┐
    │Email Worker │   │Report Worker│
    │  (src/jobs/ │   │  (src/jobs/ │
    │   workers/) │   │   workers/) │
    └──────┬──────┘   └──────┬──────┘
           │                  │
           ▼                  ▼
    ┌─────────────┐   ┌─────────────┐
    │Email        │   │Report       │
    │Processor    │   │Processor    │
    │(src/jobs/   │   │(src/jobs/   │
    │processors/) │   │processors/) │
    └─────────────┘   └─────────────┘
```

### Email Job Implementation

```javascript
// src/jobs/queues/email.queue.js
export const addEmailJob = async (emailData) => {
  const job = await emailQueue.add('send-email', emailData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    priority: emailData.priority || 1,
  });
  return job;
};

// src/jobs/workers/email.worker.js
const worker = new Worker('email', async (job) => {
  logger.info(`Processing email job: ${job.id}`);
  await sendEmail(job.data);
}, {
  connection: redisConfig,
  concurrency: 5,
});

// src/jobs/processors/email.processor.js
export const sendEmail = async (data) => {
  const { to, subject, body } = data;
  // Send email using SendGrid/Mailgun/etc
  logger.info(`Email sent to ${to}`);
};
```

### Job Features

- **Retry Logic**: 3 attempts with exponential backoff
- **Priority Queue**: High-priority emails processed first
- **Concurrency**: 5 concurrent email sends
- **Job Persistence**: Jobs saved in Redis
- **Monitoring**: Job events logged
- **Cleanup**: Auto-remove completed/failed jobs

---

## Error Handling

### Error Class Hierarchy

```
Error (Native JavaScript Error)
  │
  └─ AppError (src/utils/errors.js)
      ├─ ValidationError (400) - Input validation failures
      ├─ UnauthorizedError (401) - Authentication failures
      ├─ ForbiddenError (403) - Authorization failures
      ├─ NotFoundError (404) - Resource not found
      ├─ ConflictError (409) - Duplicate resources
      └─ TooManyRequestsError (429) - Rate limit exceeded
```

### Global Error Handler

```javascript
// src/middlewares/error.js
export const errorMiddleware = (err, req, res, next) => {
  // Log error with Winston
  logger.error('Error occurred', {
    requestId: req.id,
    error: err.message,
    stack: err.stack,
  });

  // Handle specific error types
  if (err.name === 'CastError') {
    err = new NotFoundError('Resource');
  }
  if (err.code === 11000) {
    err = new ConflictError('Duplicate field value');
  }
  if (err.name === 'ValidationError') {
    err = new ValidationError('Validation failed');
  }

  // Send formatted error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    requestId: req.id,
    ...(config.env === 'development' && { stack: err.stack }),
  });
};
```

### AsyncHandler Wrapper

```javascript
// src/middlewares/error.js
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage in controllers
export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  successResponse(res, products);
});
```

---

## Configuration Management

### Environment-Based Configuration

```javascript
// src/config/index.js
const ENV = process.env.NODE_ENV || 'development';

// Load appropriate .env file
const envFile = {
  production: '.env.prod',
  development: '.env.dev',
  test: '.env.test',
  local: '.env.local'
}[ENV] || '.env.local';

dotenv.config({ path: envFile });

export default {
  env: ENV,
  port: parseInt(process.env.PORT || '5000'),
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};
```

### Configuration Validation

```javascript
// Required in production
if (ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'REDIS_HOST'];
  for (const envVar of required) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required env var: ${envVar}`);
    }
  }
}
```

---

## Logging & Monitoring

### Winston Logger Configuration

```javascript
// src/utils/logger.js
const logger = winston.createLogger({
  level: config.logs.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}]`;
      if (requestId) log += ` [${requestId}]`;
      log += `: ${message}`;
      if (Object.keys(meta).length) log += ` ${JSON.stringify(meta)}`;
      return log;
    })
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});
```

### Request Correlation

```javascript
// src/middlewares/requestLogger.js
export const requestLogger = (req, res, next) => {
  // Generate unique ID for request
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  
  // Log all requests with this ID
  logger.http('Request received', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
  });
  
  next();
};
```

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/                          # Unit tests
│   ├── services/                  # Service layer tests
│   │   ├── auth.service.test.js
│   │   ├── product.service.test.js
│   │   └── user.service.test.js
│   ├── repositories/              # Repository tests
│   └── utils/                     # Utility function tests
│
└── integration/                   # Integration tests
    └── api/                       # API endpoint tests
        ├── auth.test.js
        ├── products.test.js
        └── users.test.js
```

### Test Scripts

```javascript
// package.json
{
  "scripts": {
    "test": "jest --coverage",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:watch": "jest --watch"
  }
}
```

---

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Compound indexes for common query patterns
- Sparse indexes for optional fields
- Text indexes for search functionality
- Connection pooling (Mongoose default)

### Query Optimization
- Field selection with `.select()`
- Pagination to limit results
- Lean queries when virtuals not needed
- Query result caching (future: Redis)

### Application Performance
- Async/await for non-blocking operations
- Background jobs for heavy tasks
- Compression middleware (future)
- Response caching (future: Redis)

---

## Deployment Architecture

### Production Deployment

```
                    [Load Balancer]
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    [Instance 1]      [Instance 2]      [Instance 3]
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         [MongoDB Atlas]           [Redis Cloud]
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'backend-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    autorestart: true,
    max_memory_restart: '500M',
  }]
};
```

---

## Key Architectural Decisions

### 1. **Layered Architecture**
- **Why**: Separation of concerns, testability, maintainability
- **Benefit**: Easy to modify one layer without affecting others

### 2. **Repository Pattern**
- **Why**: Abstract data access, easier to switch databases
- **Benefit**: Testable, reusable query logic

### 3. **Soft Deletes**
- **Why**: Audit trail, data recovery, compliance
- **Benefit**: Can restore deleted data, maintain referential integrity

### 4. **JWT Authentication**
- **Why**: Stateless, scalable, works across services
- **Benefit**: No server-side session storage needed

### 5. **Background Jobs (BullMQ)**
- **Why**: Async processing, retry logic, scalability
- **Benefit**: Don't block API responses, handle failures gracefully

### 6. **Structured Logging**
- **Why**: Debugging, monitoring, compliance
- **Benefit**: Request tracing, error tracking, audit logs

### 7. **Environment-Based Config**
- **Why**: Different settings for dev/staging/production
- **Benefit**: Easy deployment, security (secrets in env vars)

---

## Future Enhancements

### Planned Features
- [ ] Redis caching layer
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Event-driven architecture
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] APM integration (New Relic/DataDog)
- [ ] Automated API documentation (Swagger)
- [ ] Real-time features (WebSockets)

---

## Conclusion

This architecture provides:

**Scalability** - Horizontal scaling with stateless design  
**Maintainability** - Clean code, separation of concerns  
**Security** - Multi-layer defense strategy  
**Performance** - Optimized queries, background jobs  
**Reliability** - Error handling, logging, monitoring  
**Testability** - Each layer independently testable  
**Professional** - Industry-standard patterns and practices  
