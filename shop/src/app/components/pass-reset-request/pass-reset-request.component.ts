import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pass-reset-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './pass-reset-request.component.html',
  styleUrl: './pass-reset-request.component.css'
})
export class PassResetRequestComponent {

  emailForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.userservice.setEmailForReset(this.emailForm.get('email')?.value);
    this.router.navigate(['/cambiar-contrasena']);
  }

}
