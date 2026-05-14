import React, { useState } from 'react';
import {
    Box, Button, Checkbox, Divider, FormControlLabel,
    MenuItem, Paper, Select, Stack, Typography,
} from '@mui/material';
import { Order, ReturnRequest } from '../store';

const RETURN_REASONS = [
    'Changed my mind',
    'Item not as described',
    'Defective or damaged',
    'Wrong item received',
    'Better price available',
    'Other',
];

interface ReturnRequestFormProps {
    order: Order
    onSubmit: (r: ReturnRequest) => void
    onCancel: () => void
}

const ReturnRequestForm: React.FC<ReturnRequestFormProps> = ({ order, onSubmit, onCancel }) => {
    const [selectedItems, setSelectedItems] = useState<Record<string, { selected: boolean; reason: string }>>(() =>
        Object.fromEntries(order.items.map(item => [item.id, { selected: false, reason: RETURN_REASONS[0] }]))
    );

    const toggleItem = (id: string) =>
        setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }));

    const setReason = (id: string, reason: string) =>
        setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], reason } }));

    const anySelected = Object.values(selectedItems).some(v => v.selected);

    const handleSubmit = () => {
        const returnItems = order.items
            .filter(item => selectedItems[item.id].selected)
            .map(item => ({
                productId: item.id,
                quantity: item.quantity,
                reason: selectedItems[item.id].reason,
            }));

        onSubmit({
            id: `ret-${Date.now()}`,
            orderId: order.id,
            items: returnItems,
            status: 'requested',
            requestedAt: new Date().toISOString(),
        });
    };

    return (
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #ddd', maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Request a Return</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Order #{order.id}</Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
                {order.items.map(item => (
                    <Box key={item.id}>
                        <FormControlLabel
                            control={<Checkbox checked={selectedItems[item.id].selected} onChange={() => toggleItem(item.id)} />}
                            label={<Typography fontWeight="medium">{item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</Typography>}
                        />
                        {selectedItems[item.id].selected && (
                            <Box ml={4} mt={1}>
                                <Select
                                    size="small"
                                    fullWidth
                                    value={selectedItems[item.id].reason}
                                    onChange={e => setReason(item.id, e.target.value)}
                                >
                                    {RETURN_REASONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                                </Select>
                            </Box>
                        )}
                    </Box>
                ))}

                <Divider />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" color="error" disabled={!anySelected} onClick={handleSubmit}>
                        Submit Return Request
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default ReturnRequestForm;