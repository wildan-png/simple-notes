"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"

import { EditorToolbar } from "./editor-toolbar"

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
  onImageUpload?: (file: File) => void
  isUploadingImage?: boolean
}

export function RichTextEditor({ content, onContentChange, onImageUpload, isUploadingImage = false }: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side before rendering the editor
  useEffect(() => {
    setIsClient(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
          alt: '',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (html !== content) {
        onContentChange(html)
      }
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  // Don't render the editor until we're on the client side
  if (!isClient) {
    return (
      <div className="rich-text-editor-loading-container flex-1 flex items-center justify-center">
        <div className="rich-text-editor-loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!editor) {
    return (
      <div className="rich-text-editor-loading-container flex-1 flex items-center justify-center">
        <div className="rich-text-editor-loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="rich-text-editor-container flex-1 flex flex-col min-h-0">
      <EditorToolbar 
        editor={editor} 
        onImageUpload={onImageUpload} 
        isUploadingImage={isUploadingImage}
      />
      <div className="rich-text-editor-content flex-1 overflow-y-auto p-4">
        <EditorContent 
          editor={editor} 
          className="rich-text-editor-prose prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </div>
  )
} 