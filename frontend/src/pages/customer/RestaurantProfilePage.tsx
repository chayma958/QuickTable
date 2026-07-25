import { Skeleton } from '@components/ui/Skeleton';
import { AboutCard } from '@features/customer/restaurant-profile/components/AboutCard';
import { BottomOrderCTA } from '@features/customer/restaurant-profile/components/BottomOrderCTA';
import { MenuPreviewSection } from '@features/customer/restaurant-profile/components/MenuPreviewSection';
import { OpeningHoursList } from '@features/customer/restaurant-profile/components/OpeningHoursList';
import { PhotoGallery } from '@features/customer/restaurant-profile/components/PhotoGallery';
import { PhotoLightbox } from '@features/customer/restaurant-profile/components/PhotoLightbox';
import { ProfileHero } from '@features/customer/restaurant-profile/components/ProfileHero';
import { RestaurantInfoSidebar } from '@features/customer/restaurant-profile/components/RestaurantInfoSidebar';
import { ReviewsSection } from '@features/customer/restaurant-profile/components/ReviewsSection';
import { useGuestSession } from '@features/customer/restaurant-profile/hooks/useGuestSession';
import { useRestaurantProfile } from '@features/customer/restaurant-profile/hooks/useRestaurantProfile';
import { isOpenNow } from '@features/customer/restaurant-profile/opening-hours.util';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DEMO_TABLE_NUMBER = 1;

export function RestaurantProfilePage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const { ensureGuestSession, hasGuestSession } = useGuestSession();
  const { isLoading, isError, restaurant, categories, rating, reviews } = useRestaurantProfile(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const avgPrepMinutes = useMemo(() => {
    const items = categories.flatMap((c) => c.menuItems ?? []);
    if (items.length === 0) return null;
    return Math.round(items.reduce((sum, i) => sum + i.preparationTimeMinutes, 0) / items.length);
  }, [categories]);

  function handleScanQr() {
    ensureGuestSession();
    navigate(`/r/${restaurant!.slug}/table/${DEMO_TABLE_NUMBER}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-subtle pb-28">
        <Skeleton className="h-[340px] w-full rounded-none sm:h-[420px]" />
        <div className="mx-auto max-w-6xl px-5 py-10">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-text-muted">
        This restaurant could not be found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-subtle pb-20">
      <ProfileHero
        name={restaurant.name}
        coverImageUrl={restaurant.coverImageUrl}
        rating={rating}
        isOpenNow={isOpenNow(restaurant.openingHours)}
      />

      <div className="mx-auto max-w-6xl px-5 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-10">
            <AboutCard description={restaurant.description} />

            {restaurant.galleryImages.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-text">Photos</h2>
                <PhotoGallery photos={restaurant.galleryImages} onOpen={setLightboxIndex} />
              </section>
            )}

            <OpeningHoursList hours={restaurant.openingHours} />

            <section>
              <h2 className="mb-4 text-xl font-bold text-text">Menu Preview</h2>
              <MenuPreviewSection categories={categories} />
            </section>

            <ReviewsSection reviews={reviews} />

            <BottomOrderCTA onStart={handleScanQr} />
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <RestaurantInfoSidebar
              restaurant={restaurant}
              avgPrepMinutes={avgPrepMinutes}
              tableNumber={DEMO_TABLE_NUMBER}
              hasGuestSession={hasGuestSession()}
              onStartOrdering={handleScanQr}
            />
          </div>
        </div>
      </div>

      <PhotoLightbox
        photos={restaurant.galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
