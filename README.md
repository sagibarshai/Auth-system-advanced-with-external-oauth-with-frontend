# Robust Auth System with Database, Refresh Tokens Cookie-Based JWT Authentication and client side.

This project provides a secure and well-structured application for user authentication, featuring email verification, refresh tokens, and cookie-based JWT authentication. It's designed to be a solid foundation for building new projects with robust authentication features.


**Key Features:**

1.**Frontend:**

- Technologies: React, TypeScript, Material-UI, Redux, React Router, React Hooks.

- Key Features:
* Signup and Signin Pages.
* Custom hooks for managing requests, inputs, and more.
* Modern UI built with Material-UI.
* State management using Redux.
* Navigation using React Router.
* Comprehensive error handling and user feedback messages.
* Aligned types with the backend to ensure consistency between client and server.


2. **Backend**

- Technologies: Node.js, Express, TypeScript, Postgres

- Key Features:
* JWT-based authentication with refresh tokens.
* Secure cookie storage for tokens.
* Email verification and resend functionality with configurable retry limits.
* Google OAuth integration for signup/signin.
* Database configuration using PostgreSQL.
* Environment variable management for configuration



---

# User Authentication:

1. Signup and Signin with Email: Users can sign up and sign in using their email, password, and extra fields. Email verification is required for account activation.

2. Signup and Signin with Google: Users can sign up and sign in using their Google account on a single endpoint. No email verification is required for Google signups.

3. Signout: Signing out deletes the authentication token cookie.

4. Email Verification: Required for email-based signups to activate accounts.

5. Resend Email Verification: Users can request a verification email again, with configurable retry limits.

---

# Security:

Strong password hashing

Email verification for increased security

Auto refresh tokens for long-lived sessions

Cookie-based JWT authentication for secure token storage

---

# Middlewares:

currentUser: return the currently logged-in user or null

requireAuth: Protects routes that require authentication

notFoundRoute: Handles requests for non-existent routes

errorHandler: Provides centralized error handling for a robust and well-structured application design.

---

# Error Handling:

Centralized Error Handling Middleware: Implement a middleware to handle errors gracefully and provide normalized errors to the client.

Custom Error Types: Define custom error types for different error scenarios (e.g., validation errors, authentication errors, database errors) to provide more specific error messages.

Error Logging: Log errors to a file or a logging service to aid in debugging and monitoring.

---
# Strong Configuration:

Backend configuration

Database Configuration:

JWT Configuration

Cookie Configuration

SMTP server settings (host, port, username, password)

Google Configuration


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

---

# Dockerization:

Dockerfiles and docker-compose.yml for easy deployment

---


#  Started:
Prerequisites

Docker, Git

**Environment Setup**
To run this project, you only need to create a single .env file at the root level of the project with the following environment variables.

1. **Clone the Repository**
git clone https://github.com/sagibarshai/Auth-System.git
cd Auth-System

2.**Create the .env File**
Inside the root directory, create a file named .env and add the following environment variables:

BACKEND_PORT=<value>


POSTGRES_USER=postgres  # Default for initialization, can change later
POSTGRES_PASSWORD=postgres  # Default for initialization, can change later
POSTGRES_DATABASE=postgres  # Default for initialization, can change later
POSTGRES_PORT=5432  # Default for initialization, can change later
POSTGRES_DB=postgres  # Default for initialization, can change later
POSTGRES_HOST=db  # Default for initialization, can change later

GOOGLE_CLIENT_ID=<value>
GOOGLE_CLIENT_SECRET=<value>
EMAIL_ADDRESS=<value>
EMAIL_ACCESS_KEY=<value>
JWT_KEY=<value>
COOKIE_SECRET=<value>




3. **Running the Project:**
   
To start the project with Docker Compose, run the following command:

**docker-compose up --build**

This will build the services and start them using the environment variables defined in .env file in the root directory.

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
