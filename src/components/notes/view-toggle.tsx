"use client"

import { List, Grid3X3 } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

interface ViewToggleProps {
  viewMode: 'list' | 'card'
  onViewModeChange: (mode: 'list' | 'card') => void
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="view-toggle-container flex items-center gap-1">
      <Toggle
        pressed={viewMode === 'list'}
        onPressedChange={() => onViewModeChange('list')}
        size="sm"
        aria-label="List view"
        className="view-toggle-list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={viewMode === 'card'}
        onPressedChange={() => onViewModeChange('card')}
        size="sm"
        aria-label="Card view"
        className="view-toggle-card"
      >
        <Grid3X3 className="h-4 w-4" />
      </Toggle>
    </div>
  )
} 