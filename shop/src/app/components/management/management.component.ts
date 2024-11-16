import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserInfoComponent } from "../user-info/user-info.component";
import { UserEditComponent } from "../user-edit/user-edit.component";

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, UserInfoComponent, UserEditComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {
  user!: User;
  userRole: string = "";
  toggleUserInfo: boolean = true;

  constructor( private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRole().subscribe(status => {
      this.userRole = status;
    });
    this.user = this.userService.getCurrentUser();
  }

  showEditUser(){
    this.toggleUserInfo = false;
  }

  refreshUser(){
    this.toggleUserInfo = true;
    this.user = this.userService.getCurrentUser();
  }
}
