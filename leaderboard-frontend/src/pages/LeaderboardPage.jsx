import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './LeaderboardPage.css'; // Assuming you'll create a specific CSS for this page

function LeaderboardPage() {
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [teamsResponse, statsResponse] = await Promise.all([
        apiService.getTopTeams(10),
        apiService.getLeaderboardStats(),
      ]);

      if (teamsResponse.success) {
        setTeams(teamsResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#6B7280'; // Gray
  };

  return (
    <div className="leaderboard-page">
      <header className="header">
        <h1>🏆 Leaderboard</h1>
        {stats && (
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total Teams:</span>
              <span className="stat-value">{stats.total_teams}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Points:</span>
              <span className="stat-value">{stats.total_points}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Score:</span>
              <span className="stat-value">{stats.average_score}</span>
            </div>
          </div>
        )}
      </header>

      {loading && teams.length === 0 ? (
        <div className="loading" role="status" aria-live="polite">
          Loading leaderboard...
        </div>
      ) : error ? (
        <div className="error" role="alert" aria-live="assertive">
          <p>Error: {error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      ) : null}

      {!loading && teams.length === 0 && !error && (
        <div className="empty-state" role="status" aria-live="polite">
          <p>No teams found. Start by creating a team!</p>
        </div>
      )}

      <div className="leaderboard">
        {teams.map((team) => (
          <div key={team.id} className="team-card" style={{ borderLeftColor: team.color || '#3B82F6' }}>
            <div className="team-rank" aria-label={`Rank: ${team.rank}`} style={{ color: getRankColor(team.rank) }}>
              #{team.rank}
            </div>
            <div className="team-info">
              <div className="team-header">
                <h2 className="team-name">{team.name}</h2>
                {team.code && <span className="team-code" aria-label={`Team Code: ${team.code}`}>{team.code}</span>}
              </div>
              {team.description && (
                <p className="team-description">{team.description}</p>
              )}
              {team.scores && team.scores.length > 0 && (
                <div className="recent-scores">
                  <strong>Recent Scores:</strong>
                  <ul aria-label="Recent scores">
                    {team.scores.map((score) => (
                      <li key={score.id}>
                        {score.challenge_name || 'Challenge'}: +{score.points} points
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="team-score">
              <div className="score-value" aria-label={`Total Score: ${team.total_score} points`}>{team.total_score}</div>
              <div className="score-label">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPage;
