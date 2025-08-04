import type { Book } from "lib/types"

// Initial books data
const initialBooksData: Record<string, Book> = {
  "1": {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    cover: "/placeholder.svg?height=400&width=300",
    description:
      "Set in the summer of 1922, The Great Gatsby follows narrator Nick Carraway's interactions with his mysterious neighbor Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
    pages: 180,
    language: "English",
    publishedDate: "1925",
  },
  "2": {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    cover: "/placeholder.svg?height=400&width=300",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    isbn: "978-0-06-112008-4",
    publisher: "Harper Perennial",
    pages: 376,
    language: "English",
    publishedDate: "1960",
  },
  "3": {
    id: "3",
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    cover: "/placeholder.svg?height=400&width=300",
    description:
      "Winston Smith works for the Ministry of Truth in London, chief city of Airstrip One. Big Brother stares out from every poster.",
    isbn: "978-0-452-28423-4",
    publisher: "Plume",
    pages: 328,
    language: "English",
    publishedDate: "1949",
  },
}

// Book management with localStorage persistence
export const bookService = {
  getAllBooks: (): Book[] => {
    if (typeof window === "undefined") return Object.values(initialBooksData)
    const stored = localStorage.getItem("books")
    const books = stored ? JSON.parse(stored) : initialBooksData
    return Object.values(books)
  },

  getBookById: (id: string): Book | undefined => {
    if (typeof window === "undefined") return initialBooksData[id]
    const stored = localStorage.getItem("books")
    const books = stored ? JSON.parse(stored) : initialBooksData
    return books[id]
  },

  addBook: (book: Omit<Book, "id">): Book => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
    }

    const stored = localStorage.getItem("books")
    const books = stored ? JSON.parse(stored) : initialBooksData
    books[newBook.id] = newBook
    localStorage.setItem("books", JSON.stringify(books))

    return newBook
  },

  updateBook: (id: string, updates: Partial<Book>): Book | null => {
    const stored = localStorage.getItem("books")
    const books = stored ? JSON.parse(stored) : initialBooksData

    if (!books[id]) return null

    books[id] = { ...books[id], ...updates }
    localStorage.setItem("books", JSON.stringify(books))

    return books[id]
  },

  deleteBook: (id: string): boolean => {
    const stored = localStorage.getItem("books")
    const books = stored ? JSON.parse(stored) : initialBooksData

    if (!books[id]) return false

    delete books[id]
    localStorage.setItem("books", JSON.stringify(books))

    return true
  },

  searchBooks: (filters: { title?: string; author?: string }): Book[] => {
    const books = bookService.getAllBooks()

    return books.filter((book) => {
      const titleMatch = !filters.title || book.title.toLowerCase().includes(filters.title.toLowerCase())
      const authorMatch = !filters.author || book.author.toLowerCase().includes(filters.author.toLowerCase())

      return titleMatch && authorMatch
    })
  },
}

// Legacy exports for backward compatibility
export const getAllBooks = bookService.getAllBooks
export const getBookById = bookService.getBookById
export const searchBooks = bookService.searchBooks
