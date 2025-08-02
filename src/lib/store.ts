import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteStore, ThemeStore } from '@/types';
import { NoteStorage } from './storage';
import { searchNotes, sortNotes, generateId } from './utils';

// Note store
export const useNoteStore = create<NoteStore & {
  // Actions
  loadNotes: () => Promise<void>;
  createNote: () => Promise<string>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  selectNote: (noteId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'list' | 'card') => void;
  setSortBy: (sortBy: 'createdAt' | 'updatedAt' | 'title') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  getFilteredNotes: () => Note[];
}>()(
  persist(
    (set, get) => ({
      // State
      notes: [],
      selectedNoteId: null,
      searchQuery: '',
      viewMode: 'list',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      isLoading: false,
      isSaving: false,

      // Actions
      loadNotes: async () => {
        set({ isLoading: true });
        try {
          const notes = await NoteStorage.getAllNotes();
          set({ notes, isLoading: false });
        } catch (error) {
          console.error('Error loading notes:', error);
          set({ isLoading: false });
        }
      },

      createNote: async () => {
        const newNote: Note = {
          id: generateId(),
          title: 'Untitled Note',
          content: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          images: [],
          isPinned: false,
        };

        set({ isSaving: true });
        try {
          await NoteStorage.saveNote(newNote);
          set(state => ({
            notes: [...state.notes, newNote],
            selectedNoteId: newNote.id,
            isSaving: false,
          }));
          return newNote.id;
        } catch (error) {
          console.error('Error creating note:', error);
          set({ isSaving: false });
          throw error;
        }
      },

      updateNote: async (noteId: string, updates: Partial<Note>) => {
        // Don't set isSaving to true immediately to prevent UI blocking
        const state = get();
        const noteIndex = state.notes.findIndex(n => n.id === noteId);
        
        if (noteIndex === -1) throw new Error('Note not found');
        
        // Update the note in state immediately for responsive UI
        const updatedNote = {
          ...state.notes[noteIndex],
          ...updates,
          updatedAt: new Date(),
        };
        
        // Update state immediately
        set(state => ({
          notes: state.notes.map(n => 
            n.id === noteId ? updatedNote : n
          ),
        }));
        
        // Save to storage in background
        try {
          await NoteStorage.saveNote(updatedNote);
        } catch (error) {
          console.error('Error saving note:', error);
          // Optionally revert the state change on error
          // set(state => ({
          //   notes: state.notes.map(n => 
          //     n.id === noteId ? state.notes[noteIndex] : n
          //   ),
          // }));
        }
      },

      deleteNote: async (noteId: string) => {
        try {
          await NoteStorage.deleteNote(noteId);
          set(state => {
            const newNotes = state.notes.filter(n => n.id !== noteId);
            const newSelectedId = state.selectedNoteId === noteId 
              ? (newNotes.length > 0 ? newNotes[0].id : null)
              : state.selectedNoteId;
            
            return {
              notes: newNotes,
              selectedNoteId: newSelectedId,
            };
          });
        } catch (error) {
          console.error('Error deleting note:', error);
          throw error;
        }
      },

      selectNote: (noteId: string | null) => {
        set({ selectedNoteId: noteId });
      },

      togglePinNote: async (noteId: string) => {
        try {
          const state = get();
          const note = state.notes.find(n => n.id === noteId);
          if (note) {
            const updatedNote = { ...note, isPinned: !note.isPinned };
            await NoteStorage.saveNote(updatedNote);
            set(state => ({
              notes: state.notes.map(n => n.id === noteId ? updatedNote : n)
            }));
          }
        } catch (error) {
          console.error('Error toggling pin:', error);
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setViewMode: (mode: 'list' | 'card') => {
        set({ viewMode: mode });
      },

      setSortBy: (sortBy: 'createdAt' | 'updatedAt' | 'title') => {
        set({ sortBy });
      },

      setSortOrder: (order: 'asc' | 'desc') => {
        set({ sortOrder: order });
      },

      getFilteredNotes: () => {
        const state = get();
        const filtered = searchNotes(state.notes, state.searchQuery);
        return sortNotes(filtered, state.sortBy, state.sortOrder);
      },
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

// Theme store
export const useThemeStore = create<ThemeStore & {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
); 