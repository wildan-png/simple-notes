import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Note, ImageReference } from '@/types';

// Database configuration
const DB_PATH = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), 'data', 'notes.db')
  : path.join(process.cwd(), 'data', 'notes-dev.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

class DatabaseService {
  private db: Database.Database | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      this.db = new Database(DB_PATH);
      this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Create notes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        is_pinned BOOLEAN DEFAULT FALSE
      )
    `);

    // Create images table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        note_id TEXT NOT NULL,
        blob_key TEXT NOT NULL,
        alt TEXT,
        width INTEGER,
        height INTEGER,
        data BLOB NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes (updated_at);
      CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);
      CREATE INDEX IF NOT EXISTS idx_notes_title ON notes (title);
      CREATE INDEX IF NOT EXISTS idx_images_note_id ON images (note_id);
    `);
  }

  // Note operations
  async getAllNotes(): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const notesStmt = this.db.prepare(`
      SELECT id, title, content, created_at, updated_at, is_pinned
      FROM notes
      ORDER BY is_pinned DESC, updated_at DESC
    `);

    const imagesStmt = this.db.prepare(`
      SELECT id, blob_key, alt, width, height
      FROM images
      WHERE note_id = ?
    `);

    const notes = notesStmt.all() as any[];
    
    return notes.map(note => {
      const images = imagesStmt.all(note.id) as ImageReference[];
      return {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        isPinned: Boolean(note.is_pinned),
        images: images.map(img => ({
          id: img.id,
          blobKey: img.blobKey,
          alt: img.alt || '',
          width: img.width,
          height: img.height,
        })),
      };
    });
  }

  async getNoteById(id: string): Promise<Note | null> {
    if (!this.db) throw new Error('Database not initialized');

    const noteStmt = this.db.prepare(`
      SELECT id, title, content, created_at, updated_at, is_pinned
      FROM notes
      WHERE id = ?
    `);

    const imagesStmt = this.db.prepare(`
      SELECT id, blob_key, alt, width, height
      FROM images
      WHERE note_id = ?
    `);

    const note = noteStmt.get(id) as any;
    if (!note) return null;

    const images = imagesStmt.all(id) as ImageReference[];

    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
      isPinned: Boolean(note.is_pinned),
      images: images.map(img => ({
        id: img.id,
        blobKey: img.blobKey,
        alt: img.alt || '',
        width: img.width,
        height: img.height,
      })),
    };
  }

  async saveNote(note: Note): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Validate note data
    if (!note.id || note.id.trim() === '') {
      throw new Error('Note ID is required and cannot be empty');
    }
    if (!note.title || note.title.trim() === '') {
      throw new Error('Note title is required and cannot be empty');
    }

    const transaction = this.db.transaction(() => {
      // Insert or update note
      const upsertNoteStmt = this.db!.prepare(`
        INSERT INTO notes (id, title, content, created_at, updated_at, is_pinned)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          content = excluded.content,
          updated_at = excluded.updated_at,
          is_pinned = excluded.is_pinned
      `);

      upsertNoteStmt.run(
        note.id,
        note.title,
        note.content,
        note.createdAt.toISOString(),
        note.updatedAt.toISOString(),
        note.isPinned ? 1 : 0
      );

      // Delete existing images for this note
      const deleteImagesStmt = this.db!.prepare(`
        DELETE FROM images WHERE note_id = ?
      `);
      deleteImagesStmt.run(note.id);

      // Insert new images
      if (note.images && note.images.length > 0) {
        const insertImageStmt = this.db!.prepare(`
          INSERT INTO images (id, note_id, blob_key, alt, width, height, data)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const image of note.images) {
          // Note: We don't have the actual blob data here, so we'll skip images for now
          // In a real implementation, you'd need to handle blob storage separately
          console.warn('Image saving not implemented yet:', image.id);
        }
      }
    });

    transaction();
  }

  async deleteNote(noteId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteStmt = this.db.prepare(`
      DELETE FROM notes WHERE id = ?
    `);
    
    const result = deleteStmt.run(noteId);
    if (result.changes === 0) {
      throw new Error('Note not found');
    }
  }

  async searchNotes(query: string): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const searchStmt = this.db.prepare(`
      SELECT id, title, content, created_at, updated_at, is_pinned
      FROM notes
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY is_pinned DESC, updated_at DESC
    `);

    const searchPattern = `%${query}%`;
    const notes = searchStmt.all(searchPattern, searchPattern) as any[];

    const imagesStmt = this.db.prepare(`
      SELECT id, blob_key, alt, width, height
      FROM images
      WHERE note_id = ?
    `);

    return notes.map(note => {
      const images = imagesStmt.all(note.id) as ImageReference[];
      return {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        isPinned: Boolean(note.is_pinned),
        images: images.map(img => ({
          id: img.id,
          blobKey: img.blobKey,
          alt: img.alt || '',
          width: img.width,
          height: img.height,
        })),
      };
    });
  }

  // Image operations
  async saveImage(noteId: string, image: ImageReference, blob: Blob): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const insertStmt = this.db.prepare(`
      INSERT INTO images (id, note_id, blob_key, alt, width, height, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Convert Blob to Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    insertStmt.run(
      image.id,
      noteId,
      image.blobKey,
      image.alt,
      image.width,
      image.height,
      buffer
    );
  }

  async getImage(blobKey: string): Promise<Blob | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT data FROM images WHERE blob_key = ?
    `);

    const result = stmt.get(blobKey) as any;
    if (!result) return null;

    return new Blob([result.data], { type: 'image/png' });
  }

  async deleteImage(blobKey: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      DELETE FROM images WHERE blob_key = ?
    `);
    
    stmt.run(blobKey);
  }

  // Utility methods
  async getStorageStats(): Promise<{ noteCount: number; imageCount: number; totalSize: number }> {
    if (!this.db) throw new Error('Database not initialized');

    const noteCountStmt = this.db.prepare('SELECT COUNT(*) as count FROM notes');
    const imageCountStmt = this.db.prepare('SELECT COUNT(*) as count FROM images');
    const sizeStmt = this.db.prepare('SELECT SUM(LENGTH(data)) as total_size FROM images');

    const noteCount = (noteCountStmt.get() as any).count;
    const imageCount = (imageCountStmt.get() as any).count;
    const totalSize = (sizeStmt.get() as any).total_size || 0;

    return { noteCount, imageCount, totalSize };
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(() => {
      this.db!.exec('DELETE FROM images');
      this.db!.exec('DELETE FROM notes');
    });

    transaction();
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService(); 