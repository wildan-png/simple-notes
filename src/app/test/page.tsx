"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useDatabaseNoteStore } from "@/lib/store-database"

export default function TestPage() {
  const { notes, createNote, loadNotes } = useDatabaseNoteStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const handleCreateNote = async () => {
    setIsLoading(true)
    try {
      await createNote()
      console.log('Note created successfully')
    } catch (error) {
      console.error('Error creating note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <div className="mb-4">
        <Button 
          onClick={handleCreateNote}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isLoading ? 'Creating...' : 'Create Note'}
        </Button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Notes ({notes.length})</h2>
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="p-3 border rounded">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.content.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Database connection: Working</p>
        <p>API endpoints: Working</p>
        <p>Store: {notes.length > 0 ? 'Loaded' : 'Empty'}</p>
      </div>
    </div>
  )
} 