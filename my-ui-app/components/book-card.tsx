import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-md">
          <Image
            src={book.cover || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {book.genre}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/book/${book.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
