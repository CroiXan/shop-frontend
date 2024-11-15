import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ActionResponse } from '../models/actionresponse';
import { SessionValues } from '../models/sessionvalues';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private SESSION_KEY = 'user_session';

  userList: User[] = [
    {
      id_user: 1,
      name: 'administrador',
      password: 'adminadmin',
      email: 'admin@mail.cl',
      role: 'admin',
      phone: '56988776655'
    },
    {
      id_user: 2,
      name: 'juan perez',
      password: 'qwerty',
      email: 'mail@mail.cl',
      phone: '56911223344',
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
      return { IsSuccess: false, Message: "Error, revise sus credenciales." };
    }

    let sessionUser: SessionValues = {
      id_user: foundUser.id_user,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role
    }

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));

    return { IsSuccess: true, Message: "Se ha logueado" };
  }

  getSession(): SessionValues | undefined {
    const sessionData = sessionStorage.getItem(this.SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : undefined;
  }

  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getSession();
  }

}
