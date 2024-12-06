import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditComponent,
        HttpClientModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    component.userData = {
      id_user: 0,
      name: '',
      email: '',
      phone: '',
      password: '',
      role: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Inicia el formulario con los campos vacios', () => {
    const form = component.userForm;
    expect(form).toBeTruthy();
    expect(form.get('name')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('phone')?.value).toBe('');
  });

  it('Marca como invalido el formulario si los campos estan vacios', () => {
    const form = component.userForm;
    form.markAllAsTouched();
    expect(form.invalid).toBeTrue();
  });

  it('Valida que el campo nombre es obligatorio', () => {
    const nameControl = component.userForm.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('#name + .text-danger'));
    expect(nameControl?.invalid).toBeTrue();
    expect(errorElement.nativeElement.textContent).toContain('El nombre es obligatorio.');
  });

  it('Valida que el correo electrónico sea obligatorio y valido', () => {
    const emailControl = component.userForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    let errorElement = fixture.debugElement.query(By.css('#email + .text-danger'));
    expect(emailControl?.invalid).toBeTrue();
    expect(errorElement.nativeElement.textContent).toContain('El correo electrónico es obligatorio.');

    emailControl?.setValue('correo-invalido');
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTrue();
    expect(errorElement.nativeElement.textContent).toContain('Ingresa un correo electrónico válido.');
  });

  it('Permite enviar el formulario si todos los campos son validos', () => {
    const form = component.userForm;
    form.get('name')?.setValue('Nombre valido');
    form.get('email')?.setValue('correo@valido.com');
    form.get('phone')?.setValue('987654321');

    form.get('name')?.markAsTouched();
    form.get('email')?.markAsTouched();
    form.get('phone')?.markAsTouched();

    fixture.detectChanges();
    expect(form.valid).toBeTrue();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeFalse();
  });

  it('Muestra el mensaje de error global si existe un error', () => {
    component.errorMessage = 'Ocurrió un error al guardar los cambios.';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert-danger'));
    expect(alertElement).toBeTruthy();
    expect(alertElement.nativeElement.textContent).toContain('Ocurrió un error al guardar los cambios.');
  });

});
