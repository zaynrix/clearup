# ClearUp - Layered MVC Architecture with Firebase

A Vue 3 application built with a **Layered MVC Architecture** where each layer implements the MVC pattern. The application uses Firebase as the backend service.

## Architecture

This project follows a **Layered MVC Architecture**:

- **Presentation Layer (MVC)**: Vue components (Views) and View Controllers
- **Business Logic Layer (MVC)**: Business Controllers and Services
- **Data Access Layer (MVC)**: Repositories and Domain Models
- **Firebase Services**: Authentication, Firestore, and Storage integration

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Features

- ✅ Layered MVC architecture with separation of concerns
- ✅ Firebase Authentication (Email/Password)
- ✅ Firestore database integration
- ✅ Firebase Storage support
- ✅ TypeScript support
- ✅ Vue Router for navigation
- ✅ Pinia for state management

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

### 1. Install Dependencies

```sh
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password provider
3. Create a **Firestore Database**
4. Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Replace the placeholder values with your Firebase project credentials (found in Project Settings > General > Your apps)

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
