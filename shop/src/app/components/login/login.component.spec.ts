import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Desactiva el boton submit cuando el formulario es invalido', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('Mostrar mensaje de error con email invalido', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('.text-danger')).nativeElement;
    expect(errorMsg.textContent).toContain('Ingresa un correo electrónico válido.');
  });

  it('Invoca onLogin durante se ejecuta el submit', () => {
    spyOn(component, 'onLogin');
    component.loginForm.controls['email'].setValue('test@testemail.com');
    component.loginForm.controls['password'].setValue('password');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));

    expect(component.onLogin).toHaveBeenCalled();
  });

  it('Formulario de login invalido', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    spyOn(component.loginForm, 'markAllAsTouched');

    component.onLogin();

    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    expect(userService.login).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('Logueo con exito', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password');
    userService.login.and.returnValue(of(void 0));

    component.onLogin();

    expect(userService.login).toHaveBeenCalledWith('test@test.com', 'password');
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeNull();
  });

  it('Error de login', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password');
    userService.login.and.returnValue(throwError({ Message: 'Error, revise sus credenciales.' }));

    component.onLogin();

    expect(userService.login).toHaveBeenCalledWith('test@test.com', 'password');
    expect(component.errorMessage).toBe('Error, revise sus credenciales.');
    expect(component.isLoading).toBeFalse();
  });

});
