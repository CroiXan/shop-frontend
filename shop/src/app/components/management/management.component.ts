import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserInfoComponent } from "../user-info/user-info.component";

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, UserInfoComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {
  user!: User;
  userRole: string = "";

  constructor( private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRole().subscribe(status => {
      this.userRole = status;
    });
    this.user = this.userService.getCurrentUser();
  }
}
