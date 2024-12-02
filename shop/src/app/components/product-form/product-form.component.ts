import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActionResponse } from '../../models/actionresponse';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  @Input() productData!: Product;
  @Output() backAction = new EventEmitter<void>();
  @Output() endSaveProduct = new EventEmitter<void>();

  productForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      sku: [this.productData.sku, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      name: [this.productData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: [this.productData.price, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      discount: [this.productData.discount, [Validators.min(0), Validators.max(100)]],
      category: [this.productData.category, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.productData.description, [Validators.required, Validators.maxLength(1000)]],
      stock: [this.productData.stock, [Validators.required, Validators.min(0), Validators.max(999999)]],
    });
  }

  onSubmit() {
    let localProduct: Product = {
      id_product: this.productData.id_product,
      sku: this.productForm.get('sku')?.value,
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      discount: this.productForm.get('discount')?.value,
      category: this.productForm.get('category')?.value,
      description: this.productForm.get('description')?.value,
      stock: this.productForm.get('stock')?.value
    }

    let result: ActionResponse = {} as ActionResponse;

    if (this.productData.id_product > 0) {
      this.productService.updateProduct(localProduct).subscribe({
        next: response2 => {
          result = { IsSuccess: true, Message: "Se ha actualizado con exito" };
          alert(result.Message);
          if (result.IsSuccess) {
            this.endSaveProduct.emit();
          }
        },
        error: error => {
          result = { IsSuccess: false, Message: "Error al actualizar producto" };
          alert(result.Message);
        },
      });
    } else {
      this.productService.createProduct(localProduct).subscribe({
        next: response2 => {
          result = { IsSuccess: true, Message: "Se ha creado con exito" };
          alert(result.Message);
          if (result.IsSuccess) {
            this.endSaveProduct.emit();
          }
        },
        error: error => {
          result = { IsSuccess: false, Message: "El producto se encuentra registrado" };
          alert(result.Message);
        },
      });;
    }

  }

  onCancel() {
    this.backAction.emit();
  }

  get productId() { return this.productData.id_product }
  get sku() { return this.productForm.get('sku') }
  get name() { return this.productForm.get('name') }
  get price() { return this.productForm.get('price') }
  get discount() { return this.productForm.get('discount') }
  get category() { return this.productForm.get('category') }
  get description() { return this.productForm.get('description') }
  get stock() { return this.productForm.get('stock') }

}
