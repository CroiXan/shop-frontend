import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { HttpClientModule } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['updateProduct', 'createProduct']);

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent,
        HttpClientModule
      ],
      providers: [
        { provide: ProductService, useValue: spy }
      ]
    })
    .compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    component.productData = { id_product: 0 } as Product;
    component.endSaveProduct = new EventEmitter<void>();
    component.productData = {
      id_product: 0,
      sku: '',
      name: '',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario del producto correctamente', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.controls['sku']).toBeDefined();
    expect(component.productForm.controls['name']).toBeDefined();
    expect(component.productForm.controls['price']).toBeDefined();
  });

  it('Muestra el titulo "Crear Producto" cuando no hay un ID de producto', () => {
    component.productData.id_product = 0;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Crear Producto');
  });

  it('Muestra el titulo "Editar Producto" cuando hay un ID de producto', () => {
    component.productData.id_product = 1;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Editar Producto');
  });

  it('Marca como invalido el campo SKU si esta vacio', () => {
    const skuControl = component.productForm.controls['sku'];
    skuControl.setValue('');
    expect(skuControl.invalid).toBeTrue();
  });

  it('Valida que el SKU tenga entre 7 y 100 caracteres', () => {
    const skuControl = component.productForm.controls['sku'];
    skuControl.setValue('123');
    expect(skuControl.invalid).toBeTrue();
    skuControl.setValue('1234567');
    expect(skuControl.valid).toBeTrue();
  });

  it('Marca como invalido el campo Nombre si esta vacio', () => {
    const nameControl = component.productForm.controls['name'];
    nameControl.setValue('');
    expect(nameControl.invalid).toBeTrue();
  });

  it('Valida que el Nombre tenga entre 3 y 100 caracteres', () => {
    const nameControl = component.productForm.controls['name'];
    nameControl.setValue('A');
    expect(nameControl.invalid).toBeTrue();
    nameControl.setValue('Producto válido');
    expect(nameControl.valid).toBeTrue();
  });

  it('Marca como invalido el campo Precio si es menor a 0', () => {
    const priceControl = component.productForm.controls['price'];
    priceControl.setValue(-10);
    expect(priceControl.invalid).toBeTrue();
    priceControl.setValue(10);
    expect(priceControl.valid).toBeTrue();
  });

  it('Valida que el descuento esta entre 0 y 100', () => {
    const discountControl = component.productForm.controls['discount'];
    discountControl.setValue(-5);
    expect(discountControl.invalid).toBeTrue();
    discountControl.setValue(50);
    expect(discountControl.valid).toBeTrue();
  });

  it('Marca como invalido el campo Categoria si esta vacio', () => {
    const categoryControl = component.productForm.controls['category'];
    categoryControl.setValue('');
    expect(categoryControl.invalid).toBeTrue();
  });

  it('Valida que la Categoria tenga entre 3 y 100 caracteres', () => {
    const categoryControl = component.productForm.controls['category'];
    categoryControl.setValue('AB');
    expect(categoryControl.invalid).toBeTrue();
    categoryControl.setValue('Categoría válida');
    expect(categoryControl.valid).toBeTrue();
  });

  it('Marca como invalido el campo Descripcion si esta vacio', () => {
    const descriptionControl = component.productForm.controls['description'];
    descriptionControl.setValue('');
    expect(descriptionControl.invalid).toBeTrue();
  });

  it('Valida que la Descripcion no exceda los 1000 caracteres', () => {
    const descriptionControl = component.productForm.controls['description'];
    descriptionControl.setValue('a'.repeat(1001));
    expect(descriptionControl.invalid).toBeTrue();
    descriptionControl.setValue('Descripción válida');
    expect(descriptionControl.valid).toBeTrue();
  });

  it('Marca como invalido el campo Stock si es menor a 0', () => {
    const stockControl = component.productForm.controls['stock'];
    stockControl.setValue(-5);
    expect(stockControl.invalid).toBeTrue();
    stockControl.setValue(10);
    expect(stockControl.valid).toBeTrue();
  });

  it('Deshabilita el boton Guardar si el formulario es invalido', () => {
    component.productForm.controls['sku'].setValue('');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton?.hasAttribute('disabled')).toBeTrue();
  });

  it('Invoca a onSubmit() al enviar el formulario', () => {
    spyOn(component, 'onSubmit');
    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('Invoca a onCancel() al presionar el boton Volver', () => {
    spyOn(component, 'onCancel');
    const backButton = fixture.nativeElement.querySelector('button.btn-secondary');
    backButton.click();
    expect(component.onCancel).toHaveBeenCalled();
  });

  it('Llama a updateProduct() si el ID del producto es mayor a 0', () => {
    component.productData.id_product = 1;
    const localProduct = { ...component.productData, sku: '12345', name: 'Producto', price: 100 };
    productServiceSpy.updateProduct.and.returnValue(of({} as Product));

    component.onSubmit();

    expect(productServiceSpy.updateProduct).toHaveBeenCalledOnceWith(localProduct);
  });

  it('Muestra un mensaje de exito y emitir endSaveProduct cuando updateProduct() es exitoso', () => {
    spyOn(window, 'alert');
    spyOn(component.endSaveProduct, 'emit');
    component.productData.id_product = 1;
    productServiceSpy.updateProduct.and.returnValue(of({} as Product));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Se ha actualizado con exito');
    expect(component.endSaveProduct.emit).toHaveBeenCalled();
  });

  it('Muestra un mensaje de error cuando updateProduct() falla', () => {
    spyOn(window, 'alert');
    component.productData.id_product = 1;
    productServiceSpy.updateProduct.and.returnValue(throwError(() => new Error('Error al actualizar producto')));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error al actualizar producto');
  });

  it('Llama a createProduct() si el ID del producto es 0', () => {
    component.productData.id_product = 0;
    const localProduct = { ...component.productData, sku: '12345', name: 'Producto', price: 100 };
    productServiceSpy.createProduct.and.returnValue(of({} as Product));

    component.onSubmit();

    expect(productServiceSpy.createProduct).toHaveBeenCalledOnceWith(localProduct);
  });

  it('Muestra un mensaje de exito y emitir endSaveProduct cuando createProduct() es exitoso', () => {
    spyOn(window, 'alert');
    spyOn(component.endSaveProduct, 'emit');
    component.productData.id_product = 0;
    productServiceSpy.createProduct.and.returnValue(of({} as Product));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Se ha creado con exito');
    expect(component.endSaveProduct.emit).toHaveBeenCalled();
  });

  it('Muestra un mensaje de error cuando createProduct() falla', () => {
    spyOn(window, 'alert');
    component.productData.id_product = 0;
    productServiceSpy.createProduct.and.returnValue(throwError(() => new Error('El producto se encuentra registrado')));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('El producto se encuentra registrado');
  });
  
});
