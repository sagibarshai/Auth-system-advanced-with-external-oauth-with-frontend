# Comprehensive Authentication System with Database, Refresh Tokens, JWT, Password Reset, and Responsive Client-Side Features


This project provides a secure and well-structured application for user authentication, featuring email verification, refresh tokens, cookie-based JWT authentication, and password reset functionality. It's designed to be a solid foundation for building new projects with robust authentication features.
---


#  Getting Started:
Prerequisites: **Docker, Git, Node**
---

 # 1. Clone the Repository

* git clone https://github.com/sagibarshai/Auth-system-advanced-with-external-oauth-with-frontend.git

* cd Auth-system-advanced-with-external-oauth-with-frontend
---



# 2. Install Dependencies:

**cd ./frontend && npm install && cd ../backend && npm install**

---



# 3. Create the .env File
   
**Inside the root directory, create a file named .env and add the following environment variables:**

POSTGRES_USER=postgres  # Default for initialization, can change later

POSTGRES_PASSWORD=postgres  # Default for initialization, can change later

POSTGRES_DATABASE=postgres  # Default for initialization, can change later

POSTGRES_PORT=5432  # Default for initialization, can change later

POSTGRES_DB=postgres  # Default for initialization, can change later

POSTGRES_HOST=db  # Default for initialization, can change later


EMAIL_ADDRESS= # your_email_address

EMAIL_ACCESS_KEY= # your_email_app_token (Learn how to generate it by following this guide: [How to Create an App Password in Gmail](https://youtu.be/YKn6iRlYd_Q?feature=shared))

JWT_KEY= # value (Can be generated using `crypto.randomUUID()` for a unique string)

COOKIE_SECRET= # value (Should be a random string, used for securing cookies)

BACKEND_PORT= # value  (Default port (4000 recommended))
**Ensure this port matches the one configured in your Google OAuth redirect URI.
The redirect URI in the Google Developer Console should point to this port for proper authentication.**


GOOGLE_CLIENT_ID=<your_google_client_id>  # Learn how to generate your Google Client ID here: [How to create Google OAuth Credentials](https://www.youtube.com/watch?v=v8j2lvjCAZc)

GOOGLE_CLIENT_SECRET=<your_google_client_secret>  # Learn how to generate your Google Client Secret here: [How to generate Google OAuth Client ID and Client Secret](https://www.youtube.com/watch?v=ex3FW_40izU)

**Ensure that the Google OAuth callback URL is correctly configured.
The callback URL must match the following format:
http://localhost:<port>/api/auth/google/callback
Where <port> corresponds to the BACKEND_PORT specified in your .env file.
Make sure the URL in the Google Developer Console matches this for proper authentication.**



---


 # 4. Running the Project:
   
To start the project run : **docker-compose up --build**
This will build the services and start them using the environment variables defined in .env file in the root directory.

# 5.  Stopping the Project

To stop the project, run: **docker-compose down**

---

# Core Features and Technologies:

# 1.  Frontend:

- **Technologies:** React, TypeScript, Material-UI, Redux, React Router, React Hooks.

- **Key Features:**
* Signup, Signin, Signout, Email-verification,Reset-password, Forgot-password and Home Responsive Pages.
* Custom hooks for managing requests,inputs, and more.
* Modern UI built with Material-UI.
* State management using Redux.
* Navigation using React Router.
* Comprehensive error handling and user feedback messages.
* Aligned types with the backend to ensure consistency between client and server.
---

 # 2. Backend

- **Technologies:** Node.js, Express, TypeScript, Postgres

- **Key Features:**
* JWT-based authentication with refresh tokens.
* Secure cookie storage for tokens.
* Email verification and resend functionality with configurable retry limits.
* Reset password functionality with configurable retry limits.
* Google OAuth integration for signup/signin.
* Database configuration using PostgreSQL.
* Environment variable management for configuration
---

# User Authentication:

* Signup and Signin with Email: Users can sign up and sign in using their email, password, and extra fields. Email verification is required for account activation.

* Signup and Signin with Google: Users can sign up and sign in using their Google account on a single endpoint. No email verification is required for Google signups.

* Signout: Signing out deletes the authentication token cookie.

* Email Verification: Required for email-based signups to activate accounts.

* Resend Email Verification: Users can request a verification email again, with configurable retry limits.

* Forgot Password: Users can click on Forgot password and get email with token that allows them to choose a new password

* Reset Password: Users can request to reset password, with configurable retry limits.

---

# Backend End Points:

**signup** - /api/auth/signup, method = post 

**signin** - /api/auth/signin, method = post

**signout** - /api/auth/signout, method = post

**auth with google(signin and signup)** - /api/auth/google, method = get

**verify email** - /api/emailVerification/:id/:token, method = get

**resend email verification** - /api/auth/emailVerification/resend, method = post

**send email for reset password** /api/auth/sendResetPasswordEmail, method = post

**reset password** /api/auth/resetPassword, method = post


---

# Security:

* Strong password hashing

* Email verification for increased security with expired date (configurable)

* Auto refresh tokens mechanism

* Cookie-based JWT authentication for secure token storage
---

# Middlewares:

* currentUser: return the currently logged-in user or null

* requireAuth: Protects routes that require authentication

* notFoundRoute: Handles requests for non-existent routes

* errorHandler: Provides centralized error handling for a robust and well-structured application design.
---

# Error Handling:

* Centralized Error Handling Middleware: Implement a middleware to handle errors gracefully and provide normalized errors to the client.

* Custom Error Types: Define custom error types for different error scenarios (e.g., validation errors, authentication errors, database errors) to provide more specific error messages.

* Error Logging: Log errors to a file or a logging service to aid in debugging and monitoring.
---
# Strong Configuration:

* Backend configuration

* Database Configuration:

* JWT Configuration

* Cookie Configuration

* Email Configuration

* Google Configuration

* Reset Password Configuration
---

# Structure:

* Clean and organized codebase using TypeScript

* Modular design for easier maintenance

* Environment variables for sensitive data (*.env), loaded and served from a centralized config file for better maintainability.
---

# Database:

* Uses PostgreSQL for user, reset password and email verification data:

includes two tables: 


1. **Users Table**
2. **Email Verifications Table**
3. **Reset Password Table**   
---

# Dockerization:

**Dockerfiles and docker-compose.yaml for easy development**

---
