export type DefaultOrderStatus = 'cancelled' | 'confirmed' | 'delivered' | 'pending' | 'shipped';

export type DefaultPaymentMethodType = 'apple_pay' | 'card' | 'google_pay' | 'paypal';

export type DefaultReturnStatus = 'approved' | 'received' | 'refunded' | 'rejected' | 'requested';

export type DefaultSortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

// ─── Extensible via consumer union ──────────────────────────────────────────────────────
// Consumer extends by passing a custom union: SortOption<'by-popularity' | 'by-newest'>

export type OrderStatus<TCustom extends string = never> = DefaultOrderStatus | TCustom;

export type PaymentMethodType<TCustom extends string = never> = DefaultPaymentMethodType | TCustom;

export type ReturnStatus<TCustom extends string = never> = DefaultReturnStatus | TCustom;

export type SortOption<TCustom extends string = never> = DefaultSortOption | TCustom;
