import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../models/user';
import { SessionValues } from '../models/sessionvalues';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Permitir crear usario cuando correo no esta en uso', () => {
    const mockUsers = [
      { id_user: 1, name: 'Usuario Prueba', email: 'test@test.com', password: '1234', role: 'user', phone: '1234567890' },
    ];
    const newUser = { name: 'Ususario Nuevo', email: 'new@test.com', password: '5678', phone: '0987654321', role: 'user' };

    service.createUser(newUser.name, newUser.password, newUser.email, newUser.phone).subscribe((response) => {
      expect(response).toEqual(jasmine.objectContaining(newUser));
    });

    const req1 = httpMock.expectOne(service['apiURL']);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockUsers);

    const req2 = httpMock.expectOne(service['apiURL']);
    expect(req2.request.method).toBe('POST');
    req2.flush(newUser);
  });

  it('Lanzar error en creacion de usuario cuando el correo esta en uso', () => {
    const mockUsers = [
      { id_user: 1, name: 'Usuario Prueba', email: 'test@test.com', password: '1234', role: 'user', phone: '1234567890' },
    ];

    service.createUser('Usuario Nuevo', '5678', 'test@test.com', '0987654321').subscribe({
      error: (err) => {
        expect(err.message).toBe('Error, el email ya esta en uso');
      },
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('Inicia sesion con exito', (done: DoneFn) => {
    const mockUsers = [{ email: 'test@test.com', password: 'password123', role: 'user' }];

    service.login('test@test.com', 'password123').subscribe(() => {
      expect(service.isLogged()).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('Lanza error en login con credenciales incorrectas', (done: DoneFn) => {
    const mockUsers = [{ email: 'test@test.com', password: 'password123' }];

    service.login('test@test.com', 'wrongpassword').subscribe({
      error: (err) => {
        expect(err.message).toBe('Error, revise sus credenciales.');
        done();
      },
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('Actualiza un usuario con exito', (done: DoneFn) => {
    const mockUsers = [{ id_user: 1, email: 'test@test.com' }];
    const updatedUser: User = {
      id_user: 1,
      name: 'Updated Name',
      email: 'updated@test.com',
      phone: '1234567890',
      password: '',
      role: ''
    };

    service.updateUser(updatedUser).subscribe((response) => {
      expect(response).toEqual(updatedUser);
      done();
    });

    const req1 = httpMock.expectOne(service['apiURL']);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockUsers);

    const req2 = httpMock.expectOne(`${service['apiURL']}/${updatedUser.id_user}`);
    expect(req2.request.method).toBe('PUT');
    req2.flush(updatedUser);
  });

  it('Cambia el rol de un usuario con exito', (done: DoneFn) => {
    const mockUser = { id_user: 1, role: 'user' };
    const updatedUser = { ...mockUser, role: 'admin' };

    service.changeRole(1, 'admin').subscribe((response) => {
      expect(response.role).toBe('admin');
      done();
    });

    const req1 = httpMock.expectOne(`${service['apiURL']}/1`);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockUser);

    const req2 = httpMock.expectOne(`${service['apiURL']}/1`);
    expect(req2.request.method).toBe('PUT');
    req2.flush(updatedUser);
  });

  it('Lanza un error en changeRole si ocurre un problema', (done: DoneFn) => {
    service.changeRole(1, 'admin').subscribe({
      error: (err) => {
        expect(err.message).toBe('Error al buscar el usuario');
        done();
      },
    });

    const req = httpMock.expectOne(`${service['apiURL']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('Reestablecer la contrasena con exito', (done: DoneFn) => {
    const mockUsers = [{ email: 'test@example.com', id_user: 1 }];
    const updatedUser = { ...mockUsers[0], password: 'newpassword' };

    service.setEmailForReset('test@example.com');
    service.resetPassword('newpassword').subscribe((response) => {
      expect(response.password).toBe('newpassword');
      done();
    });

    const req1 = httpMock.expectOne(service['apiURL']);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockUsers);

    const req2 = httpMock.expectOne(`${service['apiURL']}/1`);
    expect(req2.request.method).toBe('PUT');
    req2.flush(updatedUser);
  });

  it('Lanza un error en resetPassword si el usuario no existe', (done: DoneFn) => {
    service.setEmailForReset('nonexistent@example.com');
    service.resetPassword('newpassword').subscribe({
      error: (err) => {
        expect(err.message).toBe('Error al actualizar contraseña');
        done();
      },
    });

    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('Retorna usuario de sesion correctamente', () => {

    const mockSession = {
      id_user: 1,
      name: 'Prueba',
      email: 'test@test.com',
      role: 'user',
      phone: '1234567890',
    };
  
    (service as any).userSession = mockSession;
  
    const session = service.getSession();
    expect(session).toEqual(mockSession);
  });

  it('Limpia los valores de sesion', () => {
    const mockSession = {
      id_user: 1,
      name: 'Prueba',
      email: 'test@test.com',
      role: 'user',
      phone: '1234567890',
    };
  
    (service as any).userSession = mockSession;
    service['isLoggedIn'].next(true);
    service['userRole'].next('user');
  
    service.clearSession();
  
    expect(service.getSession()).toEqual({} as SessionValues);
  
    service.isAuthenticated().subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeFalse();
    });
  
    service.getRole().subscribe((role) => {
      expect(role).toBe('');
    });
  });

  it('Obtener listado de usuarios', (done: DoneFn) => {
    const mockUsers = [
      { id_user: 1, name: 'Usuario 1', email: 'user1@test.com', role: 'admin', phone: '1234567890', password: '' },
      { id_user: 2, name: 'Usuario 2', email: 'user2@test.com', role: 'user', phone: '0987654321', password: '' },
    ];

    service.getAllUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
      done();
    });
  
    const req = httpMock.expectOne(service['apiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); 
  });

});
