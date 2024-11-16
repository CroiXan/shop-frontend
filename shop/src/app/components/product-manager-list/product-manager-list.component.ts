import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

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
  loading = false;
  errorMessage = '';

  editProduct(product: Product): void {
    this.selectedProduct.emit(product);
  }
}
