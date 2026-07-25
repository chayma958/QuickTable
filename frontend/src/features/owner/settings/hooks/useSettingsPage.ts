import { updateRestaurant } from '@api/restaurants.api';
import { uploadImage } from '@api/uploads.api';
import { zodResolver } from '@hookform/resolvers/zod';
import type { OpeningHours, Restaurant } from '@models/index';
import { useToast } from '@store/toast-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { settingsSchema, type SettingsFormInput, type SettingsFormValues } from '../settings.schema';

export function useSettingsPage(restaurant: Restaurant) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [logoUrl, setLogoUrl] = useState(restaurant.logoUrl ?? '');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(restaurant.coverImageUrl ?? '');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(restaurant.galleryImages ?? []);
  const [isUploadingGalleryPhoto, setIsUploadingGalleryPhoto] = useState(false);
  const [openingHours, setOpeningHours] = useState<OpeningHours>(restaurant.openingHours ?? {});

  const form = useForm<SettingsFormInput, unknown, SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description ?? '',
      email: restaurant.email ?? '',
      phone: restaurant.phone ?? '',
      address: restaurant.address ?? '',
      city: restaurant.city ?? '',
      country: restaurant.country ?? '',
      currency: restaurant.currency,
      taxRate: Number(restaurant.taxRate),
      hasParking: restaurant.hasParking,
      hasWifi: restaurant.hasWifi,
      isWheelchairAccessible: restaurant.isWheelchairAccessible,
      isPetFriendly: restaurant.isPetFriendly,
      acceptsCardPayment: restaurant.acceptsCardPayment,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: SettingsFormValues) =>
      updateRestaurant(restaurant.id, { ...values, logoUrl, coverImageUrl, galleryImages, openingHours }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-restaurant'] });
      toast.success('Settings saved');
    },
  });

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      setLogoUrl(await uploadImage(file, 'logos'));
    } finally {
      setIsUploadingLogo(false);
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      setCoverImageUrl(await uploadImage(file, 'covers'));
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleGalleryPhotoAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingGalleryPhoto(true);
    try {
      const url = await uploadImage(file, 'gallery');
      setGalleryImages((prev) => [...prev, url]);
    } finally {
      setIsUploadingGalleryPhoto(false);
      e.target.value = '';
    }
  }

  function handleGalleryPhotoRemove(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  return {
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
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isSubmitting: form.formState.isSubmitting,
  };
}
