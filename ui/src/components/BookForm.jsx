import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookForm({ book, onSave }) {
  const [formData, setFormData] = useState({
    title: '', author: '', year_published: '', publisher: '',
    isbn: '', country_of_origin: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        year_published: book.year_published || '',
        publisher: book.publisher || '',
        isbn: book.isbn || '',
        country_of_origin: book.country_of_origin || '',
      });
    } else {
      setFormData({
        title: '', author: '', year_published: '',
        publisher: '', isbn: '', country_of_origin: '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData for multipart/form-data request
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (book) {
        await axios.put(`http://localhost:8080/api/books/${book.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:8080/api/books', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSave();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving book');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
      <h4>{book ? 'Update Book' : 'Add New Book'}</h4>

      <div className="row g-2 mb-3">
        <div className="col">
          <input name="title" value={formData.title} onChange={handleChange} className="form-control" placeholder="Title" required />
        </div>
        <div className="col">
          <input name="author" value={formData.author} onChange={handleChange} className="form-control" placeholder="Author" required />
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col">
          <input name="year_published" value={formData.year_published} onChange={handleChange} type="number" className="form-control" placeholder="Year" />
        </div>
        <div className="col">
          <input name="publisher" value={formData.publisher} onChange={handleChange} className="form-control" placeholder="Publisher" />
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col">
          <input name="isbn" value={formData.isbn} onChange={handleChange} className="form-control" placeholder="ISBN" />
        </div>
        <div className="col">
          <input name="country_of_origin" value={formData.country_of_origin} onChange={handleChange} className="form-control" placeholder="Country" />
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-3">
        <input type="file" name="image" onChange={handleFileChange} className="form-control" accept="image/*" />
      </div>

      <button className="btn btn-primary" type="submit">
        {book ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
}
