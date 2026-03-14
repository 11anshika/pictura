import { useEffect, useCallback, useState } from "react";

const Lightbox = ({ photo, isFavourite, onToggleFavourite, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset loaded state when photo changes
  useEffect(() => { setImgLoaded(false); }, [photo.id]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    onToggleFavourite(photo.id);
  }, [onToggleFavourite, photo.id]);

  return (
    <div
      className="lightbox-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo by ${photo.author}`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="lightbox-close"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev arrow */}
      {hasPrev && (
        <button onClick={onPrev} className="lightbox-arrow lightbox-arrow-left" aria-label="Previous photo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button onClick={onNext} className="lightbox-arrow lightbox-arrow-right" aria-label="Next photo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-img-wrap">
          {/* Skeleton while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton rounded-t-2xl" />
          )}
          <img
            src={`https://picsum.photos/id/${photo.id}/1200/900`}
            alt={`Photo by ${photo.author}`}
            className={`lightbox-img transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Info bar */}
        <div className="lightbox-info">
          <div className="min-w-0">
            <p className="text-[15px] font-medium truncate" style={{ color: "#1a1a1a" }}>
              {photo.author}
            </p>
            <p className="text-[12px] mt-0.5 tracking-wide uppercase" style={{ color: "#a09d96" }}>
              {photo.width} × {photo.height}
            </p>
          </div>

          {/* Heart button */}
          <button
            onClick={handleToggle}
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            className={`lightbox-heart ${isFavourite ? "is-fav" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavourite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-[13px] font-medium">
              {isFavourite ? "Saved" : "Save"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
