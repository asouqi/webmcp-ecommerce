import React, { useState } from 'react';
import {
    Box, Button, Chip, Collapse, Divider, Paper,
    Stack, Typography,
} from '@mui/material';
import { Order, ReturnRequest } from '../store';

interface OrderHistoryProps {
    orders: Order[]
    returns: ReturnRequest[]
    onStartReturn: (order: Order) => void
}

const statusColor: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
    pending: 'warning',
    confirmed: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'error',
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, returns, onStartReturn }) => {
    const [expandedTracking, setExpandedTracking] = useState<string | null>(null);

    if (orders.length === 0) {
        return <Box textAlign="center" py={10}><Typography variant="h6" color="text.secondary">No orders yet.</Typography></Box>;
    }

    const getReturnForOrder = (orderId: string) => returns.find(r => r.orderId === orderId);

    return (
        <Stack spacing={3}>
            <Typography variant="h4" fontWeight="bold">My Orders</Typography>
            {orders.map(order => {
                const existingReturn = getReturnForOrder(order.id);
                return (
                    <Paper key={order.id} elevation={0} sx={{ p: 3, border: '1px solid #ddd' }}>
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Order #{order.id} · {new Date(order.placedAt).toLocaleString()}
                            </Typography>
                            <Chip label={order.status} color={statusColor[order.status]} size="small" />
                        </Stack>
                        <Divider sx={{ mb: 2 }} />

                        {/* Items */}
                        {order.items.map(item => (
                            <Stack key={item.id} direction="row" justifyContent="space-between" mb={0.5}>
                                <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                                <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                            </Stack>
                        ))}
                        <Divider sx={{ my: 1 }} />

                        {/* Totals */}
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">Total: ${order.total.toFixed(2)}</Typography>
                        </Stack>

                        {/* Tracking */}
                        {order.trackingInfo && (
                            <Box mt={1}>
                                <Button size="small" onClick={() => setExpandedTracking(expandedTracking === order.id ? null : order.id)}>
                                    {expandedTracking === order.id ? 'Hide Tracking' : 'Track Order'}
                                </Button>
                                <Collapse in={expandedTracking === order.id}>
                                    <Box sx={{ mt: 1, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                        <Typography variant="body2"><strong>Carrier:</strong> {order.trackingInfo.carrier}</Typography>
                                        <Typography variant="body2"><strong>Tracking #:</strong> {order.trackingInfo.trackingNumber}</Typography>
                                        <Typography variant="body2"><strong>Status:</strong> {order.trackingInfo.status}</Typography>
                                        <Typography variant="body2"><strong>Est. Delivery:</strong> {new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString()}</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        {order.trackingInfo.events.map((event, i) => (
                                            <Typography key={i} variant="caption" display="block" color="text.secondary">
                                                {new Date(event.date).toLocaleString()} — {event.description} {event.location ? `(${event.location})` : ''}
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
                                        label={`Return ${existingReturn.status}`}
                                        color={existingReturn.status === 'refunded' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                ) : (
                                    <Button variant="outlined" color="error" size="small" onClick={() => onStartReturn(order)}>
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