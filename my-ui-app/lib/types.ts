export interface Book {
  id: string
  title: string
  author: string
  genre: string
  cover: string
  description: string
  isbn: string
  publisher: string
  pages: number
  language: string
  publishedDate: string
}

export interface SearchFilters {
  title: string
  author: string
}
