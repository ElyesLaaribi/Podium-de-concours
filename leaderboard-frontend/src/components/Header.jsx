import { Link } from 'react-router-dom';
import React from 'react';
import './Header.css';

function Header() {
  return (
    <nav className="header-nav">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Leaderboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/teams" className="nav-link">Teams Management</Link>
        </li>
        <li className="nav-item">
          <Link to="/scores" className="nav-link">Scores Management</Link>
        </li>
        <li className="nav-item">
          <Link to="/progress" className="nav-link">Progress Management</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
