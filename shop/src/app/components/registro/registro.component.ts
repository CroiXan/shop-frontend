import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { samePasswordValidator } from '../../validators/validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmpass: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    }, {
      validators: samePasswordValidator('password', 'confirmpass')
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.userservice.createUser(
        this.registerForm.get('name')?.value,
        this.registerForm.get('password')?.value,
        this.registerForm.get('email')?.value,
        this.registerForm.get('phone')?.value).subscribe({
          next: response2 => {
            this.errorMessage = null;
            alert("Se ha registrado con exito");
            this.router.navigate(['/login']);
          },
          error: error => {
            this.errorMessage = error.Message;
          },
        });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get confirmpass() { return this.registerForm.get('confirmpass'); }

}
