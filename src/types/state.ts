import { SortOption } from './enums';
import {
  Address,
  AddressBase,
  CartModels,
  CheckoutModels,
  ProductModels,
  ReturnItem,
  ReturnItemBase,
} from './models';

export interface CartState<TModels extends CartModels = CartModels> {
  addItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<TModels['cart']>;
  getItem: (productId: string) => Promise<null | TModels['cartItem']>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
}

export interface CheckoutState<
  TModels extends CheckoutModels = CheckoutModels,
  TAddress extends AddressBase = Address,
  TReturnItem extends ReturnItemBase = ReturnItem,
> {
  applyCoupon: (code: string) => Promise<TModels['couponResult']>;
  cancelOrder: (orderId: string) => Promise<void>;
  estimateShipping: (address: TAddress) => Promise<TModels['shippingOption'][]>;
  getCheckout: () => Promise<TModels['checkout']>;
  getOrder: (orderId: string) => Promise<null | TModels['order']>;
  getOrderHistory: () => Promise<TModels['order'][]>;
  getPaymentMethods: () => Promise<TModels['paymentMethod'][]>;
  getReturnStatus: (returnId: string) => Promise<null | TModels['returnRequest']>;
  placeOrder: () => Promise<TModels['order']>;
  requestReturn: (orderId: string, items: TReturnItem[]) => Promise<TModels['returnRequest']>;
  setBillingAddress: (address: TAddress) => Promise<void>;
  setPaymentMethod: (methodId: string) => Promise<void>;
  setShippingAddress: (address: TAddress) => Promise<void>;
  trackOrder: (orderId: string) => Promise<null | TModels['trackingInfo']>;
}

export interface ProductState<TModels extends ProductModels = ProductModels> {
  addToWishlist: (productId: string) => Promise<void>;
  checkStock: (productId: string, quantity: number) => Promise<boolean>;
  getCategories: () => Promise<string[]>;
  getProduct: (productId: string) => Promise<null | TModels['product']>;
  getProductReviews: (productId: string) => Promise<TModels['review'][]>;
  getProducts: () => Promise<TModels['product'][]>;
  getRecommendations: () => Promise<TModels['product'][]>;
  getRelatedProducts: (productId: string) => Promise<TModels['product'][]>;
  getWishlist: () => Promise<TModels['wishlistItem'][]>;
  removeFromWishlist: (productId: string) => Promise<void>;
  searchProducts: (
    query: string,
    options?: { category?: string; sort?: SortOption },
  ) => Promise<TModels['product'][]>;
}
