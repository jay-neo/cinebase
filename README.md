<div align='center'><h1>Cinebase 🎞️</h1></div>

A full-stack web application for managing your personal movie and TV show collection. Built with modern technologies and best practices.

## Features

- **Add New Entries**: Create detailed entries for movies and TV shows
- **Infinite Scroll**: Automatically loads more entries as you scroll
- **Edit & Delete**: Update or remove entries with confirmation dialogs
- **Image Upload**: Upload and display poster images
- **Responsive Design**: Beautiful UI that works on all devices

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Axios** for API communication
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **MySQL** database
- **JWT** for authentication
- **Zod** for schema validation
- **Winston** for logging
- **Multer** for file uploads
- **Cloudinary** for image storage

### DevOps
- **Docker** & **Docker Compose** for containerization
- **Nginx** for serving frontend
- **MySQL 8.0** database

## Project Structure

```
cinebase/
├── backend/
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── config/           # Configuration files
│   │   │   ├── lib/              # Database connection
│   │   │   ├── prisma/           # Prisma schema & migrations
│   │   │   ├── route/            # API routes
│   │   │   ├── service/          # Business logic
│   │   │   └── types/            # TypeScript types
│   │   ├── config/               # Environment & server config
│   │   └── main.ts               # Application entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── Navbar/           # Navigation
│   │   │   └── ui/               # Reusable UI components
│   │   ├── config/               # API configuration
│   │   ├── lib/                  # Utilities & contexts
│   │   ├── pages/                # Page components
│   │   └── routes/               # Routing configuration
│   ├── config/
│   │   └── nginx.conf            # Nginx configuration
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.prod.example
└── README.md
```


---


## Quick Start (Docker)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/jay-neo
cd cinebase
```

2. **Create environment file**
```bash
cp .env.prod.example .env.prod
```

3. **Configure the environment file**

```bash
MYSQL_DATABASE=cinebase
MYSQL_USER=cinebase
MYSQL_PASSWORD=cinebase
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_PORT=3306

SERVER_PORT=8080
SERVER_URL=http://localhost:8080
DATABASE_URL="mysql://cinebase:cinebase@db:3306/cinebase?connection_limit=10&pool_timeout=30000"
CLIENT_1=http://localhost:5173

JWT_SECRET_KEY=JWT_SECRET_KEY
ACCESS_TOKEN_SECRET_KEY=ACCESS_TOKEN_SECRET_KEY
REFRESH_TOKEN_SECRET_KEY=REFRESH_TOKEN_SECRET_KEY

GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID=GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=GITHUB_CLIENT_SECRET

CLOUDINARY_CLOUD_NAME=CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=CLOUDINARY_API_SECRET

VITE_SERVER_API_V1=http://localhost:8080/api/v1
```

4. **Start all services**
```bash
docker compose --env-file .env.prod up -d --build
```

This will start:
- **MySQL Database** on port 3306
- **Backend API** on `http://localhost:8080`
- **Frontend** on `http://localhost:5173`


5. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Database: localhost:3306

---

## Local Development Setup

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` file with your database credentials:
```bash
NODE_ENV=development

SERVER_PORT=8080
SERVER_URL="http://localhost:8080/ap1/v1"

CLIENT_1="http://localhost:5173"

DATABASE_URL="mysql://username:password@localhost:3306/cinebase"
JWT_SECRET_KEY=JWT_SECRET_KEY
ACCESS_TOKEN_SECRET_KEY=ACCESS_TOKEN_SECRET_KEY
REFRESH_TOKEN_SECRET_KEY=REFRESH_TOKEN_SECRET_KEY

GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID=GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=GITHUB_CLIENT_SECRET

CLOUDINARY_CLOUD_NAME=CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=CLOUDINARY_API_SECRET

```

5. **Create database**

Running this command in `mysql` shell
```sql
CREATE DATABASE cinebase;
```

6. **Generate Prisma client and run migrations**
```bash
npx prisma generate
npx prisma migrate dev
```

7. **Start development server**
```bash
npm run dev
```

Backend will run on http://localhost:8080

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
echo "VITE_SERVER_API_V1=http://localhost:8080" > .env.local
```

4. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.


## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/jay-neo/cinebase/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jay-neo/cinebase/discussions)
- **Email**: `jsau5337@gmail.com`

---

<div align="center">

**Made with ❤️ by [jay-neo](https://jay-neo.github.io)**

</div>