"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { AddBookForm } from "@/components/book-management/add-book-form"
import { EditBookForm } from "@/components/book-management/edit-book-form"
import { BookManagementCard } from "@/components/book-management/book-management-card"
import { Plus, BookOpen } from "lucide-react"
import { bookService } from "@/lib/data"
import { authService } from "@/lib/auth"
import type { Book } from "@/lib/types"
import type { User } from "@/lib/auth"

export default function MyLibraryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      setBooks(bookService.getAllBooks())
    }
  }, [])

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [...prev, newBook])
    setShowAddForm(false)
  }

  const handleEditBook = (updatedBook: Book) => {
    setBooks((prev) => prev.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
    setEditingBook(null)
  }

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please log in to manage your library.</p>
        </div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <AddBookForm onSuccess={handleAddBook} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      </div>
    )
  }

  if (editingBook) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <EditBookForm book={editingBook} onSuccess={handleEditBook} onCancel={() => setEditingBook(null)} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Library</h1>
            <p className="text-muted-foreground">Manage your book collection</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No books in your library</h2>
            <p className="text-muted-foreground mb-6">Start building your collection by adding your first book.</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Book
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookManagementCard key={book.id} book={book} onEdit={setEditingBook} onDelete={handleDeleteBook} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
