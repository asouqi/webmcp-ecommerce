export type CartTools =
  | 'add-to-cart'
  | 'clear-cart'
  | 'get-cart'
  | 'get-cart-item'
  | 'remove-from-cart'
  | 'update-cart-quantity';

export type CheckoutTools =
  | 'apply-coupon'
  | 'cancel-order'
  | 'estimate-shipping'
  | 'get-checkout'
  | 'get-order'
  | 'get-order-history'
  | 'get-payment-methods'
  | 'get-return-status'
  | 'place-order'
  | 'request-return'
  | 'set-billing-address'
  | 'set-payment-method'
  | 'set-shipping-address'
  | 'track-order';

export type EcommerceTools = CartTools | CheckoutTools | ProductTools;

export type ProductTools =
  | 'add-to-wishlist'
  | 'check-stock'
  | 'get-categories'
  | 'get-product'
  | 'get-product-reviews'
  | 'get-products'
  | 'get-recommendations'
  | 'get-related-products'
  | 'get-wishlist'
  | 'remove-from-wishlist'
  | 'search-products';
