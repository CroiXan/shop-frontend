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

  it('Crea un producto con exito', () => {
    const newProduct: Product = {
      id_product: 1, 
      sku: '12345', 
      name: 'Product 1',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    service.createProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush([]);
    const reqPost = httpMock.expectOne(service['apiURL']);
    expect(reqPost.request.method).toBe('POST');
    reqPost.flush(newProduct);
  });
  
  it('debería manejar error al crear un producto', () => {
    const newProduct: Product = {
      id_product: 1, 
      sku: '12345', 
      name: 'Product 1',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    service.createProduct(newProduct).subscribe(
      () => fail('Se esperaba un error'),
      error => expect(error).toBeTruthy()
    );

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush([{ sku: '12345' }], { status: 409, statusText: 'Conflict' });
  });

  it('debería actualizar un producto con éxito', () => {
    const updatedProduct: Product = {
      id_product: 1, 
      sku: '12345', 
      name: 'Updated Product',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    service.updateProduct(updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush([updatedProduct]);
    const reqPut = httpMock.expectOne(service['apiURL']);
    expect(reqPut.request.method).toBe('PUT');
    reqPut.flush(updatedProduct);
  });

  it('debería manejar error al actualizar un producto', () => {
    const updatedProduct: Product = {
      id_product: 2, 
      sku: '67890', 
      name: 'Product Not Found',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    service.updateProduct(updatedProduct).subscribe(
      () => fail('Se esperaba un error'),
      error => expect(error).toBeTruthy()
    );

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush([], { status: 404, statusText: 'Not Found' });
  });

  it('debería eliminar un producto con éxito', () => {
    const productId = 1;
    service.deleteProduct(productId).subscribe(response => {
      expect(response).toEqual('Producto eliminado');
    });

    const req = httpMock.expectOne(`${service['apiURL']}/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Producto eliminado');
  });
  
});
