"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { ViewToggle } from "@/components/notes/view-toggle"
import { useDatabaseNoteStore } from "@/lib/store-database"

export function Header() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useDatabaseNoteStore()

  return (
    <header className="header-container border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="header-content container flex h-14 items-center gap-4 px-4">
        <div className="header-logo mr-auto">
          <h1 className="header-title text-lg font-semibold">Simple Notes</h1>
        </div>
        
        <div className="header-search flex-1 max-w-sm">
          <Input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
        </div>
        
        <div className="header-controls flex items-center gap-2">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 