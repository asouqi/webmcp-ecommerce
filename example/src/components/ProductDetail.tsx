import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { Product, Review } from '../store';
import ProductCard from './ProductCard';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ProductDetailProps {
  allProducts: Product[];
  isWishlisted: boolean;
  onAdd: (p: Product, qty: number) => void;
  onSubmitReview: (r: Omit<Review, 'date' | 'id'>) => void;
  onToggleWishlist: (id: string) => void;
  onViewDetail: (p: Product) => void;
  product: Product;
  purchasedProductIds: Set<string>;
  reviews: Review[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  allProducts,
  isWishlisted,
  onAdd,
  onSubmitReview,
  onToggleWishlist,
  onViewDetail,
  product,
  purchasedProductIds,
  reviews,
}) => {
  const [qty, setQty] = useState(1);

  const relatedProducts = allProducts.filter((p) => product.relatedProductIds.includes(p.id));
  const canReview = purchasedProductIds.has(product.id);
  const hasReviewed = reviews.some((r) => r.author === 'You');

  return (
    <Stack spacing={6}>
      {/* Product Info */}
      <Paper elevation={0} sx={{ border: '1px solid #ddd', p: 4 }}>
        <Grid container spacing={6}>
          <Grid item md={5} xs={12}>
            <Box
              sx={{
                bgcolor: '#f0f0f0',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <img
                alt={product.name}
                src={product.image}
                style={{ maxHeight: 300, objectFit: 'contain' }}
              />
            </Box>
          </Grid>
          <Grid item md={7} xs={12}>
            <Stack spacing={2}>
              <Box>
                <Typography color="text.secondary" variant="overline">
                  {product.category}
                </Typography>
                <Typography fontWeight="bold" variant="h3">
                  {product.name}
                </Typography>
              </Box>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Rating precision={0.1} readOnly value={product.rating} />
                <Typography color="text.secondary" variant="body2">
                  ({product.rating}) · {reviews.length} reviews
                </Typography>
              </Stack>
              <Typography color="primary" fontWeight="bold" variant="h4">
                ${product.price}
              </Typography>
              <Typography color="text.secondary" variant="body1">
                {product.description}
              </Typography>
              <Divider />
              <Stack direction="row" flexWrap="wrap" spacing={1}>
                {product.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Stack>
              <Chip
                color={product.stock > 0 ? 'success' : 'error'}
                label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                sx={{ width: 'fit-content' }}
                variant="outlined"
              />
              {/* Qty selector */}
              <Stack alignItems="center" direction="row" spacing={2}>
                <IconButton disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{qty}</Typography>
                <IconButton
                  disabled={qty >= product.stock}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  disabled={product.stock === 0}
                  onClick={() => onAdd(product, qty)}
                  size="large"
                  sx={{ flex: 1 }}
                  variant="contained"
                >
                  Add to Cart
                </Button>
                <IconButton
                  color={isWishlisted ? 'error' : 'default'}
                  onClick={() => onToggleWishlist(product.id)}
                >
                  {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box>
          <Typography fontWeight="bold" mb={3} variant="h5">
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((p) => (
              <Grid item key={p.id} md={3} sm={6} xs={12}>
                <ProductCard
                  isWishlisted={false}
                  onAdd={onAdd}
                  onToggleWishlist={onToggleWishlist}
                  onViewDetail={onViewDetail}
                  product={p}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Reviews */}
      <Box>
        <Typography fontWeight="bold" mb={3} variant="h5">
          Customer Reviews
        </Typography>
        <ReviewList reviews={reviews} />
        {canReview && !hasReviewed && (
          <Box mt={3}>
            <Divider sx={{ mb: 3 }} />
            <Typography mb={2} variant="h6">
              Leave a Review
            </Typography>
            <ReviewForm onSubmit={onSubmitReview} productId={product.id} />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default ProductDetail;
