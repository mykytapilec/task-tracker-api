# Task Tracker API

Backend API for a Kanban-style task management application with authentication, task management, validation, and PostgreSQL database integration.

## Overview

This project provides a REST API for the Task Tracker application.

The API is responsible for:

* User registration and authentication
* JWT-based authorization
* Task management
* Task validation
* User-specific data access
* Board and column management
* Task story points
* Database operations using Prisma ORM

The frontend client is available in a separate repository:

[Task Tracker Client](https://github.com/mykytapilec/task-tracker)

## Tech Stack

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* PostgreSQL
* Zod
* JWT
* Docker
* Vitest

## Features

### Authentication

* User registration
* User login
* Password hashing
* JWT token generation
* Protected routes
* User-specific data access

### Boards and Columns

* User-specific boards
* Board columns
* Column-based task organization
* Board and column database relations

### Tasks

* Get all user tasks
* Get task by ID
* Create tasks
* Update tasks
* Delete tasks
* Task descriptions
* Task column assignment
* Task story points
* Subtask support

### Validation

Request validation is implemented with Zod.

Validated request data includes:

* Task title
* Task description
* Column ID
* Story points
* Request payload structure

## Project Structure

```text
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

prisma/
├── migrations/
└── schema.prisma
```

## Requirements

Before running the project, make sure you have:

* Node.js 22 or later
* npm
* Docker
* Docker Compose
* PostgreSQL

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd task-tracker-api
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Configure the application and database settings in `.env`.

Example:

```env
PORT=3000

DATABASE_URL="postgresql://postgres:postgres@localhost:5436/task_tracker?schema=public"
```

## Database Setup

Start the PostgreSQL container:

```bash
docker compose up -d
```

Check the container status:

```bash
docker compose ps
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

The development database will be available on:

```text
localhost:5436
```

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

Health check endpoint:

```text
GET /api/health
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run type checking:

```bash
npm run typecheck
```

Run linting:

```bash
npm run lint
```

Run type checking and linting:

```bash
npm run check
```

Run tests:

```bash
npm test
```

Format the code:

```bash
npm run format
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Apply development migrations:

```bash
npm run prisma:migrate
```

Push the Prisma schema to the database:

```bash
npm run prisma:push
```

## API Authentication

Protected endpoints require a valid JWT token.

Authorization header format:

```text
Authorization: Bearer <token>
```

The token is returned after successful authentication and is required for protected API requests.

## API Endpoints

### Health

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Protected endpoints require a valid JWT token.

## Error Handling

The API provides consistent error responses.

Example:

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

## Database

The project uses Prisma ORM with PostgreSQL.

The Prisma schema defines the application's main entities:

* User
* Board
* Column
* Task
* Prisma migrations

The database schema is managed through Prisma migrations.

Development migrations can be created and applied with:

```bash
npx prisma migrate dev
```

For production environments, migrations should be applied with:

```bash
npx prisma migrate deploy
```

## Testing

The project uses Vitest for automated tests.

Run the test suite with:

```bash
npm test
```

The test suite covers API and application behavior.

## Production Build

Create a production build:

```bash
npm run build
```

The compiled application is generated in the `dist/` directory.

Start the production server:

```bash
npm start
```

Before starting the application in production, make sure that:

* PostgreSQL is running
* `DATABASE_URL` points to the production database
* Prisma Client has been generated
* Database migrations have been applied

Production database migrations:

```bash
npx prisma migrate deploy
```

## Docker

PostgreSQL is provided through Docker Compose for local development.

Start the database:

```bash
docker compose up -d
```

Stop the database:

```bash
docker compose down
```

View running containers:

```bash
docker compose ps
```

## Environment Variables

The application uses environment variables for configuration.

Required variables:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5436/task_tracker?schema=public"
```

The `.env` file is not committed to the repository.

Use `.env.example` as the template for local and production configuration.

## Git Workflow

The project follows a feature branch workflow:

```text
main
 └── dev
      └── feature/*
```

All features are developed in separate feature branches and merged into `dev` through pull requests.

The `main` branch contains the stable version of the project.

## License

This project is for educational and portfolio purposes.
