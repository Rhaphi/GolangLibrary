import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view your profile.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user profile. You may need to log in again.');
      }
    };

    fetchProfile();
  }, []); // Empty dependency array to run once on mount

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Profile</h2>
      <ul className="list-group">
        <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
      </ul>
    </div>
  );
}