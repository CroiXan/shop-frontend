import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProductListComponent } from './catalog-product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('CatalogProductListComponent', () => {
  let component: CatalogProductListComponent;
  let fixture: ComponentFixture<CatalogProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogProductListComponent,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,],
      providers: [ProductService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
