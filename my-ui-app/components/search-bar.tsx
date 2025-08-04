"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, User, BookOpen } from "lucide-react"
import type { SearchFilters } from "lib/types"

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [titleQuery, setTitleQuery] = useState("")
  const [authorQuery, setAuthorQuery] = useState("")

  const handleSearch = () => {
    onSearch({
      title: titleQuery,
      author: authorQuery,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="relative flex-1">
        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title..."
          className="pl-10"
          value={titleQuery}
          onChange={(e) => setTitleQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="relative flex-1">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by author..."
          className="pl-10"
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Button onClick={handleSearch} className="sm:w-auto">
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </div>
  )
}
