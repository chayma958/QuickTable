import { readJSON, writeJSON } from '@lib/storage';
import type { CartLine, MenuItem } from '@models/index';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface CartState {
  restaurantId: string | null;
  restaurantSlug: string | null;
  tableId: string | null;
  tableNumber: number | null;
  lines: CartLine[];
}

interface CartContextValue extends CartState {
  itemCount: number;
  subtotal: number;
  setDineInContext: (restaurantId: string, slug: string, tableId: string, tableNumber: number) => void;
  addItem: (menuItem: MenuItem, quantity: number, notes?: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
}

const EMPTY_STATE: CartState = {
  restaurantId: null,
  restaurantSlug: null,
  tableId: null,
  tableNumber: null,
  lines: [],
};

const CART_KEY = 'cart';
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() => readJSON<CartState>(CART_KEY) ?? EMPTY_STATE);

  useEffect(() => {
    writeJSON(CART_KEY, state);
  }, [state]);

  const setDineInContext = useCallback(
    (restaurantId: string, slug: string, tableId: string, tableNumber: number) => {
      setState((prev) =>
        prev.restaurantId === restaurantId && prev.tableId === tableId
          ? prev
          : { ...EMPTY_STATE, restaurantId, restaurantSlug: slug, tableId, tableNumber },
      );
    },
    [],
  );

  const addItem = useCallback((menuItem: MenuItem, quantity: number, notes?: string) => {
    setState((prev) => {
      const existingIndex = prev.lines.findIndex((l) => l.menuItem.id === menuItem.id);
      if (existingIndex >= 0) {
        const lines = [...prev.lines];
        lines[existingIndex] = {
          ...lines[existingIndex],
          quantity: lines[existingIndex].quantity + quantity,
        };
        return { ...prev, lines };
      }
      return { ...prev, lines: [...prev.lines, { menuItem, quantity, notes }] };
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    setState((prev) => {
      if (quantity <= 0) {
        return { ...prev, lines: prev.lines.filter((l) => l.menuItem.id !== menuItemId) };
      }
      return {
        ...prev,
        lines: prev.lines.map((l) => (l.menuItem.id === menuItemId ? { ...l, quantity } : l)),
      };
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setState((prev) => ({ ...prev, lines: prev.lines.filter((l) => l.menuItem.id !== menuItemId) }));
  }, []);

  const clear = useCallback(() => {
    setState((prev) => ({ ...EMPTY_STATE, restaurantId: prev.restaurantId, restaurantSlug: prev.restaurantSlug }));
  }, []);

  const { itemCount, subtotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const line of state.lines) {
      count += line.quantity;
      const unitPrice = Number(line.menuItem.discountPrice ?? line.menuItem.price);
      total += unitPrice * line.quantity;
    }
    return { itemCount: count, subtotal: total };
  }, [state.lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      itemCount,
      subtotal,
      setDineInContext,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [state, itemCount, subtotal, setDineInContext, addItem, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
