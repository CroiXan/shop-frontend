import { Component, Input } from '@angular/core';
import { ShopCartFull } from '../../models/shopcartfull';
import { CommonModule } from '@angular/common';
import { ShopcartService } from '../../services/shopcart.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-shop-cart-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-cart-list.component.html',
  styleUrl: './shop-cart-list.component.css'
})
export class ShopCartListComponent {
  shopCartFullList: ShopCartFull[] = [];
  private productList: Product[] = []

  constructor(private shopcartService: ShopcartService,
    private productService: ProductService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(allProducts => {
      this.productList = allProducts;
    });
    this.shopcartService.getAllShopcartByUser(this.userService.getCurrentUser().id_user).subscribe(result =>{
      this.shopCartFullList = this.shopcartService.currentUserShoppingCartList;
    })
  }

  getCartProductNames(cart: ShopCartFull): string[] {
    return cart.cart_items.map(item => item.product.name);
  }
  
  getproductData(productId: number): Product{
    return this.productList.find(product => product.id_product === productId)||{} as Product;
  }

}
