import React from 'react';
import {
  Box, Button, Divider, Drawer, IconButton, List,
  ListItem, ListItemText, Stack, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartItem } from '../store';
import { AppView } from '../App';

interface ShoppingCartProps {
  cart: CartItem[]
  cartSubtotal: number
  drawerOpen: boolean
  setDrawer: () => void
  setView: (view: AppView) => void
  handleUpdateQty: (id: string, qty: number) => void
  handleRemove: (id: string) => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
                                                     cart, cartSubtotal, drawerOpen, setDrawer, setView, handleUpdateQty, handleRemove,
                                                   }) => (
    <Drawer anchor="right" open={drawerOpen} onClose={setDrawer}>
      <Box sx={{ width: 380, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" fontWeight="bold">Cart</Typography>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" mt={10}>Your cart is empty</Typography>
          ) : (
              <List>
                {cart.map(item => (
                    <ListItem key={item.id} sx={{ px: 0, py: 2 }}>
                      <ListItemText
                          primary={item.name}
                          secondary={`$${item.price} ea.`}
                          sx={{ flex: 1 }}
                      />
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconButton size="small" onClick={() => handleUpdateQty(item.id, item.quantity - 1)}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleUpdateQty(item.id, item.quantity + 1)}><AddIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleRemove(item.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    </ListItem>
                ))}
              </List>
          )}
        </Box>

        {cart.length > 0 && (
            <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Subtotal</Typography>
                <Typography variant="h6" fontWeight="bold">${cartSubtotal.toFixed(2)}</Typography>
              </Stack>
              <Button variant="contained" fullWidth size="large" onClick={() => { setView('checkout'); setDrawer(); }}>
                Proceed to Checkout
              </Button>
            </Box>
        )}
      </Box>
    </Drawer>
);

export default ShoppingCart;