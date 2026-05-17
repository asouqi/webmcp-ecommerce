// ─── Base Constraints ─────────────────────────────────────────────────────────
// Minimum contract the library needs for inputs the agent constructs.
// Consumer input types must satisfy these.

export interface Address extends AddressBase {
  line2?: string;
}

export interface AddressBase {
  city: string;
  country: string;
  fullName: string;
  line1: string;
  state: string;
  zip: string;
}

// ─── Library Defaults ─────────────────────────────────────────────────────────
// Shipped by the library. Consumer can use as-is or replace with
// a type that extends the base constraint.

export interface CartModels {
  cart?: unknown;
  cartItem?: unknown;
}

export interface CheckoutModels {
  checkout?: unknown;
  couponResult?: unknown;
  order?: unknown;
  paymentMethod?: unknown;
  returnRequest?: unknown;
  shippingOption?: unknown;
  trackingInfo?: unknown;
}

// ─── Model Interfaces ─────────────────────────────────────────────────────────
// Collapse generics into a single typed object per namespace.
// Consumer overrides only the models they care about.
//
// Before: CartState<TCart, TCartItem>          — positional, fragile
// After:  CartState<TModels extends CartModels> — named, extensible
//
// Example:
//   interface MyModels extends CartModels { cart: MyCart; cartItem: MyCartItem }
//   const state: CartState<MyModels> = { ... }

export interface ProductModels {
  product?: unknown;
  review?: unknown;
  wishlistItem?: unknown;
}

export interface ReturnItem extends ReturnItemBase {}

export interface ReturnItemBase {
  productId: string;
  quantity: number;
  reason: string;
}
