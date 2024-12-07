import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProductListComponent } from './catalog-product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('CatalogProductListComponent', () => {
  let component: CatalogProductListComponent;
  let fixture: ComponentFixture<CatalogProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogProductListComponent,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,],
      providers: [ProductService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogProductListComponent);
    component = fixture.componentInstance;
    component.products = [
      {
        name: 'Producto 1', 
        description: 'Descripcion 1', 
        price: 100,
        id_product: 0,
        sku: '',
        discount: 0,
        category: '',
        stock: 0
      },
      {
        name: 'Producto 2', 
        description: 'Descripcion 2', 
        price: 200,
        id_product: 0,
        sku: '',
        discount: 0,
        category: '',
        stock: 0
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe renderizar la lista de productos', () => {
    const productCards = fixture.debugElement.queryAll(By.css('.featured-product-card'));
    expect(productCards.length).toBe(2); // Validamos que se renderizan dos productos
  });

  it('Debe mostrar el nombre y descripción del producto', () => {
    const productName = fixture.debugElement.query(By.css('.featured-product-card h3')).nativeElement.textContent;
    const productDescription = fixture.debugElement.query(By.css('.featured-product-card p')).nativeElement.textContent;

    expect(productName).toContain('Producto 1');
    expect(productDescription).toContain('Descripcion 1'); 
  });

  it('Debe llamar al método addItem cuando se hace clic en el botón "Agregar al Carrito"', () => {
    spyOn(component, 'addItem');
    const button = fixture.debugElement.query(By.css('.btn.btn-primary')).nativeElement;
    button.click();
    expect(component.addItem).toHaveBeenCalledWith(component.products[0]);
  });

});
