# Simple Notes - UI Structure & Design System

## Component Hierarchy

### Root Layout
```
AppLayout
├── ThemeProvider
├── Header
│   ├── Logo
│   ├── SearchBar
│   ├── ViewToggle (List/Card)
│   └── ThemeToggle
└── MainContent
    ├── MobileLayout
    │   ├── NoteList
    │   └── NoteEditor (full-screen)
    └── DesktopLayout
        ├── NoteList (left pane)
        └── NoteEditor (right pane)
```

### Note List Components
```
NoteList
├── SearchSection
│   ├── SearchInput
│   └── SortDropdown
├── ViewToggle
│   ├── ListViewButton
│   └── CardViewButton
├── NoteListContainer
│   ├── NoteListItem (list view)
│   │   ├── NoteTitle
│   │   ├── NotePreview
│   │   ├── NoteMetadata
│   │   └── NoteActions
│   └── NoteCard (card view)
│       ├── NoteCardHeader
│       ├── NoteCardContent
│       └── NoteCardFooter
└── CreateNoteButton
```

### Editor Components
```
NoteEditor
├── EditorHeader
│   ├── BackButton (mobile)
│   ├── NoteTitle
│   ├── SaveStatus
│   └── NoteActions
├── EditorToolbar
│   ├── FormatButtons (Bold, Italic, Underline)
│   ├── ListButtons (Bullet, Numbered)
│   ├── ImageUpload
│   └── Separator
└── EditorContent
    ├── TitleInput
    └── RichTextEditor
        ├── TiptapEditor
        └── ImageHandler
```

## Layout Patterns

### Mobile Layout (≤768px)
```
┌─────────────────────────┐
│ Header                  │
│ [Logo] [Search] [Menu]  │
├─────────────────────────┤
│ Note List              │
│ [Search Bar]           │
│ [View Toggle]          │
│ ┌─────────────────────┐ │
│ │ Note Item 1         │ │
│ │ Note Item 2         │ │
│ │ Note Item 3         │ │
│ └─────────────────────┘ │
│ [+ Create Note]         │
└─────────────────────────┘

┌─────────────────────────┐
│ Editor (Full Screen)    │
│ [← Back] [Save] [Menu]  │
├─────────────────────────┤
│ [Title Input]           │
│ [Toolbar]               │
│ ┌─────────────────────┐ │
│ │ Rich Text Editor    │ │
│ │                     │ │
│ │                     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
│ [Logo] [Search] [View Toggle] [Theme]                  │
├─────────────────────────────────────────────────────────┤
│ Note List (40%)        │ Note Editor (60%)             │
│ ┌─────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ [Search Bar]        │ │ │ [Title Input]               │ │
│ │ [Sort Dropdown]     │ │ │ [Toolbar]                   │ │
│ │ ┌─────────────────┐ │ │ │ ┌─────────────────────────┐ │ │
│ │ │ Note Item 1     │ │ │ │ │ Rich Text Editor        │ │ │
│ │ │ Note Item 2     │ │ │ │ │                         │ │ │
│ │ │ Note Item 3     │ │ │ │ │                         │ │ │
│ │ └─────────────────┘ │ │ │ └─────────────────────────┘ │ │
│ │ [+ Create Note]     │ │ └─────────────────────────────┘ │
│ └─────────────────────┘ │                                 │
└─────────────────────────────────────────────────────────┘
```

### Tablet Layout (769px - 1023px)
```
┌─────────────────────────────────────────┐
│ Header                                  │
│ [Logo] [Search] [View Toggle] [Theme]   │
├─────────────────────────────────────────┤
│ Note List (50%)    │ Note Editor (50%)  │
│ ┌─────────────────┐ │ ┌─────────────────┐ │
│ │ [Search Bar]    │ │ │ [Title Input]   │ │
│ │ [Sort Dropdown] │ │ │ [Toolbar]       │ │
│ │ ┌─────────────┐ │ │ │ ┌─────────────┐ │ │
│ │ │ Note Item 1 │ │ │ │ │ Rich Text   │ │ │
│ │ │ Note Item 2 │ │ │ │ │ Editor      │ │ │
│ │ └─────────────┘ │ │ │ └─────────────┘ │ │
│ │ [+ Create]      │ │ └─────────────────┘ │
│ └─────────────────┘ │                     │
└─────────────────────────────────────────┘
```

