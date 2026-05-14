import { z } from "zod"

import image1 from './assets/img_1.png';
import image2 from './assets/img_2.png';
import image3 from './assets/img_3.png';
import image4 from './assets/img_4.png';

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    category: z.string(),
    image: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface CartItem extends Product {
    quantity: number;
}

export const MOCK_PRODUCTS: Product[] = z.array(ProductSchema).parse([
    {
        id: 1,
        name: "Premium Headphones",
        price: 299,
        description: "Studio quality sound with ANC.",
        category: "Electronics",
        image: image1
    },
    {
        id: 2,
        name: "Mechanical Keyboard",
        price: 150,
        description: "RGB Backlit with tactile switches.",
        category: "Electronics",
        image: image2
    },
    {
        id: 3,
        name: "Minimalist Watch",
        price: 85,
        description: "Swiss movement with leather strap.",
        category: "Accessories",
        image: image4
    },
    {
        id: 4,
        name: "Leather Backpack",
        price: 120,
        description: "Waterproof with laptop sleeve.",
        category: "Accessories",
        image: image3
    },
]);