"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCover } from "@/components/book-details/book-cover"
import { BookInfo } from "@/components/book-details/book-info"
import { BookMetadata } from "@/components/book-details/book-metadata"
import { ArrowLeft } from "lucide-react"
import { getBookById } from "lib/data"

interface BookDetailsPageProps {
  params: {
    id: string
  }
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const book = getBookById(params.id)

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <BookCover book={book} />
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            <BookInfo book={book} />
            <BookMetadata book={book} />
          </div>
        </div>
      </div>
    </div>
  )
}
