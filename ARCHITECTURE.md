# Layered MVC Architecture Documentation

This project follows a **Layered MVC Architecture** where each layer implements the MVC (Model-View-Controller) pattern. The architecture is designed to separate concerns and provide a clean, maintainable codebase.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (MVC)                    │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐         │
│  │  Views   │  │ Controllers  │  │  Models  │         │
│  │  (.vue)  │  │ (View Ctrl)  │  │  (State) │         │
│  └──────────┘  └──────────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER (MVC)                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐         │
│  │  Views   │  │ Controllers  │  │ Services │         │
│  │  (N/A)   │  │ (Business)   │  │ (Models) │         │
│  └──────────┘  └──────────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│            DATA ACCESS LAYER (MVC)                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐         │
│  │  Views   │  │ Controllers  │  │Repositories│        │
│  │  (N/A)   │  │  (N/A)       │  │ (Models)  │         │
│  └──────────┘  └──────────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              FIREBASE SERVICES                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐         │
│  │   Auth   │  │  Firestore   │  │ Storage  │         │
│  │  Service │  │   Service    │  │ Service  │         │
│  └──────────┘  └──────────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────┘
```

## Layer Structure

### 1. Presentation Layer (`src/layers/presentation/`)

**Purpose**: Handles user interface and user interactions.

- **Views** (`views/`): Vue components that render the UI
  - `LoginView.vue` - Login page
  - `RegisterView.vue` - Registration page
  - `DashboardView.vue` - Dashboard page

- **Controllers** (`controllers/`): View Controllers that manage view state and handle user interactions
  - `BaseViewController.ts` - Base class for view controllers
  - `UserViewController.ts` - Handles user-related UI logic

**MVC Pattern**:
- **Model**: View state (reactive refs)
- **View**: Vue components
- **Controller**: View Controllers

### 2. Business Logic Layer (`src/layers/business/`)

**Purpose**: Contains business rules and orchestrates operations.

- **Services** (`services/`): Business logic implementation
  - `BaseService.ts` - Base service class
  - `UserService.ts` - User business logic

- **Controllers** (`controllers/`): Business controllers that orchestrate services
  - `BaseController.ts` - Base controller class
  - `UserController.ts` - Orchestrates user operations

**MVC Pattern**:
- **Model**: Services (business logic)
- **View**: N/A (no UI in this layer)
- **Controller**: Business Controllers (orchestration)

### 3. Data Access Layer (`src/repositories/` and `src/models/`)

**Purpose**: Handles data persistence and retrieval.

- **Models** (`models/`): Data models representing entities
  - `BaseModel.ts` - Base model class
  - `User.ts` - User model

- **Repositories** (`repositories/`): Data access objects
  - `BaseRepository.ts` - Base repository with CRUD operations
  - `UserRepository.ts` - User-specific data access

**MVC Pattern**:
- **Model**: Domain models and repositories
- **View**: N/A (no UI in this layer)
- **Controller**: N/A (repositories handle data operations directly)

### 4. Firebase Services (`src/services/firebase/`)

**Purpose**: Firebase integration and configuration.

- `config.ts` - Firebase initialization and configuration
- `authService.ts` - Authentication operations
- `firestoreService.ts` - Firestore database operations
- `storageService.ts` - File storage operations

## Data Flow

1. **User Interaction** → Presentation Layer View
2. **View** → Presentation Layer Controller (View Controller)
3. **View Controller** → Business Layer Controller
4. **Business Controller** → Business Layer Service
5. **Business Service** → Data Access Layer Repository
6. **Repository** → Firebase Service
7. **Firebase Service** → Firebase Backend

Response flows back through the same layers in reverse.

## Example: User Registration Flow

```
1. User fills form in RegisterView.vue (Presentation View)
   ↓
2. UserViewController.register() (Presentation Controller)
   ↓
3. userController.register() (Business Controller)
   ↓
4. userService.register() (Business Service)
   ↓
5. authService.signUp() (Firebase Auth Service)
   ↓
6. userRepository.create() (Data Repository)
   ↓
7. firestoreService.createDocument() (Firebase Service)
   ↓
8. Firebase Backend
```

## File Structure

```
src/
├── layers/
│   ├── presentation/          # Presentation Layer (MVC)
│   │   ├── controllers/       # View Controllers
│   │   └── views/             # Vue Components (Views)
│   └── business/              # Business Logic Layer (MVC)
│       ├── controllers/       # Business Controllers
│       └── services/          # Business Services (Models)
├── repositories/              # Data Access Layer (MVC)
│   └── *.ts                   # Repositories (Models)
├── models/                    # Data Models
│   └── *.ts                   # Domain Models
├── services/
│   └── firebase/              # Firebase Integration
│       ├── config.ts
│       ├── authService.ts
│       ├── firestoreService.ts
│       └── storageService.ts
└── router/                    # Vue Router Configuration
    └── index.ts
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features following the same pattern
5. **Reusability**: Services and repositories can be reused across different controllers

## Adding New Features

To add a new feature (e.g., "Product"):

1. **Data Layer**: Create `Product.ts` model and `ProductRepository.ts`
2. **Business Layer**: Create `ProductService.ts` and `ProductController.ts`
3. **Presentation Layer**: Create `ProductViewController.ts` and `ProductView.vue`
4. **Router**: Add routes in `router/index.ts`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your Firebase project credentials
3. The app will automatically use these credentials

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config to `.env` file

