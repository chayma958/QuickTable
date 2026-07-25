import type { PublicReview } from '@api/reviews.api';
import { EmptyState } from '@components/ui/EmptyState';
import { MessageSquare, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? 'text-warning' : 'text-border'}
          fill={n <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: PublicReview[] }) {
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const counts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0];
    for (const r of reviews) c[r.rating] = (c[r.rating] ?? 0) + 1;
    return c;
  }, [reviews]);

  const filtered = starFilter === null ? reviews : reviews.filter((r) => r.rating === starFilter);

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-text">Reviews</h2>

      {reviews.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStarFilter(null)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              starFilter === null
                ? 'bg-brand text-white'
                : 'bg-bg-subtle text-text-muted hover:text-text'
            }`}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="button"
              disabled={counts[n] === 0}
              onClick={() => setStarFilter(n)}
              className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                starFilter === n ? 'bg-brand text-white' : 'bg-bg-subtle text-text-muted hover:text-text'
              }`}
            >
              {n}
              <Star size={13} fill="currentColor" />
              <span className="tabular-nums">({counts[n]})</span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={reviews.length === 0 ? 'No reviews yet' : 'No reviews with that rating'}
          description={
            reviews.length === 0
              ? 'Be the first to order and leave a review after your meal.'
              : 'Try a different star rating, or view all reviews.'
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((review) => (
            <div key={review.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-semibold text-text">{review.customer.name ?? 'Guest'}</span>
                <span className="shrink-0 text-xs text-text-muted">{formatReviewDate(review.createdAt)}</span>
              </div>
              <StarRow rating={review.rating} />
              {review.comment && <p className="mt-3 text-sm leading-relaxed text-text-muted">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
