import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import BookForm from '../components/BookForm';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/books?page=${page}&page_size=${pageSize}`);
      setBooks(res.data.books);
      setTotalCount(res.data.total_count);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  }, [page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    setEditingBook(null);
    fetchBooks();
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Manage Books</h2>
      <p className="text-muted text-center">Page {page} of {totalPages}</p>

      {/* Book Form for Add/Edit */}
      <div className="mb-5">
        <BookForm book={editingBook} onSave={handleSave} />
      </div>

      <hr className="mb-4" />

      {/* Existing Books Section */}
      <h4 className="mb-3">Existing Books</h4>

      {books.length === 0 ? (
        <div className="alert alert-info">No books found.</div>
      ) : (
        <div className="row">
          {books.map((book) => (
            <div className="col-md-6 col-lg-4 mb-4" key={book.id}>
              <div className="card h-100 shadow-sm">
                {book.imageURL && (
                  <img
                    src={`http://localhost:8080${book.imageURL}`}
                    alt={`${book.title} cover`}
                    className="card-img-top"
                    style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text text-muted">Author: {book.author}</p>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning w-100"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger w-100"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-5">
        <button className="btn btn-outline-primary" onClick={handlePrev} disabled={page === 1}>
          ← Previous
        </button>
        <button className="btn btn-outline-primary" onClick={handleNext} disabled={page >= totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
}
