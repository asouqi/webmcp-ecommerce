import { Box, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import { Review } from '../store';

interface ReviewFormProps {
  onSubmit: (review: Omit<Review, 'date' | 'id'>) => void;
  productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, productId }) => {
  const [rating, setRating] = useState<null | number>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!rating || !comment.trim()) return;
    onSubmit({ author: 'You', comment, productId, rating, verified: true });
    setRating(null);
    setComment('');
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography mb={0.5} variant="body2">
          Your Rating
        </Typography>
        <Rating onChange={(_, v) => setRating(v)} value={rating} />
      </Box>
      <TextField
        fullWidth
        label="Your Review"
        multiline
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        value={comment}
      />
      <Button
        disabled={!rating || !comment.trim()}
        onClick={handleSubmit}
        sx={{ alignSelf: 'flex-start' }}
        variant="contained"
      >
        Submit Review
      </Button>
    </Stack>
  );
};

export default ReviewForm;
