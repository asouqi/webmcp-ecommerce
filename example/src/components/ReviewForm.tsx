import React, { useState } from 'react';
import { Box, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import { Review } from '../store';

interface ReviewFormProps {
    productId: string
    onSubmit: (review: Omit<Review, 'id' | 'date'>) => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!rating || !comment.trim()) return;
        onSubmit({ productId, author: 'You', rating, comment, verified: true });
        setRating(null);
        setComment('');
    };

    return (
        <Stack spacing={2}>
            <Box>
                <Typography variant="body2" mb={0.5}>Your Rating</Typography>
                <Rating value={rating} onChange={(_, v) => setRating(v)} />
            </Box>
            <TextField
                label="Your Review"
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={e => setComment(e.target.value)}
            />
            <Button
                variant="contained"
                disabled={!rating || !comment.trim()}
                onClick={handleSubmit}
                sx={{ alignSelf: 'flex-start' }}
            >
                Submit Review
            </Button>
        </Stack>
    );
};

export default ReviewForm;