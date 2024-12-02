import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActionResponse } from '../../models/actionresponse';

@Component({
  selector: 'app-product-manager-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-manager-list.component.html',
  styleUrl: './product-manager-list.component.css'
})
export class ProductManagerListComponent {

  @Input() products!: Product[];
  @Output() selectedProduct = new EventEmitter<Product>();
  @Output() refreshProducts = new EventEmitter<Product>();
  loading = false;
  errorMessage = '';

  constructor( private productService: ProductService ) { }

  editProduct(product: Product): void {
    this.selectedProduct.emit(product);
  }

  deleteProduct(productId: number){
    this.productService.deleteProduct(productId).subscribe({
      next: response2 => {
        alert("Se ha eleminado con exito");
        this.refreshProducts.emit();
      },
      error: error => {
        alert("Error al eliminar producto");
      },
    });
  }
  
}
