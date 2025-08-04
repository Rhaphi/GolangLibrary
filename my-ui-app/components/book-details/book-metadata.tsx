import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash, Building, BookOpen, Globe, Calendar } from "lucide-react"
import type { Book } from "lib/types"

interface BookMetadataProps {
  book: Book
}

export function BookMetadata({ book }: BookMetadataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">ISBN</p>
              <p className="text-sm text-muted-foreground">{book.isbn}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Publisher</p>
              <p className="text-sm text-muted-foreground">{book.publisher}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Pages</p>
              <p className="text-sm text-muted-foreground">{book.pages}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-muted-foreground">{book.language}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Published</p>
              <p className="text-sm text-muted-foreground">{book.publishedDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
