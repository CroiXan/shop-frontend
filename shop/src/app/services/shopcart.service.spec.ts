import { TestBed } from '@angular/core/testing';

import { ShopcartService } from './shopcart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import { Product } from '../models/product';

describe('ShopcartService', () => {
  let service: ShopcartService;
  let httpMock: HttpTestingController;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getAllProducts']);
    mockUserService = jasmine.createSpyObj('UserService', ['getSession']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ShopcartService,
        { provide: ProductService, useValue: mockProductService },
        { provide: UserService, useValue: mockUserService },
      ]
    });

    service = TestBed.inject(ShopcartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Crear shopping cart', () => {
    const mockCart = { id_order: 1, create_date: '2024-12-05', id_user: 1, total: 0, status: 'Creado' };
    mockUserService.getSession.and.returnValue({
      id_user: 1,
      name: '',
      email: '',
      role: '',
      phone: ''
    });

    service.createShoppingCart().subscribe(cart => {
      expect(cart.cart_data.id_order).toBe(mockCart.id_order);
      expect(cart.cart_data.status).toBe(mockCart.status);
    });

    const req = httpMock.expectOne('http://localhost:8081/shop/order');
    expect(req.request.method).toBe('POST');
    req.flush(mockCart);
  });

  it('Agrega un item a shopping cart', () => {
    const mockProduct : Product = {
      id_product: 1, name: 'Sample Product',
      sku: '',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    const mockCartItem = { id_product: 1, amount: 1, product: mockProduct };

    service.addItem(mockProduct).subscribe(item => {
      expect(item.product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:8081/shop/item/add');
    expect(req.request.method).toBe('POST');
    req.flush(mockCartItem);
  });

  it('Borrar un item en el shopping cart', () => {
    const mockProductId = 1;

    service.deleteItem(mockProductId).subscribe(() => {
      expect(true).toBeTrue(); // Confirm the observable completes
    });

    const req = httpMock.expectOne('http://localhost:8081/shop/item/add');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('Actualiza el status de la orden', () => {
    const mockStatus = 'Completado';

    service.updateOrder(mockStatus).subscribe(cart => {
      expect(cart.cart_data.status).toBe('');
    });

    const req = httpMock.expectOne('http://localhost:8081/shop/order');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
  
  it('Maneja error al agregar un item', () => {
    const mockProduct: Product = {
      id_product: 1, name: 'Error Product', price: 5.0,
      sku: '',
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };

    service.addItem(mockProduct).subscribe(
      () => fail('Expected an error'),
      (error) => {
        expect(error.message).toContain('No se ha logrado agregar el producto');
      }
    );

    const req = httpMock.expectOne('http://localhost:8081/shop/item/add');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
  
});
