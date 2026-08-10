# Task Tracker API

Backend API for a task management application with authentication, task management, validation, and database integration.

## Overview

This project provides a REST API for a Kanban-style task tracker application.

The API handles:

- User authentication
- JWT-based authorization
- Task management
- Task validation
- User-specific data access
- Database operations using Prisma ORM

The frontend client is available here:

Client application repository:
`CLIENT_GITHUB_REPOSITORY_URL`

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- Docker

## Features

### Authentication

- User registration
- User login
- Password hashing
- JWT token generation
- Protected routes

### Tasks

- Get all user tasks
- Get task by id
- Create tasks
- Update tasks
- Delete tasks

### Validation

Request validation is implemented with Zod.

Validated fields:

- Task title
- Task description
- Column id
- Request payload structure

## Project Structure

```
src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── types/
├── utils/
├── validators/
├── app.ts
└── server.ts
```

## Requirements

Before running the project, make sure you have:

- Node.js installed
- Docker installed
- PostgreSQL database available

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Configure your database and application settings inside `.env`.

## Database Setup

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at:

```
http://localhost:3000
```

## Available Scripts

Format code:

```bash
npm run format
```

Run type checking and linting:

```bash
npm run check
```

Build the project:

```bash
npm run build
```

## API Authentication

Protected endpoints require a JWT token.

Authorization header format:

```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

## Error Handling

The API provides consistent error responses:

```json
{
  "message": "Error description"
}
```

Validation errors include additional details:

```json
{
  "message": "Validation error",
  "errors": []
}
```

## Git Workflow

The project follows a feature branch workflow:

```
main
 └── dev
      └── feature/*
```

All features are developed in separate branches and merged into `dev` through pull requests.

## License

This project is for educational and portfolio purposes.
