import { Note, ImageReference } from '@/types';

const API_BASE = '/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Note operations
  async getAllNotes(): Promise<Note[]> {
    const response = await this.request<{ notes: Note[] }>('/notes');
    return response.notes;
  }

  async getNoteById(id: string): Promise<Note> {
    const response = await this.request<{ note: Note }>(`/notes/${id}`);
    return response.note;
  }

  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    const response = await this.request<{ note: Note }>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    return response.note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const response = await this.request<{ note: Note }>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.note;
  }

  async deleteNote(id: string): Promise<void> {
    await this.request(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async searchNotes(query: string): Promise<Note[]> {
    const response = await this.request<{ notes: Note[] }>(`/notes?q=${encodeURIComponent(query)}`);
    return response.notes;
  }

  // Image operations
  async uploadImage(noteId: string, image: ImageReference, blob: Blob): Promise<void> {
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('metadata', JSON.stringify(image));

    await fetch(`${API_BASE}/notes/${noteId}/images`, {
      method: 'POST',
      body: formData,
    });
  }

  async getImage(blobKey: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/images/${blobKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    return response.blob();
  }

  async deleteImage(blobKey: string): Promise<void> {
    await this.request(`/images/${blobKey}`, {
      method: 'DELETE',
    });
  }

  // Utility operations
  async getStorageStats(): Promise<{ noteCount: number; imageCount: number; totalSize: number }> {
    return this.request('/stats');
  }

  async clearAllData(): Promise<void> {
    await this.request('/clear', {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService(); 