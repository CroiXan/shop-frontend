import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementComponent } from './management.component';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../models/product';
import { By } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { User } from '../../models/user';

describe('ManagementComponent', () => {
  let component: ManagementComponent;
  let fixture: ComponentFixture<ManagementComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockProducts: Product[] = [{
    id_product: 1, name: 'Product 1',
    sku: '',
    price: 0,
    discount: 0,
    category: '',
    description: '',
    stock: 0
  }, {
    id_product: 2, name: 'Product 2',
    sku: '',
    price: 0,
    discount: 0,
    category: '',
    description: '',
    stock: 0
  }];
  let mockUsers: User[] = [{
    id_user: 1, name: 'User 1',
    email: '',
    phone: '',
    password: '',
    role: ''
  }, {
    id_user: 2, name: 'User 2',
    email: '',
    phone: '',
    password: '',
    role: ''
  }];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getAllProducts']);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers','getRole','getCurrentUser']);

    mockProductService.getAllProducts.and.returnValue(of(mockProducts));
    mockUserService.getAllUsers.and.returnValue(of(mockUsers));
    mockUserService.getRole.and.returnValue(of('user'));
    mockUserService.getCurrentUser.and.returnValue(mockUsers[0]);

    await TestBed.configureTestingModule({
      imports: [ManagementComponent,
        HttpClientModule
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: UserService, useValue: mockUserService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Se muestran las tabs para el rol de admin', () => {
    component.userRole = 'admin';
    fixture.detectChanges();
  
    const adminTabs = fixture.debugElement.queryAll(By.css('[id^="tab3-tab"], [id^="tab4-tab"], [id^="tab5-tab"]'));
    expect(adminTabs.length).toBe(3);
  });
  
  it('No se muestran las tabs de permisos especiales para usuarios normales', () => {
    component.userRole = 'user';
    fixture.detectChanges();
  
    const adminTabs = fixture.debugElement.queryAll(By.css('[id^="tab3-tab"], [id^="tab4-tab"], [id^="tab5-tab"]'));
    expect(adminTabs.length).toBe(0);
  });

  it('Accion de mostrar edicion de usuario', () => {
    component.toggleUserInfo = true;
    fixture.detectChanges();
  
    const userInfoComponent = fixture.debugElement.query(By.css('app-user-info'));
    userInfoComponent.triggerEventHandler('buttonEditUser', null);
  
    expect(component.toggleUserInfo).toBeFalse();
  });

  it('Accion createProduct al hacer click', () => {
    spyOn(component, 'createProduct');
    component.userRole = 'admin';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#tab4 .btn.btn-primary'));
    expect(button).toBeTruthy();
    button.triggerEventHandler('click', null);
  
    expect(component.createProduct).toHaveBeenCalled();
  });

  it('Cargar usuarios y productos para usuario admin', () => {

    mockProductService.getAllProducts.and.returnValue(of(mockProducts));
    mockUserService.getAllUsers.and.returnValue(of(mockUsers));

    component.userRole = 'admin';
    mockUserService.getRole.and.returnValue(of('admin'));
    component.ngOnInit();

    expect(mockProductService.getAllProducts).toHaveBeenCalled();
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.productList).toEqual(mockProducts);
    expect(component.userList).toEqual(mockUsers);
  });

  it('Cargar usuarios y productos para usuario editor', () => {

    mockProductService.getAllProducts.and.returnValue(of(mockProducts));
    mockUserService.getAllUsers.and.returnValue(of(mockUsers));

    component.userRole = 'editor';
    mockUserService.getRole.and.returnValue(of('editor'));
    component.ngOnInit();

    expect(mockProductService.getAllProducts).toHaveBeenCalled();
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.productList).toEqual(mockProducts);
    expect(component.userList).toEqual(mockUsers);
  });

  it('No carga usuarios para usuarios normales', () => {
    component.userRole = 'user';
    mockUserService.getRole.and.returnValue(of('user'));
    component.ngOnInit();

    expect(mockUserService.getAllUsers).not.toHaveBeenCalled();
    expect(component.userList).toHaveSize(0);
  });

  it('Invoca la funcion de refreshProductList', () => {
    spyOn(component, 'refreshProductList').and.callThrough();
  
    component.refreshProductList();
    
    expect(component.refreshProductList).toHaveBeenCalled();
  });

  it('Cambia el valor de showProductEdit al usar cancelProductEdit', () => {
    component.showProductEdit = true;
    spyOn(component, 'cancelProductEdit').and.callThrough();
  
    component.cancelProductEdit();
  
    expect(component.cancelProductEdit).toHaveBeenCalled();
    expect(component.showProductEdit).toBeFalse();
  });

  it('Cambia el producto seleccionado al usar onProductSelected', () => {
    const mockProduct:Product = {
      id_product: 1, name: 'Product 1',
      sku: '',
      price: 0,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    };
    spyOn(component, 'onProductSelected').and.callThrough();
  
    component.onProductSelected(mockProduct);
  
    expect(component.onProductSelected).toHaveBeenCalledWith(mockProduct);
    expect(component.produtToEdit).toEqual(mockProduct);
    expect(component.showProductEdit).toBeTrue();
  });

  it('Cambia toggleUserInfo al usar showEditUser', () => {
    component.toggleUserInfo = true;
    spyOn(component, 'showEditUser').and.callThrough();
  
    component.showEditUser();
  
    expect(component.showEditUser).toHaveBeenCalled();
    expect(component.toggleUserInfo).toBeFalse();
  });

  it('Obtiene el usuario al usar refreshUser', () => {
    component.refreshUser();
  
    expect(mockUserService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUsers[0]);
  });

  it('Obtiene el listado de productos al usar savedProduct', () => {
    component.savedProduct();

    expect(mockProductService.getAllProducts).toHaveBeenCalled();
    expect(component.productList).toEqual(mockProducts);
  });

  it('Cambia el valor de showProductEdit al usar createProduct', () => {
    component.showProductEdit = false;

    component.createProduct();

    expect(component.showProductEdit).toBeTrue();
    expect(component.produtToEdit.id_product).toBe(0);
  });

});
