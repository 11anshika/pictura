import { useReducer, useCallback, useMemo, useState } from "react";
import useFetchPhotos from "../hooks/useFetchPhotos";
import { favouritesReducer, initialState } from "../hooks/favouritesReducer";
import PhotoCard from "./PhotoCard";
import Lightbox from "./Lightbox";

const Gallery = () => {
  const { photos, loading, error } = useFetchPhotos();
  const [state, dispatch] = useReducer(favouritesReducer, initialState);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null); // index into filteredPhotos

  // useCallback: stable reference — avoids re-creating on every render
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: "TOGGLE_FAVOURITE", payload: id });
  }, []);

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : i)), []);
  const nextPhoto = useCallback((len) => setLightboxIndex((i) => (i < len - 1 ? i + 1 : i)), []);

  // Clicking the logo resets all filters and scrolls to top
  const handleLogoClick = useCallback(() => {
    setSearchQuery("");
    setShowFavsOnly(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // useMemo: only recomputes when photos, searchQuery, or showFavsOnly changes
  const filteredPhotos = useMemo(() => {
    let result = photos;
    if (showFavsOnly) {
      result = result.filter((p) => state.favourites.includes(p.id));
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => p.author.toLowerCase().includes(query));
    }
    return result;
  }, [photos, searchQuery, showFavsOnly, state.favourites]);

  const favouriteCount = state.favourites.length;
  const isFiltered = searchQuery || showFavsOnly;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f8f6" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 border-b"
        style={{
          backgroundColor: "rgba(249,248,246,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "#ece8e1",
        }}
      >
        {/* Row 1: Logo + Saved button */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Logo — clicking resets to home */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-60 active:opacity-40"
            aria-label="Go to home"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.55" />
                <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.55" />
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3" />
              </svg>
            </div>
            <span
              className="font-serif-display text-[17px] tracking-tight"
              style={{ color: "#1a1a1a" }}
            >
              Pictura
            </span>
          </button>

          {/* Search — hidden on mobile, shown on sm+ */}
          <div className="relative hidden sm:block flex-1 max-w-sm ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-[14px] h-[14px] absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "#a09d96" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 16.803z" />
            </svg>
            <input
              type="text"
              placeholder="Search by author…"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input w-full pl-9 pr-4 py-2 text-[13px] rounded-xl border transition-colors"
              style={{ backgroundColor: "#f0ede8", borderColor: "#e2ddd7", color: "#1a1a1a" }}
            />
          </div>

          {/* Spacer on mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Saved toggle */}
          <button
            onClick={() => setShowFavsOnly((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200 shrink-0"
            style={{
              backgroundColor: showFavsOnly ? "#1a1a1a" : "#edeae4",
              color: showFavsOnly ? "#f9f8f6" : "#6b6760",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={showFavsOnly ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              className="w-3.5 h-3.5 shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="hidden xs:inline">Saved</span>
            {favouriteCount > 0 && (
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: showFavsOnly ? "rgba(255,255,255,0.2)" : "#d4c9b8",
                  color: showFavsOnly ? "#f9f8f6" : "#1a1a1a",
                }}
              >
                {favouriteCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Mobile search bar (only on small screens) */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-[14px] h-[14px] absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "#a09d96" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 16.803z" />
            </svg>
            <input
              type="text"
              placeholder="Search by author…"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input w-full pl-9 pr-4 py-2.5 text-[14px] rounded-xl border transition-colors"
              style={{ backgroundColor: "#f0ede8", borderColor: "#e2ddd7", color: "#1a1a1a" }}
            />
          </div>
        </div>
      </header>

      {/* ── Hero (only on home / no filters) ──────────────────── */}
      {!loading && !error && !isFiltered && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10">
          <p
            className="text-[11px] font-medium tracking-[0.18em] uppercase mb-3"
            style={{ color: "#a09d96" }}
          >
            Photography
          </p>
          <h1
            className="font-serif-display text-[32px] sm:text-[42px] leading-tight"
            style={{ color: "#1a1a1a" }}
          >
            A quiet collection
          </h1>
          <p
            className="text-[14px] sm:text-[15px] mt-2 max-w-xs"
            style={{ color: "#8c8880", fontWeight: 300 }}
          >
            30 photographs curated from the Picsum archive.
          </p>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">

        {/* Loading skeletons */}
        {loading && (
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white">
                <div className="aspect-[4/3] skeleton" />
                <div className="px-4 py-3 space-y-2">
                  <div className="skeleton h-3 w-24 rounded-full" />
                  <div className="skeleton h-2 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-40 gap-3 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f0ede8" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" style={{ color: "#a09d96" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-[14px] font-medium" style={{ color: "#1a1a1a" }}>Could not load photos</p>
            <p className="text-[13px]" style={{ color: "#a09d96" }}>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 gap-3 text-center">
            <p className="text-[14px]" style={{ color: "#a09d96" }}>
              {showFavsOnly
                ? "No saved photos yet — heart one to save it."
                : `No results for "${searchQuery}"`}
            </p>
            <button
              onClick={handleLogoClick}
              className="text-[13px] underline underline-offset-2 transition-opacity hover:opacity-60"
              style={{ color: "#a09d96" }}
            >
              Back to all photos
            </button>
          </div>
        )}

        {/* Photo grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <>
            {/* Filtered meta row */}
            {isFiltered && (
              <div className="pt-6 pb-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] sm:text-[28px] font-serif-display" style={{ color: "#1a1a1a" }}>
                    {filteredPhotos.length}
                  </span>
                  <span className="text-[13px]" style={{ color: "#a09d96", fontWeight: 300 }}>
                    {filteredPhotos.length === 1 ? "photo" : "photos"}
                    {searchQuery && ` matching "${searchQuery}"`}
                    {showFavsOnly && !searchQuery && " saved"}
                  </span>
                </div>
                {/* Clear filter link */}
                <button
                  onClick={handleLogoClick}
                  className="text-[12px] underline underline-offset-2 transition-opacity hover:opacity-60"
                  style={{ color: "#a09d96" }}
                >
                  Clear
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredPhotos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  isFavourite={state.favourites.includes(photo.id)}
                  onToggleFavourite={handleToggleFavourite}
                  onOpen={() => openLightbox(i)}
                />
              ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
              <Lightbox
                photo={filteredPhotos[lightboxIndex]}
                isFavourite={state.favourites.includes(filteredPhotos[lightboxIndex].id)}
                onToggleFavourite={handleToggleFavourite}
                onClose={closeLightbox}
                onPrev={prevPhoto}
                onNext={() => nextPhoto(filteredPhotos.length)}
                hasPrev={lightboxIndex > 0}
                hasNext={lightboxIndex < filteredPhotos.length - 1}
              />
            )}

            {/* Footer */}
            {!isFiltered && (
              <p
                className="text-center text-[12px] mt-14 tracking-widest uppercase"
                style={{ color: "#c4bfb8" }}
              >
                {photos.length} photographs
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Gallery;
