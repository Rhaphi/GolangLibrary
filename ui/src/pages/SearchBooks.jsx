import React, { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  const baseURL = 'http://localhost:8080/api';

  const handleSearch = async () => {
    if (!title && !author) {
      setError('Please enter a title or author to search.');
      setBooks([]);
      return;
    }

    let url;
    const params = new URLSearchParams();

    // Determine which endpoint to use based on input
    if (title && !author) {
      // Search by title using /api/books/title/{title}
      url = `${baseURL}/books/title/${encodeURIComponent(title)}`;
    } else if (author && !title) {
      // Search by author using /api/books/author?author=...
      url = `${baseURL}/books/author`;
      params.append('author', author);
      url += `?${params.toString()}`;
    } else {
      // If both title and author are provided, prioritize title or adjust as needed
      // For now, we'll use title search as an example; adjust based on your app's needs
      url = `${baseURL}/books/title/${encodeURIComponent(title)}`;
    }

    try {
      const res = await axios.get(url);
      // Both /api/books/title/{title} and /api/books/author return arrays directly
      setBooks(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError('No books found or an error occurred.');
      setBooks([]);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <h2 className="mb-4" style={{ fontSize: '36px' }}>🔍 Search Books</h2>

      <div style={{ maxWidth: '500px', width: '100%' }} className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && (
        <div className="alert alert-danger w-100 text-center" style={{ maxWidth: '500px' }}>
          {error}
        </div>
      )}

      <div style={{ maxWidth: '600px', width: '100%' }}>
        {books.map(book => (
          <div key={book.id} className="card mb-2">
            <div className="card-body">
              <h5 className="card-title">{book.title}</h5>
              <p className="card-text">Author: {book.author}</p>
              <p className="card-text">Published: {book.year_published}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}