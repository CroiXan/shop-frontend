import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ActionResponse } from '../models/actionresponse';
import { SessionValues } from '../models/sessionvalues';
import { BehaviorSubject, catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSession: SessionValues = {
    id_user: 0,
    name: '',
    email: '',
    role: '',
    phone: ''
  };
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>("");
  private emailForReset: String = "";

  private apiURL = 'http://localhost:8082/api/user'
  private credentials = btoa("admin:WpCsGw3jp*");

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${this.credentials}`,
    });
  }

  createUser(name: string, password: string, email: string, phone: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.apiURL, { headers }).pipe(
      switchMap(users => {
        let result = users.find(user => user.email === email) != undefined;
        if (result) {
          throw new Error("Error, el email ya esta en uso");
        } else {
          let newUser: User = {} as User;
          newUser.name = name;
          newUser.password = password;
          newUser.email = email;
          newUser.role = 'user';
          newUser.phone = phone;
          return this.http.post<User>(this.apiURL, newUser, { headers }).pipe(
            catchError(error => {
              throw new Error("Error al validar Email");
            })
          )
        }
      })
    );
  }

  login(email: string, password: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.apiURL, { headers }).pipe(
      map(users => {
        let foundUser: User | undefined = users.find(user => user.email === email && user.password == password);
        if (foundUser === undefined) {
          this.isLoggedIn.next(false);
          this.userRole.next("");
          throw new Error("Error, revise sus credenciales.");
        }
        this.userSession = {
          id_user: foundUser.id_user,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          phone: foundUser.phone
        }
        this.isLoggedIn.next(true);
        this.userRole.next(foundUser.role);
      })
    );
  }

  getSession(): SessionValues {
    return this.userSession;
  }

  clearSession(): void {
    this.userSession = {} as SessionValues;
    this.isLoggedIn.next(false);
    this.userRole.next("");
  }

  getRole() {
    return this.userRole.asObservable();
  }

  isAuthenticated() {
    return this.isLoggedIn.asObservable();
  }

  isLogged(): boolean {
    return this.isLoggedIn.value;
  }

  getCurrentUser(): User {
    return {
      id_user: this.userSession.id_user,
      name: this.userSession.name,
      email: this.userSession.email,
      phone: this.userSession.phone,
      password: "",
      role: this.userSession.role
    }
  }

  updateUser(userInput: User): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.apiURL, { headers }).pipe(
      switchMap(response1 => {
        let usersWithEmail: User[] = response1.filter(user => user.id_user !== userInput.id_user && user.email === userInput.email);
        if (usersWithEmail.length > 0) {
          throw new Error("Error, el email ya esta en uso");
        }
        let userToUpdate = response1.find(user => user.id_user === userInput.id_user);
        if (userToUpdate == undefined) {
          throw new Error("usuario no encontrado");
        }
        userToUpdate.name = userInput.name;
        userToUpdate.email = userInput.email;
        userToUpdate.phone = userInput.phone;
        this.userSession = userToUpdate;
        return this.http.put<User>(`${this.apiURL}/${userInput.id_user}`, userToUpdate, { headers }).pipe(
          catchError(error => {
            throw new Error("Error al actualizar usuario")
          })
        )
      }
      ),
      catchError(error => {
        throw new Error("Error al actualizar usuario")
      })
    );
  }

  changeRole(userId: number, newRole: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.apiURL}/${userId}`, { headers }).pipe(
      switchMap(response1 => {
        response1.role = newRole;
        return this.http.put<User>(`${this.apiURL}/${userId}`, response1, { headers }).pipe(
          catchError(error => {
            throw new Error("Error al buscar el usuario")
          })
        )
      }
      ),
      catchError(error => {
        throw new Error("Error al buscar el usuario")
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.apiURL, { headers });
  }

  setEmailForReset(email: string) {
    this.emailForReset = email;
  }

  resetPassword(password: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.apiURL, { headers }).pipe(
      switchMap(response1 => {
        let userFound = response1.find((user) => user.email === this.emailForReset);
        if (userFound == undefined) {
          throw new Error("Error al actualizar contraseña");
        }
        userFound.password = password;
        return this.http.put<User>(`${this.apiURL}/${userFound.id_user}`, userFound, { headers }).pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
      }
      ),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}

