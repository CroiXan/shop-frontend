import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ActionResponse } from '../models/actionresponse';
import { SessionValues } from '../models/sessionvalues';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSession: SessionValues = {} as SessionValues;
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>("");
  private emailForReset: String = "";

  userList: User[] = [
    {
      id_user: 1,
      name: 'administrador',
      password: 'adminadmin',
      email: 'admin@mail.cl',
      role: 'admin',
      phone: '988776655'
    },
    {
      id_user: 2,
      name: 'juan perez',
      password: 'qwertyui',
      email: 'mail@mail.cl',
      phone: '911223344',
      role: 'user'
    }
  ];

  constructor() { }

  createUser(name: string, password: string, email: string, phone: string): ActionResponse {

    if (this.checkEmail(email)) {
      return { IsSuccess: false, Message: "Email ya esta en uso" }
    }

    let newUser: User = {} as User;
    const newId = this.userList.reduce((maxId, user) => {
      return Math.max(maxId, user.id_user);
    }, 0) + 1;

    newUser.id_user = newId;
    newUser.name = name;
    newUser.password = password;
    newUser.email = email;
    newUser.role = 'user';
    newUser.phone = phone;

    this.userList.push(newUser);

    return { IsSuccess: true, Message: "Se ha registrado con exito" };
  }

  checkEmail(email: string): boolean {
    return (this.userList.find(user => user.email === email) !== undefined)
  }


  login(email: string, password: string): ActionResponse {
    let foundUser: User | undefined = this.userList.find(user => user.email === email && user.password == password);

    if (foundUser === undefined) {
      this.isLoggedIn.next(false);
      this.userRole.next("");
      return { IsSuccess: false, Message: "Error, revise sus credenciales." };
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

    return { IsSuccess: true, Message: "Se ha logueado" };
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

  updateUser(userInput: User): ActionResponse {
    let usersWithEmail: User[] = this.userList.filter(user => user.id_user !== userInput.id_user && user.email === userInput.email);

    if (usersWithEmail.length > 0) {
      return { IsSuccess: false, Message: "Error, el email ya esta en uso" };
    }

    let userIndex = this.userList.findIndex((user) => user.id_user === userInput.id_user);

    if (userIndex === -1) {
      return { IsSuccess: false, Message: "Error al actualizar usuario" };
    }

    this.userList[userIndex].email = userInput.email;
    this.userList[userIndex].name = userInput.name;
    this.userList[userIndex].phone = userInput.phone;

    this.userSession.name = userInput.name;
    this.userSession.email = userInput.email;
    this.userSession.phone = userInput.phone;

    return { IsSuccess: true, Message: "Se ha actualizado el usuario" };
  }

  changeRole(userId: number, newRole: string): ActionResponse{

    let userIndex = this.userList.findIndex((user) => user.id_user === userId);

    if (userIndex === -1) {
      return { IsSuccess: false, Message: "Error al actualizar usuario" };
    }

    this.userList[userIndex].role = newRole;

    if (this.userSession.id_user = userId) {
      this.userSession.role = newRole;
    }

    return { IsSuccess: true, Message: "Se ha actualizado el usuario" };
  }

  getAllUsers(): User[] {
    return this.userList;
  }

  setEmailForReset(email: string){
    this.emailForReset = email;
  }

  resetPassword(password: string): ActionResponse{

    let userIndex = this.userList.findIndex((user) => user.email === this.emailForReset);

    if (userIndex === -1) {
      return { IsSuccess: false, Message: "Error al actualizar contraseña" };
    }

    this.userList[userIndex].password = password;

    return { IsSuccess: true, Message: "Se ha actualizado la Contraseña" };
  }

}

