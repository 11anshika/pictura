import { useState, useRef, useCallback } from "react";

const PhotoCard = ({ photo, isFavourite, onToggleFavourite, onOpen, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    }
  }, []);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    setIsPopping(true);
    onToggleFavourite(photo.id);
    setTimeout(() => setIsPopping(false), 400);
  }, [onToggleFavourite, photo.id]);

  return (
    <div
      className="card-enter"
      style={{ animationDelay: `${(index % 12) * 55}ms` }}
    >
      <div
        ref={cardRef}
        className="photo-card rounded-2xl overflow-hidden bg-white"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image area — click opens lightbox */}
        <div
          className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-zoom-in"
          onClick={onOpen}
        >
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}

          <img
            src={`https://picsum.photos/id/${photo.id}/600/450`}
            alt={`Photo by ${photo.author}`}
            className={`card-img w-full h-full object-cover transition-opacity duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Dark gradient overlay on hover */}
          <div className="card-overlay absolute inset-0" />

          {/* Author name fades in over the image on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-3 transition-all duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
            }}
          >
            <p className="text-white text-sm font-medium truncate drop-shadow">
              {photo.author}
            </p>
          </div>

          {/* Heart button — hidden until hover, always visible if saved */}
          <button
            onClick={handleToggle}
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            className={`heart-btn absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow-md
              ${isFavourite
                ? "is-fav bg-white text-rose-500"
                : "bg-white/85 text-stone-400 hover:text-rose-400"
              } ${isPopping ? "heart-pop" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavourite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-stone-700 truncate">
              {photo.author}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5 tracking-wide uppercase">
              {photo.width} × {photo.height}
            </p>
          </div>
          {isFavourite && (
            <span className="text-[10px] font-semibold tracking-widest text-rose-400 uppercase ml-2 shrink-0">
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
