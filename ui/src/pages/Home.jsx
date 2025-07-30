import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '60px',
      }}
    >
      <h1
        style={{
          fontFamily: 'Nexus Heavy, sans-serif',
          fontSize: '64px',
          fontWeight: 700,
          color: '#000',
          marginBottom: '32px',
        }}
      >
        Library Hub
      </h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Link to="/books" className="btn btn-outline-primary">Book List</Link>
        <Link to="/search" className="btn btn-outline-success">Search</Link>
        <Link to="/manage" className="btn btn-outline-warning">Manage</Link>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        {!token ? (
          <>
            <Link to="/login" className="btn btn-outline-secondary">Login</Link>
            <Link to="/register" className="btn btn-outline-secondary">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn btn-outline-info">Profile</Link>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
