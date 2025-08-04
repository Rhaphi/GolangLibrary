"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen } from "lucide-react"
import type { Book } from "@/lib/types"

interface BookCoverProps {
  book: Book
}

export function BookCover({ book }: BookCoverProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [isReading, setIsReading] = useState(false)

  const handleStartReading = () => {
    setIsReading(true)
    // Simulate reading progress
    const interval = setInterval(() => {
      setReadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 100)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-[3/4] relative mb-6 overflow-hidden rounded-lg">
          <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <Button className="w-full" size="lg" onClick={handleStartReading} disabled={isReading}>
            <BookOpen className="mr-2 h-5 w-5" />
            {isReading ? "Reading..." : "Start Reading"}
          </Button>

          {isReading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reading Progress</span>
                <span>{readingProgress}%</span>
              </div>
              <Progress value={readingProgress} className="w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
