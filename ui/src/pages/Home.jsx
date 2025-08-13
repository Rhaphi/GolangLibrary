import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); 
    navigate('/login');
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-2 fw-bold mb-5" style={{ fontFamily: 'Nexus Heavy, sans-serif' }}>
          Library Hub
        </h1>

        <div className="mb-4 d-flex justify-content-center flex-wrap gap-3">
          <Link to="/books" className="btn btn-outline-primary px-4">Book List</Link>
          <Link to="/search" className="btn btn-outline-success px-4">Search</Link>
          <Link to="/manage" className="btn btn-outline-warning px-4">Manage</Link>
        </div>

        <div className="d-flex justify-content-center flex-wrap gap-3">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-outline-secondary px-4">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary px-4">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-outline-info px-4">Profile</Link>
              <button className="btn btn-outline-danger px-4" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
