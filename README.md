## Welcome to the RedaPro backend documentation.

This project is a scalable and structured API designed to support an intelligent essay correction platform powered by modern technologies.

## Overview
RedaPro is a backend service designed to provide a robust and scalable foundation for a smart essay correction platform.  
It handles user management and authentication, processes essay submissions, integrates with AI for corrections, and ensures secure and efficient management of all application data.

## Tech Stack & Technologies used

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- Docker & Docker Compose
- Web Socket

## Architecture

The application is structured using a layered architecture (Controller-Service-Repository), promoting clear separation of concerns and maintainability.

## Layers Overview

### Controllers
Responsible for handling **HTTP requests and responses**.  
They receive client input and delegate processing to the service layer.

---

### Services
Contain the **core business logic** of the application.  
They process data, apply rules, and orchestrate operations between different layers.

---

### Repositories
Handle **data access and persistence**.  
This layer abstracts database operations and communicates with the ORM.

---

### Models
Represent the **database schema** and define the structure of application data.

---

### Middlewares
Manage **cross-cutting concerns** such as authentication, validation, logging, and request preprocessing.

---

### DTOs (Data Transfer Objects)
Define structured data for communication between layers, improving **consistency and type safety**.

---

### Validators
Ensure incoming data meets expected **formats and constraints**.

---

### Utils
Provide **reusable helper functions** used across the application.

---

### Exceptions
Centralize **custom error handling**, improving debugging and maintainability.

---

## Project Structure
  ```bash
📁 src/
  ┣ 📁 config/ → Application configuration (database, environment variables, logger)
  ┣ 📁 controllers/ → Handle HTTP requests and delegate to services
  ┣ 📁 dtos/ → Data Transfer Objects (optional but recommended)
  ┣ 📁 exceptions/ → Custom error classes and centralized error handling
  ┣ 📁 middlewares/ → Middleware functions (auth, validation, logging, etc.)
  ┣ 📁 models/ → Database models (Sequelize, Prisma, or Mongoose)
  ┣ 📁 repositories/ → Data access layer (ORM queries and database communication)
  ┣ 📁 seeds/ → Database seeding scripts
  ┣ 📁 routes/ → Application routes organized by modules
  ┣ 📁 services/ → Business logic and application rules
  ┣ 📁 tests/ → Automated tests organized by modules
  ┣ 📁 utils/ → Utility functions and helpers
  ┣ 📄 app.ts → Main app configuration (middlewares, routes)
  ┗ 📄 server.ts → Server bootstrap and initialization
```
## Commit Convention)
### This project follows Conventional Commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Formatting changes
- refactor: Code refactoring
- perf: Performance improvements
- test: Tests
- chore: Maintenance
- ci: CI/CD changes

### Issue Linking (fixes, closes, resolves)

#### Automatically close an issue
```bash
closes #12
   ```
#### Resolve an issue
  ```bash
resolves #87
   ```
#### Link multiple issues
  ```bash
fixes #3 #5 closes #9
   ```
## Getting Started

### 1. Clone the repository

  ```bash
git clone https://github.com/ryannardelli/redapro-back-end.git
   ```
---

### 2. Navigate to the project directory
  ```bash
cd back-end-redapro
   ```
---

### 3. Install dependencies
  ```bash
npm install
   ```
---

### 3. Create a .env file
  ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_name
    DB_PASSWORD=your_password
    DB_NAME=redapro_dev
    PORT=8080
    NODE_ENV=development
   ```
### 4. Run with Docker

#### Build the application image

  ```bash
docker build -t redapro .  
   ```
---
#### Run the application container
  ```bash
docker run -d -p 8080:8080 --name redapro-dev redapro 
   ```
