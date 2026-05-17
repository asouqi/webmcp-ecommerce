import { ToolDefinition } from 'webmcp-adapter';

import {
  Address,
  AddressBase,
  CartModels,
  CheckoutModels,
  ProductModels,
  ReturnItem,
  ReturnItemBase,
} from './models';
import { CartState, CheckoutState, ProductState } from './state';
import { CartTools, CheckoutTools, ProductTools } from './tools';

// ─── ToolSchema ───────────────────────────────────────────────────────────────
// Per-tool schema passed by the consumer.
// `validator` maps directly to ToolConfig.validator in webmcp-adapter.
// At runtime: isStandardSchema check routes to correct validator —
//   Standard Schema (Zod, Valibot, ArkType) or plain JSON Schema.
// No output schema — webmcp-adapter has no output schema concept.

export interface CreateCartToolsOptions<
  TModels extends CartModels = CartModels,
  TSelected extends CartTools = CartTools,
> {
  customTools?: ToolDefinition[];
  // Keys constrained to selected tools — prevents silent schema/selectedTools mismatch
  schemas?: Partial<Record<TSelected, ToolSchema>>;
  selectedTools?: Set<TSelected>;
  state: CartState<TModels>;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CreateCheckoutToolsOptions<
  TModels extends CheckoutModels = CheckoutModels,
  TAddress extends AddressBase = Address,
  TReturnItem extends ReturnItemBase = ReturnItem,
  TSelected extends CheckoutTools = CheckoutTools,
> {
  customTools?: ToolDefinition[];
  schemas?: Partial<Record<TSelected, ToolSchema>>;
  selectedTools?: Set<TSelected>;
  state: CheckoutState<TModels, TAddress, TReturnItem>;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface CreateEcommerceToolsOptions<
  TCartModels extends CartModels = CartModels,
  TProductModels extends ProductModels = ProductModels,
  TCheckoutModels extends CheckoutModels = CheckoutModels,
  TAddress extends AddressBase = Address,
  TReturnItem extends ReturnItemBase = ReturnItem,
  TCartSelected extends CartTools = CartTools,
  TProductSelected extends ProductTools = ProductTools,
  TCheckoutSelected extends CheckoutTools = CheckoutTools,
> {
  cart: CreateCartToolsOptions<TCartModels, TCartSelected>;
  checkout: CreateCheckoutToolsOptions<TCheckoutModels, TAddress, TReturnItem, TCheckoutSelected>;
  products: CreateProductToolsOptions<TProductModels, TProductSelected>;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CreateProductToolsOptions<
  TModels extends ProductModels = ProductModels,
  TSelected extends ProductTools = ProductTools,
> {
  customTools?: ToolDefinition[];
  schemas?: Partial<Record<TSelected, ToolSchema>>;
  selectedTools?: Set<TSelected>;
  state: ProductState<TModels>;
}

// ─── Unified ──────────────────────────────────────────────────────────────────

export interface ToolSchema {
  annotations?: Record<string, unknown>;
  validator?: unknown;
}
