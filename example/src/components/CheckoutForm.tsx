import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import {
  Address,
  CartItem,
  MOCK_PAYMENT_METHODS,
  MOCK_SHIPPING_OPTIONS,
  Order,
  ShippingOption,
  VALID_COUPONS,
} from '../store';

interface CheckoutFormProps {
  cart: CartItem[];
  cartSubtotal: number;
  onPlaceOrder: (order: Order) => void;
}

const emptyAddress = (): Address => ({
  city: '',
  country: 'US',
  fullName: '',
  line1: '',
  line2: '',
  state: '',
  zip: '',
});

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, cartSubtotal, onPlaceOrder }) => {
  const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress());
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Address>(emptyAddress());
  const [selectedPaymentId, setSelectedPaymentId] = useState(MOCK_PAYMENT_METHODS[0].id);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(
    MOCK_SHIPPING_OPTIONS[0],
  );
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    const discount = VALID_COUPONS[couponCode.toUpperCase()];
    if (discount) {
      setCouponDiscount(discount);
      setCouponError('');
    } else {
      setCouponDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };

  const total = Math.max(0, cartSubtotal + selectedShipping.cost - couponDiscount);

  const addressValid = (a: Address) => a.fullName && a.line1 && a.city && a.state && a.zip;
  const canPlace =
    addressValid(shippingAddress) && (billingSameAsShipping || addressValid(billingAddress));

  const handlePlaceOrder = () => {
    const order: Order = {
      billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
      coupon: couponCode || undefined,
      discount: couponDiscount,
      id: `order-${Date.now()}`,
      items: cart,
      paymentMethodId: selectedPaymentId,
      placedAt: new Date().toISOString(),
      shippingAddress,
      shippingCost: selectedShipping.cost,
      status: 'confirmed',
      total,
      trackingInfo: {
        carrier: 'FedEx',
        estimatedDelivery: new Date(
          Date.now() + selectedShipping.estimatedDays * 86400000,
        ).toISOString(),
        events: [
          {
            date: new Date().toISOString(),
            description: 'Order placed',
            location: 'Warehouse',
          },
        ],
        status: 'Processing',
        trackingNumber: `TRK-${Date.now()}`,
      },
    };
    onPlaceOrder(order);
  };

  const AddressFields = ({
    onChange,
    value,
  }: {
    onChange: (a: Address) => void;
    value: Address;
  }) => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Full Name"
        onChange={(e) => onChange({ ...value, fullName: e.target.value })}
        required
        value={value.fullName}
      />
      <TextField
        fullWidth
        label="Address Line 1"
        onChange={(e) => onChange({ ...value, line1: e.target.value })}
        required
        value={value.line1}
      />
      <TextField
        fullWidth
        label="Address Line 2 (optional)"
        onChange={(e) => onChange({ ...value, line2: e.target.value })}
        value={value.line2}
      />
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="City"
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          required
          value={value.city}
        />
        <TextField
          fullWidth
          label="State"
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          required
          value={value.state}
        />
        <TextField
          fullWidth
          label="ZIP"
          onChange={(e) => onChange({ ...value, zip: e.target.value })}
          required
          value={value.zip}
        />
      </Stack>
    </Stack>
  );

  return (
    <Paper elevation={0} sx={{ border: '1px solid #ddd', maxWidth: 680, mx: 'auto', p: 4 }}>
      <Typography fontWeight="bold" gutterBottom variant="h4">
        Checkout
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={4}>
        {/* Shipping Address */}
        <Box>
          <Typography fontWeight="bold" mb={2} variant="h6">
            Shipping Address
          </Typography>
          <AddressFields onChange={setShippingAddress} value={shippingAddress} />
        </Box>

        {/* Billing Address */}
        <Box>
          <Typography fontWeight="bold" mb={1} variant="h6">
            Billing Address
          </Typography>
          <FormControlLabel
            control={
              <Radio
                checked={billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(true)}
              />
            }
            label="Same as shipping"
          />
          <FormControlLabel
            control={
              <Radio
                checked={!billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(false)}
              />
            }
            label="Use different address"
          />
          {!billingSameAsShipping && (
            <Box mt={2}>
              <AddressFields onChange={setBillingAddress} value={billingAddress} />
            </Box>
          )}
        </Box>

        {/* Shipping Method */}
        <Box>
          <Typography fontWeight="bold" mb={2} variant="h6">
            Shipping Method
          </Typography>
          <RadioGroup
            onChange={(e) =>
              setSelectedShipping(MOCK_SHIPPING_OPTIONS.find((s) => s.id === e.target.value)!)
            }
            value={selectedShipping.id}
          >
            {MOCK_SHIPPING_OPTIONS.map((option) => (
              <FormControlLabel
                control={<Radio />}
                key={option.id}
                label={`${option.method} — $${option.cost.toFixed(2)} (${option.estimatedDays} day${option.estimatedDays > 1 ? 's' : ''})`}
                value={option.id}
              />
            ))}
          </RadioGroup>
        </Box>

        {/* Payment Method */}
        <Box>
          <Typography fontWeight="bold" mb={2} variant="h6">
            Payment Method
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Payment</InputLabel>
            <Select
              label="Payment"
              onChange={(e) => setSelectedPaymentId(e.target.value)}
              value={selectedPaymentId}
            >
              {MOCK_PAYMENT_METHODS.map((pm) => (
                <MenuItem key={pm.id} value={pm.id}>
                  {pm.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Coupon */}
        <Box>
          <Typography fontWeight="bold" mb={2} variant="h6">
            Coupon Code
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              error={!!couponError}
              fullWidth
              helperText={
                couponError || (couponDiscount > 0 ? `✓ -$${couponDiscount} applied` : '')
              }
              label="Enter code"
              onChange={(e) => setCouponCode(e.target.value)}
              value={couponCode}
            />
            <Button onClick={handleApplyCoupon} sx={{ minWidth: 100 }} variant="outlined">
              Apply
            </Button>
          </Stack>
        </Box>

        {/* Order Summary */}
        <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 1, p: 2 }}>
          <Typography fontWeight="bold" mb={1} variant="subtitle1">
            Order Summary
          </Typography>
          {cart.map((item) => (
            <Stack direction="row" justifyContent="space-between" key={item.id}>
              <Typography variant="body2">
                {item.name} × {item.quantity}
              </Typography>
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
              <Typography color="success.main" variant="body2">
                Coupon discount
              </Typography>
              <Typography color="success.main" variant="body2">
                -${couponDiscount}
              </Typography>
            </Stack>
          )}
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography color="primary" fontWeight="bold" variant="h6">
              ${total.toFixed(2)}
            </Typography>
          </Stack>
        </Box>

        <Button
          color="success"
          disabled={!canPlace}
          onClick={handlePlaceOrder}
          size="large"
          variant="contained"
        >
          Place Secure Order
        </Button>
      </Stack>
    </Paper>
  );
};

export default CheckoutForm;
