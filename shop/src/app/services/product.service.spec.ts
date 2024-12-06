import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Obtener todos los productos', () => {
    const dummyProducts: Product[] = [
      {
        id_product: 1, sku: '12345', name: 'Producto 1',
        price: 10,
        discount: 0,
        category: 'Test',
        description: 'Test',
        stock: 1
      },
      {
        id_product: 2, sku: '67890', name: 'Producto 2',
        price: 10,
        discount: 0,
        category: 'Test',
        description: 'Test',
        stock: 1
      },
    ];

    service.getAllProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('Error al obtener productos', () => {
    service.getAllProducts().subscribe(
      () => fail('Se espera un error'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush('Error al obtener productos', { status: 500, statusText: 'Server Error' });
  });

});
