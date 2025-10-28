# Frontend Documentation

## Overview
The frontend is a React 18 application built with Vite, TypeScript, and TailwindCSS.

## Project Structure
```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── Navbar/           # Navigation
│   │   └── ui/               # Reusable UI components
│   ├── config/               # API configuration
│   ├── lib/                  # Utilities & contexts
│   ├── pages/                # Page components
│   └── routes/               # Routing configuration
├── config/
│   └── nginx.conf            # Nginx configuration
├── Dockerfile
└── package.json
```

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
echo "VITE_SERVER_API_V1=http://localhost:8080" > .env.local
npm run dev
```

## Environment Variables
```bash
VITE_SERVER_API_V1=http://localhost:8080
```

## Features
- Infinite scroll pagination
- Lazy loading images
- Modal dialogs for CRUD operations
- Responsive design
- Image upload with preview
- Form validation
- Loading states

## Components

### Pages
- `HomePage.tsx` - Main collection view with infinite scroll
- `AuthPage.tsx` - Authentication page
- `WelcomePage.tsx` - Landing page

### UI Components
- `Modal.tsx` - Modal dialog component
- `ConfirmDialog.tsx` - Confirmation dialog
- `Button.tsx` - Reusable button component
- `Dialog.tsx` - Alternative dialog component

### Context
- `AuthContext.tsx` - Authentication state management
- `ThemeContext.tsx` - Theme management

## Commands
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Build Output
The build creates a `dist/` directory with static files ready for deployment.