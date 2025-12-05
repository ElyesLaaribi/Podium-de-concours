# Podium de Concours - Competition Leaderboard
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/ElyesLaaribi/Podium-de-concours)

This repository contains a full-stack application for managing and displaying a real-time competition leaderboard. It consists of a Laravel-based REST API backend and a React-based frontend.

## Key Features

-   **Full-Stack Application**: A robust Laravel 12 API backend paired with a modern React (Vite) frontend.
-   **Real-time Leaderboard**: Automatically calculates and updates team scores and ranks when new scores are added.
-   **Comprehensive API**: RESTful endpoints for managing teams, scores, and progress milestones.
-   **Interactive Frontend**: A user-friendly interface for viewing the live leaderboard, team details, and using management forms.
-   **Database Seeding**: Includes seeders to quickly populate the database with sample data for easy testing and development.
-   **API Documentation**: Comes with a Postman collection and detailed API documentation for easy integration and testing.

## Project Structure

The repository is organized into two main directories:

-   `leaderboard-app/`: The Laravel backend that serves the REST API.
-   `leaderboard-frontend/`: The React frontend application that consumes the API.

## Technology Stack

### Backend
-   PHP 8.2+
-   Laravel 12
-   SQLite (default), MySQL compatible

### Frontend
-   React 18
-   Vite
-   TypeScript (for type definitions)
-   Axios
-   React Router

## Setup and Installation

Follow the steps below to set up both the backend and frontend for local development.

### 1. Backend Setup (`leaderboard-app`)

First, set up the Laravel API server.

```bash
# 1. Navigate to the backend directory
cd leaderboard-app

# 2. Install PHP dependencies
composer install

# 3. Create your environment file
cp .env.example .env

# 4. Generate an application key
php artisan key:generate

# 5. Set up the database (the project is pre-configured to use SQLite)
#    Create the SQLite database file:
touch database/database.sqlite

# 6. Run database migrations
php artisan migrate

# 7. Seed the database with sample data (teams and scores)
php artisan db:seed

# 8. Start the Laravel development server
php artisan serve
```
The backend API will now be running at `http://localhost:8000`.

### 2. Frontend Setup (`leaderboard-frontend`)

Next, set up the React client.

```bash
# 1. Open a new terminal and navigate to the frontend directory
cd leaderboard-frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
The frontend application will be available at `http://localhost:3000`. It is pre-configured to proxy API requests to the backend server running on port `8000`.

## API Overview

The backend provides a comprehensive set of endpoints to manage the leaderboard.

### Main Endpoints

| Method | Endpoint                    | Description                                  |
| :----- | :-------------------------- | :------------------------------------------- |
| `GET`  | `/api/leaderboard/top`      | Retrieves the top N teams for the leaderboard. |
| `GET`  | `/api/leaderboard/stats`    | Gets global statistics for the competition.  |
| `GET`  | `/api/teams`                | Fetches a list of all active teams.          |
| `POST` | `/api/teams`                | Creates a new team.                          |
| `GET`  | `/api/teams/{id}`           | Retrieves the details of a specific team.    |
| `POST` | `/api/scores/add-points`    | A simplified way to add points to a team.    |
| `POST` | `/api/scores`               | Creates a new, detailed score entry.         |
| `GET`  | `/api/progress?team_id={id}`| Gets the progress milestones for a team.     |
| `POST` | `/api/progress`             | Creates a new progress entry for a team.     |

### API Testing with Postman

A pre-configured Postman collection is included for easy API testing.

1.  Import the `leaderboard-app/postman_collection.json` file into Postman.
2.  Set up an environment variable `base_url` with the value `http://localhost:8000`.
3.  Refer to the `leaderboard-app/POSTMAN_GUIDE.md` for detailed instructions on using the collection.
