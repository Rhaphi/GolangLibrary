// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import BookList from './pages/BookList';
import Search from './pages/SearchBooks';
import Manage from './pages/EditBook';
import Login from './pages/Login';       
import Register from './pages/Register';
import Profile from './pages/Profile'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/login" element={<Login />} />       
        <Route path="/register" element={<Register />} /> 
        <Route path="/profile" element={<Profile />} />   
      </Routes>
    </Router>
  );
}

export default App;
