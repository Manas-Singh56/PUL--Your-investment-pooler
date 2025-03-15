import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';

function JoinGroup({ onJoinGroup, user }) {
  const [groupId, setGroupId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Check if the group exists
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (!groupSnap.exists()) {
        throw new Error("Group not found. Please check the group ID and try again.");
      }
      
      const groupData = groupSnap.data();
      
      // Check if user is already a member
      const isMember = groupData.members.some(member => member.id === user.id);
      
      if (isMember) {
        throw new Error("You are already a member of this group.");
      }
      
      // Add user to group members
      const newMember = {
        id: user.id,
        name: user.name,
        email: user.email,
        contribution: 0,
        joinedAt: serverTimestamp()
      };
      
      await updateDoc(groupRef, {
        members: arrayUnion(newMember)
      });
      
      // Get the updated group data
      const updatedGroupSnap = await getDoc(groupRef);
      const updatedGroupData = updatedGroupSnap.data();
      
      // Create group object for state
      const joinedGroup = {
        id: groupId,
        ...updatedGroupData,
        members: updatedGroupData.members.map(member => ({
          id: member.id,
          name: member.name,
          contribution: member.contribution || 0
        }))
      };
      
      onJoinGroup(joinedGroup);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="join-group-page">
      <h1>Join an Investment Group</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="group-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="groupId">Group ID</label>
          <input
            type="text"
            id="groupId"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
            placeholder="Enter the unique group ID"
          />
        </div>
        <button 
          type="submit" 
          className="btn primary-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Joining...' : 'Join Group'}
        </button>
      </form>
      
      <div className="info-section">
        <h3>How to Join a Group</h3>
        <p>Ask the group creator for the unique group ID. This ID is required to join an existing investment group.</p>
      </div>
    </div>
  );
}

export default JoinGroup;