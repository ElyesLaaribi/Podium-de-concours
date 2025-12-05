import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Link } from 'react-router-dom';
import './ProgressPage.css';

function ProgressPage() {
  const [progressEntries, setProgressEntries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedTeamId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressResponse, teamsResponse] = await Promise.all([
        apiService.getProgress(selectedTeamId ? parseInt(selectedTeamId) : undefined),
        apiService.getTeams(), // Fetch teams for filtering
      ]);

      if (progressResponse.success) {
        setProgressEntries(progressResponse.data);
      } else {
        setError(progressResponse.message || 'Failed to fetch progress entries');
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
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        await apiService.deleteProgress(id);
        fetchData(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete progress entry');
      }
    }
  };

  return (
    <div className="page-container">
      <h2>Progress Management</h2>

      <div className="progress-actions">
        <Link to="/progress/new" className="button primary">Add New Progress Entry</Link>
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
      </div>

      {loading ? (
        <div className="loading">Loading progress entries...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : progressEntries.length === 0 ? (
        <p>No progress entries found. Try adjusting your filters or add a new entry!</p>
      ) : (
        <ul className="progress-list">
          {progressEntries.map((entry) => (
            <li key={entry.id} className="progress-item">
              <div className="progress-info">
                <strong>{entry.milestone}</strong> for {entry.team?.name || `Team ID: ${entry.team_id}`}:
                <span className="progress-percentage"> {entry.percentage}%</span>
              </div>
              <div className="progress-actions">
                <Link to={`/progress/edit/${entry.id}`} className="button secondary">Edit</Link>
                <button onClick={() => handleDelete(entry.id)} className="button danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProgressPage;
