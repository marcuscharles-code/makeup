import { Timestamp } from 'firebase/firestore';

/** Cart item (used before checkout) */
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

/** Order item (stored in Firestore) */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/** Shipping / billing address */
export interface ShippingAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

/** Allowed order statuses */
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'paid';

/** Main Order model */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status?: OrderStatus;
  paymentMethod?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  shipping?: string;
  discount?: number;
  shippingAddress?: ShippingAddress;
}
