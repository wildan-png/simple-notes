"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AIGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (prompt: string) => Promise<string>
  isGenerating: boolean
}

export function AIGenerationModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    try {
      const result = await onGenerate(prompt.trim())
      if (result) {
        setPrompt("")
        onClose()
      }
    } catch (error) {
      console.error("AI generation failed:", error)
    }
  }

  const handleCancel = () => {
    setPrompt("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Text Generation
          </DialogTitle>
          <DialogDescription>
            Describe what kind of text you want to generate. Be specific for better results.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt" className="text-sm font-medium">
              What would you like to write about?
            </Label>
            <Textarea
              id="ai-prompt"
              placeholder="e.g., Write a professional email to schedule a meeting with a client about project updates..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="min-h-[120px] resize-none"
            />
          </div>
          
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating your text...</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 