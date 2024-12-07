import { Component } from '@angular/core';
import { ShopCartFull } from '../../models/shopcartfull';
import { CommonModule } from '@angular/common';
import { ShopcartService } from '../../services/shopcart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.css'
})
export class ShopCartComponent {

  shopCartFull!: ShopCartFull;

  constructor(private shopcartService: ShopcartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shopCartFull = this.shopcartService.currentShoppingCart;
  }

  back() {
    window.history.back();
  }

  buy() {
    this.router.navigate(['/procesando-orden']);
  }
}
