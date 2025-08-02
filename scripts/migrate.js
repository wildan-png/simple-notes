#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database paths
const DB_PATH = path.join(process.cwd(), 'data', 'notes.db');
const dataDir = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('🚀 Starting migration from IndexedDB to SQLite...');

try {
  // Initialize SQLite database
  const db = new Database(DB_PATH);
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      is_pinned BOOLEAN DEFAULT FALSE
    )
  `);

  db.exec(`
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

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes (updated_at);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);
    CREATE INDEX IF NOT EXISTS idx_notes_title ON notes (title);
    CREATE INDEX IF NOT EXISTS idx_images_note_id ON images (note_id);
  `);

  console.log('✅ Database schema created successfully');

  // Note: In a real migration, you would:
  // 1. Read data from IndexedDB (requires browser context)
  // 2. Transform the data to match the new schema
  // 3. Insert into SQLite database
  
  console.log('📝 Note: Manual migration required');
  console.log('   - Open the app in your browser');
  console.log('   - Create a few test notes');
  console.log('   - The data will be automatically saved to SQLite');
  console.log('   - You can then clear browser storage if needed');

  db.close();
  console.log('✅ Migration script completed');

} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} 