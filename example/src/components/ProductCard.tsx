import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Typography,
} from '@mui/material';
import React from 'react';

import { Product } from '../store';

interface ProductCardProps {
  isWishlisted: boolean;
  onAdd: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  onViewDetail: (p: Product) => void;
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({
  isWishlisted,
  onAdd,
  onToggleWishlist,
  onViewDetail,
  product,
}) => (
  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
    <IconButton
      onClick={() => onToggleWishlist(product.id)}
      sx={{
        '&:hover': { bgcolor: 'white' },
        bgcolor: 'white',
        position: 'absolute',
        right: 8,
        top: 8,
      }}
    >
      {isWishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>

    <CardMedia
      alt={product.name}
      component="img"
      height="200"
      image={product.image}
      onClick={() => onViewDetail(product)}
      sx={{ bgcolor: '#f0f0f0', cursor: 'pointer', objectFit: 'contain', p: 2 }}
    />

    <CardContent sx={{ flexGrow: 1 }}>
      <Typography color="text.secondary" variant="overline">
        {product.category}
      </Typography>
      <Typography gutterBottom variant="h6">
        {product.name}
      </Typography>
      <Rating precision={0.1} readOnly size="small" value={product.rating} />
      <Typography color="text.secondary" sx={{ mb: 2, mt: 1 }} variant="body2">
        {product.description}
      </Typography>
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <Typography color="primary" variant="h6">
          ${product.price}
        </Typography>
        <Chip
          color={product.stock > 0 ? 'success' : 'error'}
          label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          size="small"
          variant="outlined"
        />
      </Box>
    </CardContent>

    <Box sx={{ p: 2, pt: 0 }}>
      <Button
        disabled={product.stock === 0}
        fullWidth
        onClick={() => onAdd(product)}
        variant="contained"
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </Box>
  </Card>
);

export default ProductCard;
