<div align="center">

![ClearUp Logo](./public/images/logos/logo-main.png)

# ClearUp Agency

**Web application built with Vue 3 and Firebase for content management and lead generation.**

🌐 **Live Website:** [https://clearupagency.com](https://clearupagency.com)

</div>

## Stack

- Vue 3 + TypeScript + Vite
- Firebase (Auth, Firestore, Storage)
- Pinia
- Vue Router

## Architecture

This project follows a **Feature-Based MVC Architecture** where each feature is completely independent with its own MVC structure.

### Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── models/            # User model
│   │   ├── views/             # LoginView.vue
│   │   ├── controllers/       # AuthController, AuthViewController
│   │   ├── services/          # AuthService, UserService
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
│   ├── components/            # NavigationBar (shared UI components)
│   ├── repositories/          # BaseRepository, UserRepository, etc.
│   ├── services/              # Infrastructure services (Firebase)
│   │   ├── config.ts         # Firebase configuration
│   │   ├── firestoreService.ts
│   │   └── storageService.ts
│   ├── BaseModel.ts          # Base model class
│   ├── BaseController.ts     # Base business controller
│   ├── BaseViewController.ts # Base view controller
│   └── BaseService.ts        # Base service class
│
├── router/                     # Vue Router configuration
└── assets/                     # CSS and static assets
```

### Key Principles

- **Feature Independence**: Each feature is self-contained with its own MVC structure
- **Service Separation**: 
  - Infrastructure services → `shared/services/` (Firebase)
  - Business logic services → `features/[feature]/services/`
- **No Cross-Feature Dependencies**: Features don't import from other features' services
- **Shared Resources**: Base classes, repositories, and infrastructure in `shared/`

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [MVC_GUIDE.md](./MVC_GUIDE.md).

## Setup

### Option 1: Docker (Recommended for Teams)

**Requirements:** Docker and Docker Compose

```bash
# Build and start development server
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

The app will be available at `http://localhost:5173`

**Benefits:**
- ✅ Consistent Node.js version across all team members
- ✅ No need to install Node.js locally
- ✅ Same environment for everyone
- ✅ Easy onboarding for new team members

### Option 2: Local Development

**Requirements:** Node.js v20.19.0+ and a Firebase project.

```bash
npm install
npm run dev
```

**Firebase Setup:**

1. Create Firebase project and enable Email/Password authentication
2. Create Firestore database
3. Add environment variables to `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Google Calendar OAuth (Optional - for automatic Google Meet links)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-client-secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

See `.env.example` for a complete template.

4. Deploy `firestore.rules` and `storage.rules` to Firebase

## Deployment

Deploys to Hetzner server via GitHub Actions. Configure these secrets in repository settings:

**Firebase Secrets:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)
- `VITE_GOOGLE_CLIENT_ID` (optional - for Google Calendar integration)
- `VITE_GOOGLE_CLIENT_SECRET` (optional - for Google Calendar integration)
- `VITE_GOOGLE_REDIRECT_URI` (optional - for Google Calendar integration)

**Server Secrets:**
- `SERVER_IP` - Hetzner server IP address
- `SERVER_USER` - SSH username (typically `root`)
- `SSH_PRIVATE_KEY` - SSH private key for server access

The workflow automatically builds and deploys on push to `main` branch.

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run type-check` - TypeScript validation
- `npm run lint` - Code linting

## Docker Commands

**Development:**
```bash
docker-compose up          # Start dev server
docker-compose down        # Stop container
docker-compose logs -f     # View logs
docker-compose exec app sh # Access container shell
```

**Production Build:**
```bash
docker build -f Dockerfile.prod -t clearup:prod .
docker run -p 8080:80 clearup:prod
```

## Features

### Authentication (`features/auth/`)
- User login/logout
- User registration
- Session management
- Firebase Auth integration

### Home Page (`features/home/`)
- Dynamic content management
- WhatsApp lead capture
- Content editing (admin)
- Section visibility controls

### Dashboard (`features/dashboard/`)
- User dashboard
- Profile management
- User information display

### Admin (`features/admin/`)
- User management (create, update, delete, role assignment)
- Role management
- Activity logging
- Site settings management
- Home content editing

## Adding a New Feature

To add a new feature (e.g., "products"):

1. Create feature structure:
   ```
   src/features/products/
   ├── models/Product.ts
   ├── views/ProductView.vue
   ├── controllers/ProductController.ts, ProductViewController.ts
   ├── services/ProductService.ts
   └── routes/index.ts
   ```

2. Create Model: Extend `BaseModel`
3. Create Service: Extend `BaseService`, use shared repositories
4. Create Controllers: 
   - Business Controller extends `BaseController`
   - View Controller extends `BaseViewController`
5. Create View: Vue component using View Controller
6. Create Routes: Add routes to router
7. Create Repository (if needed): In `shared/repositories/`

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed guidelines.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Comprehensive architecture documentation
- [MVC_GUIDE.md](./MVC_GUIDE.md) - Quick reference guide for MVC patterns

## License

Private project
