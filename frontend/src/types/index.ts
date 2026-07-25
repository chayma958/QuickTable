export type Role = 'SUPER_ADMIN' | 'OWNER' | 'KITCHEN' | 'WAITER';

export type OrderType = 'DINE_IN';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'PAY_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type CouponType = 'PERCENTAGE' | 'FIXED';

export type KitchenNoteReason =
  | 'ITEM_UNAVAILABLE'
  | 'PREPARATION_DELAYED'
  | 'NEED_CLARIFICATION'
  | 'CUSTOM';
export type KitchenNoteStatus = 'OPEN' | 'ACKNOWLEDGED';

export interface KitchenNote {
  id: string;
  restaurantId: string;
  orderId: string;
  tableId: string | null;
  reason: KitchenNoteReason;
  message: string | null;
  status: KitchenNoteStatus;
  createdAt: string;
  acknowledgedAt: string | null;
}

export interface StaffUser {
  id: string;
  type: 'staff';
  name: string;
  email: string;
  role: Role;
  restaurantId: string | null;
  avatarUrl: string | null;
}

export interface OpeningHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

export type OpeningHours = Record<string, OpeningHoursDay>;

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  galleryImages: string[];
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  currency: string;
  taxRate: string;
  openingHours: OpeningHours | null;
  isActive: boolean;
  hasParking: boolean;
  hasWifi: boolean;
  isWheelchairAccessible: boolean;
  isPetFriendly: boolean;
  acceptsCardPayment: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  menuItems?: MenuItem[];
  _count?: { menuItems: number };
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: string;
  discountPrice: string | null;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  calories: number | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  category?: Category;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  number: number;
  qrCodeUrl: string | null;
  isActive: boolean;
  isOccupied: boolean;
  currentSessionStartedAt: string | null;
  assignedWaiterId?: string | null;
  assignedWaiter?: { id: string; name: string } | null;
}

export type TableRequestType = 'ASSISTANCE' | 'BILL';
export type TableRequestStatus = 'PENDING' | 'RESOLVED';

export interface TableRequest {
  id: string;
  restaurantId: string;
  tableId: string;
  type: TableRequestType;
  status: TableRequestStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export type TableStatus = 'FREE' | 'EATING' | 'READY' | 'NEEDS_ASSISTANCE';

export interface TableOverview extends RestaurantTable {
  status: TableStatus;
  requests: TableRequest[];
  kitchenNotes: KitchenNote[];
  activeOrders: Order[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface Invitation {
  id: string;
  restaurantId: string;
  email: string;
  name: string;
  role: Role;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
  inviteUrl?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  nameSnapshot: string;
  priceSnapshot: string;
  quantity: number;
  subtotal: string;
  notes: string | null;
}

export interface Order {
  id: string;
  orderNumber: number;
  restaurantId: string;
  tableId: string | null;
  table?: RestaurantTable | null;
  customerId: string | null;
  customer?: { id: string; name: string | null; phone: string | null; email: string | null } | null;
  type: OrderType;
  status: OrderStatus;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  restaurant?: { name: string; slug?: string; logoUrl?: string | null; phone?: string | null };
  review?: { rating: number; comment: string | null } | null;
  createdAt: string;
  confirmedAt: string | null;
  preparingAt: string | null;
  readyAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
  servedByUserId?: string | null;
  servedBy?: { id: string; name: string } | null;
}

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}
