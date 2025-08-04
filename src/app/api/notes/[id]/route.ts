import { NextRequest, NextResponse } from 'next/server';
import { supabaseDatabaseService } from '@/lib/database-supabase';

// GET /api/notes/[id] - Get a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }
    
    const note = await supabaseDatabaseService.getNoteById(id);
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update a specific note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const existingNote = await supabaseDatabaseService.getNoteById(id);
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    const updatedNote = {
      ...existingNote,
      ...body,
      updatedAt: new Date(),
    };

    await supabaseDatabaseService.saveNote(updatedNote);

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }
    
    await supabaseDatabaseService.deleteNote(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 