"use client"

import { useState, useEffect } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Image, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Editor } from "@tiptap/react"

interface EditorToolbarProps {
  editor?: Editor
  onImageUpload?: (file: File) => void
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)

  // Check for selected image on every render
  useEffect(() => {
    const checkSelectedImage = () => {
      const img = document.querySelector('.ProseMirror img.selected') as HTMLImageElement
      setSelectedImage(img)
    }
    
    // Check immediately
    checkSelectedImage()
    
    // Set up observer to watch for changes
    const observer = new MutationObserver(checkSelectedImage)
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && onImageUpload) {
        onImageUpload(file)
      }
    }
    input.click()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border-b p-2 flex items-center gap-1">
      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-active={editor.isActive('bold')}
        className="data-[active=true]:bg-accent"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={editor.isActive('italic')}
        className="data-[active=true]:bg-accent"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-active={editor.isActive('underline')}
        className="data-[active=true]:bg-accent"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        data-active={editor.isActive('bulletList')}
        className="data-[active=true]:bg-accent"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        data-active={editor.isActive('orderedList')}
        className="data-[active=true]:bg-accent"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        data-active={editor.isActive({ textAlign: 'left' })}
        className="data-[active=true]:bg-accent"
        title="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        data-active={editor.isActive({ textAlign: 'center' })}
        className="data-[active=true]:bg-accent"
        title="Align center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        data-active={editor.isActive({ textAlign: 'right' })}
        className="data-[active=true]:bg-accent"
        title="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        data-active={editor.isActive({ textAlign: 'justify' })}
        className="data-[active=true]:bg-accent"
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Image Upload */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleImageUpload}
        title="Insert image"
      >
        <Image className="h-4 w-4" />
      </Button>

      {/* Image Remove */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const { state } = editor
          const { selection } = state
          if (selection.empty) {
            // Find the image node at cursor position
            const pos = selection.$from.pos
            const node = state.doc.nodeAt(pos)
            if (node && node.type.name === 'image') {
              // Remove the image
              editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
            }
          } else {
            // Remove selected content
            editor.chain().focus().deleteSelection().run()
          }
        }}
        title="Remove image"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Image Controls - Only show when image is selected */}
      {selectedImage && (
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-muted-foreground">Image:</span>
          <span className="text-xs text-blue-500" id="image-size-indicator">
            {selectedImage.style.width || selectedImage.getAttribute('width') || 'Auto'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.style.width = '150px'
                  selectedImage.style.height = 'auto'
                  selectedImage.setAttribute('width', '150px')
                  
                  // Update size indicator
                  const sizeIndicator = document.getElementById('image-size-indicator')
                  if (sizeIndicator) {
                    sizeIndicator.textContent = '150px'
                  }
                }
              }}
              title="Small (150px)"
              className="text-xs px-2"
            >
              S
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.style.width = '300px'
                  selectedImage.style.height = 'auto'
                  selectedImage.setAttribute('width', '300px')
                  
                  // Update size indicator
                  const sizeIndicator = document.getElementById('image-size-indicator')
                  if (sizeIndicator) {
                    sizeIndicator.textContent = '300px'
                  }
                }
              }}
              title="Medium (300px)"
              className="text-xs px-2"
            >
              M
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.style.width = '500px'
                  selectedImage.style.height = 'auto'
                  selectedImage.setAttribute('width', '500px')
                  
                  // Update size indicator
                  const sizeIndicator = document.getElementById('image-size-indicator')
                  if (sizeIndicator) {
                    sizeIndicator.textContent = '500px'
                  }
                }
              }}
              title="Large (500px)"
              className="text-xs px-2"
            >
              L
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.style.width = ''
                  selectedImage.style.height = ''
                  selectedImage.removeAttribute('width')
                  selectedImage.removeAttribute('height')
                  
                  // Update size indicator
                  const sizeIndicator = document.getElementById('image-size-indicator')
                  if (sizeIndicator) {
                    sizeIndicator.textContent = 'Auto'
                  }
                }
              }}
              title="Original Size"
              className="text-xs px-2"
            >
              O
            </Button>
          </div>
          
          {/* Image Alignment Controls */}
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs text-muted-foreground">Align:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.classList.remove('text-center', 'text-right', 'text-justify')
                  selectedImage.classList.add('text-left')
                }
              }}
              title="Align left"
              className="text-xs px-2"
            >
              L
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.classList.remove('text-left', 'text-right', 'text-justify')
                  selectedImage.classList.add('text-center')
                }
              }}
              title="Align center"
              className="text-xs px-2"
            >
              C
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.classList.remove('text-left', 'text-center', 'text-justify')
                  selectedImage.classList.add('text-right')
                }
              }}
              title="Align right"
              className="text-xs px-2"
            >
              R
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedImage) {
                  selectedImage.classList.remove('text-left', 'text-center', 'text-right')
                  selectedImage.classList.add('text-justify')
                }
              }}
              title="Full width"
              className="text-xs px-2"
            >
              F
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 