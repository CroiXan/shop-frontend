import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProductListComponent } from './catalog-product-list.component';

describe('CatalogProductListComponent', () => {
  let component: CatalogProductListComponent;
  let fixture: ComponentFixture<CatalogProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogProductListComponent]
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
