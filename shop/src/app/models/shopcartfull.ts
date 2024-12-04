import { ShopCart } from "./shopcart";
import { ShopCartItem } from "./shopcartitem";

export interface ShopCartFull{
    cart_data: ShopCart;
    cart_items: ShopCartItem[]
}