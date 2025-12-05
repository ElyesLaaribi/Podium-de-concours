import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
// Removed: import { Score, CreateScoreRequest, Team } from '../types';
import './Forms.css';

// No longer needs an interface for props since we are removing TypeScript
// interface ScoreFormPageProps {
//   isEditing?: boolean;
// }

function ScoreFormPage({ isEditing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState({ team_id: 0, points: 0, challenge_name: '', description: '', achieved_at: '', metadata: {} });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
    if (isEditing && id) {
      fetchScore(parseInt(id));
    } else {
      setScore(prev => ({ ...prev, achieved_at: new Date().toISOString().slice(0, 16) }));
    }
  }, [id, isEditing]);

  const fetchTeams = async () => {
    try {
      const response = await apiService.getTeams();
      if (response.success) {
        setTeams(response.data);
        if (!isEditing && response.data.length > 0) {
          setScore(prev => ({ ...prev, team_id: response.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const fetchScore = async (scoreId) => {
    setLoading(true);
    try {
      const response = await apiService.getScore(scoreId);
      if (response.success) {
        setScore({
          team_id: response.data.team_id,
          points: response.data.points,
          challenge_name: response.data.challenge_name || '',
          description: response.data.description || '',
          achieved_at: response.data.achieved_at ? new Date(response.data.achieved_at).toISOString().slice(0, 16) : '',
          metadata: response.data.metadata || {},
        });
      } else {
        setError(response.message || 'Failed to load score');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setScore((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setScore((prev) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {}),
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isEditing && id) {
        response = await apiService.updateScore(parseInt(id), score);
      } else {
        response = await apiService.createScore(score);
      }

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
      <h2>{isEditing ? 'Edit Score' : 'Create New Score'}</h2>
      {error && <p className="error-message">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="team_id">Team</label>
          <select
            id="team_id"
            name="team_id"
            value={score.team_id}
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
          <label htmlFor="points">Points</label>
          <input
            type="number"
            id="points"
            name="points"
            value={score.points}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="challenge_name">Challenge Name</label>
          <input
            type="text"
            id="challenge_name"
            name="challenge_name"
            value={score.challenge_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={score.description}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="achieved_at">Achieved At</label>
          <input
            type="datetime-local"
            id="achieved_at"
            name="achieved_at"
            value={score.achieved_at}
            onChange={handleChange}
          />
        </div>
        {/* Simple metadata editor */}
        <div className="form-group">
          <label htmlFor="metadata_difficulty">Metadata: Difficulty</label>
          <input
            type="text"
            id="metadata_difficulty"
            name="difficulty"
            value={score.metadata?.difficulty || ''}
            onChange={handleMetadataChange}
            placeholder="e.g., easy, medium, hard"
          />
        </div>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Score' : 'Create Score')}
        </button>
        <button type="button" className="button secondary" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ScoreFormPage;
