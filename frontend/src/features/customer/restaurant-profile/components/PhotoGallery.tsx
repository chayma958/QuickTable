const MAX_VISIBLE = 4;

export function PhotoGallery({ photos, onOpen }: { photos: string[]; onOpen: (index: number) => void }) {
  const visible = photos.slice(0, MAX_VISIBLE);
  const remaining = photos.length - MAX_VISIBLE;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {visible.map((src, i) => {
        const isLastVisible = i === MAX_VISIBLE - 1;
        const showOverlay = isLastVisible && remaining > 0;
        return (
          <button
            key={src + i}
            type="button"
            onClick={() => onOpen(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            {showOverlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-3xl font-bold text-white">+{remaining}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
