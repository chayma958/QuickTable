import { createCoupon, deleteCoupon, getCoupons, setCouponActive } from '@api/coupons.api';
import { useToast } from '@store/toast-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { CouponFormValues } from '../coupon.schema';

export function useCouponsPage(restaurantId: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const couponsQuery = useQuery({
    queryKey: ['coupons', restaurantId],
    queryFn: () => getCoupons(restaurantId),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['coupons', restaurantId] });
  }

  const createMutation = useMutation({
    mutationFn: (values: CouponFormValues) =>
      createCoupon(restaurantId, {
        ...values,
        expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
      }),
    onSuccess: () => {
      invalidate();
      toast.success('Coupon created');
    },
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => setCouponActive(restaurantId, id, isActive),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCoupon(restaurantId, id),
    onSuccess: () => {
      invalidate();
      toast.success('Coupon deleted');
    },
  });

  async function handleSubmit(values: CouponFormValues) {
    await createMutation.mutateAsync(values);
    setModalOpen(false);
  }

  return {
    coupons: couponsQuery.data ?? [],
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    handleSubmit,
    toggleActive: (id: string, isActive: boolean) => toggleMutation.mutate({ id, isActive }),
    deleteCoupon: (id: string) => deleteMutation.mutate(id),
  };
}
