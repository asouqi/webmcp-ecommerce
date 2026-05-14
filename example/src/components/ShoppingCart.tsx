import React from "react"
import {
    Box,
    Button,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import {Add as AddIcon, Delete as DeleteIcon, Remove as RemoveIcon} from "@mui/icons-material";
import {CartItem} from "../store"

type CartRowProps = {
    item: CartItem,
    onUpdate: (id: number, q: number) => void,
    onRemove: (id: number) => void
};

const CartRow = ({item, onUpdate, onRemove}: CartRowProps) => (
    <ListItem sx={{px: 0, py: 2}}>
        <Grid container alignItems="center" spacing={1}>
            <Grid item xs={6}>
                <ListItemText primary={item.name} secondary={`$${item.price} ea.`}/>
            </Grid>
            <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton size="small" onClick={() => onUpdate(item.id, item.quantity - 1)}><RemoveIcon
                        fontSize="small"/></IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => onUpdate(item.id, item.quantity + 1)}><AddIcon
                        fontSize="small"/></IconButton>
                </Stack>
            </Grid>
            <Grid item xs={2}>
                <IconButton size="small" color="error" onClick={() => onRemove(item.id)}><DeleteIcon/></IconButton>
            </Grid>
        </Grid>
    </ListItem>
)

interface ShoppingCartProps {
    cart: CartItem[]
    cartTotal: number
    drawerOpen: boolean
    setDrawer: () => void
    setView: (view: string) => void
    handleUpdateQty: (id: number, qty: number) => void
    handleRemove: (id: number) => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
                                                       cart,
                                                       cartTotal,
                                                       drawerOpen,
                                                       setDrawer,
                                                       setView,
                                                       handleUpdateQty,
                                                       handleRemove
                                                   }) => {
    return <Drawer anchor="right" open={drawerOpen} onClose={setDrawer}>
        <Box sx={{width: 380, p: 3, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Typography variant="h5" fontWeight="bold">Cart</Typography>
            <Divider sx={{my: 2}}/>

            <Box sx={{flexGrow: 1, overflowY: 'auto'}}>
                {cart.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" mt={10}>Your cart is empty</Typography>
                ) : (
                    <List>
                        {cart.map(item => (
                            <CartRow key={item.id} item={item} onUpdate={handleUpdateQty} onRemove={handleRemove}/>
                        ))}
                    </List>
                )}
            </Box>

            {cart.length > 0 && (
                <Box sx={{pt: 2, borderTop: '1px solid #eee'}}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" fontWeight="bold">${cartTotal}</Typography>
                    </Stack>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => {
                            setView('checkout');
                            setDrawer();
                        }}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            )}
        </Box>
    </Drawer>
}

export default ShoppingCart