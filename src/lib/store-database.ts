import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteStore } from '@/types';
import { apiService } from './api';
import { searchNotes, sortNotes } from './utils';

// Database-backed note store
export const useDatabaseNoteStore = create<NoteStore & {
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
  syncWithServer: () => Promise<void>;
  togglePinNote: (noteId: string) => Promise<void>;
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
          const notes = await apiService.getAllNotes();
          set({ notes, isLoading: false });
          console.log('Notes loaded:', notes.length);
        } catch (error) {
          console.error('Error loading notes from database:', error);
          set({ isLoading: false });
          // Fallback to empty state
          set({ notes: [] });
        }
      },

      createNote: async () => {
        const newNote: Omit<Note, 'id'> = {
          title: 'Untitled Note',
          content: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          images: [],
          isPinned: false,
        };

        set({ isSaving: true });
        try {
          const createdNote = await apiService.createNote(newNote);
          console.log('Note created:', createdNote.id);
          
          // Refresh notes from database to ensure consistency
          await get().loadNotes();
          
          // Set the newly created note as selected
          set({ selectedNoteId: createdNote.id, isSaving: false });
          return createdNote.id;
        } catch (error) {
          console.error('Error creating note:', error);
          set({ isSaving: false });
          throw error;
        }
      },

      updateNote: async (noteId: string, updates: Partial<Note>) => {
        const state = get();
        const noteIndex = state.notes.findIndex(n => n.id === noteId);
        
        if (noteIndex === -1) {
          console.error('Note not found for update:', noteId);
          throw new Error('Note not found');
        }
        
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
        
        // Save to database in background
        try {
          await apiService.updateNote(noteId, updates);
          console.log('Note updated:', noteId);
        } catch (error) {
          console.error('Error saving note to database:', error);
          // Revert the state change on error
          set(state => ({
            notes: state.notes.map(n => 
              n.id === noteId ? state.notes[noteIndex] : n
            ),
          }));
          throw error;
        }
      },

      deleteNote: async (noteId: string) => {
        try {
          console.log('Deleting note:', noteId);
          await apiService.deleteNote(noteId);
          console.log('Note deleted successfully:', noteId);
          
          // Refresh notes from database to ensure consistency
          await get().loadNotes();
          
          // Update selected note if the deleted note was selected
          const state = get();
          if (state.selectedNoteId === noteId) {
            const newSelectedId = state.notes.length > 0 ? state.notes[0].id : null;
            set({ selectedNoteId: newSelectedId });
          }
        } catch (error) {
          console.error('Error deleting note:', error);
          throw error;
        }
      },

      selectNote: (noteId: string | null) => {
        if (noteId) {
          const state = get();
          const noteExists = state.notes.some(n => n.id === noteId);
          if (!noteExists) {
            console.warn('Selected note not found in state, refreshing notes...');
            get().loadNotes().then(() => {
              // Try to select again after refresh
              const refreshedState = get();
              const noteExistsAfterRefresh = refreshedState.notes.some(n => n.id === noteId);
              if (noteExistsAfterRefresh) {
                set({ selectedNoteId: noteId });
              } else {
                console.error('Note not found even after refresh:', noteId);
                set({ selectedNoteId: null });
              }
            });
            return;
          }
        }
        set({ selectedNoteId: noteId });
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
        let filteredNotes = state.notes;

        // Apply search filter
        if (state.searchQuery.trim()) {
          filteredNotes = searchNotes(filteredNotes, state.searchQuery);
        }

        // Apply sorting
        filteredNotes = sortNotes(filteredNotes, state.sortBy, state.sortOrder);

        return filteredNotes;
      },

      syncWithServer: async () => {
        try {
          await get().loadNotes();
        } catch (error) {
          console.error('Error syncing with server:', error);
        }
      },

      togglePinNote: async (noteId: string) => {
        const state = get();
        const note = state.notes.find(n => n.id === noteId);
        
        if (!note) {
          console.error('Note not found for pin toggle:', noteId);
          throw new Error('Note not found');
        }
        
        const newPinnedState = !note.isPinned;
        console.log('Toggling pin for note:', noteId, 'New state:', newPinnedState);
        
        // Update state immediately
        set(state => ({
          notes: state.notes.map(n => 
            n.id === noteId ? { ...n, isPinned: newPinnedState } : n
          ),
        }));
        
        // Save to database in background
        try {
          await apiService.updateNote(noteId, { isPinned: newPinnedState });
          console.log('Pin toggled successfully:', noteId);
          
          // Refresh notes from database to ensure consistency
          await get().loadNotes();
        } catch (error) {
          console.error('Error toggling pin:', error);
          // Revert state change on error
          set(state => ({
            notes: state.notes.map(n => 
              n.id === noteId ? { ...n, isPinned: !newPinnedState } : n
            ),
          }));
          throw error;
        }
      },
    }),
    {
      name: 'database-notes-storage',
      partialize: (state) => ({
        selectedNoteId: state.selectedNoteId,
        searchQuery: state.searchQuery,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
); 