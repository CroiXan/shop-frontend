import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

});
