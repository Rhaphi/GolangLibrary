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
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Books (Page {page} of {totalPages})</h2>

      <BookForm book={editingBook} onSave={handleSave} />

      <hr />

      <h4>Existing Books</h4>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        books.map((book) => (
          <div className="card mb-3" key={book.id}>
            <div className="card-body">
              <h5>{book.title}</h5>
              <p>Author: {book.author}</p>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(book)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      {/* Pagination buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-primary" onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <button className="btn btn-primary" onClick={handleNext} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

