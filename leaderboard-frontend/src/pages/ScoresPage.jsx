import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Link } from 'react-router-dom';
import './ScoresPage.css';

function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [challengeName, setChallengeName] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedTeamId, challengeName]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [scoresResponse, teamsResponse] = await Promise.all([
        apiService.getScores({
          team_id: selectedTeamId ? parseInt(selectedTeamId) : undefined,
          challenge_name: challengeName || undefined,
        }),
        apiService.getTeams(),
      ]);

      if (scoresResponse.success) {
        // Ensure data is an array before setting state
        setScores(Array.isArray(scoresResponse.data) ? scoresResponse.data : []);
      } else {
        setError(scoresResponse.message || 'Failed to fetch scores');
      }

      if (teamsResponse.success) {
        setTeams(teamsResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await apiService.deleteScore(id);
        fetchData(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete score');
      }
    }
  };

  return (
    <div className="page-container">
      <h2>Scores Management</h2>

      <div className="scores-actions">
        <Link to="/scores/new" className="button primary">Add New Score</Link>
        <Link to="/scores/add-points" className="button secondary">Add Points (Simplified)</Link>
      </div>

      <div className="filters">
        <div className="form-group">
          <label htmlFor="team-filter">Filter by Team:</label>
          <select
            id="team-filter"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="filter-select"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="challenge-filter">Filter by Challenge Name:</label>
          <input
            type="text"
            id="challenge-filter"
            value={challengeName}
            onChange={(e) => setChallengeName(e.target.value)}
            placeholder="Enter challenge name"
            className="filter-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading scores...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : scores.length === 0 ? (
        <p>No scores found. Try adjusting your filters or add a new score!</p>
      ) : (
        <ul className="score-list">
          {scores.map((score) => (
            <li key={score.id} className="score-item">
              <div className="score-info">
                <strong>{score.challenge_name || 'Unnamed Challenge'}</strong> for {score.team?.name || `Team ID: ${score.team_id}`}:
                <span className="score-points"> +{score.points} points</span>
              </div>
              <div className="score-actions">
                <Link to={`/scores/edit/${score.id}`} className="button secondary">Edit</Link>
                <button onClick={() => handleDelete(score.id)} className="button danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ScoresPage;
