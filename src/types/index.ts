export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images: ImageReference[];
  isPinned: boolean;
}

export interface ImageReference {
  id: string;
  blobKey: string;
  alt: string;
  width: number;
  height: number;
}

export interface NoteStore {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  viewMode: 'list' | 'card';
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  isSaving: boolean;
}

export interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
}

export type SortOption = {
  value: 'createdAt' | 'updatedAt' | 'title';
  label: string;
};

export type ViewMode = 'list' | 'card'; 