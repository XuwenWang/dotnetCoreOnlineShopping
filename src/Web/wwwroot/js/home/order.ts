import { Product } from './product';

export class Order {
    guid: string;
    userId: number;
    products: Array<{product: Product, quantity: number }>;
}