import { NextRequest, NextResponse } from 'next/server';
import { supabaseDatabaseService } from '@/lib/database-supabase';
import { Note } from '@/types';
import { generateId } from '@/lib/utils';

// GET /api/notes - Get all notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let notes: Note[];
    
    if (query) {
      notes = await supabaseDatabaseService.searchNotes(query);
    } else {
      notes = await supabaseDatabaseService.getAllNotes();
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const note: Note = {
      id: generateId(), // Generate ID for new notes
      title: body.title || 'Untitled Note',
      content: body.content || '',
      createdAt: new Date(body.createdAt || Date.now()),
      updatedAt: new Date(body.updatedAt || Date.now()),
      images: body.images || [],
      isPinned: body.isPinned || false,
    };

    await supabaseDatabaseService.saveNote(note);

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

// PUT /api/notes - Update a note
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const existingNote = await supabaseDatabaseService.getNoteById(id);
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    const updatedNote: Note = {
      ...existingNote,
      ...updates,
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

// DELETE /api/notes - Delete a note
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
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