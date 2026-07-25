import { ThemeToggle } from '@components/ui/ThemeToggle';
import { useToast } from '@store/toast-context';
import { ArrowLeft, Share2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HERO_BADGES = ['Wood-fired Pizza', 'Fresh Pasta', 'Family Restaurant', 'Since 1998'];

export function ProfileHero({
  name,
  coverImageUrl,
  rating,
  cuisine = 'Italian',
  priceRange = '$$',
  isOpenNow,
}: {
  name: string;
  coverImageUrl: string | null;
  rating: { average: number; count: number } | null;
  cuisine?: string;
  priceRange?: string;
  isOpenNow: boolean;
}) {
  const toast = useToast();
  const navigate = useNavigate();

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }

  const roundedRating = rating ? Math.round(rating.average) : 0;

  return (
    <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px]">
      {coverImageUrl && (
        <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/55"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={share}
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55"
          >
            <Share2 size={17} />
          </button>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm font-medium text-white/90 sm:text-base">
            {rating && rating.count > 0 && (
              <span className="inline-flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < roundedRating ? 'text-warning' : 'text-white/40'}
                    fill={i < roundedRating ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="ml-1">{rating.average.toFixed(1)}</span>
              </span>
            )}
            {rating && rating.count > 0 && <span className="text-white/50">·</span>}
            <span>{rating ? `${rating.count} review${rating.count === 1 ? '' : 's'}` : 'New'}</span>
            <span className="text-white/50">·</span>
            <span>{cuisine}</span>
            <span className="text-white/50">·</span>
            <span>{priceRange}</span>
            <span className="text-white/50">·</span>
            <span className={isOpenNow ? 'font-semibold text-[#4ade80]' : 'font-semibold text-white/70'}>
              {isOpenNow ? 'Open Now' : 'Closed now'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {HERO_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
