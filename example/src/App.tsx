import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Button,
  Badge, IconButton, Box, Divider, InputAdornment, TextField,
  Stack, Chip, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';

import {
  CartItem, MOCK_PRODUCTS, MOCK_REVIEWS, Order, Product,
  ReturnRequest, Review, WishlistItem,
} from './store';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import ShoppingCart from './components/ShoppingCart';
import CheckoutForm from './components/CheckoutForm';
import OrderHistory from './components/OrderHistory';
import ReturnRequestForm from './components/ReturnRequestForm';

export type AppView = 'browse' | 'detail' | 'checkout' | 'success' | 'orders' | 'return';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export default function App() {
  const [view, setView] = useState<AppView>('browse');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('default');

  // ── Product Search / Filter / Sort ────────────────────────────────────────
  const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => {
      const matchesSearch = search === '' ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
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
    const wishlistIds = new Set(wishlist.map(w => w.productId));
    const wishlistedProducts = MOCK_PRODUCTS.filter(p => wishlistIds.has(p.id));
    const relatedIds = new Set(wishlistedProducts.flatMap(p => p.relatedProductIds));
    return MOCK_PRODUCTS.filter(p => relatedIds.has(p.id) && !wishlistIds.has(p.id));
  }, [wishlist]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty < 1) return handleRemove(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleRemove = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const handleClearCart = () => setCart([]);

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev =>
        prev.find(w => w.productId === productId)
            ? prev.filter(w => w.productId !== productId)
            : [...prev, { productId, addedAt: new Date().toISOString() }]
    );
  };

  // ── Reviews ───────────────────────────────────────────────────────────────
  const handleSubmitReview = (review: Omit<Review, 'id' | 'date'>) => {
    setReviews(prev => [...prev, {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString(),
    }]);
  };

  // ── Orders ────────────────────────────────────────────────────────────────
  const handlePlaceOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    handleClearCart();
    setView('success');
  };

  // ── Returns ───────────────────────────────────────────────────────────────
  const handleRequestReturn = (returnReq: ReturnRequest) => {
    setReturns(prev => [returnReq, ...prev]);
    setView('orders');
  };

  // ── Totals ────────────────────────────────────────────────────────────────
  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

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
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'black' }}>
          <Toolbar>
            {view !== 'browse' && (
                <IconButton edge="start" onClick={() => setView('browse')}><ArrowBackIcon /></IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 1 }}>WEB-STORE</Typography>
            <Button onClick={() => setView('orders')} sx={{ mr: 1 }}>Orders</Button>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <Badge badgeContent={cart.length} color="primary"><ShoppingCartIcon /></Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container sx={{ py: 6 }}>

          {/* VIEW: BROWSE */}
          {view === 'browse' && (
              <Box>
                {/* Search + Sort */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                  <TextField
                      fullWidth
                      placeholder="Search products, tags, categories..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                  />
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select value={sort} label="Sort by" onChange={e => setSort(e.target.value as SortOption)}>
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="price-asc">Price: Low to High</MenuItem>
                      <MenuItem value="price-desc">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Top Rated</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Category filter */}
                <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
                  <Chip label="All" onClick={() => setSelectedCategory(null)} color={!selectedCategory ? 'primary' : 'default'} />
                  {categories.map(cat => (
                      <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)} color={selectedCategory === cat ? 'primary' : 'default'} />
                  ))}
                </Stack>

                {/* Products */}
                <Grid container spacing={3}>
                  {filteredProducts.map(p => (
                      <Grid item xs={12} sm={6} md={3} key={p.id}>
                        <ProductCard
                            product={p}
                            onAdd={handleAddToCart}
                            onViewDetail={handleViewDetail}
                            isWishlisted={wishlist.some(w => w.productId === p.id)}
                            onToggleWishlist={handleToggleWishlist}
                        />
                      </Grid>
                  ))}
                  {filteredProducts.length === 0 && (
                      <Grid item xs={12}>
                        <Typography textAlign="center" color="text.secondary" py={10}>No products found.</Typography>
                      </Grid>
                  )}
                </Grid>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <Box mt={6}>
                      <Divider sx={{ mb: 3 }} />
                      <Typography variant="h5" fontWeight="bold" mb={3}>Recommended for You</Typography>
                      <Grid container spacing={3}>
                        {recommendations.map(p => (
                            <Grid item xs={12} sm={6} md={3} key={p.id}>
                              <ProductCard
                                  product={p}
                                  onAdd={handleAddToCart}
                                  onViewDetail={handleViewDetail}
                                  isWishlisted={wishlist.some(w => w.productId === p.id)}
                                  onToggleWishlist={handleToggleWishlist}
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
                  product={selectedProduct}
                  allProducts={MOCK_PRODUCTS}
                  reviews={reviews.filter(r => r.productId === selectedProduct.id)}
                  onAdd={handleAddToCart}
                  onViewDetail={handleViewDetail}
                  isWishlisted={wishlist.some(w => w.productId === selectedProduct.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onSubmitReview={handleSubmitReview}
                  purchasedProductIds={new Set(orders.flatMap(o => o.items.map(i => i.id)))}
              />
          )}

          {/* VIEW: CHECKOUT */}
          {view === 'checkout' && (
              <CheckoutForm
                  cart={cart}
                  cartSubtotal={cartSubtotal}
                  onPlaceOrder={handlePlaceOrder}
              />
          )}

          {/* VIEW: SUCCESS */}
          {view === 'success' && lastOrder && (
              <Box textAlign="center" py={10}>
                <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h3" fontWeight="bold">Thank you!</Typography>
                <Typography variant="h6" color="text.secondary">Order #{lastOrder.id} confirmed.</Typography>
                <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
                  <Button variant="outlined" onClick={() => setView('browse')}>Continue Shopping</Button>
                  <Button variant="contained" onClick={() => setView('orders')}>View My Orders</Button>
                </Stack>
              </Box>
          )}

          {/* VIEW: ORDERS */}
          {view === 'orders' && (
              <OrderHistory
                  orders={orders}
                  returns={returns}
                  onStartReturn={handleStartReturn}
              />
          )}

          {/* VIEW: RETURN */}
          {view === 'return' && returnOrder && (
              <ReturnRequestForm
                  order={returnOrder}
                  onSubmit={handleRequestReturn}
                  onCancel={() => setView('orders')}
              />
          )}
        </Container>

        <ShoppingCart
            cart={cart}
            cartSubtotal={cartSubtotal}
            drawerOpen={drawerOpen}
            setDrawer={() => setDrawerOpen(false)}
            setView={setView}
            handleUpdateQty={handleUpdateQty}
            handleRemove={handleRemove}
        />
      </Box>
  );
}