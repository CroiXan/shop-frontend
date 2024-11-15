import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList: User[] = [
    {
      id_user: 1,
      name: 'administrador',
      password: 'admin',
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

  createUser(name: string, password: string, email: string, phone: string): boolean {

    if (this.checkEmail(email)) {
      return false;
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

    return true;
  }

  checkEmail(email: string): boolean {
    return (this.userList.find(user => user.email === email) !== undefined)
  }
  
}
