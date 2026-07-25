import { createOrder } from '@api/orders.api';
import { getPublicRestaurant } from '@api/restaurants.api';
import { getPublicReviewSummary } from '@api/reviews.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { addOrderToHistory } from '@lib/last-order';
import { useCart } from '@store/cart-context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { checkoutSchema, type CheckoutFormValues } from '../checkout.schema';

export function useCheckoutForm() {
  const cart = useCart();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const restaurantQuery = useQuery({
    queryKey: ['public-restaurant', cart.restaurantSlug],
    queryFn: () => getPublicRestaurant(cart.restaurantSlug!),
    enabled: !!cart.restaurantSlug,
  });

  const ratingQuery = useQuery({
    queryKey: ['public-review-summary', cart.restaurantSlug],
    queryFn: () => getPublicReviewSummary(cart.restaurantSlug!),
    enabled: !!cart.restaurantSlug,
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'CASH',
    },
  });
  const { register, handleSubmit, formState } = form;

  const mutation = useMutation({
    mutationFn: (values: CheckoutFormValues) => {
      if (!cart.restaurantId || !cart.tableId) throw new Error('Missing table context');
      return createOrder({
        restaurantId: cart.restaurantId,
        tableId: cart.tableId,
        items: cart.lines.map((l) => ({
          menuItemId: l.menuItem.id,
          quantity: l.quantity,
          notes: l.notes,
        })),
        couponCode: values.couponCode || undefined,
        paymentMethod: values.paymentMethod,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        notes: values.notes || undefined,
      });
    },
    onSuccess: (order) => {
      cart.clear();
      addOrderToHistory(order.id);
      navigate(`/orders/${order.id}/track`);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong placing your order';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  function submit(values: CheckoutFormValues) {
    setServerError(null);
    mutation.mutate(values);
  }

  const restaurant = restaurantQuery.data;
  const taxRate = restaurant ? Number(restaurant.taxRate) : 0;
  const estimatedTax = cart.subtotal * (taxRate / 100);
  const estimatedTotal = cart.subtotal + estimatedTax;

  const rating = ratingQuery.data
    ? { average: ratingQuery.data.averageRating, count: ratingQuery.data.totalReviews }
    : null;

  return {
    cart,
    restaurant,
    rating,
    register,
    handleSubmit,
    submit,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    serverError,
    mutation,
    estimatedTax,
    estimatedTotal,
  };
}
