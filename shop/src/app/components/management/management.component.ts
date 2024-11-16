import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserInfoComponent } from "../user-info/user-info.component";
import { UserEditComponent } from "../user-edit/user-edit.component";
import { UserItemComponent } from "../user-item/user-item.component";

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, UserInfoComponent, UserEditComponent, UserItemComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {
  user!: User;
  userRole: string = "";
  toggleUserInfo: boolean = true;
  userList: User[] = [];

  constructor( private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRole().subscribe(status => {
      this.userRole = status;
    });
    this.user = this.userService.getCurrentUser();
    if (this.userRole == "admin" || this.userRole == "editor") {
      this.userList = this.userService.getAllUsers();
    }
  }

  showEditUser(){
    this.toggleUserInfo = false;
  }

  refreshUser(){
    this.toggleUserInfo = true;
    this.user = this.userService.getCurrentUser();
  }
}
