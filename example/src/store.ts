import { z } from "zod"

import image1 from './assets/img_1.png';
import image2 from './assets/img_2.png';
import image3 from './assets/img_3.png';
import image4 from './assets/img_4.png';

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  author: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  date: z.string().datetime(),
  verified: z.boolean().default(false),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  stock: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  tags: z.array(z.string()),
  relatedProductIds: z.array(z.string()),
});

export const CartItemSchema = ProductSchema.extend({
  quantity: z.number().int().positive(),
});

export const WishlistItemSchema = z.object({
  productId: z.string(),
  addedAt: z.string().datetime(),
});

export const PaymentMethodSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
  icon: z.string().optional(),
});

export const ShippingOptionSchema = z.object({
  id: z.string(),
  method: z.string(),
  cost: z.number().min(0),
  estimatedDays: z.number().int().positive(),
});

export const AddressSchema = z.object({
  fullName: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);

export const TrackingInfoSchema = z.object({
  carrier: z.string(),
  trackingNumber: z.string(),
  status: z.string(),
  estimatedDelivery: z.string().datetime(),
  events: z.array(z.object({
    date: z.string().datetime(),
    description: z.string(),
    location: z.string().optional(),
  })),
});

export const ReturnStatusSchema = z.enum(['requested', 'approved', 'rejected', 'received', 'refunded']);

export const ReturnRequestSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    reason: z.string(),
  })),
  status: ReturnStatusSchema,
  requestedAt: z.string().datetime(),
});

export const OrderSchema = z.object({
  id: z.string(),
  items: z.array(CartItemSchema),
  total: z.number().positive(),
  status: OrderStatusSchema,
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  paymentMethodId: z.string(),
  coupon: z.string().optional(),
  discount: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
  placedAt: z.string().datetime(),
  trackingInfo: TrackingInfoSchema.optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type Review = z.infer<typeof ReviewSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type ShippingOption = z.infer<typeof ShippingOptionSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type TrackingInfo = z.infer<typeof TrackingInfoSchema>;
export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;
export type ReturnStatus = z.infer<typeof ReturnStatusSchema>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = z.array(ProductSchema).parse([
  {
    id: 'prod-1',
    name: 'Premium Headphones',
    price: 299,
    description: 'Studio quality sound with active noise cancellation.',
    category: 'Electronics',
    image: image1,
    stock: 12,
    rating: 4.8,
    tags: ['audio', 'wireless', 'anc'],
    relatedProductIds: ['prod-2'],
  },
  {
    id: 'prod-2',
    name: 'Mechanical Keyboard',
    price: 150,
    description: 'RGB backlit with tactile switches.',
    category: 'Electronics',
    image: image2,
    stock: 5,
    rating: 4.5,
    tags: ['keyboard', 'rgb', 'mechanical'],
    relatedProductIds: ['prod-1'],
  },
  {
    id: 'prod-3',
    name: 'Minimalist Watch',
    price: 85,
    description: 'Swiss movement with leather strap.',
    category: 'Accessories',
    image: image4,
    stock: 20,
    rating: 4.2,
    tags: ['watch', 'leather', 'minimalist'],
    relatedProductIds: ['prod-4'],
  },
  {
    id: 'prod-4',
    name: 'Leather Backpack',
    price: 120,
    description: 'Waterproof with laptop sleeve.',
    category: 'Accessories',
    image: image3,
    stock: 0,
    rating: 4.6,
    tags: ['bag', 'leather', 'waterproof'],
    relatedProductIds: ['prod-3'],
  },
]);

export const MOCK_REVIEWS: Review[] = z.array(ReviewSchema).parse([
  {
    id: 'rev-1',
    productId: 'prod-1',
    author: 'Alice',
    rating: 5,
    comment: 'Best headphones I have ever owned. The ANC is incredible.',
    date: '2025-01-10T10:00:00.000Z',
    verified: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    author: 'Bob',
    rating: 4,
    comment: 'Great sound quality, a little heavy for long sessions.',
    date: '2025-02-14T09:30:00.000Z',
    verified: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    author: 'Carol',
    rating: 5,
    comment: 'Typing feel is fantastic. RGB is very customizable.',
    date: '2025-03-01T14:00:00.000Z',
    verified: false,
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    author: 'Dave',
    rating: 4,
    comment: 'Very clean design. Keeps perfect time.',
    date: '2025-04-20T08:00:00.000Z',
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
  { id: 'ship-1', method: 'Standard Shipping', cost: 5.99, estimatedDays: 7 },
  { id: 'ship-2', method: 'Express Shipping', cost: 14.99, estimatedDays: 3 },
  { id: 'ship-3', method: 'Overnight Shipping', cost: 29.99, estimatedDays: 1 },
]);

export const VALID_COUPONS: Record<string, number> = {
  'SAVE10': 10,
  'WELCOME20': 20,
};