"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { NoteList } from "@/components/notes/note-list"
import { NoteEditor } from "@/components/editor/note-editor"
import { useDatabaseNoteStore } from "@/lib/store-database"

export default function HomePage() {
  const { selectedNoteId, loadNotes } = useDatabaseNoteStore()

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  return (
    <div className="home-page-container min-h-screen bg-background">
      <Header />
      <main className="home-page-main-content flex h-[calc(100vh-3.5rem)]">
        {/* Note List - Always visible on desktop */}
        <div className="home-page-note-list-container w-full md:w-1/2 lg:w-2/5 border-r flex flex-col h-full">
          <NoteList />
        </div>
        
        {/* Note Editor - Hidden on mobile, visible on desktop when note selected */}
        <div className="home-page-editor-container hidden md:block md:w-1/2 lg:w-3/5">
          {selectedNoteId ? (
            <NoteEditor noteId={selectedNoteId} />
          ) : (
            <div className="home-page-editor-placeholder flex-1 flex items-center justify-center text-muted-foreground">
              <div className="home-page-editor-placeholder-content text-center">
                <p className="home-page-editor-placeholder-title text-lg font-medium mb-2">Select a note</p>
                <p className="home-page-editor-placeholder-description text-sm">Choose a note from the list to start editing</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
