import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';

function CreateGroup({ onCreateGroup, user }) {
  const [groupName, setGroupName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Create a new group document in Firestore
      const groupRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        targetAmount: parseFloat(targetAmount),
        description: description,
        createdBy: user.id,
        createdAt: serverTimestamp(),
        members: [{
          id: user.id,
          name: user.name,
          email: user.email,
          contribution: 0,
          joinedAt: serverTimestamp()
        }],
        totalContributed: 0
      });
      
      // Get the new group ID
      const groupId = groupRef.id;
      
      // Create the group object with the Firestore ID
      const newGroup = {
        id: groupId,
        name: groupName,
        targetAmount: parseFloat(targetAmount),
        description: description,
        members: [{
          id: user.id,
          name: user.name,
          contribution: 0
        }],
        totalContributed: 0,
        createdAt: new Date().toISOString()
      };
      
      onCreateGroup(newGroup);
      navigate('/dashboard');
    } catch (error) {
      setError('Error creating group: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      <h1>Create a New Investment Group</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="group-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="groupName">Group Name</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount ($)</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            min="1"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
        <button 
          type="submit" 
          className="btn primary-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;