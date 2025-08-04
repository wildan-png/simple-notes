-- Notes table
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Images table
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  blob_key TEXT NOT NULL,
  alt TEXT,
  width INTEGER,
  height INTEGER,
  data BYTEA NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_notes_updated_at ON notes (updated_at);
CREATE INDEX idx_notes_created_at ON notes (created_at);
CREATE INDEX idx_notes_title ON notes (title);
CREATE INDEX idx_images_note_id ON images (note_id); 