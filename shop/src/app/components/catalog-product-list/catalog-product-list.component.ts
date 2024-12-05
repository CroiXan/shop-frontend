import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ShopcartService } from '../../services/shopcart.service';

@Component({
  selector: 'app-catalog-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-product-list.component.html',
  styleUrl: './catalog-product-list.component.css'
})
export class CatalogProductListComponent {

  products: Product[] = [];

  constructor(private productService: ProductService,
    private shopcartService: ShopcartService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
      }
    );
  }

  addItem(product: Product) {
    console.log(this.shopcartService.currentShoppingCart)
    if (this.shopcartService.currentShoppingCart.cart_data.id_order == 0) {
      this.shopcartService.createShoppingCart().subscribe({
        next: response => {
          this.shopcartService.addItem(product).subscribe({
            next: response2 => {
              alert('Se ha agregado ' + product.name + ' al carro');
            },
            error: error => {
              alert("Error al agregar item al carro");
            },
          })
        },
        error: error => {
          alert("Error al crear al carro");
        },
      });
    } else {
      this.shopcartService.addItem(product).subscribe({
        next: response => {
          alert('Se ha agregado ' + product.name + ' al carro');
        },
        error: error => {
          alert("Error al agregar item al carro");
        },
      })
    }
  }

}