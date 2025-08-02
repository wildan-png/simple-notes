"use client"

import { useDatabaseNoteStore } from "@/lib/store-database"
import { TitleInput } from "./title-input"
import { RichTextEditor } from "./rich-text-editor"
import { EditorToolbar } from "./editor-toolbar"

interface NoteEditorProps {
  noteId: string
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes, updateNote, isSaving, isLoading } = useDatabaseNoteStore()
  const note = notes.find(n => n.id === noteId)

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
      <EditorToolbar note={note} />
      <div className="note-editor-content flex-1 flex flex-col p-4">
        <TitleInput 
          title={note.title} 
          onTitleChange={(title) => updateNote(noteId, { title })} 
        />
        <RichTextEditor 
          content={note.content} 
          onContentChange={(content) => updateNote(noteId, { content })} 
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