## Design Tokens

### Colors
```css
/* Light Theme */
--background: #ffffff
--foreground: #0f172a
--card: #ffffff
--card-foreground: #0f172a
--popover: #ffffff
--popover-foreground: #0f172a
--primary: #3b82f6
--primary-foreground: #ffffff
--secondary: #f1f5f9
--secondary-foreground: #0f172a
--muted: #f8fafc
--muted-foreground: #64748b
--accent: #f1f5f9
--accent-foreground: #0f172a
--destructive: #ef4444
--destructive-foreground: #ffffff
--border: #e2e8f0
--input: #e2e8f0
--ring: #3b82f6

/* Dark Theme */
--background: #0f172a
--foreground: #f8fafc
--card: #1e293b
--card-foreground: #f8fafc
--popover: #1e293b
--popover-foreground: #f8fafc
--primary: #3b82f6
--primary-foreground: #ffffff
--secondary: #334155
--secondary-foreground: #f8fafc
--muted: #1e293b
--muted-foreground: #94a3b8
--accent: #334155
--accent-foreground: #f8fafc
--destructive: #ef4444
--destructive-foreground: #ffffff
--border: #334155
--input: #334155
--ring: #3b82f6
```

### Typography
```css
/* Font Sizes */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem

/* Font Weights */
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700

/* Line Heights */
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

### Spacing
```css
/* Spacing Scale */
--space-1: 0.25rem
--space-2: 0.5rem
--space-3: 0.75rem
--space-4: 1rem
--space-5: 1.25rem
--space-6: 1.5rem
--space-8: 2rem
--space-10: 2.5rem
--space-12: 3rem
--space-16: 4rem
--space-20: 5rem
--space-24: 6rem
```

### Border Radius
```css
--radius-sm: 0.125rem
--radius: 0.25rem
--radius-md: 0.375rem
--radius-lg: 0.5rem
--radius-xl: 0.75rem
--radius-2xl: 1rem
--radius-full: 9999px
```

## Component Specifications

### Note List Item
```typescript
interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  viewMode: 'list' | 'card';
}
```

### Note Card
```typescript
interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
  onDelete: (noteId: string) => void;
}
```

### Search Input
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

### Editor Toolbar
```typescript
interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: (file: File) => void;
  isSaving: boolean;
}
```

## Responsive Breakpoints

### Mobile First Approach
```css
/* Base (Mobile) */
.container {
  padding: 1rem;
  max-width: 100%;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
  }
}
```

### Layout Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## Accessibility Features

### Semantic HTML Structure
```html
<main role="main">
  <header role="banner">
    <nav role="navigation">
      <!-- Navigation items -->
    </nav>
  </header>
  
  <section role="region" aria-label="Note list">
    <!-- Note list content -->
  </section>
  
  <section role="region" aria-label="Note editor">
    <!-- Editor content -->
  </section>
</main>
```

### ARIA Labels & Roles
- `aria-label` for search inputs
- `aria-describedby` for form fields
- `aria-expanded` for collapsible sections
- `aria-selected` for note items
- `aria-live` for auto-save status

### Keyboard Navigation
- Tab order follows visual layout
- Enter/Space for note selection
- Escape for closing modals
- Arrow keys for list navigation
- Ctrl/Cmd + S for manual save

## Animation & Transitions

### Micro-interactions
```css
/* Hover effects */
.note-item {
  transition: background-color 0.2s ease;
}

.note-item:hover {
  background-color: var(--accent);
}

/* Focus states */
.button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Loading states */
.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Page Transitions
```css
/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Editor auto-save indicator */
.save-indicator {
  transition: opacity 0.3s ease;
}
```

## Performance Considerations

### Lazy Loading
- Editor components loaded on demand
- Image compression in background
- Search debouncing (300ms)

### Optimizations
- Virtual scrolling for large note lists
- Image lazy loading
- Component memoization
- Bundle splitting

### Loading States
- Skeleton loaders for note lists
- Progressive image loading
- Optimistic updates for saves
- Error boundaries for graceful failures 