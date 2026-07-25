import { createReview } from '@api/reviews.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order } from '@models/index';
import { Star } from 'lucide-react';
import { useState } from 'react';

export function ReviewSection({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => createReview(order.id, rating, comment || undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order-tracking', order.id] }),
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Could not submit your review';
      setError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  if (order.status !== 'DELIVERED') return null;

  if (order.review) {
    return (
      <div>
        <div className="mb-3 text-[0.9375rem] font-bold text-text">Your review</div>
        <div className="mb-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={22}
              className={n <= order.review!.rating ? 'text-warning' : 'text-border'}
              fill={n <= order.review!.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        {order.review.comment && (
          <p className="text-sm text-text-muted">&ldquo;{order.review.comment}&rdquo;</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-[0.9375rem] font-bold text-text">Rate your order</div>
      <div className="mb-3.5 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            className={n <= (hoverRating || rating) ? 'text-warning' : 'text-border'}
          >
            <Star size={26} fill={n <= (hoverRating || rating) ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        placeholder="How was it? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-3.5 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light"
      />
      {error && <span className="mb-2 block text-xs text-danger">{error}</span>}
      <button
        type="button"
        disabled={rating === 0 || mutation.isPending}
        onClick={() => {
          setError(null);
          mutation.mutate();
        }}
        className="rounded-xl bg-brand px-[1.125rem] py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Submitting...' : 'Submit review'}
      </button>
    </div>
  );
}
