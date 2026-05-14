import { Box, Button, Chip, Collapse, Divider, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import { Order, ReturnRequest } from '../store';

interface OrderHistoryProps {
  onStartReturn: (order: Order) => void;
  orders: Order[];
  returns: ReturnRequest[];
}

const statusColor: Record<string, 'default' | 'error' | 'info' | 'success' | 'warning'> = {
  cancelled: 'error',
  confirmed: 'info',
  delivered: 'success',
  pending: 'warning',
  shipped: 'info',
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ onStartReturn, orders, returns }) => {
  const [expandedTracking, setExpandedTracking] = useState<null | string>(null);

  if (orders.length === 0) {
    return (
      <Box py={10} textAlign="center">
        <Typography color="text.secondary" variant="h6">
          No orders yet.
        </Typography>
      </Box>
    );
  }

  const getReturnForOrder = (orderId: string) => returns.find((r) => r.orderId === orderId);

  return (
    <Stack spacing={3}>
      <Typography fontWeight="bold" variant="h4">
        My Orders
      </Typography>
      {orders.map((order) => {
        const existingReturn = getReturnForOrder(order.id);
        return (
          <Paper elevation={0} key={order.id} sx={{ border: '1px solid #ddd', p: 3 }}>
            {/* Header */}
            <Stack alignItems="center" direction="row" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary" variant="subtitle2">
                Order #{order.id} · {new Date(order.placedAt).toLocaleString()}
              </Typography>
              <Chip color={statusColor[order.status]} label={order.status} size="small" />
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {/* Items */}
            {order.items.map((item) => (
              <Stack direction="row" justifyContent="space-between" key={item.id} mb={0.5}>
                <Typography variant="body2">
                  {item.name} × {item.quantity}
                </Typography>
                <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 1 }} />

            {/* Totals */}
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary" variant="body2">
                Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
              </Typography>
              <Typography fontWeight="bold" variant="subtitle1">
                Total: ${order.total.toFixed(2)}
              </Typography>
            </Stack>

            {/* Tracking */}
            {order.trackingInfo && (
              <Box mt={1}>
                <Button
                  onClick={() =>
                    setExpandedTracking(expandedTracking === order.id ? null : order.id)
                  }
                  size="small"
                >
                  {expandedTracking === order.id ? 'Hide Tracking' : 'Track Order'}
                </Button>
                <Collapse in={expandedTracking === order.id}>
                  <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 1, mt: 1, p: 2 }}>
                    <Typography variant="body2">
                      <strong>Carrier:</strong> {order.trackingInfo.carrier}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tracking #:</strong> {order.trackingInfo.trackingNumber}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {order.trackingInfo.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Est. Delivery:</strong>{' '}
                      {new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {order.trackingInfo.events.map((event, i) => (
                      <Typography color="text.secondary" display="block" key={i} variant="caption">
                        {new Date(event.date).toLocaleString()} — {event.description}{' '}
                        {event.location ? `(${event.location})` : ''}
                      </Typography>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            )}

            {/* Return */}
            {order.status === 'delivered' && (
              <Box mt={2}>
                {existingReturn ? (
                  <Chip
                    color={existingReturn.status === 'refunded' ? 'success' : 'warning'}
                    label={`Return ${existingReturn.status}`}
                    size="small"
                  />
                ) : (
                  <Button
                    color="error"
                    onClick={() => onStartReturn(order)}
                    size="small"
                    variant="outlined"
                  >
                    Request Return
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
};

export default OrderHistory;
