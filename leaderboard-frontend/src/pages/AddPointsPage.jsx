import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
// Removed: import { AddPointsRequest, Team } from '../types';
import './Forms.css';

function AddPointsPage() {
  const navigate = useNavigate();
  const [addPointsData, setAddPointsData] = useState({ team_id: 0, points: 0, challenge_name: '', description: '' });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await apiService.getTeams();
      if (response.success) {
        setTeams(response.data);
        if (response.data.length > 0) {
          setAddPointsData(prev => ({ ...prev, team_id: response.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setAddPointsData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.addPoints(addPointsData);
      if (response.success) {
        navigate('/scores');
      } else {
        setError(response.message || 'Operation failed');
        if (response.errors) {
          setError(Object.values(response.errors).flat().join(', '));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Add Points to Team</h2>
      {error && <p className="error-message">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="team_id">Team</label>
          <select
            id="team_id"
            name="team_id"
            value={addPointsData.team_id}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="points">Points to Add</label>
          <input
            type="number"
            id="points"
            name="points"
            value={addPointsData.points}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="challenge_name">Challenge Name (Optional)</label>
          <input
            type="text"
            id="challenge_name"
            name="challenge_name"
            value={addPointsData.challenge_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={addPointsData.description}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Points'}
        </button>
        <button type="button" className="button secondary" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddPointsPage;
