"use client"

import { useDatabaseNoteStore } from "@/lib/store-database"
import { TitleInput } from "./title-input"
import { RichTextEditor } from "./rich-text-editor"

interface NoteEditorProps {
  noteId: string
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes, updateNote, isSaving, isLoading } = useDatabaseNoteStore()
  const note = notes.find(n => n.id === noteId)

  const handleImageUpload = async (file: File) => {
    try {
      // Convert file to base64 for now (in production, you'd upload to a service)
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        if (base64 && note) {
          // Insert image into editor content at cursor position
          const imageHtml = `<img src="${base64}" alt="${file.name}" class="max-w-full h-auto rounded-lg" />`
          const newContent = note.content + imageHtml
          updateNote(noteId, { content: newContent })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="note-editor-loading-container flex-1 flex items-center justify-center">
        <div className="note-editor-loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="note-editor-not-found-container flex-1 flex items-center justify-center text-muted-foreground">
        <p>Note not found</p>
      </div>
    )
  }

  return (
    <div className="note-editor-container flex-1 flex flex-col h-full">
      <div className="note-editor-content flex-1 flex flex-col p-4">
        <TitleInput 
          value={note.title} 
          onChange={(title) => updateNote(noteId, { title })} 
          isSaving={isSaving}
        />
        <RichTextEditor 
          content={note.content} 
          onContentChange={(content) => updateNote(noteId, { content })} 
          onImageUpload={handleImageUpload}
        />
      </div>
      {isSaving && (
        <div className="note-editor-saving-indicator absolute bottom-4 right-4 text-xs text-muted-foreground">
          Saving...
        </div>
      )}
    </div>
  )
} 