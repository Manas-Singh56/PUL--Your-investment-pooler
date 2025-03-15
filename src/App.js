import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          joined: currentUser.metadata.creationTime
        });
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setUser(null);
        setIsLoggedIn(false);
        setCurrentGroup(null);
      }
      setLoading(false);
    });

    // Clean up the observer on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Auth state listener will handle the state update
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCreateGroup = (groupData) => {
    setCurrentGroup(groupData);
  };

  const handleJoinGroup = (groupData) => {
    setCurrentGroup(groupData);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                isLoggedIn ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/create-group" 
              element={
                isLoggedIn ? 
                <CreateGroup onCreateGroup={handleCreateGroup} user={user} /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/join-group" 
              element={
                isLoggedIn ? 
                <JoinGroup onJoinGroup={handleJoinGroup} user={user} /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn ? 
                <Dashboard user={user} group={currentGroup} /> : 
                <Navigate to="/login" />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;