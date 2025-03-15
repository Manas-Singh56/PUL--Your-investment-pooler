import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to InvestGroup</h1>
      <p>A platform for creating and managing investment groups with friends and family.</p>
      <div className="cta-buttons">
        <Link to="/login" className="btn primary-btn">Get Started</Link>
        <Link to="/" className="btn secondary-btn">Learn More</Link>
      </div>
      <div className="features">
        <div className="feature">
          <h3>Create Investment Groups</h3>
          <p>Start your own investment group and invite others to join.</p>
        </div>
        <div className="feature">
          <h3>Track Contributions</h3>
          <p>Monitor individual contributions and group progress.</p>
        </div>
        <div className="feature">
          <h3>Achieve Goals Together</h3>
          <p>Reach investment targets as a team.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
