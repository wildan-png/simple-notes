# Simple Notes - Product Requirements Document

## Overview
A lightweight, offline-first notes application that runs entirely in the browser. Built with modern web technologies for a smooth, responsive experience across all devices.

## Core Features

### 1. Note Management
- **Create**: New notes with rich text editing
- **Edit**: In-place editing with auto-save
- **Delete**: Soft delete with confirmation
- **View**: List and card preview modes with toggle

### 2. Rich Text Editor
- **Formatting**: Bold, Italic, Underline
- **Lists**: Bullet and numbered lists
- **Images**: Drag & drop or paste images (auto-compressed to ≤1024px width)
- **Auto-save**: Real-time saving to IndexedDB

### 3. Search & Organization
- **Search**: Real-time search across note titles and content
- **Sorting**: By creation date, last modified, or title
- **Metadata**: Creation date, last modified timestamp

### 4. Theme Support
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes
- **System**: Automatically follows OS preference

### 5. Responsive Design
- **Mobile-First**: Optimized for touch interfaces
- **Desktop**: Split-pane layout for larger screens
- **Tablet**: Adaptive layout between mobile and desktop

## Technical Specifications

### Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Persistence**: IndexedDB via idb-keyval
- **Editor**: Tiptap React with StarterKit
- **Build Tool**: pnpm

### Data Structure
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images: ImageReference[];
}

interface ImageReference {
  id: string;
  blobKey: string;
  alt: string;
  width: number;
  height: number;
}
```

### File Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── note/[id]/page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── editor/
│   ├── notes/
│   └── layout/
├── lib/
│   ├── store.ts (zustand)
│   ├── storage.ts (IndexedDB)
│   └── utils.ts
├── styles/
│   └── components.css
└── types/
    └── index.ts
```

## User Experience

### Mobile Flow
1. **Home**: Note list with search bar and view toggle
2. **Create**: Floating action button for new notes
3. **Edit**: Full-screen editor with toolbar
4. **Navigation**: Back button to return to list

### Desktop Flow
1. **Home**: Split-pane with note list and editor
2. **Selection**: Click note to edit in right pane
3. **Multi-tasking**: Keep list visible while editing

### Performance Goals
- **Load Time**: <2 seconds initial load
- **Save Time**: <100ms auto-save
- **Search**: <50ms response time
- **Image Processing**: <1 second for compression

## Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Logical tab order

## Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Required APIs**: IndexedDB, Canvas API, File API
- **Fallbacks**: Graceful degradation for older browsers

## Success Metrics
- **Usability**: 90% of users can create and edit notes within 30 seconds
- **Performance**: 95% of auto-saves complete within 100ms
- **Reliability**: 99.9% data persistence rate
- **Accessibility**: 100% WCAG AA compliance 