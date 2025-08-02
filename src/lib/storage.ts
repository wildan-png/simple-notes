import { get, set, del, keys } from 'idb-keyval';
import { Note } from '@/types';

const NOTES_KEY = 'notes';
const IMAGE_PREFIX = 'image_';

export class NoteStorage {
  // Note operations
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notes = await get(NOTES_KEY) || [];
      return notes.map((note: Note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }
      
      await set(NOTES_KEY, notes);
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  static async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const note = notes.find(n => n.id === noteId);
      
      if (note) {
        // Delete associated images
        for (const image of note.images) {
          await this.deleteImage(image.blobKey);
        }
      }
      
      const filteredNotes = notes.filter(n => n.id !== noteId);
      await set(NOTES_KEY, filteredNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // Image operations
  static async saveImage(blobKey: string, blob: Blob): Promise<void> {
    try {
      await set(IMAGE_PREFIX + blobKey, blob);
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  static async getImage(blobKey: string): Promise<Blob | null> {
    try {
      return await get(IMAGE_PREFIX + blobKey) || null;
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }

  static async deleteImage(blobKey: string): Promise<void> {
    try {
      await del(IMAGE_PREFIX + blobKey);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  static async getAllImageKeys(): Promise<string[]> {
    try {
      const allKeys = await keys();
      return allKeys
        .filter(key => typeof key === 'string' && key.startsWith(IMAGE_PREFIX))
        .map(key => (key as string).replace(IMAGE_PREFIX, ''));
    } catch (error) {
      console.error('Error getting image keys:', error);
      return [];
    }
  }

  // Utility methods
  static async clearAllData(): Promise<void> {
    try {
      await del(NOTES_KEY);
      const imageKeys = await this.getAllImageKeys();
      for (const key of imageKeys) {
        await this.deleteImage(key);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  static async getStorageSize(): Promise<number> {
    try {
      const notes = await this.getAllNotes();
      const imageKeys = await this.getAllImageKeys();
      
      let totalSize = 0;
      
      // Estimate notes size (JSON string)
      totalSize += JSON.stringify(notes).length;
      
      // Get actual image sizes
      for (const key of imageKeys) {
        const image = await this.getImage(key);
        if (image) {
          totalSize += image.size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }
} 