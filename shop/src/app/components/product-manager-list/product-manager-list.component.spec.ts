import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerListComponent } from './product-manager-list.component';

describe('ProductManagerListComponent', () => {
  let component: ProductManagerListComponent;
  let fixture: ComponentFixture<ProductManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
