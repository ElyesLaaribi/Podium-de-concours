import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Link } from 'react-router-dom';
import './TeamsPage.css';

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTeams();
      if (response.success) {
        setTeams(response.data);
      } else {
        setError(response.message || 'Failed to fetch teams');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await apiService.deleteTeam(id);
        fetchTeams(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete team');
      }
    }
  };

  if (loading) {
    return <div className="page-container">Loading teams...</div>;
  }

  if (error) {
    return <div className="page-container error">Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <h2>Teams Management</h2>
      <Link to="/teams/new" className="button primary">Add New Team</Link>

      {teams.length === 0 ? (
        <p>No teams found. Start by adding a new team!</p>
      ) : (
        <ul className="team-list">
          {teams.map((team) => (
            <li key={team.id} className="team-item">
              <span>{team.name} ({team.code})</span>
              <div className="team-actions">
                <Link to={`/teams/${team.id}`} className="button secondary">View</Link>
                <Link to={`/teams/edit/${team.id}`} className="button secondary">Edit</Link>
                <button onClick={() => handleDelete(team.id)} className="button danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeamsPage;
