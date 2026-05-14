import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

import { AppView } from '../App';
import { CartItem } from '../store';

interface ShoppingCartProps {
  cart: CartItem[];
  cartSubtotal: number;
  drawerOpen: boolean;
  handleRemove: (id: string) => void;
  handleUpdateQty: (id: string, qty: number) => void;
  setDrawer: () => void;
  setView: (view: AppView) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  cartSubtotal,
  drawerOpen,
  handleRemove,
  handleUpdateQty,
  setDrawer,
  setView,
}) => (
  <Drawer anchor="right" onClose={setDrawer} open={drawerOpen}>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3, width: 380 }}>
      <Typography fontWeight="bold" variant="h5">
        Cart
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <Typography color="text.secondary" mt={10} textAlign="center">
            Your cart is empty
          </Typography>
        ) : (
          <List>
            {cart.map((item) => (
              <ListItem key={item.id} sx={{ px: 0, py: 2 }}>
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price} ea.`}
                  sx={{ flex: 1 }}
                />
                <Stack alignItems="center" direction="row" spacing={0.5}>
                  <IconButton
                    onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 20, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRemove(item.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {cart.length > 0 && (
        <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Subtotal</Typography>
            <Typography fontWeight="bold" variant="h6">
              ${cartSubtotal.toFixed(2)}
            </Typography>
          </Stack>
          <Button
            fullWidth
            onClick={() => {
              setView('checkout');
              setDrawer();
            }}
            size="large"
            variant="contained"
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Box>
  </Drawer>
);

export default ShoppingCart;
