# Feature-Based MVC Architecture Documentation

This project follows a **Feature-Based MVC Architecture** where each feature is completely independent with its own MVC structure. The architecture is designed to separate concerns and provide a clean, maintainable, and scalable codebase.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              FEATURE-BASED MVC STRUCTURE                │
│                                                         │
│  Each Feature Contains:                                │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐        │
│  │  Models  │  │ Controllers  │  │  Views   │        │
│  │ (Data)   │  │ (Logic)      │  │  (UI)    │        │
│  └──────────┘  └──────────────┘  └──────────┘        │
│       ↓              ↓                  ↓              │
│  ┌──────────────────────────────────────────┐         │
│  │         Services (Business Logic)        │         │
│  └──────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              SHARED RESOURCES                           │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐        │
│  │  Base    │  │ Repositories │  │ Components│        │
│  │ Classes  │  │ (Data Access)│  │ (Shared) │        │
│  └──────────┘  └──────────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              FIREBASE SERVICES                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐        │
│  │   Auth   │  │  Firestore   │  │ Storage  │        │
│  │  Service │  │   Service    │  │ Service  │        │
│  └──────────┘  └──────────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── models/            # User model
│   │   ├── views/             # LoginView.vue
│   │   ├── controllers/       # AuthController, AuthViewController
│   │   ├── services/          # UserService (business logic)
│   │   └── routes/            # Auth routes
│   │
│   ├── home/                   # Home page feature
│   │   ├── models/            # HomeContent model
│   │   ├── views/             # HomeView.vue
│   │   ├── controllers/       # HomeContentController, HomeViewController, etc.
│   │   ├── services/          # HomeContentService, WhatsAppService
│   │   └── routes/            # Home routes
│   │
│   ├── dashboard/             # User dashboard feature
│   │   ├── views/             # DashboardView.vue
│   │   └── routes/            # Dashboard routes
│   │
│   └── admin/                 # Admin dashboard feature
│       ├── models/            # Role, ActivityLog, SiteSettings
│       ├── views/             # AdminDashboardView.vue
│       ├── controllers/       # UserController, RoleController, etc.
│       ├── services/          # UserService, RoleService, etc.
│       └── routes/            # Admin routes
│
├── shared/                     # Shared resources
│   ├── components/            # NavigationBar, HelloWorld, icons
│   ├── repositories/          # BaseRepository, UserRepository, etc.
│   ├── BaseModel.ts          # Base model class
│   ├── BaseController.ts     # Base business controller
│   ├── BaseViewController.ts # Base view controller
│   └── BaseService.ts        # Base service class
│
├── shared/                     # Shared resources
│   ├── components/            # NavigationBar, HelloWorld, icons
│   ├── repositories/          # BaseRepository, UserRepository, etc.
│   ├── services/              # Infrastructure services (Firebase)
│   │   ├── config.ts
│   │   ├── authService.ts
│   │   ├── firestoreService.ts
│   │   └── storageService.ts
│   ├── BaseModel.ts
│   ├── BaseController.ts
│   ├── BaseViewController.ts
│   └── BaseService.ts
│
├── router/                     # Vue Router configuration
└── assets/                     # CSS and static assets
```

## MVC Pattern in Each Feature

Each feature follows the MVC pattern with clear separation and **complete independence**:

### Feature Independence Principle
- ✅ Each feature has its own **Models, Views, Controllers, and Services**
- ✅ Services are **self-contained** within each feature
- ✅ Services use **shared repositories** (not other features' services)
- ✅ Services use **Firebase services** (infrastructure)
- ✅ No cross-feature service dependencies

### 1. Models (`models/`)
**Purpose**: Data structures and domain models

- Define data structures
- Handle data validation
- Convert between formats (Firestore, API, etc.)
- Extend `BaseModel` for common functionality

**Example**: `features/auth/models/User.ts`
```typescript
export class User extends Model implements UserData {
  email: string
  displayName?: string
  role?: string
  // ...
}
```

### 2. Views (`views/`)
**Purpose**: Vue components that render the UI

- Present data to users
- Handle user interactions
- Use View Controllers for logic
- Receive data from View Controllers

**Example**: `features/auth/views/LoginView.vue`
```vue
<template>
  <form @submit.prevent="handleLogin">
    <!-- Form UI -->
  </form>
</template>

