# Ebuy - PC Parts Marketplace

A full-stack e-commerce platform for buying and selling PC components, built with Next.js, Express, and PostgreSQL.

![Ebuy Screenshot]()

## Features

- 🛍️ User authentication and authorization
- 💻 Browse and search PC components
- 🛒 Shopping cart functionality
- 💳 Order management system
- 📦 Seller dashboard for managing listings
- 🎯 Category-specific browsing (GPUs, CPUs, etc.)
- 🔍 Advanced filtering and search options

## Tech Stack

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- React Query
- Axios
- Lucide Icons

### Backend
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Node.js

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone h
https://github.com/yourusername/ebuy.git
cd ebuy
```
Install Backend Dependencies

```bash
cd backend
npm install
```
Set up your PostgreSQL database and update .env file
```
DATABASE_URL="postgresql://user:password@localhost:5432/ebuy"
JWT_SECRET="your-secret-key"
```
Run Prisma migrations

```
npx prisma migrate dev
```
Install Frontend Dependencies
```
cd ../frontend
npm install
```
Create .env.local in frontend directory
```
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```
Running the Application
Start Backend Server
```
Copycd backend
npm run dev
```
Start Frontend Development Server
```
cd frontend
npm run dev
```
File Upload Configuration
## Ensure the uploads directory exists and is writable as files are served statically from /uploads route
```
backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware
│   ├── routes/       # API routes
│   ├── utils/        # Helper functions
│   └── index.ts      # Entry point
├── uploads/          # Uploaded files
└── prisma/          # Database schema
```
The application will be available at:
Frontend: http://localhost:3000
Backend API: http://localhost:3001
