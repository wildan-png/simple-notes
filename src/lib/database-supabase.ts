import { createClient } from '@supabase/supabase-js';
import { Note, ImageReference } from '@/types';

// Singleton pattern to prevent multiple client initializations
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Supabase client initialized with URL:', supabaseUrl);
  }
  
  return supabase;
}

class SupabaseDatabaseService {
  // Note operations
  async getAllNotes(): Promise<Note[]> {
    try {
      const supabase = getSupabaseClient();
      const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get images for each note
      const notesWithImages = await Promise.all(
        notes.map(async (note) => {
          const { data: images } = await supabase
            .from('images')
            .select('id, blob_key, alt, width, height')
            .eq('note_id', note.id);

          return {
            id: note.id as string,
            title: note.title as string,
            content: note.content as string,
            createdAt: new Date(note.created_at as string),
            updatedAt: new Date(note.updated_at as string),
            isPinned: note.is_pinned as boolean,
            images: images?.map(img => ({
              id: img.id as string,
              blobKey: img.blob_key as string,
              alt: img.alt || '',
              width: img.width as number,
              height: img.height as number,
            })) || [],
          };
        })
      );

      return notesWithImages;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  async getNoteById(id: string): Promise<Note | null> {
    try {
      const supabase = getSupabaseClient();
      const { data: note, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }

      // Get images for this note
      const { data: images } = await supabase
        .from('images')
        .select('id, blob_key, alt, width, height')
        .eq('note_id', id);

      return {
        id: note.id as string,
        title: note.title as string,
        content: note.content as string,
        createdAt: new Date(note.created_at as string),
        updatedAt: new Date(note.updated_at as string),
        isPinned: note.is_pinned as boolean,
        images: images?.map(img => ({
          id: img.id as string,
          blobKey: img.blob_key as string,
          alt: (img.alt as string) || '',
          width: img.width as number,
          height: img.height as number,
        })) || [],
      };
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  }

  async saveNote(note: Note): Promise<void> {
    try {
      // Validate note data
      if (!note.id || note.id.trim() === '') {
        throw new Error('Note ID is required and cannot be empty');
      }
      if (!note.title || note.title.trim() === '') {
        throw new Error('Note title is required and cannot be empty');
      }

      // Upsert note (without handling images - they are saved separately)
      const supabase = getSupabaseClient();
      const { error: noteError } = await supabase
        .from('notes')
        .upsert({
          id: note.id,
          title: note.title,
          content: note.content,
          created_at: note.createdAt.toISOString(),
          updated_at: note.updatedAt.toISOString(),
          is_pinned: note.isPinned,
        });

      if (noteError) throw noteError;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  async searchNotes(query: string): Promise<Note[]> {
    try {
      const supabase = getSupabaseClient();
      const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get images for each note
      const notesWithImages = await Promise.all(
        notes.map(async (note) => {
          const { data: images } = await supabase
            .from('images')
            .select('id, blob_key, alt, width, height')
            .eq('note_id', note.id);

          return {
            id: note.id as string,
            title: note.title as string,
            content: note.content as string,
            createdAt: new Date(note.created_at as string),
            updatedAt: new Date(note.updated_at as string),
            isPinned: note.is_pinned as boolean,
            images: images?.map(img => ({
              id: img.id as string,
              blobKey: img.blob_key as string,
              alt: (img.alt as string) || '',
              width: img.width as number,
              height: img.height as number,
            })) || [],
          };
        })
      );

      return notesWithImages;
    } catch (error) {
      console.error('Error searching notes:', error);
      throw error;
    }
  }

  // Image operations
  async saveImage(noteId: string, image: ImageReference, blob: Blob): Promise<void> {
    try {
      console.log('saveImage called with:', { noteId, image, blobSize: blob.size })
      
      // Validate inputs
      if (!noteId || !image || !blob) {
        throw new Error('Missing required parameters for saveImage');
      }
      
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      console.log('Converted blob to Uint8Array, size:', uint8Array.length)

      const insertData = {
        id: image.id,
        note_id: noteId,
        blob_key: image.blobKey,
        alt: image.alt,
        width: image.width,
        height: image.height,
        data: uint8Array,
      }
      
      console.log('About to insert image data:', {
        id: insertData.id,
        note_id: insertData.note_id,
        blob_key: insertData.blob_key,
        alt: insertData.alt,
        width: insertData.width,
        height: insertData.height,
        dataSize: insertData.data.length
      })

      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('images')
        .insert(insertData)
        .select()

      if (error) {
        console.error('Supabase insert error:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error
      }
      
      console.log('Image saved successfully:', data)
    } catch (error) {
      console.error('Error saving image:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  async getImage(blobKey: string): Promise<Blob | null> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('images')
        .select('data')
        .eq('blob_key', blobKey)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }

      // Supabase returns bytea data as a hex-encoded string (e.g., \x7b2230223a312c2231...)
      if (typeof data.data === 'string') {
        try {
          // Remove the \x prefix and convert hex string to Uint8Array
          const hexString = data.data.replace(/\\x/g, '');
          const bytes = new Uint8Array(hexString.length / 2);
          for (let i = 0; i < hexString.length; i += 2) {
            bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
          }
          return new Blob([bytes], { type: 'image/png' });
        } catch (error) {
          console.error('Error decoding hex string:', error);
          return null;
        }
      } else if (data.data instanceof Uint8Array) {
        return new Blob([data.data], { type: 'image/png' });
      } else {
        console.error('Unexpected data type:', typeof data.data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }

  async deleteImage(blobKey: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('blob_key', blobKey);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Utility methods
  async getStorageStats(): Promise<{ noteCount: number; imageCount: number; totalSize: number }> {
    try {
      const supabase = getSupabaseClient();
      const { count: noteCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true });

      const { count: imageCount } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true });

      // For total size, we'd need to sum the data column
      // This is a simplified version
      const totalSize = 0; // TODO: Implement size calculation

      return { 
        noteCount: noteCount || 0, 
        imageCount: imageCount || 0, 
        totalSize 
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      // Delete all images first (due to foreign key constraint)
      await supabase.from('images').delete().neq('id', '');
      
      // Delete all notes
      await supabase.from('notes').delete().neq('id', '');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const supabaseDatabaseService = new SupabaseDatabaseService(); 