<script setup lang="ts">
import { AuthViewController } from '../controllers/AuthViewController'
const viewController = new AuthViewController()
</script>
```

### 3. Controllers (`controllers/`)
**Purpose**: Handle business logic and orchestration

There are two types of controllers:

#### View Controllers (Presentation Layer)
- Extend `BaseViewController`
- Manage view state (loading, errors)
- Handle user interactions
- Call Business Controllers

**Example**: `features/auth/controllers/AuthViewController.ts`
```typescript
export class AuthViewController extends BaseViewController {
  async login(email: string, password: string): Promise<boolean> {
    this.setLoading(true)
    const result = await authController.login(email, password)
    // Handle result...
  }
}
```

#### Business Controllers (Business Layer)
- Extend `BaseController`
- Orchestrate Services
- Handle business logic flow
- Return standardized responses `{ success, data, error }`

**Example**: `features/auth/controllers/AuthController.ts`
```typescript
export class AuthController extends BaseController {
  async login(email: string, password: string) {
    try {
      const credential = await this.userService.login(email, password)
      return this.success(credential)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
```

### 4. Services (`services/`)
**Purpose**: Business logic implementation

**Key Principles**:
- ✅ **Self-contained**: Each feature's services are within that feature
- ✅ **No cross-feature dependencies**: Services don't import from other features' services
- ✅ **Use repositories**: Access data through shared repositories
- ✅ **Use Firebase services**: For external operations (auth, firestore, storage)

**What Services Can Use**:
- ✅ Shared repositories (`shared/repositories/`)
- ✅ Infrastructure services (`shared/services/` - Firebase)
- ✅ Shared base classes (`shared/BaseService.ts`)
- ✅ Their own feature's models
- ❌ Other features' services (use repositories instead)

**Example**: `features/auth/services/UserService.ts`
```typescript
export class UserService extends BaseService {
  private userRepository: UserRepository  // Shared repository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  async register(email: string, password: string): Promise<UserCredential> {
    // Validate
    if (!this.validate(email)) throw new Error('Email required')
    
    // Business logic - use Firebase service directly
    const credential = await authService.signUp(email, password)
    
    // Use repository for data access
    await this.userRepository.create(userData)
    
    return credential
  }
}
```

**Example**: `features/home/services/HomeContentService.ts`
```typescript
export class HomeContentService extends BaseService {
  private userRepository: UserRepository           // Shared repository
  private activityLogRepository: ActivityLogRepository  // Shared repository

  constructor() {
    super()
    this.userRepository = new UserRepository()
    this.activityLogRepository = new ActivityLogRepository()
  }

  async updateHomeContent(content: Partial<HomeContent>, userId?: string) {
    // Use repositories directly, not other features' services
    if (userId) {
      const user = await this.userRepository.findById(userId)
      const log = new ActivityLog({ /* ... */ })
      await this.activityLogRepository.create(log)
    }
  }
}
```

## Data Flow

### Example: User Login Flow

```
1. User clicks "Login" in LoginView.vue (View)
   ↓
2. LoginView calls AuthViewController.login() (View Controller)
   ↓
3. AuthViewController calls AuthController.login() (Business Controller)
   ↓
4. AuthController calls UserService.login() (Service)
   ↓
5. UserService calls authService.signIn() (Firebase Service)
   ↓
6. UserService calls UserRepository.findById() (Repository)
   ↓
7. Repository calls firestoreService.getDocument() (Firebase Service)
   ↓
8. Firebase Backend
```

Response flows back through the same layers in reverse.

## Service Layer Architecture

### Base Service (`shared/BaseService.ts`)

All services extend `BaseService` which provides:

- **Validation**: `validate(data)` - Check if data is valid
- **Error Handling**: `handleError(error)` - Consistent error handling

### Service Responsibilities

1. **Business Logic**: Implement business rules
2. **Validation**: Validate input data
3. **Data Transformation**: Transform data between layers
4. **Orchestration**: Coordinate between repositories and external services
5. **Error Handling**: Handle and transform errors

### Service Examples

#### Auth Service (`features/auth/services/UserService.ts`)
- User registration
- User login/logout
- User profile management
- Admin checks

#### Home Content Service (`features/home/services/HomeContentService.ts`)
- Get home content
- Update home content
- Reset to defaults
- Activity logging

#### Admin Services (`features/admin/services/`)
- User management (create, update, delete)
- Role management
- Activity logging
- Site settings

## Repository Layer (Data Access)

Repositories are in `shared/repositories/` and handle:

- **CRUD Operations**: Create, Read, Update, Delete
- **Data Access**: Abstract Firestore operations
- **Model Conversion**: Convert between Firestore and domain models

**Example**: `shared/repositories/UserRepository.ts`
```typescript
export class UserRepository extends BaseRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    // Query logic
  }
}
```

## Shared Resources

### Base Classes
- `BaseModel`: Common model functionality
- `BaseController`: Business controller base
- `BaseViewController`: View controller base
- `BaseService`: Service base class
- `BaseRepository`: Repository base class

### Components
- `NavigationBar`: Shared navigation component
- Other shared UI components

## Best Practices

### 1. Feature Independence
- Each feature is completely self-contained
- Features communicate through shared services/repositories
- No direct dependencies between features

### 2. Controller Types
- **View Controllers**: Handle UI state and user interactions
- **Business Controllers**: Orchestrate services and handle business flow

### 3. Service Layer
- Services contain business logic
- Services use repositories for data access
- Services use Firebase services for external operations
- Services handle validation and error transformation

### 4. Error Handling
- Controllers return `{ success, data, error }` format
- Services throw errors (caught by controllers)
- View Controllers manage error state for UI

### 5. Type Safety
- Use TypeScript types throughout
- Export types from service files when needed
- Use `type` imports for type-only imports

## Adding a New Feature

To add a new feature (e.g., "products"):

1. **Create feature structure**:
   ```
   src/features/products/
   ├── models/Product.ts
   ├── views/ProductView.vue
   ├── controllers/ProductController.ts, ProductViewController.ts
   ├── services/ProductService.ts
   └── routes/index.ts
   ```

2. **Create Model**: Extend `BaseModel`
3. **Create Service**: Extend `BaseService`, use repositories
4. **Create Controllers**: 
   - Business Controller extends `BaseController`
   - View Controller extends `BaseViewController`
5. **Create View**: Vue component using View Controller
6. **Create Routes**: Add routes to router
7. **Create Repository** (if needed): In `shared/repositories/`

## Benefits

1. **Separation of Concerns**: Clear boundaries between layers
2. **Feature Independence**: Each feature is self-contained
3. **Testability**: Each layer can be tested independently
4. **Maintainability**: Easy to locate and modify code
5. **Scalability**: Easy to add new features
6. **Reusability**: Shared base classes and repositories
7. **Type Safety**: Full TypeScript support throughout

## Summary

- **Models**: Data structures and domain logic
- **Views**: Vue components (UI)
- **Controllers**: Business logic orchestration (View Controllers + Business Controllers)
- **Services**: Business logic implementation
- **Repositories**: Data access abstraction
- **Firebase Services**: External service integration

Each feature follows this pattern independently, making the codebase modular, maintainable, and scalable.
