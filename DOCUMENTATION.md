# Cinebase Project Documentation

## Overview
Cinebase is a full-stack web application for managing personal movie and TV show collections. This documentation provides comprehensive information about the project structure, setup, development, and deployment.


## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: MySQL 8.0
- **Deployment**: Docker, Docker Compose
- **Authentication**: JWT, OAuth2 (Google, GitHub)
- **File Storage**: Cloudinary
- **Styling**: TailwindCSS with custom components

### Project Structure
```
cinebase/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── api/v1/         # API routes and services
│   │   ├── config/         # Configuration files
│   │   └── main.ts         # Application entry point
│   ├── Dockerfile          # Backend container configuration
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and contexts
│   │   └── config/        # API configuration
│   ├── Dockerfile         # Frontend container configuration
│   └── package.json       # Frontend dependencies
├── docker-compose.yml     # Multi-container orchestration
├── .env.prod.example      # Production environment template
└── README.md              # Main project documentation
```

## Key Features

### Core Functionality
- **Movie/TV Show Management**: Add, edit, delete entries
- **Image Upload**: Upload and display poster images
- **Infinite Scroll**: Automatic pagination for large collections
- **Responsive Design**: Works on all device sizes
- **Authentication**: JWT-based auth with OAuth2 support

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Database ORM**: Prisma for type-safe database operations
- **API Validation**: Zod schemas for request validation
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Lazy loading, debouncing, and optimization
- **Security**: CORS, rate limiting, input validation

## Development Workflow

### Local Development
1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   echo "VITE_SERVER_API_V1=http://localhost:8080" > .env.local
   npm run dev
   ```

### Docker Development
```bash
cp .env.prod.example .env.prod
docker compose --env-file .env.prod up -d --build
```

## API Endpoints

### Movies/Entries
- `GET api/v1/movies` - List movies with pagination
- `POST api/v1/movies` - Create new movie
- `PUT api/v1/movies/:id` - Update movie
- `DELETE api/v1/movies/:id` - Delete movie

### Authentication
- `GET api/v1/auth/user` - Get current user

### File Upload
- `POST api/v1/upload/image` - Upload image

## Database Schema

### User Model
- User authentication and profile information
- OAuth account linking
- Role-based access control

### Entry Model
- Movie/TV show information
- User association
- Image URLs and metadata

## Deployment Options

### Cloud Platforms
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Render, Railway, Fly.io, Heroku
- **Database**: PlanetScale, Railway MySQL, AWS RDS

### Docker Deployment
- Multi-container setup with Docker Compose
- Production-ready configuration
- Environment variable management

## Security Considerations

### Authentication
- JWT token-based authentication
- OAuth2 integration (Google, GitHub)
- Secure password hashing with bcrypt

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention with Prisma
- XSS protection and sanitization
- CORS configuration

### Infrastructure
- HTTPS enforcement
- Security headers
- Rate limiting
- Environment variable security

## Performance Optimization

### Backend
- Database indexing
- Connection pooling
- Query optimization
- Caching strategies

### Frontend
- React.memo for component optimization
- Lazy loading for images
- Infinite scroll for large datasets
- Bundle optimization

## Monitoring and Logging

### Backend Logging
- Winston logger with multiple transports
- Error tracking and monitoring
- Performance metrics

### Frontend Monitoring
- Error boundaries for React components
- Performance monitoring
- User interaction tracking

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for API endpoints
- Database testing with Prisma

### Frontend Testing
- Component testing with React Testing Library
- Integration tests for user flows
- E2E testing for critical paths

### Getting Help
- Check documentation first
- Search existing issues
- Create detailed issue reports
- Community discussions

### Resources
- API documentation with examples
- Database schema documentation
- Deployment guides
- Troubleshooting guides

## Roadmap and Future Plans

### Planned Features
- Search and filtering
- User collections and sharing
- Recommendation system

### Technical Improvements
- Performance optimizations
- Security enhancements
- Testing coverage
- Documentation updates

