import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Book } from "lib/types"

interface BookInfoProps {
  book: Book
}

export function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {book.genre}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{book.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
