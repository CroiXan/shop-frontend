import { Product } from "./product";

export interface ShopCartItem{
    id_orderitem: number;
    id_order: number;
    id_product: number;
    sku: string;
    amount: number;
    product: Product
}