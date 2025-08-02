"use client"

import { useEffect } from "react"
import { useDatabaseNoteStore } from "@/lib/store-database"
import { NoteListItem } from "./note-list-item"
import { NoteCard } from "./note-card"
import { CreateNoteButton } from "./create-note-button"
import { EmptyState } from "./empty-state"

export function NoteList() {
  const { 
    notes, 
    viewMode, 
    isLoading, 
    loadNotes, 
    getFilteredNotes 
  } = useDatabaseNoteStore()

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const filteredNotes = getFilteredNotes()

  if (isLoading) {
    return (
      <div className="note-list-loading-container flex-1 p-4">
        <div className="note-list-loading-skeleton space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="note-list-loading-item h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (notes.length === 0) {
    return <EmptyState />
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="note-list-empty-search-container flex-1 p-4">
        <div className="note-list-empty-search-message text-center text-muted-foreground">
          <p>No notes found matching your search.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="note-list-container flex-1 flex flex-col h-full">
      {/* Notes Container */}
      <div className="note-list-content flex-1 overflow-y-auto p-4 scrollbar-thin">
        {viewMode === 'list' ? (
          <div className="note-list-view-list space-y-2">
            {filteredNotes.map((note) => (
              <NoteListItem key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="note-list-view-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      {/* Create Note Button - Sticky at bottom */}
      <div className="note-list-create-button-container p-4 border-t bg-background sticky bottom-0">
        <CreateNoteButton />
      </div>
    </div>
  )
} 