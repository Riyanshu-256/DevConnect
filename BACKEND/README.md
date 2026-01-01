# Dev-Tinder

Dev-Tinder is a focused, minimal backend for a Tinder-like matchmaking service built with Node.js, Express and MongoDB. It provides secure user authentication, profile management, connection requests, and utility validations to accelerate building a developer-matching application.

**Status:** Work-in-progress — backend API ready for integration with a frontend client.

**Table of Contents**

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Run the App](#run-the-app)
-   [API Overview](#api-overview)
-   [Testing & Development](#testing--development)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   Secure user signup / login with hashed passwords
-   JWT-based authentication and cookie support
-   Profile creation and updates
-   Send / accept / reject connection requests between users
-   Centralized validation utilities

## Tech Stack

-   Node.js + Express
-   MongoDB via Mongoose
-   Authentication: JSON Web Tokens (JWT)
-   Utilities: bcrypt, validator, dotenv, cookie-parser

## Project Structure

-   `src/app.js` — application entry, middleware and route mounting
-   `src/config/database.js` — MongoDB connection helper
-   `src/routes/` — express routes: `auth`, `profile`, `requests`, `user`
-   `src/models/` — Mongoose models: `user`, `connectionRequest`
-   `src/middlewares/auth.js` — authentication middleware
-   `src/utils/validation.js` — request/input validations

## Getting Started

Prerequisites

-   Node.js (v16+ recommended)
-   A MongoDB database (Atlas or local)

Installation

1. Clone the repository

```bash
git clone <repo-url>
cd dev-tinder
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root (see below)

## Environment Variables

Create a `.env` at the repository root with at least the following variable:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/dev-tinder?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

`src/config/database.js` already loads `.env` from the project root, and the app will fail to start if `MONGODB_URI` is not defined.

## Run the App

-   Start in production mode:

```bash
npm start
```

-   Start in development mode (requires `nodemon`):

```bash
npm run dev
```

The server listens on port `3000` by default (see `src/app.js`).

## API Overview

This project exposes REST endpoints mounted in `src/routes/`.

-   Authentication (`/auth`)

    -   `POST /signup` — create a new user
    -   `POST /login` — authenticate and receive a JWT/cookie

-   Profile (`/profile`)

    -   `GET /profile/:id` — fetch profile by user id
    -   `PUT /profile` — update current user's profile

-   Users (`/user`)

    -   `GET /users` — list/search users (filtering depends on implementation)

-   Requests (`/requests`)
    -   `POST /requests` — send a connection request
    -   `GET /requests` — list incoming/outgoing requests
    -   `PUT /requests/:id/accept` — accept a request
    -   `PUT /requests/:id/reject` — reject a request

Refer to the route files in `src/routes/` for exact request/response schemas and required auth headers.

## Testing & Development

-   Use `nodemon` during development for auto-reload: `npm run dev`.
-   Add unit/integration tests (not included) and consider using `jest` or `mocha`.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a pull request with clear description and tests (if applicable)

Please open issues for feature requests or bugs.

## License

This project uses the ISC license. See the `package.json` `license` field for details.

