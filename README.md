# Robust Auth System with Database, Refresh Tokens and Cookie-Based JWT Authentication

This project provides a secure and well-structured Node.js Express TypeScript application for user authentication with email verification, refresh tokens, and cookie-based JWT authentication. It's designed to be a solid foundation for building new projects with robust authentication features.

**Key Features:**

---

# User Authentication:

Signup and Signin with google on one endpoint.

Signup with email, password and other extra fields

Signin with email and password

Signout (delete token cookie)

Email verification for account activation

Resend email verification with configurable retry limits

---

# Security:

Strong password hashing

Email verification for increased security

Refresh tokens for long-lived sessions

Cookie-based JWT authentication for secure token storage

Session management with secure secret

---

# Middlewares:

currentUser: Retrieves the currently logged-in user (if any)

requireAuth: Protects routes that require authentication

notFoundRoute: Handles requests for non-existent routes

errorHandler: Provides centralized error handling

---

# Error Handling:

Centralized Error Handling Middleware: Implement a middleware to handle errors gracefully and provide informative error messages to the client.

Custom Error Types: Define custom error types for different error scenarios (e.g., validation errors, authentication errors, database errors) to provide more specific error messages.

Error Logging: Log errors to a file or a logging service to aid in debugging and monitoring.

---


# Utils:

Helper Functions: Create reusable helper functions for tasks like:

Validating user input

Hashing passwords

Generating JWT tokens

Sending emails

Formatting dates and times

---
# Strong Configuration:

Database Configuration:

JWT Configuration

Cookie Configuration

Email Configuration

SMTP server settings (host, port, username, password)

Sender email address

Security Configuration


---

# Structure:

Clean and organized codebase using TypeScript

Modular design for easier maintenance

Environment variables for sensitive data (*.env)

---

# Database:

Uses PostgreSQL for user and verification data:
two tables: 

**Users Table**

**Email_Verifications Table**

Secure connection and data management

---

# Dockerization:

Dockerfile and docker-compose.yml included for easy deployment

---


# Getting Started:
Prerequisites
Docker, Git

This guide provides two options for setting up the environment variables and running the project. Choose the option that best fits your needs.

# Option 1: Single .env File in the Backend Folder

1. **Clone the Repository**

**git clone https://github.com/sagibarshai/Auth-System.git**

**cd Auth-System**

2. **Create the .env File**
   
Inside the backend folder, create a file named .env to hold the environment variables for configuration and database settings.

File Location: backend/.env

**Contents of the .env file:**

General Configuration:

PORT=value

JWT_KEY=value

COOKIE_SECRET=value

EMAIL_ADDRESS=value

EMAIL_ACCESS_KEY=value

Database Configuration:

POSTGRES_USER=value

POSTGRES_PASSWORD=value

POSTGRES_DATABASE=value

POSTGRES_PORT=value

POSTGRES_DB=value

POSTGRES_HOST=value

Optional Settings:

JWT_EXPIRED_IN=value

COOKIES_EXPIRED_IN=value

GOOGLE_CLIENT_ID=value

GOOGLE_CLIENT_SECRET=value

**Replace value with your actual values for each configuration.**

3. **Running the Project**
   
Run the following command to build and start the project using Docker Compose. It will automatically use the environment variables defined in the .env file located in the backend directory.

**docker-compose --env-file ./backend/.env up --build**

4. **Stopping the Project**

To stop the project, run:

**docker-compose down**


# Option 2: Two .env Files (One in the Backend Folder and One in the Root Directory)

1. **Clone the Repository**
   
**git clone https://github.com/sagibarshai/Auth-System.git**

**cd Auth-System**

2. **Create Two .env Files**

**Backend .env file (located in backend/.env)**

**Contents of the .env file:**

General Configuration:

PORT=value

JWT_KEY=value

COOKIE_SECRET=value

EMAIL_ADDRESS=value

EMAIL_ACCESS_KEY=value

Database Configuration:

POSTGRES_USER=value

POSTGRES_PASSWORD=value

POSTGRES_DATABASE=value

POSTGRES_PORT=value

POSTGRES_DB=value

POSTGRES_HOST=value

Optional Settings:

JWT_EXPIRED_IN=value

COOKIES_EXPIRED_IN=value

GOOGLE_CLIENT_ID=value

GOOGLE_CLIENT_SECRET=value


**Root .env file (located in the project root folder)**

**Contents of the .env file:**

Database Configuration (**matching with backend/.env**):

POSTGRES_USER=value

POSTGRES_PASSWORD=value

POSTGRES_DATABASE=value

POSTGRES_PORT=value


**Replace value with your actual values for each configuration.**

3. **Running the Project:**
   
To start the project with Docker Compose, run the following command:

**docker-compose up --build**

This will build the services and start them using the environment variables defined in both .env files—one in the root directory and one in the backend directory.

4. **Stopping the Project**

To stop the project, run:

**docker-compose down**

---

# End Points:

**signup** - /api/auth/signup, method = post 

**signin** - /api/auth/signin, method = post

**signout** - /api/auth/signout, method = post

**auth with google(signin and signup)** - /api/auth/google, method = post

**verify email** - /api/emailVerification/:id/:token, method = get

**resend email verification** - /api/auth/emailVerification/resend, method = post
