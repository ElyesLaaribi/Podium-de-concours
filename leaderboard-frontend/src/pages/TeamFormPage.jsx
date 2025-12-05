import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './Forms.css'; // Assuming shared form styling

function TeamFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState({ name: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchTeam(parseInt(id));
    } else {
      setIsEditing(false);
      setTeam({ name: '', code: '', description: '', color: '#000000', logo_url: '' });
    }
  }, [id]);

  const fetchTeam = async (teamId) => {
    setLoading(true);
    try {
      const response = await apiService.getTeam(teamId);
      if (response.success) {
        setTeam(response.data);
      } else {
        setError(response.message || 'Failed to load team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isEditing && id) {
        response = await apiService.updateTeam(parseInt(id), team);
      } else {
        response = await apiService.createTeam(team);
      }

      if (response.success) {
        navigate('/teams');
      } else {
        setError(response.message || 'Operation failed');
        // Handle validation errors specifically if needed
        if (response.errors) {
          console.error('Validation errors:', response.errors);
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
      <h2>{isEditing ? 'Edit Team' : 'Create New Team'}</h2>
      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          Error: {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="name">Team Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={team.name || ''}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'name-error' : undefined}
          />
          {error && <span id="name-error" className="visually-hidden">{error}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="code">Team Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={team.code || ''}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'code-error' : undefined}
          />
          {error && <span id="code-error" className="visually-hidden">{error}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={team.description || ''}
            onChange={handleChange}
            rows={4}
            aria-invalid={!!error}
            aria-describedby={error ? 'description-error' : undefined}
          ></textarea>
          {error && <span id="description-error" className="visually-hidden">{error}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="color"
            id="color"
            name="color"
            value={team.color || '#000000'}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? 'color-error' : undefined}
          />
          {error && <span id="color-error" className="visually-hidden">{error}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="logo_url">Logo URL</label>
          <input
            type="url"
            id="logo_url"
            name="logo_url"
            value={team.logo_url || ''}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? 'logo_url-error' : undefined}
          />
          {error && <span id="logo_url-error" className="visually-hidden">{error}</span>}
        </div>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Team' : 'Create Team')}
        </button>
        <button type="button" className="button secondary" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TeamFormPage;
