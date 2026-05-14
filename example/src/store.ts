import { z } from 'zod';

import image1 from './assets/img_1.png';
import image2 from './assets/img_2.png';
import image3 from './assets/img_3.png';
import image4 from './assets/img_4.png';

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  author: z.string(),
  comment: z.string(),
  date: z.string().datetime(),
  id: z.string(),
  productId: z.string(),
  rating: z.number().min(1).max(5),
  verified: z.boolean().default(false),
});

export const ProductSchema = z.object({
  category: z.string(),
  description: z.string(),
  id: z.string(),
  image: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  rating: z.number().min(0).max(5),
  relatedProductIds: z.array(z.string()),
  stock: z.number().int().min(0),
  tags: z.array(z.string()),
});

export const CartItemSchema = ProductSchema.extend({
  quantity: z.number().int().positive(),
});

export const WishlistItemSchema = z.object({
  addedAt: z.string().datetime(),
  productId: z.string(),
});

export const PaymentMethodSchema = z.object({
  icon: z.string().optional(),
  id: z.string(),
  label: z.string(),
  type: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
});

export const ShippingOptionSchema = z.object({
  cost: z.number().min(0),
  estimatedDays: z.number().int().positive(),
  id: z.string(),
  method: z.string(),
});

export const AddressSchema = z.object({
  city: z.string(),
  country: z.string(),
  fullName: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  state: z.string(),
  zip: z.string(),
});

export const OrderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]);

export const TrackingInfoSchema = z.object({
  carrier: z.string(),
  estimatedDelivery: z.string().datetime(),
  events: z.array(
    z.object({
      date: z.string().datetime(),
      description: z.string(),
      location: z.string().optional(),
    }),
  ),
  status: z.string(),
  trackingNumber: z.string(),
});

export const ReturnStatusSchema = z.enum([
  'requested',
  'approved',
  'rejected',
  'received',
  'refunded',
]);

export const ReturnRequestSchema = z.object({
  id: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      reason: z.string(),
    }),
  ),
  orderId: z.string(),
  requestedAt: z.string().datetime(),
  status: ReturnStatusSchema,
});

export const OrderSchema = z.object({
  billingAddress: AddressSchema.optional(),
  coupon: z.string().optional(),
  discount: z.number().min(0).default(0),
  id: z.string(),
  items: z.array(CartItemSchema),
  paymentMethodId: z.string(),
  placedAt: z.string().datetime(),
  shippingAddress: AddressSchema,
  shippingCost: z.number().min(0).default(0),
  status: OrderStatusSchema,
  total: z.number().positive(),
  trackingInfo: TrackingInfoSchema.optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type Address = z.infer<typeof AddressSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;
export type ReturnStatus = z.infer<typeof ReturnStatusSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ShippingOption = z.infer<typeof ShippingOptionSchema>;
export type TrackingInfo = z.infer<typeof TrackingInfoSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = z.array(ProductSchema).parse([
  {
    category: 'Electronics',
    description: 'Studio quality sound with active noise cancellation.',
    id: 'prod-1',
    image: image1,
    name: 'Premium Headphones',
    price: 299,
    rating: 4.8,
    relatedProductIds: ['prod-2'],
    stock: 12,
    tags: ['audio', 'wireless', 'anc'],
  },
  {
    category: 'Electronics',
    description: 'RGB backlit with tactile switches.',
    id: 'prod-2',
    image: image2,
    name: 'Mechanical Keyboard',
    price: 150,
    rating: 4.5,
    relatedProductIds: ['prod-1'],
    stock: 5,
    tags: ['keyboard', 'rgb', 'mechanical'],
  },
  {
    category: 'Accessories',
    description: 'Swiss movement with leather strap.',
    id: 'prod-3',
    image: image4,
    name: 'Minimalist Watch',
    price: 85,
    rating: 4.2,
    relatedProductIds: ['prod-4'],
    stock: 20,
    tags: ['watch', 'leather', 'minimalist'],
  },
  {
    category: 'Accessories',
    description: 'Waterproof with laptop sleeve.',
    id: 'prod-4',
    image: image3,
    name: 'Leather Backpack',
    price: 120,
    rating: 4.6,
    relatedProductIds: ['prod-3'],
    stock: 0,
    tags: ['bag', 'leather', 'waterproof'],
  },
]);

export const MOCK_REVIEWS: Review[] = z.array(ReviewSchema).parse([
  {
    author: 'Alice',
    comment: 'Best headphones I have ever owned. The ANC is incredible.',
    date: '2025-01-10T10:00:00.000Z',
    id: 'rev-1',
    productId: 'prod-1',
    rating: 5,
    verified: true,
  },
  {
    author: 'Bob',
    comment: 'Great sound quality, a little heavy for long sessions.',
    date: '2025-02-14T09:30:00.000Z',
    id: 'rev-2',
    productId: 'prod-1',
    rating: 4,
    verified: true,
  },
  {
    author: 'Carol',
    comment: 'Typing feel is fantastic. RGB is very customizable.',
    date: '2025-03-01T14:00:00.000Z',
    id: 'rev-3',
    productId: 'prod-2',
    rating: 5,
    verified: false,
  },
  {
    author: 'Dave',
    comment: 'Very clean design. Keeps perfect time.',
    date: '2025-04-20T08:00:00.000Z',
    id: 'rev-4',
    productId: 'prod-3',
    rating: 4,
    verified: true,
  },
]);

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = z.array(PaymentMethodSchema).parse([
  { id: 'pm-1', label: 'Credit / Debit Card', type: 'card' },
  { id: 'pm-2', label: 'PayPal', type: 'paypal' },
  { id: 'pm-3', label: 'Apple Pay', type: 'apple_pay' },
  { id: 'pm-4', label: 'Google Pay', type: 'google_pay' },
]);

export const MOCK_SHIPPING_OPTIONS: ShippingOption[] = z.array(ShippingOptionSchema).parse([
  { cost: 5.99, estimatedDays: 7, id: 'ship-1', method: 'Standard Shipping' },
  { cost: 14.99, estimatedDays: 3, id: 'ship-2', method: 'Express Shipping' },
  { cost: 29.99, estimatedDays: 1, id: 'ship-3', method: 'Overnight Shipping' },
]);

export const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10,
  WELCOME20: 20,
};
