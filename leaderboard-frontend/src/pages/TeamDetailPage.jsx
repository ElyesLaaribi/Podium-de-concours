import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import './TeamDetailPage.css';

function TeamDetailPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTeamDetails(parseInt(id));
    }
  }, [id]);

  const fetchTeamDetails = async (teamId) => {
    setLoading(true);
    try {
      const response = await apiService.getTeam(teamId);
      if (response.success) {
        setTeam(response.data);
      } else {
        setError(response.message || 'Failed to fetch team details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading team details...</div>;
  }

  if (error) {
    return <div className="page-container error">Error: {error}</div>;
  }

  if (!team) {
    return <div className="page-container">Team not found.</div>;
  }

  return (
    <div className="page-container">
      <div className="team-detail-card">
        <h2 className="team-name">{team.name} ({team.code})</h2>
        <p className="team-description">{team.description}</p>
        <p><strong>Total Score:</strong> {team.total_score}</p>
        <p><strong>Rank:</strong> {team.rank}</p>
        <p><strong>Active:</strong> {team.is_active ? 'Yes' : 'No'}</p>
        {team.color && <p><strong>Color:</strong> <span style={{ backgroundColor: team.color, padding: '2px 8px', borderRadius: '4px' }}>{team.color}</span></p>}
        {team.logo_url && <p><strong>Logo:</strong> <img src={team.logo_url} alt={`${team.name} logo`} className="team-logo" /></p>}

        <h3>Recent Scores</h3>
        {team.scores && team.scores.length > 0 ? (
          <ul className="detail-list">
            {team.scores.map((score) => (
              <li key={score.id}>
                <strong>{score.challenge_name || 'Challenge'}:</strong> {score.points} points ({new Date(score.achieved_at || '').toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent scores.</p>
        )}

        <h3>Progress Milestones</h3>
        {team.progress && team.progress.length > 0 ? (
          <ul className="detail-list">
            {team.progress.map((progress) => (
              <li key={progress.id}>
                <strong>{progress.milestone}:</strong> {progress.percentage}% completed ({new Date(progress.completed_at || '').toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No progress milestones.</p>
        )}

        <div className="actions">
          <Link to={`/teams/edit/${team.id}`} className="button primary">Edit Team</Link>
          <Link to="/teams" className="button secondary">Back to Teams</Link>
        </div>
      </div>
    </div>
  );
}

export default TeamDetailPage;
