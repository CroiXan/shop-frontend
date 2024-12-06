import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent,
        HttpClientModule,
        RouterTestingModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Se muestra el titulo "Encuentra Facil"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headerTitle = compiled.querySelector('.fs-4');
    expect(headerTitle?.textContent).toContain('Encuentra Fácil');
  });

  it('Se muestra el boton de login y registro si no se esta logueado', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    
    const loginButton = Array.from(compiled.querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Iniciar sesión'
    );
    const registerButton = Array.from(compiled.querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Registrarse'
    );
  
    expect(loginButton).toBeTruthy();
    expect(registerButton).toBeTruthy();
  });

  it('Se muestra el boton de cerrar sesion cuando se encuentra logueado', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-outline-light')?.textContent).toContain('Cerrar sesión');
  });

  it('Se invoca funcion de login cuando se presiona el boton', () => {
    spyOn(component, 'onLogin');
    const compiled = fixture.nativeElement as HTMLElement;

    const loginButton = compiled.querySelector('button.btn-outline-light') as HTMLElement;
    loginButton.click();

    expect(component.onLogin).toHaveBeenCalled();
  });

  it('Se invoca funcion de registro cuando se presiona el boton', () => {
    spyOn(component, 'onRegister');
    const compiled = fixture.nativeElement as HTMLElement;

    const registerButton = compiled.querySelector('button.btn-warning') as HTMLElement;
    registerButton.click();

    expect(component.onRegister).toHaveBeenCalled();
  });

  it('Se invoca funcion de logout cuando se presiona el boton', () => {
    spyOn(component, 'loginOut');
    component.isLoggedIn = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector('.btn-outline-light') as HTMLElement;
    logoutButton.click();

    expect(component.loginOut).toHaveBeenCalled();
  });

});
