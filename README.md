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
