import { formStyles as f } from '@components/ui/formStyles';
import { OpeningHoursEditor } from '@features/owner/settings/components/OpeningHoursEditor';
import { useSettingsPage } from '@features/owner/settings/hooks/useSettingsPage';
import { useOwnerContext } from '@layouts/OwnerShell';
import { X } from 'lucide-react';

export function SettingsPage() {
  const { restaurant } = useOwnerContext();
  const {
    form,
    logoUrl,
    isUploadingLogo,
    handleLogoChange,
    coverImageUrl,
    isUploadingCover,
    handleCoverChange,
    galleryImages,
    isUploadingGalleryPhoto,
    handleGalleryPhotoAdd,
    handleGalleryPhotoRemove,
    openingHours,
    setOpeningHours,
    onSubmit,
    isSubmitting,
  } = useSettingsPage(restaurant);
  const { register, formState: { errors } } = form;

  return (
    <div>
      <h1 className="mb-5 text-[1.375rem] font-bold text-text">Settings</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-5 max-w-[640px] rounded-xl border border-border bg-bg p-5">
          <div className="mb-4 text-[0.9375rem] font-bold text-text">Restaurant info</div>

          <div className="mb-4">
            <span className="mb-1.5 block text-xs font-semibold text-text-muted">
              Logo — the small icon shown in headers and menus
            </span>
            <div className="flex items-center gap-4">
              {logoUrl && <img src={logoUrl} alt="" className="h-16 w-16 rounded-lg bg-bg-subtle object-cover" />}
              <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
              {isUploadingLogo && <span className="text-sm text-text-muted">Uploading...</span>}
            </div>
          </div>

          <div className="mb-4">
            <span className="mb-1.5 block text-xs font-semibold text-text-muted">
              Cover photo — the large banner shown at the top of your public page
            </span>
            <div className="flex items-center gap-4">
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt=""
                  className="h-16 w-28 rounded-lg bg-bg-subtle object-cover"
                />
              )}
              <input type="file" accept="image/*" onChange={handleCoverChange} className="text-sm" />
              {isUploadingCover && <span className="text-sm text-text-muted">Uploading...</span>}
            </div>
          </div>
          <div className={f.form}>
            <div className={f.field}>
              <label className={f.label} htmlFor="s-name">
                Name
              </label>
              <input id="s-name" className={f.input} {...register('name')} />
              {errors.name && <span className={f.error}>{errors.name.message}</span>}
            </div>
            <div className={f.field}>
              <label className={f.label} htmlFor="s-description">
                Description
              </label>
              <textarea id="s-description" className={f.textarea} rows={2} {...register('description')} />
            </div>
            <div className={f.row}>
              <div className={f.field}>
                <label className={f.label} htmlFor="s-email">
                  Email
                </label>
                <input id="s-email" className={f.input} {...register('email')} />
              </div>
              <div className={f.field}>
                <label className={f.label} htmlFor="s-phone">
                  Phone
                </label>
                <input id="s-phone" className={f.input} {...register('phone')} />
              </div>
            </div>
            <div className={f.field}>
              <label className={f.label} htmlFor="s-address">
                Address
              </label>
              <input id="s-address" className={f.input} {...register('address')} />
            </div>
            <div className={f.row}>
              <div className={f.field}>
                <label className={f.label} htmlFor="s-city">
                  City
                </label>
                <input id="s-city" className={f.input} {...register('city')} />
              </div>
              <div className={f.field}>
                <label className={f.label} htmlFor="s-country">
                  Country
                </label>
                <input id="s-country" className={f.input} {...register('country')} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 max-w-[640px] rounded-xl border border-border bg-bg p-5">
          <div className="mb-1 text-[0.9375rem] font-bold text-text">Gallery photos</div>
          <p className="mb-4 text-xs text-text-muted">
            Shown in the Photos section on your public page.
          </p>
          <div className="mb-4 flex flex-wrap gap-3">
            {galleryImages.map((url, index) => (
              <div key={url + index} className="group relative h-24 w-24 shrink-0">
                <img src={url} alt="" className="h-full w-full rounded-lg bg-bg-subtle object-cover" />
                <button
                  type="button"
                  onClick={() => handleGalleryPhotoRemove(index)}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:bg-danger hover:text-white"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleGalleryPhotoAdd} className="text-sm" />
            {isUploadingGalleryPhoto && <span className="text-sm text-text-muted">Uploading...</span>}
          </div>
        </div>

        <div className="mb-5 max-w-[640px] rounded-xl border border-border bg-bg p-5">
          <div className="mb-1 text-[0.9375rem] font-bold text-text">Amenities</div>
          <p className="mb-4 text-xs text-text-muted">Shown on your public page under Amenities.</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label className="flex items-center gap-2.5 text-sm text-text">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('hasParking')} />
              Parking available
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('hasWifi')} />
              Free WiFi
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('isWheelchairAccessible')} />
              Wheelchair accessible
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('isPetFriendly')} />
              Pet friendly
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('acceptsCardPayment')} />
              Cash &amp; card accepted
            </label>
          </div>
        </div>

        <div className="mb-5 max-w-[640px] rounded-xl border border-border bg-bg p-5">
          <div className="mb-4 text-[0.9375rem] font-bold text-text">Taxes</div>
          <div className={f.form}>
            <div className={f.row}>
              <div className={f.field}>
                <label className={f.label} htmlFor="s-currency">
                  Currency
                </label>
                <input id="s-currency" className={f.input} {...register('currency')} />
              </div>
              <div className={f.field}>
                <label className={f.label} htmlFor="s-tax">
                  Tax rate (%)
                </label>
                <input id="s-tax" type="number" step="0.01" className={f.input} {...register('taxRate')} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 max-w-[640px] rounded-xl border border-border bg-bg p-5">
          <div className="mb-4 text-[0.9375rem] font-bold text-text">Opening hours</div>
          <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
        </div>

        <div className={f.actions}>
          <button type="submit" className={f.primaryButton} disabled={isSubmitting}>
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
