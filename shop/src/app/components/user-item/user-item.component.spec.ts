import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemComponent } from './user-item.component';
import { HttpClientModule } from '@angular/common/http';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserItemComponent);
    component = fixture.componentInstance;
    component.userData = { 
      id_user: 1, 
      name: 'Usuario Prueba', 
      email: 'test@test.com', 
      password: '1234', 
      role: 'user', 
      phone: '1234567890' 
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Se muestra el id de usario en el header', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.card-header h4').textContent).toContain('Id: 1');
  });

  it('Se invoca onValueChange cuando se cambia el rol del selector', () => {
    spyOn(component, 'onValueChange');
    const select = fixture.nativeElement.querySelector('#role');
    select.dispatchEvent(new Event('ngModelChange'));
    fixture.detectChanges();
    expect(component.onValueChange).toHaveBeenCalled();
  });

  it('No se muestra el boton de confirmar cuando showConfirm sea falso', () => {
    component.showConfirm = false;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button).toBeNull();
  });

  it('Se invoca funcion de updateRole cuando se hace submit', () => {
    spyOn(component, 'updateRole');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.updateRole).toHaveBeenCalled();
  });

});
