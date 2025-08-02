"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Check, Loader2 } from "lucide-react"

interface TitleInputProps {
  value: string
  onChange: (value: string) => void
  isSaving: boolean
}

export function TitleInput({ value, onChange, isSaving }: TitleInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    setHasChanges(true)
  }

  const handleBlur = () => {
    if (hasChanges && localValue !== value) {
      onChange(localValue)
      setHasChanges(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (hasChanges && localValue !== value) {
        onChange(localValue)
        setHasChanges(false)
      }
    }
  }

  return (
    <div className="title-input-container flex items-center gap-3">
      <Input
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Note title..."
        className="title-input-field text-xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
      />
      
      {/* Save Status */}
      <div className="title-input-status flex items-center gap-2 text-sm text-muted-foreground">
        {isSaving ? (
          <>
            <Loader2 className="title-input-status-loading-icon h-4 w-4 animate-spin" />
            <span className="title-input-status-loading-text">Saving...</span>
          </>
        ) : hasChanges ? (
          <>
            <div className="title-input-status-unsaved-indicator h-2 w-2 rounded-full bg-yellow-500" />
            <span className="title-input-status-unsaved-text">Unsaved</span>
          </>
        ) : (
          <>
            <Check className="title-input-status-saved-icon h-4 w-4" />
            <span className="title-input-status-saved-text">Saved</span>
          </>
        )}
      </div>
    </div>
  )
} 