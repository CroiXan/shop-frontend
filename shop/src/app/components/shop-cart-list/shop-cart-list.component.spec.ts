import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCartListComponent } from './shop-cart-list.component';
import { HttpClientModule } from '@angular/common/http';

describe('ShopCartListComponent', () => {
  let component: ShopCartListComponent;
  let fixture: ComponentFixture<ShopCartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopCartListComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopCartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
