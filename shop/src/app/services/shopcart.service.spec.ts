import { TestBed } from '@angular/core/testing';

import { ShopcartService } from './shopcart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Product } from '../models/product';
import { ShopCartItem } from '../models/shopcartitem';
import { ShopCartFull } from '../models/shopcartfull';

describe('ShopcartService', () => {
  let service: ShopcartService;
  let httpMock: HttpTestingController;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getSession']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ShopcartService,
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
    const mockProduct: Product = {
      id_product: 1, 
      name: 'Producto de prueba',
      sku: '',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    const mockCartItem: ShopCartItem = {
      id_product: 1, amount: 1, product: mockProduct,
      id_orderitem: 0,
      id_order: 0,
      sku: ''
    };
    const mockOrderData = { 
      id_order: 123, 
      create_date: '', 
      id_user: 0, 
      total: 0, 
      status: '' 
    };
    const initialCart:ShopCartFull = { cart_data: {
      id_order: 123,
      create_date: '',
      id_user: 0,
      total: 0,
      status: ''
    }, cart_items: [] };

    service.currentShoppingCart = initialCart;

    service.addItem(mockProduct).subscribe(item => {
      expect(item).toEqual(mockCartItem);
      expect(service.currentShoppingCart.cart_items.length).toBe(1);
      expect(service.currentShoppingCart.cart_items[0].id_product).toBe(mockProduct.id_product);
    });
  
    const reqAdd = httpMock.expectOne('http://localhost:8081/shop/item/add');
    expect(reqAdd.request.method).toBe('POST');
    expect(reqAdd.request.body).toEqual({
      id_order: initialCart.cart_data.id_order,
      id_product: mockProduct.id_product,
    });
    reqAdd.flush(mockCartItem); 
  
    const reqRefresh = httpMock.expectOne(`http://localhost:8081/shop/order/${initialCart.cart_data.id_order}`);
    expect(reqRefresh.request.method).toBe('GET');
    reqRefresh.flush(mockOrderData); 
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

  it('Se lalama nueva informacion al usar refreshOrder', () => {
    const mockOrderData = {
      id_order: 123,
      create_date: '',
      id_user: 1,
      total: 150,
      status: ''
    };

    const initialCart = {
      cart_data: { id_order: 123, create_date: '', id_user: 0, total: 0, status: '' },
      cart_items: []
    };

    service.currentShoppingCart = initialCart;

    const refreshOrderSpy = spyOn<any>(service, 'refreshOrder').and.callThrough();
    (service as any).refreshOrder();

    const req = httpMock.expectOne(`http://localhost:8081/shop/order/${initialCart.cart_data.id_order}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrderData);

    expect(service.currentShoppingCart.cart_data).toEqual(mockOrderData);
    expect(refreshOrderSpy).toHaveBeenCalled();
  });

  it('Obtiene las ordenes de un usuario guardadas en currentUserShoppingCartList', () => {
    const mockUserId = 1;
    const mockOrders = [
      { id_order: 101, create_date: '', id_user: mockUserId, total: 200, status: '' },
      { id_order: 102, create_date: '', id_user: mockUserId, total: 300, status: '' }
    ];
  
    const mockCartItemsOrder101: ShopCartItem[] = [
      {
        id_product: 1, amount: 2,
        id_orderitem: 0,
        id_order: 0,
        sku: '',
        product:  {} as Product
      },
      {
        id_product: 2, amount: 1,
        id_orderitem: 0,
        id_order: 0,
        sku: '',
        product:  {} as Product
      }
    ];
  
    const mockCartItemsOrder102: ShopCartItem[] = [
      {
        id_product: 3, amount: 1,
        id_orderitem: 0,
        id_order: 0,
        sku: '',
        product:  {} as Product
      },
      {
        id_product: 4, amount: 2,
        id_orderitem: 0,
        id_order: 0,
        sku: '',
        product: {} as Product
      }
    ];
  
    service.getAllShopcartByUser(mockUserId).subscribe(carts => {
      expect(carts.length).toBe(2);
      expect(service.currentUserShoppingCartList.length).toBe(2);
  
      expect(service.currentUserShoppingCartList[0].cart_data).toEqual(mockOrders[0]);
      expect(service.currentUserShoppingCartList[0].cart_items).toEqual(mockCartItemsOrder101);
  
      expect(service.currentUserShoppingCartList[1].cart_data).toEqual(mockOrders[1]);
      expect(service.currentUserShoppingCartList[1].cart_items).toEqual(mockCartItemsOrder102);
    });
  
    const reqOrders = httpMock.expectOne(`http://localhost:8081/shop/order/user/${mockUserId}`);
    expect(reqOrders.request.method).toBe('GET');
    reqOrders.flush(mockOrders); 

    const reqItemsOrder101 = httpMock.expectOne(`http://localhost:8081/shop/item/101`);
    expect(reqItemsOrder101.request.method).toBe('GET');
    reqItemsOrder101.flush(mockCartItemsOrder101);
  
    const reqItemsOrder102 = httpMock.expectOne(`http://localhost:8081/shop/item/102`);
    expect(reqItemsOrder102.request.method).toBe('GET');
    reqItemsOrder102.flush(mockCartItemsOrder102);
  });

});
