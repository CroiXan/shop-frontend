import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-product-list.component.html',
  styleUrl: './catalog-product-list.component.css'
})
export class CatalogProductListComponent {

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
      }
    );
  }

}