import { Component, Input } from '@angular/core';
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
  loading = false;
  errorMessage = '';


  ngOnInit(): void {
  }

  editProduct(id: number): void {
    
  }
}
