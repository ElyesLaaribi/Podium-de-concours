import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LeaderboardPage from './pages/LeaderboardPage';
import TeamsPage from './pages/TeamsPage';
import TeamFormPage from './pages/TeamFormPage';
import TeamDetailPage from './pages/TeamDetailPage';
import ScoresPage from './pages/ScoresPage';
import ScoreFormPage from './pages/ScoreFormPage';
import AddPointsPage from './pages/AddPointsPage';
import ProgressPage from './pages/ProgressPage';
import ProgressFormPage from './pages/ProgressFormPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<LeaderboardPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/new" element={<TeamFormPage />} />
          <Route path="/teams/edit/:id" element={<TeamFormPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/scores/new" element={<ScoreFormPage />} />
          <Route path="/scores/add-points" element={<AddPointsPage />} />
          <Route path="/scores/edit/:id" element={<ScoreFormPage isEditing={true} />} />

          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/progress/new" element={<ProgressFormPage />} />
          <Route path="/progress/edit/:id" element={<ProgressFormPage isEditing={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

