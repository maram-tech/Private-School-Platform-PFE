# Private School Platform PFE

A full-stack web application for managing a private school, built with React (frontend) and Node.js/Express (backend), using Prisma ORM and PostgreSQL database.

## Features

- User authentication and authorization (Admin, Teacher, Parent, Student roles)
- Dashboard for different user types
- Secure API with JWT tokens
- Modern UI with React and Vite

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (for running PostgreSQL database)
- [Docker Compose](https://docs.docker.com/compose/) (usually included with Docker)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd private-school-platform-pfe
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/school_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=5000
```

- `DATABASE_URL`: Connection string for PostgreSQL (matches the Docker setup)
- `JWT_SECRET`: A secret key for JWT token signing (use a strong, random string)
- `PORT`: Port for the backend server (default: 5000)

### 3. Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start a PostgreSQL container with the database configured.

### 4. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

- `npm install`: Installs backend dependencies
- `npx prisma migrate dev`: Runs database migrations to create tables
- `npx prisma generate`: Generates the Prisma client
- `npm run dev`: Starts the backend server in development mode (with nodemon)

The backend will run on `http://localhost:5000`

### 5. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

- `npm install`: Installs frontend dependencies
- `npm run dev`: Starts the Vite development server

The frontend will run on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check

## Project Structure

```
private-school-platform-pfe/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── docker-compose.yml
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   └── package.json
└── README.md
```

## Development

- Backend: Node.js, Express, Prisma, PostgreSQL
- Frontend: React, Vite, React Router
- Authentication: JWT tokens
- Database: PostgreSQL with Prisma ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.</content>
<parameter name="filePath">c:\Users\user\Private-School-Platform-PFE\README.md