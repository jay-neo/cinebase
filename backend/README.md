# Backend Documentation

## Overview
The backend is a Node.js/Express API server with TypeScript, Prisma ORM, and MySQL database.

## Project Structure
```
backend/
├── src/
│   ├── api/v1/
│   │   ├── config/           # Configuration files
│   │   ├── lib/              # Database connection
│   │   ├── prisma/           # Prisma schema & migrations
│   │   ├── route/            # API routes
│   │   ├── service/          # Business logic
│   │   └── types/            # TypeScript types
│   ├── config/               # Environment & server config
│   └── main.ts               # Application entry point
├── Dockerfile
├── package.json
└── .env.example
```

## Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Environment Variables
```bash
NODE_ENV=development
SERVER_PORT=8080
SERVER_URL=http://localhost:8080
DATABASE_URL=mysql://user:password@localhost:3306/cinebase
JWT_SECRET_KEY=your_jwt_secret
ACCESS_TOKEN_SECRET_KEY=your_access_secret
REFRESH_TOKEN_SECRET_KEY=your_refresh_secret
CLIENT_LOCAL=http://localhost:5173
```

## API Routes

### Movies
- `GET /movies` - List movies with pagination
- `POST /movies` - Create new movie
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

### Authentication
- `GET /auth/user` - Get current user

### Upload
- `POST /upload/image` - Upload image

## Database Schema
See `src/api/v1/prisma/schema.prisma` for complete schema.

## Commands
```bash
npm run dev          # Development server
npm run build        # Build for production
npm start            # Production server
npm run db:migrate   # Create migration
npm run db:studio    # Prisma Studio
npm run db:seed      # Seed database
```