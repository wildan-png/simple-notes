"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import { useDatabaseNoteStore } from "@/lib/store-database"

export function EmptyState() {
  const { createNote } = useDatabaseNoteStore()

  const handleCreateNote = async () => {
    try {
      await createNote()
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  return (
    <div className="empty-state-container flex-1 flex items-center justify-center p-8">
      <div className="empty-state-content text-center">
        <div className="empty-state-icon-container mb-4">
          <FileText className="empty-state-icon h-12 w-12 text-muted-foreground mx-auto" />
        </div>
        <h3 className="empty-state-title text-lg font-medium mb-2">No notes yet</h3>
        <p className="empty-state-description text-muted-foreground mb-6">
          Create your first note to get started
        </p>
        <Button onClick={handleCreateNote} className="empty-state-button">
          <Plus className="empty-state-button-icon h-4 w-4 mr-2" />
          Create Note
        </Button>
      </div>
    </div>
  )
} 