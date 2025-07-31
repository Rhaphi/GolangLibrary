import { useEffect, useState } from 'react';
import axios from 'axios';

export function useBooks(page, pageSize = 10) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let cancel = false;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/books?page=${page}&page_size=${pageSize}`);

        if (!cancel) {
          const data = res.data;
          setBooks(data.books); // ✅ FIXED: Use the array from the response
          setHasNextPage(page * pageSize < data.total_count); // ✅ Use total_count to calculate
        }
      } catch (err) {
        if (!cancel) {
          setError('Failed to fetch books');
          console.error(err);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      cancel = true;
    };
  }, [page, pageSize]);

  return { books, error, loading, hasNextPage };
}
