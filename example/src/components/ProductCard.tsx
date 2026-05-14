import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Chip, IconButton, Rating, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../store';

interface ProductCardProps {
    product: Product
    onAdd: (p: Product) => void
    onViewDetail: (p: Product) => void
    isWishlisted: boolean
    onToggleWishlist: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onViewDetail, isWishlisted, onToggleWishlist }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <IconButton
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
            onClick={() => onToggleWishlist(product.id)}
        >
            {isWishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>

        <CardMedia
            component="img"
            height="200"
            image={product.image}
            alt={product.name}
            sx={{ objectFit: 'contain', bgcolor: '#f0f0f0', p: 2, cursor: 'pointer' }}
            onClick={() => onViewDetail(product)}
        />

        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="overline" color="text.secondary">{product.category}</Typography>
            <Typography variant="h6" gutterBottom>{product.name}</Typography>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>{product.description}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary">${product.price}</Typography>
                <Chip
                    label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    color={product.stock > 0 ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                />
            </Box>
        </CardContent>

        <Box sx={{ p: 2, pt: 0 }}>
            <Button variant="contained" fullWidth disabled={product.stock === 0} onClick={() => onAdd(product)}>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
        </Box>
    </Card>
);

export default ProductCard;