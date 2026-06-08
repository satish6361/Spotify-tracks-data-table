# Spotify Tracks Table Management App

A high-performance React application for exploring and managing a large Spotify tracks dataset through a feature-rich, server-driven data table.

## Live Demo
https://www.loom.com/share/300e8a764c1545c69f45daf1c8d355ee

## Deployment

### Frontend

Netlify:
https://spotify-tracks.netlify.app/

### Backend API

Render:
https://spotify-json-server-ivax.onrender.com

The frontend communicates with the deployed json-server API hosted on Render.

**Hosted URL:** https://spotify-tracks.netlify.app/

## Repository

**GitHub:** https://github.com/satish6361/Spotify-tracks-data-table

---

## Screenshots
<img width="1918" height="865" alt="image" src="https://github.com/user-attachments/assets/daf65dbb-66b1-45a2-8865-6e5fa458269b" />
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/6beb8521-d456-469c-93ff-a75c3228d8c8" />
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/ae8445e1-70a3-4c5f-84c9-bb114984b545" />


---

## Overview

This project was built as part of a React Table Management take-home assignment.

The application focuses on handling large datasets efficiently while providing a smooth user experience through server-side pagination, sorting, filtering, searching, inline editing, bulk actions, column customization, and CSV export.

The application uses **json-server** as the backend API and communicates entirely through HTTP requests. The full dataset is never loaded into the browser at once.

---

## Dataset Choice

### Chosen Dataset

**Spotify Tracks Dataset (~30,000 records)**

### Why I Chose Spotify Over the Sales Records Dataset

I selected the Spotify dataset because it contains a richer variety of data types that better demonstrate table management capabilities:

- Text fields:
  - Track Name
  - Artist
  - Album

- Categorical fields:
  - Genre
  - Explicit Flag

- Numeric fields:
  - Popularity
  - Tempo
  - Energy
  - Danceability
  - Duration

- Date fields:
  - Release Date

This allowed me to implement and showcase:

- Text search and filtering
- Multi-select categorical filters
- Numeric range filtering
- Date range filtering
- Sorting across multiple data types
- Inline editing with validation

Compared to the sales dataset, the Spotify dataset provided a more realistic and engaging user experience while exercising a broader set of table-management features.

---

## Features Implemented

### Table & Performance

- MUI DataGrid with built-in virtualization
- Server-side pagination
- Server-side sorting
- Efficient rendering of large datasets
- React Query caching and request management

### Pagination

- Page size options:
  - 25
  - 50
  - 100

- Previous/Next navigation
- Page number navigation
- "Showing X–Y of Z" indicator

### Sorting

- Server-side sorting
- Ascending/Descending sorting
- Supports:
  - Strings
  - Numbers
  - Dates

### Global Search

- Search across multiple fields using json-server `q`
- 300ms debounce
- Active search indicator
- Clear search functionality

### Advanced Filtering

#### Text Filters

- Track Name contains
- Artist contains

#### Multi-Select Filter

- Genre selection

#### Numeric Range Filters

- Popularity range
- Tempo range

#### Date Range Filter

- Release date range

#### Combined Filtering

- Filters work together using AND logic
- Compatible with sorting and global search

### Inline Editing

Editable fields:

- Track Name
- Genre
- Popularity

Features:

- Validation
- Save / Cancel
- PATCH persistence
- Optimistic updates
- Automatic rollback on API failure

### Bulk Actions

- Row selection
- Select all visible page rows
- Export selected rows to CSV

### Column Management

- Show/Hide columns
- Column reordering
- Column resizing
- Preferences persisted to localStorage

### Data Export

- Export current filtered/sorted view to CSV
- Export selected rows to CSV
- Proper CSV escaping for:
  - Commas
  - Quotes
  - Special characters

### UX & States

- Loading state
- Error state with retry
- Empty state
- Search indicators
- Active filter chips
- Responsive desktop and tablet layouts

### Additional Features

- Dark Mode
- Theme preference persistence
- Optimistic UI updates
- Toast-based error handling

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite

### UI

- Material UI (MUI)
- MUI DataGrid

### Data Fetching

- TanStack React Query
- Axios

### State Management

- React Hooks
- Local Component State
- Custom Hooks

### Backend

- json-server

### Testing

- Vitest

---

## Project Structure

```text
.
├── backend/
│   ├── data/
│   │   └── spotify_songs.csv
│   ├── scripts/
│   │   └── prepare-spotify-db.mjs
│   ├── db.json
│   └── package.json
│
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── .env.example
└── README.md
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:3000
```

Example file is provided:

```env
.env.example
```

---

## Generate db.json

Download the Spotify CSV dataset and generate the json-server database:

```bash
node scripts/prepare-spotify-db.mjs spotify.csv db.json
```

This converts the CSV into:

```json
{
  "records": [...]
}
```

with unique IDs required for PATCH operations.

---

## Start json-server

```bash
npx json-server --watch db.json --port 3000
```

API will be available at:

```text
http://localhost:3000
```

---

## Run Application

```bash
npm run dev
```

Application:

```text
http://localhost:5173
```

---

## Run Tests

```bash
npm run test
```

---

## Key Technical Decisions

### Why React Query?

React Query simplifies:

- Server-state management
- Request caching
- Loading states
- Error handling
- Refetching
- Optimistic updates

while reducing manual state management code.

### Why MUI DataGrid?

MUI DataGrid provides:

- Built-in virtualization
- Accessibility support
- Editing APIs
- Pagination support
- Selection support

allowing me to focus more on application behavior rather than low-level table implementation.

### Why Server-Side Operations?

Pagination, sorting, filtering, and searching are all executed through the API.

Benefits:

- Lower memory usage
- Better scalability
- Faster UI interactions
- Closer to real-world enterprise applications

### Why LocalStorage Persistence?

Users expect table preferences to remain consistent across sessions.

I persisted:

- Column visibility
- Column order
- Column widths
- Theme preference

to improve usability.

---

## Trade-offs

### Chosen

- MUI DataGrid over building a table from scratch
- Simpler implementation with reliable virtualization
- Faster development and higher stability

### Not Chosen

- Full global state management (Redux/Zustand)
- Infinite scrolling

The application scope did not justify additional complexity.

---

## Known Limitations

### json-server Constraints

- Filtering capabilities are limited compared to a real database.
- Multi-column advanced search is constrained by json-server query support.

### Bulk Actions

- "Select All" currently applies only to rows on the visible page.
- It does not select all matching rows across the entire dataset.

### Export

- Export fetches all matching records before generating CSV.
- This works well for the current dataset size but may require backend streaming for much larger datasets.

---

## Improvements With More Time

- Saved filter presets
- Drag-and-drop column reordering
- Advanced accessibility audit
- Additional unit and integration tests
- Performance profiling and benchmarking
- Bulk edit operations
- Infinite scrolling mode
- Column pinning

---

## Author

Satish Balathe
