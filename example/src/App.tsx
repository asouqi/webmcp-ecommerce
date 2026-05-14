import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import CheckoutForm from './components/CheckoutForm';
import OrderHistory from './components/OrderHistory';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import ReturnRequestForm from './components/ReturnRequestForm';
import ShoppingCart from './components/ShoppingCart';
import {
  CartItem,
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  Order,
  Product,
  ReturnRequest,
  Review,
  WishlistItem,
} from './store';

export type AppView = 'browse' | 'checkout' | 'detail' | 'orders' | 'return' | 'success';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export default function App() {
  const [view, setView] = useState<AppView>('browse');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null);
  const [returnOrder, setReturnOrder] = useState<null | Order>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
  const [sort, setSort] = useState<SortOption>('default');

  // ── Product Search / Filter / Sort ────────────────────────────────────────
  const categories = [...new Set(MOCK_PRODUCTS.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((p) => {
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [search, selectedCategory, sort]);

  // Recommendations — wishlist-based, exclude already-wishlisted
  const recommendations = useMemo(() => {
    if (wishlist.length === 0) return [];
    const wishlistIds = new Set(wishlist.map((w) => w.productId));
    const wishlistedProducts = MOCK_PRODUCTS.filter((p) => wishlistIds.has(p.id));
    const relatedIds = new Set(wishlistedProducts.flatMap((p) => p.relatedProductIds));
    return MOCK_PRODUCTS.filter((p) => relatedIds.has(p.id) && !wishlistIds.has(p.id));
  }, [wishlist]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists)
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty < 1) return handleRemove(id);
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const handleRemove = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const handleClearCart = () => setCart([]);

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.find((w) => w.productId === productId)
        ? prev.filter((w) => w.productId !== productId)
        : [...prev, { addedAt: new Date().toISOString(), productId }],
    );
  };

  // ── Reviews ───────────────────────────────────────────────────────────────
  const handleSubmitReview = (review: Omit<Review, 'date' | 'id'>) => {
    setReviews((prev) => [
      ...prev,
      {
        ...review,
        date: new Date().toISOString(),
        id: `rev-${Date.now()}`,
      },
    ]);
  };

  // ── Orders ────────────────────────────────────────────────────────────────
  const handlePlaceOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    handleClearCart();
    setView('success');
  };

  // ── Returns ───────────────────────────────────────────────────────────────
  const handleRequestReturn = (returnReq: ReturnRequest) => {
    setReturns((prev) => [returnReq, ...prev]);
    setView('orders');
  };

  // ── Totals ────────────────────────────────────────────────────────────────
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart],
  );

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  const handleStartReturn = (order: Order) => {
    setReturnOrder(order);
    setView('return');
  };

  const lastOrder = orders[0] ?? null;

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Nav */}
      <AppBar elevation={1} position="sticky" sx={{ bgcolor: 'white', color: 'black' }}>
        <Toolbar>
          {view !== 'browse' && (
            <IconButton edge="start" onClick={() => setView('browse')}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography sx={{ flexGrow: 1, fontWeight: 'bold', ml: 1 }} variant="h6">
            WEB-STORE
          </Typography>
          <Button onClick={() => setView('orders')} sx={{ mr: 1 }}>
            Orders
          </Button>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6 }}>
        {/* VIEW: BROWSE */}
        {view === 'browse' && (
          <Box>
            {/* Search + Sort */}
            <Stack direction={{ sm: 'row', xs: 'column' }} mb={3} spacing={2}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, tags, categories..."
                value={search}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  label="Sort by"
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  value={sort}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Top Rated</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Category filter */}
            <Stack direction="row" flexWrap="wrap" mb={3} spacing={1}>
              <Chip
                color={!selectedCategory ? 'primary' : 'default'}
                label="All"
                onClick={() => setSelectedCategory(null)}
              />
              {categories.map((cat) => (
                <Chip
                  color={selectedCategory === cat ? 'primary' : 'default'}
                  key={cat}
                  label={cat}
                  onClick={() => setSelectedCategory(cat)}
                />
              ))}
            </Stack>

            {/* Products */}
            <Grid container spacing={3}>
              {filteredProducts.map((p) => (
                <Grid item key={p.id} md={3} sm={6} xs={12}>
                  <ProductCard
                    isWishlisted={wishlist.some((w) => w.productId === p.id)}
                    onAdd={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    onViewDetail={handleViewDetail}
                    product={p}
                  />
                </Grid>
              ))}
              {filteredProducts.length === 0 && (
                <Grid item xs={12}>
                  <Typography color="text.secondary" py={10} textAlign="center">
                    No products found.
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Box mt={6}>
                <Divider sx={{ mb: 3 }} />
                <Typography fontWeight="bold" mb={3} variant="h5">
                  Recommended for You
                </Typography>
                <Grid container spacing={3}>
                  {recommendations.map((p) => (
                    <Grid item key={p.id} md={3} sm={6} xs={12}>
                      <ProductCard
                        isWishlisted={wishlist.some((w) => w.productId === p.id)}
                        onAdd={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        onViewDetail={handleViewDetail}
                        product={p}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {/* VIEW: PRODUCT DETAIL */}
        {view === 'detail' && selectedProduct && (
          <ProductDetail
            allProducts={MOCK_PRODUCTS}
            isWishlisted={wishlist.some((w) => w.productId === selectedProduct.id)}
            onAdd={handleAddToCart}
            onSubmitReview={handleSubmitReview}
            onToggleWishlist={handleToggleWishlist}
            onViewDetail={handleViewDetail}
            product={selectedProduct}
            purchasedProductIds={new Set(orders.flatMap((o) => o.items.map((i) => i.id)))}
            reviews={reviews.filter((r) => r.productId === selectedProduct.id)}
          />
        )}

        {/* VIEW: CHECKOUT */}
        {view === 'checkout' && (
          <CheckoutForm cart={cart} cartSubtotal={cartSubtotal} onPlaceOrder={handlePlaceOrder} />
        )}

        {/* VIEW: SUCCESS */}
        {view === 'success' && lastOrder && (
          <Box py={10} textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography fontWeight="bold" variant="h3">
              Thank you!
            </Typography>
            <Typography color="text.secondary" variant="h6">
              Order #{lastOrder.id} confirmed.
            </Typography>
            <Stack direction="row" justifyContent="center" mt={4} spacing={2}>
              <Button onClick={() => setView('browse')} variant="outlined">
                Continue Shopping
              </Button>
              <Button onClick={() => setView('orders')} variant="contained">
                View My Orders
              </Button>
            </Stack>
          </Box>
        )}

        {/* VIEW: ORDERS */}
        {view === 'orders' && (
          <OrderHistory onStartReturn={handleStartReturn} orders={orders} returns={returns} />
        )}

        {/* VIEW: RETURN */}
        {view === 'return' && returnOrder && (
          <ReturnRequestForm
            onCancel={() => setView('orders')}
            onSubmit={handleRequestReturn}
            order={returnOrder}
          />
        )}
      </Container>

      <ShoppingCart
        cart={cart}
        cartSubtotal={cartSubtotal}
        drawerOpen={drawerOpen}
        handleRemove={handleRemove}
        handleUpdateQty={handleUpdateQty}
        setDrawer={() => setDrawerOpen(false)}
        setView={setView}
      />
    </Box>
  );
}
