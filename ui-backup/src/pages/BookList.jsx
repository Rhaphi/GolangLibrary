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
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (hasNextPage) setPage(page + 1);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Books (Page {page})</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && books.length === 0 && <p>No books found.</p>}

      {books.map((book) => (
        <div className="card mb-3" key={book.id}>
          <div className="card-body">
            <h5 className="card-title">{book.title}</h5>
            <p className="card-text">
              <strong>Author:</strong> {book.author}<br />
              <strong>Publisher:</strong> {book.publisher}<br />
              <strong>Year:</strong> {book.year_published}<br />
              <strong>ISBN:</strong> {book.isbn}<br />
              <strong>Country:</strong> {book.country_of_origin}
            </p>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-primary" onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <button className="btn btn-primary" onClick={handleNext} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
