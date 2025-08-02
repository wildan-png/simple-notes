"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pin, MoreVertical } from "lucide-react"
import { useDatabaseNoteStore } from "@/lib/store-database"
import { Note } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const { selectedNoteId, selectNote, deleteNote, togglePinNote } = useDatabaseNoteStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingPin, setIsTogglingPin] = useState(false)
  const isSelected = selectedNoteId === note.id

  const handleSelect = () => {
    selectNote(note.id)
  }

  const handleDelete = async () => {
    if (isDeleting) return
    
    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }
    
    setIsDeleting(true)
    try {
      await deleteNote(note.id)
      console.log('Note deleted successfully')
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePin = async () => {
    if (isTogglingPin) return
    
    setIsTogglingPin(true)
    try {
      await togglePinNote(note.id)
      console.log('Pin toggled successfully')
    } catch (error) {
      console.error('Error toggling pin:', error)
      alert('Failed to toggle pin. Please try again.')
    } finally {
      setIsTogglingPin(false)
    }
  }

  return (
    <Card 
      className={`note-card cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={handleSelect}
    >
      <CardContent className="note-card-content p-4">
        <div className="note-card-header flex items-start justify-between gap-2 mb-3">
          <div className="note-card-title-container flex-1 min-w-0">
            <h3 className="note-card-title font-medium line-clamp-2">
              {note.title}
            </h3>
          </div>
          <div className="note-card-actions flex items-center gap-1">
            {note.isPinned && (
              <Pin className="note-card-pin-icon h-4 w-4 text-primary" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="note-card-more-button h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isDeleting || isTogglingPin}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={handleTogglePin}
                  disabled={isTogglingPin}
                >
                  {isTogglingPin ? 'Toggling...' : (note.isPinned ? 'Unpin' : 'Pin')} Note
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Note'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="note-card-preview text-sm text-muted-foreground line-clamp-4 mb-3">
          {note.content.replace(/<[^>]*>/g, '')}
        </div>
        
        <div className="note-card-meta text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  )
} 