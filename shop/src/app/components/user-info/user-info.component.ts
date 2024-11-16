import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  @Input() userData!: User;
  @Output() buttonEditUser = new EventEmitter<void>();

  userRole: string = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRole().subscribe(status => {
      this.userRole = status;
    });
  }

  onEditUser(): void {
    this.buttonEditUser.emit();
  }
}
