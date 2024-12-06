import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent,
        ReactiveFormsModule,
        HttpClientTestingModule 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Error de campo name requerido', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.invalid).toBeTruthy();
    expect(nameControl?.hasError('required')).toBeTruthy();
  });
  
  it('Validar Error de formato de email', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalidEmail');
    expect(emailControl?.invalid).toBeTruthy();
    expect(emailControl?.hasError('email')).toBeTruthy();
  });
  
  it('Validar largo de contrasena', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('short');
    expect(passwordControl?.invalid).toBeTruthy();
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('Validar llamado de onSubmit cuando el formulario es valido', () => {
    const spy = spyOn(component, 'onSubmit');
    component.registerForm.setValue({
      name: 'Usuario Prueba',
      email: 'test@test.com',
      phone: '123456789',
      password: 'securepassword',
      confirmpass: 'securepassword'
    });
    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));
  
    expect(spy).toHaveBeenCalled();
  });

  it('Validar mensaje de error si se interactuo con campo name', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.markAsTouched();
    nameControl?.setValue('');
    fixture.detectChanges();
  
    const errorElement = fixture.nativeElement.querySelector('#name + .text-danger');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('El nombre es obligatorio.');
  });

});
