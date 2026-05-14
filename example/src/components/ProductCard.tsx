import React from "react"
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material"
import {Product} from "../store"

interface ProductCardProps {
    product: Product
    onAdd: (p: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia component="img" height="200" image={product.image} alt={product.name}
           sx={{
            objectFit: 'contain',
            bgcolor: '#f0f0f0',
            p: 2
        }}/>
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="overline" color="text.secondary">{product.category}</Typography>
            <Typography variant="h5" component="div">{product.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{product.description}</Typography>
            <Typography variant="h6" color="primary">${product.price}</Typography>
        </CardContent>
        <Box sx={{ p: 2 }}>
            <Button variant="contained" fullWidth onClick={() => onAdd(product)}>Add to Cart</Button>
        </Box>
    </Card>
)

export default ProductCard