# Leaderboard Frontend

React frontend application for the Leaderboard API.

## Features

- 🏆 Real-time leaderboard display
- 📊 Statistics dashboard
- 🔄 Auto-refresh every 5 seconds
- 🎨 Modern, responsive UI
- 🔌 Full API integration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Or update the default URL in `src/services/api.ts` if your backend runs on a different port.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── types/
│   └── index.ts          # TypeScript interfaces for API data
├── services/
│   └── api.ts            # API service layer with all endpoints
├── App.jsx               # Main React component
├── App.css               # Styles
└── main.jsx              # Entry point
```

## API Integration

The frontend uses the `apiService` from `src/services/api.ts` which provides methods for:

- **Teams**: `getTeams()`, `getTeam(id)`, `createTeam(data)`, `updateTeam(id, data)`, `deleteTeam(id)`
- **Leaderboard**: `getLeaderboard(limit, offset)`, `getTopTeams(limit)`, `getLeaderboardStats()`
- **Scores**: `getScores(params)`, `createScore(data)`, `addPoints(data)`, `updateScore(id, data)`, `deleteScore(id)`
- **Progress**: `getProgress(team_id)`, `createProgress(data)`, `updateProgress(id, data)`, `deleteProgress(id)`

## Example Usage

```javascript
import apiService from './services/api';

// Get top teams
const response = await apiService.getTopTeams(10);
if (response.success) {
  console.log(response.data);
}

// Add points to a team
await apiService.addPoints({
  team_id: 1,
  points: 50,
  challenge_name: 'Challenge 1',
  description: 'Completed challenge'
});
```

## Backend Requirements

Make sure your Laravel backend:
1. Is running on `http://localhost:8000` (or update the API URL)
2. Has CORS enabled for `http://localhost:3000`
3. Has the API routes available at `/api/*`

## Technologies

- React 18
- Vite
- Axios
- TypeScript (for type definitions)

