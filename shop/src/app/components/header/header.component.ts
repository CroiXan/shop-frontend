import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userRole: string = "";
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRole().subscribe(status => {
      this.userRole = status;
    });
    this.userService.isAuthenticated().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    this.router.navigate(['/registro']);
  }

  loginOut() {
    
  }
}
