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
  }, []);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4 text-center">Your Profile</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Name:</strong> {user.name || 'N/A'}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.email || 'N/A'}
          </li>
        </ul>
      </div>
    </div>
  );
}
