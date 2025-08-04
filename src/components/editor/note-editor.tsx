"use client"

import { useState } from "react"
import { useDatabaseNoteStore } from "@/lib/store-database"
import { supabaseDatabaseService } from "@/lib/database-supabase"
import { TitleInput } from "./title-input"
import { RichTextEditor } from "./rich-text-editor"
import { Loader2 } from "lucide-react"

interface NoteEditorProps {
  noteId: string
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes, updateNote, isSaving, isLoading } = useDatabaseNoteStore()
  const note = notes.find(n => n.id === noteId)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleImageUpload = async (file: File) => {
    if (!note) return
    
    setIsUploadingImage(true)
    try {
      // Generate unique ID for the image
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const blobKey = `${noteId}_${imageId}`
      
      // Get image dimensions
      const img = new Image()
      const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.src = URL.createObjectURL(file)
      })
      
      // Create image reference
      const imageReference = {
        id: imageId,
        blobKey,
        alt: file.name,
        width: dimensions.width,
        height: dimensions.height,
      }
      
      // Save image to Supabase images table
      await supabaseDatabaseService.saveImage(noteId, imageReference, file)
      
      // Create image HTML with blob key reference
      const imageHtml = `<img src="/api/images/${blobKey}" alt="${file.name}" class="max-w-full h-auto rounded-lg" data-blob-key="${blobKey}" />`
      
      // Update note content with the new image
      const newContent = note.content + imageHtml
      updateNote(noteId, { content: newContent })
      
    } catch (error) {
      console.error('Error uploading image:', error)
      // Fallback to base64 if Supabase upload fails
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        if (base64 && note) {
          const imageHtml = `<img src="${base64}" alt="${file.name}" class="max-w-full h-auto rounded-lg" />`
          const newContent = note.content + imageHtml
          updateNote(noteId, { content: newContent })
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploadingImage(false)
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
          isUploadingImage={isUploadingImage}
        />
      </div>
      {(isSaving || isUploadingImage) && (
        <div className="note-editor-saving-indicator absolute bottom-4 right-4 text-xs text-muted-foreground flex items-center gap-2">
          {isUploadingImage && <Loader2 className="h-3 w-3 animate-spin" />}
          {isUploadingImage ? "Uploading image..." : "Saving..."}
        </div>
      )}
    </div>
  )
} 