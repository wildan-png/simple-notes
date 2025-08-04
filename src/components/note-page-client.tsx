"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NoteEditor } from "@/components/editor/note-editor"
import { NoteList } from "@/components/notes/note-list"
import { Header } from "@/components/layout/header"
import { useRouter } from "next/navigation"
import { useNoteStore } from "@/lib/store"

interface NotePageClientProps {
  noteId?: string
}

export function NotePageClient({ }: NotePageClientProps) {
  const router = useRouter()
  const { selectedNoteId } = useNoteStore()

  return (
    <div className="note-page-container min-h-screen bg-background">
      {/* Header - Always visible */}
      <Header />
      
      {/* Mobile Back Button */}
      <div className="note-page-mobile-back-container md:hidden border-b p-4">
        <div className="note-page-mobile-back-content flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="note-page-mobile-back-button h-8 w-8 p-0"
          >
            <ArrowLeft className="note-page-mobile-back-icon h-4 w-4" />
            <span className="sr-only">Back to notes</span>
          </Button>
          <h1 className="note-page-mobile-back-title text-lg font-semibold">Edit Note</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="note-page-main-content flex h-[calc(100vh-3.5rem)]">
        {/* Note List - Always visible on desktop */}
        <div className="note-page-note-list-container w-full md:w-1/2 lg:w-2/5 border-r flex flex-col h-full">
          <NoteList />
        </div>
        
        {/* Note Editor - Hidden on mobile, visible on desktop when note selected */}
        <div className="note-page-editor-container hidden md:block md:w-1/2 lg:w-3/5">
          {selectedNoteId ? (
            <NoteEditor noteId={selectedNoteId} />
          ) : (
            <div className="note-page-editor-placeholder flex-1 flex items-center justify-center text-muted-foreground">
              <div className="note-page-editor-placeholder-content text-center">
                <p className="note-page-editor-placeholder-title text-lg font-medium mb-2">Select a note</p>
                <p className="note-page-editor-placeholder-description text-sm">Choose a note from the list to start editing</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Layout - Full screen editor (only when note is selected) */}
      {selectedNoteId && (
        <div className="note-page-mobile-editor-container md:hidden h-[calc(100vh-3.5rem)]">
          <NoteEditor noteId={selectedNoteId} />
        </div>
      )}
    </div>
  )
} 