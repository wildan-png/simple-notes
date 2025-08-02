# Simple Notes - Cross-Browser Note Taking App

A modern, offline-first notes application with **cross-browser data sharing** using SQLite database. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### 📝 Note Management
- **Create, Edit, Delete** notes with rich text editing
- **Real-time auto-save** to SQLite database
- **Search** across note titles and content
- **Pin** important notes for quick access
- **Sort** by creation date, last modified, or title

### 🌐 Cross-Browser Data Sharing
- **SQLite Database**: Notes stored in local SQLite database
- **Shared Data**: Same notes visible in Chrome, Safari, Firefox, Edge
- **No Account Required**: Works completely offline
- **Persistent Storage**: Data survives browser restarts and updates

### 🎨 Rich Text Editor
- **Formatting**: Bold, Italic, Underline, Lists
- **Images**: Drag & drop or paste images
- **Auto-compression**: Images automatically compressed to ≤1024px width
- **TipTap Editor**: Modern, extensible rich text editor

### 🎯 User Experience
- **Dark/Light Theme**: Automatic system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Fast Performance**: Optimistic updates for instant feedback
- **Offline-First**: Works without internet connection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize database**
   ```bash
   npm run db:migrate
   ```

4. **Seed with sample data (optional)**
   ```bash
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Visit `http://localhost:3000`
   - Your notes will be shared across all browsers on this device!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes for database operations
│   │   ├── notes/          # Note CRUD endpoints
│   │   ├── health/         # Health check endpoint
│   │   └── stats/          # Database statistics
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main app page
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── editor/             # Rich text editor components
│   ├── notes/              # Note display components
│   └── layout/             # Layout components
├── lib/
│   ├── database.ts         # SQLite database service
│   ├── api.ts              # API client service
│   ├── store.ts            # Zustand store (IndexedDB)
│   ├── store-database.ts   # Zustand store (SQLite)
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🗄️ Database Schema

### Notes Table
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE
);
```

### Images Table
```sql
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  blob_key TEXT NOT NULL,
  alt TEXT,
  width INTEGER,
  height INTEGER,
  data BLOB NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
# Database path (optional, defaults to ./data/notes.db)
DATABASE_PATH=/path/to/your/notes.db

# Node environment
NODE_ENV=development
```

### Database Location
- **Development**: `./data/notes-dev.db`
- **Production**: `./data/notes.db`

## 📊 API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes?q=search` - Search notes
- `POST /api/notes` - Create new note
- `PUT /api/notes` - Update note
- `DELETE /api/notes?id=noteId` - Delete note

### Individual Notes
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update specific note
- `DELETE /api/notes/[id]` - Delete specific note

### Utilities
- `GET /api/health` - Health check
- `GET /api/stats` - Database statistics
- `POST /api/clear` - Clear all data

## 🔄 Migration from IndexedDB

If you have existing notes in IndexedDB:

1. **Backup your data** (optional)
2. **Run migration script**:
   ```bash
   npm run db:migrate
   ```
3. **Create new notes** in the app
4. **Clear browser storage** if desired

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Initialize database
npm run db:seed      # Seed with sample data
```

### Database Operations
```bash
# Initialize database schema
npm run db:migrate

# Add sample data
npm run db:seed

# Check database health
curl http://localhost:3000/api/health

# Get database stats
curl http://localhost:3000/api/stats
```

## 🌐 Cross-Browser Testing

To test cross-browser data sharing:

1. **Start the app**: `npm run dev`
2. **Open in Chrome**: Create some notes
3. **Open in Safari**: Same notes should appear
4. **Open in Firefox**: Same notes should appear
5. **Edit in any browser**: Changes sync across all browsers

## 🔒 Data Privacy

- **Local Storage**: All data stays on your device
- **No Cloud Sync**: No data sent to external servers
- **SQLite Database**: Industry-standard local database
- **Browser Independent**: Data not tied to specific browser

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Database Backup
```bash
# Copy the database file
cp ./data/notes.db ./backup/notes-backup.db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the docs folder
- **API Reference**: See the API endpoints above

---

**Happy Note Taking! 📝✨**
