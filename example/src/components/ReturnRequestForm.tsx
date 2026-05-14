import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

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
  onCancel: () => void;
  onSubmit: (r: ReturnRequest) => void;
  order: Order;
}

const ReturnRequestForm: React.FC<ReturnRequestFormProps> = ({ onCancel, onSubmit, order }) => {
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { reason: string; selected: boolean; }>
  >(() =>
    Object.fromEntries(
      order.items.map((item) => [item.id, { reason: RETURN_REASONS[0], selected: false }]),
    ),
  );

  const toggleItem = (id: string) =>
    setSelectedItems((prev) => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }));

  const setReason = (id: string, reason: string) =>
    setSelectedItems((prev) => ({ ...prev, [id]: { ...prev[id], reason } }));

  const anySelected = Object.values(selectedItems).some((v) => v.selected);

  const handleSubmit = () => {
    const returnItems = order.items
      .filter((item) => selectedItems[item.id].selected)
      .map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        reason: selectedItems[item.id].reason,
      }));

    onSubmit({
      id: `ret-${Date.now()}`,
      items: returnItems,
      orderId: order.id,
      requestedAt: new Date().toISOString(),
      status: 'requested',
    });
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #ddd', maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography fontWeight="bold" gutterBottom variant="h4">
        Request a Return
      </Typography>
      <Typography color="text.secondary" mb={2} variant="body2">
        Order #{order.id}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {order.items.map((item) => (
          <Box key={item.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedItems[item.id].selected}
                  onChange={() => toggleItem(item.id)}
                />
              }
              label={
                <Typography fontWeight="medium">
                  {item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              }
            />
            {selectedItems[item.id].selected && (
              <Box ml={4} mt={1}>
                <Select
                  fullWidth
                  onChange={(e) => setReason(item.id, e.target.value)}
                  size="small"
                  value={selectedItems[item.id].reason}
                >
                  {RETURN_REASONS.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}
          </Box>
        ))}

        <Divider />
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button color="error" disabled={!anySelected} onClick={handleSubmit} variant="contained">
            Submit Return Request
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ReturnRequestForm;
