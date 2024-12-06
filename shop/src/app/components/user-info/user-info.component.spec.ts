import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoComponent } from './user-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoComponent,
        HttpClientModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    component.userData = { id_user: 1 , name: 'Usuario Prueba', email: 'user.test@test.com', phone: '123456789', password: '12345678', role: 'user' };
    component.userRole = 'user';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia mostrar los datos del usuario correctamente', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.list-group-item:nth-child(1)').textContent).toContain('Usuario Prueba');
    expect(compiled.querySelector('.list-group-item:nth-child(2)').textContent).toContain('user.test@test.com');
    expect(compiled.querySelector('.list-group-item:nth-child(3)').textContent).toContain('123456789');
  });

  it('Deberia mostrar No disponible si falta un dato', () => {
    component.userData = { id_user: 0, name: '', email: '', phone: '', password: '', role: '' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.list-group-item:nth-child(1)').textContent).toContain('No disponible');
    expect(compiled.querySelector('.list-group-item:nth-child(2)').textContent).toContain('No disponible');
    expect(compiled.querySelector('.list-group-item:nth-child(3)').textContent).toContain('No disponible');
  });

  it('Deberia mostrar el rol si el usuario es admin', () => {
    component.userRole = 'admin';
    component.userData.role = 'Admin';
    fixture.detectChanges();

    const roleItem = fixture.nativeElement.querySelector('.list-group-item:nth-child(4)');
    expect(roleItem).toBeTruthy();
    expect(roleItem.textContent).toContain('Admin');
  });

  it('No deberia mostrar el rol si el usuario no es admin', () => {
    const roleItem = fixture.nativeElement.querySelector('.list-group-item:nth-child(4)');
    expect(roleItem).toBeNull();
  });

  it('Deberia llamar a onEditUser al hacer clic en el boton de editar', () => {
    spyOn(component, 'onEditUser');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(component.onEditUser).toHaveBeenCalled();
  });
  
});
