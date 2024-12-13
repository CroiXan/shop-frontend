import { Component } from '@angular/core';
import { ShopCartFull } from '../../models/shopcartfull';
import { CommonModule } from '@angular/common';
import { ShopcartService } from '../../services/shopcart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-finish-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finish-order.component.html',
  styleUrl: './finish-order.component.css'
})
export class FinishOrderComponent {
  shopCartFull!: ShopCartFull;

  constructor(private shopcartService: ShopcartService) { }

  ngOnInit(): void {
    this.shopCartFull = this.shopcartService.currentShoppingCart;
    this.shopcartService.cleanCurrentShopCart();
  }
  
}
