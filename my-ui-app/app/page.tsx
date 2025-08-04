"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { BookCard } from "@/components/book-card"
import { getAllBooks, searchBooks } from "@/lib/data"
import type { Book, SearchFilters } from "@/lib/types"

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setBooks(getAllBooks())
  }, [])

  const handleSearch = (filters: SearchFilters) => {
    setIsSearching(true)
    const results = searchBooks(filters)
    setBooks(results)

    if (!filters.title && !filters.author) {
      setBooks(getAllBooks())
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">LibraryHub</h1>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {isSearching ? "Search Results" : "All Books"}
          </h2>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No books found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
