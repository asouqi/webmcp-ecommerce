import React from 'react';
import { Box, Chip, Divider, Rating, Stack, Typography } from '@mui/material';
import { Review } from '../store';

interface ReviewListProps {
    reviews: Review[]
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return <Typography color="text.secondary">No reviews yet.</Typography>;
    }

    return (
        <Stack divider={<Divider />} spacing={2}>
            {reviews.map(review => (
                <Box key={review.id}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography fontWeight="bold">{review.author}</Typography>
                            {review.verified && <Chip label="Verified Purchase" size="small" color="success" variant="outlined" />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(review.date).toLocaleDateString()}
                        </Typography>
                    </Stack>
                    <Rating value={review.rating} size="small" readOnly sx={{ my: 0.5 }} />
                    <Typography variant="body2">{review.comment}</Typography>
                </Box>
            ))}
        </Stack>
    );
};

export default ReviewList;