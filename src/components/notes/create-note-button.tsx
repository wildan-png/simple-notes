"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDatabaseNoteStore } from "@/lib/store-database"

export function CreateNoteButton() {
  const { createNote } = useDatabaseNoteStore()

  const handleCreateNote = async () => {
    try {
      await createNote()
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  return (
    <Button 
      onClick={handleCreateNote}
      className="create-note-button w-full"
      size="sm"
    >
      <Plus className="create-note-button-icon h-4 w-4 mr-2" />
      Create Note
    </Button>
  )
} 