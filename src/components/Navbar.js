import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  console.log("Navbar isLoggedIn:", isLoggedIn); // For debugging

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">InvestGroup</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="navbar-item">Dashboard</Link>
            <Link to="/create-group" className="navbar-item">Create Group</Link>
            <Link to="/join-group" className="navbar-item">Join Group</Link>
            <button onClick={onLogout} className="navbar-item logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar-item">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
