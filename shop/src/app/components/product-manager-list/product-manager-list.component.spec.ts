import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerListComponent } from './product-manager-list.component';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('ProductManagerListComponent', () => {
  let component: ProductManagerListComponent;
  let fixture: ComponentFixture<ProductManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagerListComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagerListComponent);
    component = fixture.componentInstance;
    component.products = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Mostrar el mensaje de carga si loading es verdadero', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingMessage = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(loadingMessage.textContent).toContain('Cargando productos...');
  });

  it('Mostrar el mensaje de error si errorMessage tiene un valor', () => {
    component.errorMessage = 'Error al cargar los productos';
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(errorMessage.textContent).toContain('Error al cargar los productos');
  });

  it('Mostrar los productos si loading es falso y hay productos', () => {
    component.loading = false;
    component.products = [
      {
        id_product: 1, name: 'Producto 1', sku: 'SKU1', price: 100,
        discount: 0,
        category: '',
        description: '',
        stock: 0
      },
      {
        id_product: 2, name: 'Producto 2', sku: 'SKU2', price: 200,
        discount: 0,
        category: '',
        description: '',
        stock: 0
      }
    ];
    fixture.detectChanges();
    const productCards = fixture.debugElement.queryAll(By.css('.card-title'));
    expect(productCards.length).toBe(2);
    expect(productCards[0].nativeElement.textContent).toContain('Producto 1');
    expect(productCards[1].nativeElement.textContent).toContain('Producto 2');
  });

  it('Mostrar el mensaje "No hay productos disponibles" si no hay productos', () => {
    component.loading = false;
    component.products = [];
    fixture.detectChanges();
    const noProductsMessage = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(noProductsMessage.textContent).toContain('No hay productos disponibles.');
  });

  it('Invocar al metodo editar producto al hacer clic en el boton "Editar"', () => {
    spyOn(component, 'editProduct');
    component.loading = false;
    component.products = [{
      id_product: 1, name: 'Producto 1', sku: 'SKU1', price: 100,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    }];
    fixture.detectChanges();
    const editButton = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
    editButton.click();
    expect(component.editProduct).toHaveBeenCalledWith(component.products[0]);
  });

  it('Invocar al metodo eliminar producto al hacer clic en el boton "Eliminar"', () => {
    spyOn(component, 'deleteProduct');
    component.loading = false;
    component.products = [{
      id_product: 1, name: 'Producto 1', sku: 'SKU1', price: 100,
      discount: 0,
      category: '',
      description: '',
      stock: 0
    }];
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.queryAll(By.css('.btn-primary'))[1].nativeElement;
    deleteButton.click();
    expect(component.deleteProduct).toHaveBeenCalledWith(component.products[0].id_product);
  });
  
});
