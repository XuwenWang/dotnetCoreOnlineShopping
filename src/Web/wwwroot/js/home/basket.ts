import { Product } from './product';

export class Basket {
    id: string;
    count: number;
    total: number;
    products: Array<{product: Product, quantity: number }> = [];
}