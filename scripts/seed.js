#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Database paths
const DB_PATH = path.join(process.cwd(), 'data', 'notes.db');
const dataDir = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('🌱 Starting database seeding...');

try {
  // Initialize SQLite database
  const db = new Database(DB_PATH);
  
  // Sample notes data
  const sampleNotes = [
    {
      id: uuidv4(),
      title: 'Welcome to Simple Notes',
      content: `
        <h2>Welcome to your new note-taking app!</h2>
        <p>This is a sample note to get you started. You can:</p>
        <ul>
          <li>Create new notes</li>
          <li>Edit existing notes</li>
          <li>Search through your notes</li>
          <li>Pin important notes</li>
          <li>Switch between light and dark themes</li>
        </ul>
        <p>Your notes are now stored in a SQLite database, so they'll be available across all browsers on this device!</p>
      `,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
      isPinned: true,
    },
    {
      id: uuidv4(),
      title: 'Shopping List',
      content: `
        <h3>Grocery Shopping</h3>
        <ul>
          <li>Milk</li>
          <li>Bread</li>
          <li>Eggs</li>
          <li>Bananas</li>
          <li>Chicken breast</li>
          <li>Rice</li>
        </ul>
        <p><em>Don't forget to check the pantry first!</em></p>
      `,
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      updatedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      isPinned: false,
    },
    {
      id: uuidv4(),
      title: 'Meeting Notes - Project Planning',
      content: `
        <h2>Project Planning Meeting</h2>
        <p><strong>Date:</strong> Today</p>
        <p><strong>Attendees:</strong> Team A, Team B, Stakeholders</p>
        
        <h3>Key Points:</h3>
        <ol>
          <li>Review current progress</li>
          <li>Discuss timeline adjustments</li>
          <li>Resource allocation</li>
          <li>Risk assessment</li>
        </ol>
        
        <h3>Action Items:</h3>
        <ul>
          <li>Update project timeline</li>
          <li>Schedule follow-up meeting</li>
          <li>Prepare budget report</li>
        </ul>
      `,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(Date.now() - 900000), // 15 minutes ago
      isPinned: true,
    },
    {
      id: uuidv4(),
      title: 'Ideas for Weekend',
      content: `
        <h3>Weekend Activities</h3>
        <ul>
          <li>Visit the new museum downtown</li>
          <li>Try that new restaurant</li>
          <li>Go hiking in the mountains</li>
          <li>Watch the new movie</li>
          <li>Call family</li>
        </ul>
        
        <h3>Weather Check:</h3>
        <p>Remember to check the weather forecast before planning outdoor activities!</p>
      `,
      createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      updatedAt: new Date(Date.now() - 300000), // 5 minutes ago
      isPinned: false,
    },
  ];

  // Clear existing data
  db.exec('DELETE FROM images');
  db.exec('DELETE FROM notes');

  // Insert sample notes
  const insertNoteStmt = db.prepare(`
    INSERT INTO notes (id, title, content, created_at, updated_at, is_pinned)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const note of sampleNotes) {
    insertNoteStmt.run(
      note.id,
      note.title,
      note.content,
      note.createdAt.toISOString(),
      note.updatedAt.toISOString(),
      note.isPinned ? 1 : 0
    );
  }

  console.log(`✅ Seeded ${sampleNotes.length} sample notes`);
  console.log('📝 Sample notes created:');
  sampleNotes.forEach(note => {
    console.log(`   - ${note.title} ${note.isPinned ? '(📌 Pinned)' : ''}`);
  });

  db.close();
  console.log('✅ Database seeding completed successfully');

} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
} 