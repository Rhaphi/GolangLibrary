import React, { useState, useEffect } from 'react';
import { useBooks } from '../components/useBook';

export default function BookList() {
  const [page, setPage] = useState(1);
  const { books, error, loading, hasNextPage } = useBooks(page, 10);

  useEffect(() => {
    if (!loading && books.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [books, loading, page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (hasNextPage) setPage((prev) => prev + 1);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Books</h2>
        <span className="text-muted">Page {page}</span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && <div className="text-center">Loading...</div>}

      {!loading && books.length === 0 && (
        <div className="alert alert-warning" role="alert">
          No books found.
        </div>
      )}

      {!loading &&
        books.map((book) => (
          <div className="card mb-3 shadow-sm" key={book.id}>
            <div className="row g-0">
              <div className="col-md-2">
                <img
                  src={book.image_url ? `http://localhost:8080${book.image_url}`: `https://via.placeholder.com/150x220?text=No+Image`}
                  alt={book.title}
                  className="img-fluid rounded-start"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150x220?text=No+Image';
                  }}
                />
              </div>
              <div className="col-md-10">
                <div className="card-body">
                  <h5 className="card-title mb-2">{book.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Publisher:</strong> {book.publisher}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Year:</strong> {book.year_published}
                  </p>
                  <p className="card-text mb-1">
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                  <p className="card-text">
                    <strong>Country:</strong> {book.country_of_origin}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={handlePrev}
          disabled={page === 1}
        >
          &larr; Prev
        </button>
        
        {hasNextPage && (
          <button
            className="btn btn-outline-primary"
            onClick={handleNext}
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
