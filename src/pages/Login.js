import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let userCredential;
      
      if (isSigningUp) {
        // Sign up with email and password
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in with email and password
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      // User is signed in
      const user = userCredential.user;
      
      // Pass user data to parent component
      onLogin({
        id: user.uid,
        name: user.displayName || email.split('@')[0], // Use email as name if displayName is not set
        email: user.email,
        joined: user.metadata.creationTime
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <h1>{isSigningUp ? 'Create an Account' : 'Login to Your Account'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn primary-btn">
          {isSigningUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      
      <p>
        {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
        <button 
          onClick={() => setIsSigningUp(!isSigningUp)} 
          className="link-btn"
        >
          {isSigningUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

export default Login;