import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProductListComponent } from './catalog-product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ShopcartService } from '../../services/shopcart.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product';
import { ShopCartItem } from '../../models/shopcartitem';
import { ShopCartFull } from '../../models/shopcartfull';

describe('CatalogProductListComponent', () => {
  let component: CatalogProductListComponent;
  let fixture: ComponentFixture<CatalogProductListComponent>;
  let mockShopcartService: jasmine.SpyObj<ShopcartService>;

  beforeEach(async () => {
    mockShopcartService = jasmine.createSpyObj('ShopcartService', [
      'createShoppingCart',
      'addItem',
    ]);

    await TestBed.configureTestingModule({
      imports: [CatalogProductListComponent,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,],
      providers: [ProductService,
        { provide: ShopcartService, useValue: mockShopcartService }
      ]
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

  it('Crea el carrito si el id_order es 0 y agregar el producto', () => {
    const mockProduct: Product = {
      name: 'Producto 1', 
      description: '', 
      price: 100,
      id_product: 0,
      sku: '',
      discount: 0,
      category: '',
      stock: 0
    };
    mockShopcartService.currentShoppingCart = {
      cart_data: {
        id_order: 0,
        create_date: '',
        id_user: 0,
        total: 0,
        status: ''
      },
      cart_items: []
    };
    mockShopcartService.createShoppingCart.and.returnValue(of({} as ShopCartFull));
    mockShopcartService.addItem.and.returnValue(of({} as ShopCartItem));

    spyOn(window, 'alert');

    component.addItem(mockProduct);

    expect(mockShopcartService.createShoppingCart).toHaveBeenCalled();
    expect(mockShopcartService.addItem).toHaveBeenCalledWith(mockProduct);
    expect(window.alert).toHaveBeenCalledWith('Se ha agregado Producto 1 al carro');
  });

  it('Agrega el producto directamente si el id_order no es 0', () => {
    const mockProduct: Product = {
      name: 'Producto 1', 
      description: '', 
      price: 100,
      id_product: 0,
      sku: '',
      discount: 0,
      category: '',
      stock: 0
    };
    mockShopcartService.currentShoppingCart = {
      cart_data: {
        id_order: 123,
        create_date: '',
        id_user: 0,
        total: 0,
        status: ''
      },
      cart_items: []
    };
    mockShopcartService.addItem.and.returnValue(of({} as ShopCartItem));

    spyOn(window, 'alert');

    component.addItem(mockProduct);

    expect(mockShopcartService.createShoppingCart).not.toHaveBeenCalled();
    expect(mockShopcartService.addItem).toHaveBeenCalledWith(mockProduct);
    expect(window.alert).toHaveBeenCalledWith('Se ha agregado Producto 1 al carro');
  });

  it('Maneja el error al crear el carrito', () => {
    const mockProduct: Product = {
      name: 'Producto 1', 
      description: '', 
      price: 100,
      id_product: 0,
      sku: '',
      discount: 0,
      category: '',
      stock: 0
    };
    mockShopcartService.currentShoppingCart = {
      cart_data: {
        id_order: 0,
        create_date: '',
        id_user: 0,
        total: 0,
        status: ''
      },
      cart_items: []
    };
    mockShopcartService.createShoppingCart.and.returnValue(throwError(() => new Error('Error al crear el carrito')));

    spyOn(window, 'alert');

    component.addItem(mockProduct);

    expect(mockShopcartService.createShoppingCart).toHaveBeenCalled();
    expect(mockShopcartService.addItem).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al crear al carro');
  });

  it('Maneja el error al agregar el producto', () => {
    const mockProduct: Product = {
      name: 'Producto 1', 
      description: '', 
      price: 100,
      id_product: 0,
      sku: '',
      discount: 0,
      category: '',
      stock: 0
    };
    mockShopcartService.currentShoppingCart = {
      cart_data: {
        id_order: 123,
        create_date: '',
        id_user: 0,
        total: 0,
        status: ''
      },
      cart_items: []
    };
    mockShopcartService.addItem.and.returnValue(throwError(() => new Error('Error al agregar producto')));

    spyOn(window, 'alert');

    component.addItem(mockProduct);

    expect(mockShopcartService.createShoppingCart).not.toHaveBeenCalled();
    expect(mockShopcartService.addItem).toHaveBeenCalledWith(mockProduct);
    expect(window.alert).toHaveBeenCalledWith('Error al agregar item al carro');
  });

});
