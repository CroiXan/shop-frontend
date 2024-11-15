import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActionResponse } from '../../models/actionresponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup; 
  isLoading = false; 
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ){}
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    });
  }

  onLogin(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    let result: ActionResponse = this.userService
      .login(this.loginForm.get('email')?.value,this.loginForm.get('password')?.value);

    this.isLoading = false;

    if (result.IsSuccess) {
      alert(result.Message);
      this.router.navigate(['/']);
    }else{
      this.errorMessage = result.Message;
    }
    
  }

  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }
}
