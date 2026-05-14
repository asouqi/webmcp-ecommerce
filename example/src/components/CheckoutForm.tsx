import React, { useState } from 'react';
import {
    Box, Button, Divider, FormControl, FormControlLabel,
    InputLabel, MenuItem, Paper, Radio, RadioGroup,
    Select, Stack, TextField, Typography,
} from '@mui/material';
import {
    Address, CartItem, MOCK_PAYMENT_METHODS, MOCK_SHIPPING_OPTIONS,
    Order, ShippingOption, VALID_COUPONS,
} from '../store';

interface CheckoutFormProps {
    cart: CartItem[]
    cartSubtotal: number
    onPlaceOrder: (order: Order) => void
}

const emptyAddress = (): Address => ({
    fullName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'US',
});

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, cartSubtotal, onPlaceOrder }) => {
    const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress());
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState<Address>(emptyAddress());
    const [selectedPaymentId, setSelectedPaymentId] = useState(MOCK_PAYMENT_METHODS[0].id);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(MOCK_SHIPPING_OPTIONS[0]);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = () => {
        const discount = VALID_COUPONS[couponCode.toUpperCase()];
        if (discount) { setCouponDiscount(discount); setCouponError(''); }
        else { setCouponDiscount(0); setCouponError('Invalid coupon code'); }
    };

    const total = Math.max(0, cartSubtotal + selectedShipping.cost - couponDiscount);

    const addressValid = (a: Address) => a.fullName && a.line1 && a.city && a.state && a.zip;
    const canPlace = addressValid(shippingAddress) && (billingSameAsShipping || addressValid(billingAddress));

    const handlePlaceOrder = () => {
        const order: Order = {
            id: `order-${Date.now()}`,
            items: cart,
            total,
            status: 'confirmed',
            shippingAddress,
            billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
            paymentMethodId: selectedPaymentId,
            coupon: couponCode || undefined,
            discount: couponDiscount,
            shippingCost: selectedShipping.cost,
            placedAt: new Date().toISOString(),
            trackingInfo: {
                carrier: 'FedEx',
                trackingNumber: `TRK-${Date.now()}`,
                status: 'Processing',
                estimatedDelivery: new Date(Date.now() + selectedShipping.estimatedDays * 86400000).toISOString(),
                events: [{
                    date: new Date().toISOString(),
                    description: 'Order placed',
                    location: 'Warehouse',
                }],
            },
        };
        onPlaceOrder(order);
    };

    const AddressFields = ({ value, onChange }: { value: Address, onChange: (a: Address) => void }) => (
        <Stack spacing={2}>
            <TextField label="Full Name" value={value.fullName} onChange={e => onChange({ ...value, fullName: e.target.value })} fullWidth required />
            <TextField label="Address Line 1" value={value.line1} onChange={e => onChange({ ...value, line1: e.target.value })} fullWidth required />
            <TextField label="Address Line 2 (optional)" value={value.line2} onChange={e => onChange({ ...value, line2: e.target.value })} fullWidth />
            <Stack direction="row" spacing={2}>
                <TextField label="City" value={value.city} onChange={e => onChange({ ...value, city: e.target.value })} fullWidth required />
                <TextField label="State" value={value.state} onChange={e => onChange({ ...value, state: e.target.value })} fullWidth required />
                <TextField label="ZIP" value={value.zip} onChange={e => onChange({ ...value, zip: e.target.value })} fullWidth required />
            </Stack>
        </Stack>
    );

    return (
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #ddd', maxWidth: 680, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={4}>

                {/* Shipping Address */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Shipping Address</Typography>
                    <AddressFields value={shippingAddress} onChange={setShippingAddress} />
                </Box>

                {/* Billing Address */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>Billing Address</Typography>
                    <FormControlLabel
                        control={<Radio checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(true)} />}
                        label="Same as shipping"
                    />
                    <FormControlLabel
                        control={<Radio checked={!billingSameAsShipping} onChange={() => setBillingSameAsShipping(false)} />}
                        label="Use different address"
                    />
                    {!billingSameAsShipping && <Box mt={2}><AddressFields value={billingAddress} onChange={setBillingAddress} /></Box>}
                </Box>

                {/* Shipping Method */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Shipping Method</Typography>
                    <RadioGroup value={selectedShipping.id} onChange={e => setSelectedShipping(MOCK_SHIPPING_OPTIONS.find(s => s.id === e.target.value)!)}>
                        {MOCK_SHIPPING_OPTIONS.map(option => (
                            <FormControlLabel
                                key={option.id}
                                value={option.id}
                                control={<Radio />}
                                label={`${option.method} — $${option.cost.toFixed(2)} (${option.estimatedDays} day${option.estimatedDays > 1 ? 's' : ''})`}
                            />
                        ))}
                    </RadioGroup>
                </Box>

                {/* Payment Method */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Payment Method</Typography>
                    <FormControl fullWidth>
                        <InputLabel>Payment</InputLabel>
                        <Select value={selectedPaymentId} label="Payment" onChange={e => setSelectedPaymentId(e.target.value)}>
                            {MOCK_PAYMENT_METHODS.map(pm => (
                                <MenuItem key={pm.id} value={pm.id}>{pm.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Coupon */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Coupon Code</Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            label="Enter code"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                            error={!!couponError}
                            helperText={couponError || (couponDiscount > 0 ? `✓ -$${couponDiscount} applied` : '')}
                            fullWidth
                        />
                        <Button variant="outlined" onClick={handleApplyCoupon} sx={{ minWidth: 100 }}>Apply</Button>
                    </Stack>
                </Box>

                {/* Order Summary */}
                <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>Order Summary</Typography>
                    {cart.map(item => (
                        <Stack key={item.id} direction="row" justifyContent="space-between">
                            <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                            <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                        </Stack>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Shipping</Typography>
                        <Typography variant="body2">${selectedShipping.cost.toFixed(2)}</Typography>
                    </Stack>
                    {couponDiscount > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="success.main">Coupon discount</Typography>
                            <Typography variant="body2" color="success.main">-${couponDiscount}</Typography>
                        </Stack>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">${total.toFixed(2)}</Typography>
                    </Stack>
                </Box>

                <Button variant="contained" size="large" color="success" disabled={!canPlace} onClick={handlePlaceOrder}>
                    Place Secure Order
                </Button>
            </Stack>
        </Paper>
    );
};

export default CheckoutForm;