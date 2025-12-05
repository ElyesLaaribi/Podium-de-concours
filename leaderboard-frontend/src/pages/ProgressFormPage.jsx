import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './Forms.css';

function ProgressFormPage({ isEditing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ team_id: 0, milestone: '', percentage: 0, notes: '', completed_at: '' });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
    if (isEditing && id) {
      fetchProgressEntry(parseInt(id));
    } else {
      setProgress(prev => ({ ...prev, completed_at: new Date().toISOString().slice(0, 16) }));
    }
  }, [id, isEditing]);

  const fetchTeams = async () => {
    try {
      const response = await apiService.getTeams();
      if (response.success) {
        setTeams(response.data);
        if (!isEditing && response.data.length > 0) {
          setProgress(prev => ({ ...prev, team_id: response.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const fetchProgressEntry = async (progressId) => {
    setLoading(true);
    try {
      const response = await apiService.getProgressEntry(progressId);
      if (response.success) {
        setProgress({
          team_id: response.data.team_id,
          milestone: response.data.milestone,
          percentage: response.data.percentage,
          notes: response.data.notes || '',
          completed_at: response.data.completed_at ? new Date(response.data.completed_at).toISOString().slice(0, 16) : '',
        });
      } else {
        setError(response.message || 'Failed to load progress entry');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProgress((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isEditing && id) {
        response = await apiService.updateProgress(parseInt(id), progress);
      } else {
        response = await apiService.createProgress(progress);
      }

      if (response.success) {
        navigate('/progress');
      } else {
        setError(response.message || 'Operation failed');
        if (response.errors) {
          setError(Object.values(response.errors).flat().join(', '));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>{isEditing ? 'Edit Progress Entry' : 'Create New Progress Entry'}</h2>
      {error && <p className="error-message">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="team_id">Team</label>
          <select
            id="team_id"
            name="team_id"
            value={progress.team_id}
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
          <label htmlFor="milestone">Milestone</label>
          <input
            type="text"
            id="milestone"
            name="milestone"
            value={progress.milestone}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="percentage">Percentage</label>
          <input
            type="number"
            id="percentage"
            name="percentage"
            value={progress.percentage}
            onChange={handleChange}
            required
            aria-required="true"
            min="0"
            max="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={progress.notes}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="completed_at">Completed At</label>
          <input
            type="datetime-local"
            id="completed_at"
            name="completed_at"
            value={progress.completed_at}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Progress' : 'Create Progress')}
        </button>
        <button type="button" className="button secondary" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ProgressFormPage;
