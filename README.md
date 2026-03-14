# Pictura — Photo Gallery

A React + Vite + Tailwind photo gallery app built for the Celebrare Frontend Intern pre-screening assignment.

## Setup

```bash
npm install
npm run dev
```

## Features

- Fetches 30 photos from [Picsum Photos API](https://picsum.photos/v2/list?limit=30)
- Loading spinner while fetching; error message on failure
- Responsive grid: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- Real-time author search with `useMemo` (no API call on search)
- Favourites toggled with a heart button, managed with `useReducer`, persisted in `localStorage`
- Fetch logic isolated in a custom hook: `useFetchPhotos`
- `useCallback` on the search handler and toggle handler for stable references

## File Structure

```
src/
  hooks/
    useFetchPhotos.js       # Custom hook — returns { photos, loading, error }
    favouritesReducer.js    # Reducer + initialState (reads localStorage on init)
  components/
    Gallery.jsx             # Main component — search, grid, reducer wiring
    PhotoCard.jsx           # Single card with image, author, heart button
  App.jsx
  main.jsx
  index.css
```

## Screen Recording Talking Points

### 1. useFetchPhotos hook
- Returns `{ photos, loading, error }`
- Uses `useEffect` with an async function inside it
- Sets `error` state if `response.ok` is false or if the network throws
- Sets `loading: false` in `finally` so it always clears regardless of success/failure

### 2. useReducer
- Actions: `TOGGLE_FAVOURITE` — adds the id if not present, removes it if already there
- Why useReducer instead of useState: the favourites array is updated with logic (check → add or remove), not just a simple value swap. useReducer makes that logic explicit and testable in isolation.

### 3. useCallback
- `handleSearchChange` — wrapped in useCallback so it doesn't get recreated on every render. Passed as a prop to the input's onChange, keeping the reference stable.
- `handleToggleFavourite` — passed as a prop to every PhotoCard. Without useCallback, every render creates a new function, causing all cards to re-render even if their photo didn't change.

### 4. useMemo
- `filteredPhotos` — recomputes only when `photos` or `searchQuery` changes. Without useMemo, the `.filter()` runs on every render, including renders caused by unrelated state changes.

### 5. One hard thing
- Keeping localStorage in sync with the reducer without side effects inside the reducer itself. Solved by writing to localStorage directly inside the reducer (before returning new state) since reducers are synchronous and predictable — no async issues.
