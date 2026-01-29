# MVC & Service Layer Quick Reference

## Quick Overview

```
┌─────────────────────────────────────────┐
│           MVC IN EACH FEATURE            │
├─────────────────────────────────────────┤
│                                         │
│  VIEW (Vue Component)                  │
│  ↓ calls                                │
│  VIEW CONTROLLER (UI State)             │
│  ↓ calls                                │
│  BUSINESS CONTROLLER (Orchestration)    │
│  ↓ calls                                │
│  SERVICE (Business Logic)               │
│  ↓ uses                                 │
│  REPOSITORY (Data Access)               │
│  ↓ uses                                 │
│  FIREBASE SERVICE (External API)        │
│                                         │
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. **Models** (`models/`)
- **What**: Data structures and domain models
- **Extends**: `BaseModel`
- **Responsibility**: Define data shape, validation, conversion

### 2. **Views** (`views/`)
- **What**: Vue components (UI)
- **Responsibility**: Display data, handle user input
- **Uses**: View Controllers for logic

### 3. **View Controllers** (`controllers/*ViewController.ts`)
- **What**: Presentation layer controllers
- **Extends**: `BaseViewController`
- **Responsibility**: 
  - Manage UI state (loading, errors)
  - Handle user interactions
  - Call Business Controllers

### 4. **Business Controllers** (`controllers/*Controller.ts`)
- **What**: Business logic orchestrators
- **Extends**: `BaseController`
- **Responsibility**:
  - Orchestrate Services
  - Return `{ success, data, error }` format
  - Handle business flow

### 5. **Services** (`services/`)
- **What**: Business logic implementation
- **Extends**: `BaseService`
- **Responsibility**:
  - Business rules and validation
  - Data transformation
  - Use Repositories for data access
  - Use Firebase Services for external operations

### 6. **Repositories** (`shared/repositories/`)
- **What**: Data access layer
- **Extends**: `BaseRepository`
- **Responsibility**:
  - CRUD operations
  - Abstract Firestore operations
  - Model conversion

## Service Layer Details

### BaseService Methods

```typescript
class BaseService {
  protected validate(data: any): boolean
  protected handleError(error: unknown): Error
}
```

### Service Pattern

```typescript
export class MyService extends BaseService {
  private repository: MyRepository

  constructor() {
    super()
    this.repository = new MyRepository()
  }

  async doSomething(data: Input): Promise<Output> {
    // 1. Validate
    if (!this.validate(data)) {
      throw new Error('Invalid data')
    }

    // 2. Business logic
    const result = await this.repository.find(data.id)
    
    // 3. Transform/process
    const processed = this.process(result)
    
    // 4. Return
    return processed
  }
}
```

## Controller Types

### View Controller (UI Layer)
```typescript
export class MyViewController extends BaseViewController {
  async handleAction(): Promise<boolean> {
    this.setLoading(true)  // UI state
    try {
      const result = await businessController.action()
      return result.success
    } finally {
      this.setLoading(false)
    }
  }
}
```

### Business Controller (Logic Layer)
```typescript
export class MyController extends BaseController {
  async action(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const data = await this.service.doSomething()
      return this.success(data)  // Standardized response
    } catch (error) {
      return this.handleError(error)
    }
  }
}
```

## Data Flow Example

```
User clicks button
  ↓
View (LoginView.vue)
  ↓ calls
View Controller (AuthViewController.login())
  ↓ calls
Business Controller (AuthController.login())
  ↓ calls
Service (UserService.login())
  ↓ uses
Repository (UserRepository.findById())
  ↓ uses
Firebase Service (firestoreService.getDocument())
  ↓
Firebase Backend
```

## File Naming Conventions

- **Models**: `User.ts`, `Product.ts` (singular, PascalCase)
- **Views**: `LoginView.vue`, `ProductView.vue` (PascalCase + View)
- **View Controllers**: `AuthViewController.ts`, `ProductViewController.ts` (PascalCase + ViewController)
- **Business Controllers**: `AuthController.ts`, `ProductController.ts` (PascalCase + Controller)
- **Services**: `UserService.ts`, `ProductService.ts` (PascalCase + Service)
- **Repositories**: `UserRepository.ts`, `ProductRepository.ts` (PascalCase + Repository)

## Key Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Direction**: Always downward (View → Controller → Service → Repository)
3. **Feature Independence**: Features don't depend on each other
4. **Shared Resources**: Base classes and repositories in `shared/`
5. **Type Safety**: Use TypeScript types throughout
6. **Error Handling**: Controllers handle errors, Services throw them

## Common Patterns

### Service Pattern
```typescript
// Service contains business logic
class UserService extends BaseService {
  async register(email: string, password: string) {
    // Validate
    // Business logic
    // Use repository
    // Return result
  }
}
```

### Controller Pattern
```typescript
// Controller orchestrates services
class UserController extends BaseController {
  async register(email: string, password: string) {
    try {
      const result = await this.userService.register(email, password)
      return this.success(result)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
```

### View Controller Pattern
```typescript
// View Controller manages UI state
class UserViewController extends BaseViewController {
  async register(email: string, password: string) {
    this.setLoading(true)
    try {
      const result = await userController.register(email, password)
      if (result.success) {
        // Handle success
        return true
      }
      this.setError(result.error)
      return false
    } finally {
      this.setLoading(false)
    }
  }
}
```

