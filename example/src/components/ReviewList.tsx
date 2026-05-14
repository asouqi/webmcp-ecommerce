import { Box, Chip, Divider, Rating, Stack, Typography } from '@mui/material';
import React from 'react';

import { Review } from '../store';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <Typography color="text.secondary">No reviews yet.</Typography>;
  }

  return (
    <Stack divider={<Divider />} spacing={2}>
      {reviews.map((review) => (
        <Box key={review.id}>
          <Stack alignItems="center" direction="row" justifyContent="space-between">
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography fontWeight="bold">{review.author}</Typography>
              {review.verified && (
                <Chip color="success" label="Verified Purchase" size="small" variant="outlined" />
              )}
            </Stack>
            <Typography color="text.secondary" variant="caption">
              {new Date(review.date).toLocaleDateString()}
            </Typography>
          </Stack>
          <Rating readOnly size="small" sx={{ my: 0.5 }} value={review.rating} />
          <Typography variant="body2">{review.comment}</Typography>
        </Box>
      ))}
    </Stack>
  );
};

export default ReviewList;
