import React, { useState } from 'react';
import {
  Box, Button, Chip, Divider, Grid, IconButton, Rating,
  Stack, Typography, Paper,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Product, Review } from '../store';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product
  allProducts: Product[]
  reviews: Review[]
  onAdd: (p: Product, qty: number) => void
  onViewDetail: (p: Product) => void
  isWishlisted: boolean
  onToggleWishlist: (id: string) => void
  onSubmitReview: (r: Omit<Review, 'id' | 'date'>) => void
  purchasedProductIds: Set<string>
}

const ProductDetail: React.FC<ProductDetailProps> = ({
                                                       product, allProducts, reviews, onAdd, onViewDetail,
                                                       isWishlisted, onToggleWishlist, onSubmitReview, purchasedProductIds,
                                                     }) => {
  const [qty, setQty] = useState(1);

  const relatedProducts = allProducts.filter(p => product.relatedProductIds.includes(p.id));
  const canReview = purchasedProductIds.has(product.id);
  const hasReviewed = reviews.some(r => r.author === 'You');

  return (
      <Stack spacing={6}>
        {/* Product Info */}
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #ddd' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 4, display: 'flex', justifyContent: 'center' }}>
                <img src={product.image} alt={product.name} style={{ maxHeight: 300, objectFit: 'contain' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" color="text.secondary">{product.category}</Typography>
                  <Typography variant="h3" fontWeight="bold">{product.name}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={product.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">({product.rating}) · {reviews.length} reviews</Typography>
                </Stack>
                <Typography variant="h4" color="primary" fontWeight="bold">${product.price}</Typography>
                <Typography variant="body1" color="text.secondary">{product.description}</Typography>
                <Divider />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {product.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
                </Stack>
                <Chip
                    label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    color={product.stock > 0 ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ width: 'fit-content' }}
                />
                {/* Qty selector */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}><RemoveIcon /></IconButton>
                  <Typography variant="h6">{qty}</Typography>
                  <IconButton onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}><AddIcon /></IconButton>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" size="large" disabled={product.stock === 0} onClick={() => onAdd(product, qty)} sx={{ flex: 1 }}>
                    Add to Cart
                  </Button>
                  <IconButton onClick={() => onToggleWishlist(product.id)} color={isWishlisted ? 'error' : 'default'}>
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
              <Typography variant="h5" fontWeight="bold" mb={3}>Related Products</Typography>
              <Grid container spacing={3}>
                {relatedProducts.map(p => (
                    <Grid item xs={12} sm={6} md={3} key={p.id}>
                      <ProductCard
                          product={p}
                          onAdd={onAdd}
                          onViewDetail={onViewDetail}
                          isWishlisted={false}
                          onToggleWishlist={onToggleWishlist}
                      />
                    </Grid>
                ))}
              </Grid>
            </Box>
        )}

        {/* Reviews */}
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={3}>Customer Reviews</Typography>
          <ReviewList reviews={reviews} />
          {canReview && !hasReviewed && (
              <Box mt={3}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" mb={2}>Leave a Review</Typography>
                <ReviewForm productId={product.id} onSubmit={onSubmitReview} />
              </Box>
          )}
        </Box>
      </Stack>
  );
};

export default ProductDetail;