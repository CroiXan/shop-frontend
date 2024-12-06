import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCartComponent } from './shop-cart.component';
import { HttpClientModule } from '@angular/common/http';

describe('ShopCartComponent', () => {
  let component: ShopCartComponent;
  let fixture: ComponentFixture<ShopCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopCartComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
