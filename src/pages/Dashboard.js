import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from '../firebase';

function Dashboard({ user }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isContributing, setIsContributing] = useState(false);
  const [error, setError] = useState('');

  // Fetch user's groups from Firestore
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      try {
        // Query for groups where the user is a member
        const q = query(
          collection(db, "groups"), 
          where(`members.${user.id}`, '!=', null)
        );
        
        const groupsSnapshot = await getDocs(q);
        const groupsList = [];
        
        groupsSnapshot.forEach((doc) => {
          groupsList.push({ id: doc.id, ...doc.data() });
        });
        
        setGroups(groupsList);
        
        // If we have groups, select the first one by default
        if (groupsList.length > 0) {
          setSelectedGroup(groupsList[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError('Failed to load groups');
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [user]);

  const handleContribute = async (e) => {
    e.preventDefault();
    setIsContributing(true);
    setError('');
    
    try {
      const amount = parseFloat(contributionAmount);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      // Reference to the group document
      const groupRef = doc(db, "groups", selectedGroup.id);
      
      // Update the group document
      await updateDoc(groupRef, {
        totalContributed: increment(amount),
        [`members.${user.id}.contribution`]: increment(amount)
      });
      
      // Update local state
      setSelectedGroup(prev => ({
        ...prev,
        totalContributed: prev.totalContributed + amount,
        members: prev.members.map(member => 
          member.id === user.id 
            ? { ...member, contribution: member.contribution + amount }
            : member
        )
      }));
      
      setContributionAmount('');
      setIsContributing(false);
    } catch (error) {
      setError(error.message);
      setIsContributing(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading your groups...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="dashboard-page">
        <h1>Welcome, {user?.name}</h1>
        <div className="no-group-message">
          <p>You haven't created or joined any investment groups yet.</p>
          <div className="cta-buttons">
            <Link to="/create-group" className="btn primary-btn">Create a Group</Link>
            <Link to="/join-group" className="btn secondary-btn">Join a Group</Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = selectedGroup 
    ? (selectedGroup.totalContributed / selectedGroup.targetAmount) * 100 
    : 0;

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user?.name}</h1>
      
      {groups.length > 1 && (
        <div className="group-selector">
          <label htmlFor="groupSelect">Select Group:</label>
          <select 
            id="groupSelect"
            value={selectedGroup?.id}
            onChange={(e) => {
              const group = groups.find(g => g.id === e.target.value);
              setSelectedGroup(group);
            }}
          >
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {selectedGroup && (
        <div className="group-details">
          <h2>{selectedGroup.name}</h2>
          <p>{selectedGroup.description}</p>
          
          <div className="progress-section">
            <div className="progress-info">
              <span>Progress: ${selectedGroup.totalContributed.toFixed(2)} of ${selectedGroup.targetAmount.toFixed(2)}</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="contribution-form">
            <h3>Make a Contribution</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleContribute}>
              <div className="form-group">
                <label htmlFor="contributionAmount">Amount ($)</label>
                <input
                  type="number"
                  id="contributionAmount"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn primary-btn"
                disabled={isContributing}
              >
                {isContributing ? 'Processing...' : 'Contribute'}
              </button>
            </form>
          </div>
          
          <div className="members-section">
            <h3>Group Members</h3>
            <ul className="members-list">
              {selectedGroup.members.map(member => (
                <li key={member.id} className="member-item">
                  <span>{member.name}</span>
                  <span>${member.contribution.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;