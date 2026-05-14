import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  CardMedia, Button, Badge, IconButton, Box,
  ListItemText, TextField, Divider, Paper, Stack,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SuccessIcon from '@mui/icons-material/CheckCircle';

import {CartItem, MOCK_PRODUCTS, Product} from "./store";
import ProductCard from "./components/ProductCard";
import ShoppingCart from "./components/ShoppingCart";


type AppView = 'browse' | 'checkout' | 'success';

export default function App() {
  const [view, setView] = useState<AppView>('browse');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- CORE OPERATIONS (WebMCP Targets) ---
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const handleUpdateQty = (id: number, qty: number) => {
    if (qty < 1) return handleRemove(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleRemove = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  return (
      <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
        {/* Navigation Bar */}
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'black' }}>
          <Toolbar>
            {view !== 'browse' && (
                <IconButton edge="start" onClick={() => setView('browse')}><ArrowBackIcon /></IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 1 }}>WEB-STORE</Typography>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <Badge badgeContent={cart.length} color="primary"><ShoppingCartIcon /></Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container sx={{ py: 6 }}>
          {/* VIEW: BROWSE PRODUCTS */}
          {view === 'browse' && (
              <Grid container spacing={3}>
                {MOCK_PRODUCTS.map(p => (
                    <Grid item xs={12} sm={6} md={3} key={p.id}>
                      <ProductCard product={p} onAdd={handleAddToCart} />
                    </Grid>
                ))}
              </Grid>
          )}

          {/* VIEW: CHECKOUT FORM */}
          {view === 'checkout' && (
              <Paper elevation={0} sx={{ p: 4, border: '1px solid #ddd', maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">Checkout</Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
                  <TextField label="Full Name" variant="outlined" fullWidth />
                  <TextField label="Shipping Address" multiline rows={3} fullWidth />
                  <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1">Order Summary</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">${cartTotal}</Typography>
                  </Box>
                  <Button
                      variant="contained"
                      size="large"
                      color="success"
                      onClick={() => { setCart([]); setView('success'); }}
                  >
                    Place Secure Order
                  </Button>
                </Stack>
              </Paper>
          )}

          {/* VIEW: SUCCESS SCREEN */}
          {view === 'success' && (
              <Box textAlign="center" py={10}>
                <SuccessIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h3" fontWeight="bold">Thank you!</Typography>
                <Typography variant="h6" color="text.secondary">Your order has been confirmed.</Typography>
                <Button variant="outlined" sx={{ mt: 4 }} onClick={() => setView('browse')}>Continue Shopping</Button>
              </Box>
          )}
        </Container>

        <ShoppingCart cart={cart} cartTotal={cartTotal} drawerOpen={drawerOpen} setDrawer={() => setDrawerOpen(false)} setView={setView} handleUpdateQty={handleUpdateQty} handleRemove={handleRemove} />
      </Box>
  );
}