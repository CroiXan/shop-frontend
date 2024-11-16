import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassResetRequestComponent } from './pass-reset-request.component';

describe('PassResetRequestComponent', () => {
  let component: PassResetRequestComponent;
  let fixture: ComponentFixture<PassResetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassResetRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassResetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
