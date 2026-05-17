# Tool List

## `CartTools`

| Tool | Operation |
|---|---|
| `get-cart` | Get full cart |
| `get-cart-item` | Get single item by productId |
| `add-to-cart` | Add item with quantity |
| `remove-from-cart` | Remove item by productId |
| `update-cart-quantity` | Update quantity of an item |
| `clear-cart` | Empty the cart |

## `ProductTools`

| Tool | Operation |
|---|---|
| `get-product` | Get single product by ID |
| `get-products` | List all products |
| `search-products` | Free-text search with optional sort + category filter |
| `get-categories` | List all categories |
| `get-related-products` | Get related products by productId |
| `get-recommendations` | Get recommendations — consumer owns logic |
| `check-stock` | Check availability by productId + quantity |
| `get-product-reviews` | Get reviews for a product |
| `add-to-wishlist` | Add product to wishlist |
| `remove-from-wishlist` | Remove product from wishlist |
| `get-wishlist` | Get full wishlist |

## `CheckoutTools`

| Tool | Operation |
|---|---|
| `get-checkout` | Get current checkout state |
| `set-shipping-address` | Set shipping address |
| `set-billing-address` | Set billing address |
| `get-payment-methods` | List available payment methods |
| `set-payment-method` | Select payment method by ID |
| `estimate-shipping` | Get shipping options for an address |
| `apply-coupon` | Apply a coupon code |
| `place-order` | Place the order |
| `get-order` | Get a specific order by ID |
| `get-order-history` | List all past orders |
| `track-order` | Get tracking info for an order |
| `cancel-order` | Cancel an order by ID |
| `request-return` | Request a return for order items |
| `get-return-status` | Get status of a return request by ID |
