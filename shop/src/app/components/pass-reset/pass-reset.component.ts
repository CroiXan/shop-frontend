import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { samePasswordValidator } from '../../validators/validators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pass-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './pass-reset.component.html',
  styleUrl: './pass-reset.component.css'
})
export class PassResetComponent {

  passwordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmpass: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    }, {
      validators: samePasswordValidator('password', 'confirmpass')
    });
  }

  onSubmit() {
    this.userservice.resetPassword(this.passwordForm.get('password')?.value).subscribe({
      next: response2 => {
        alert("Se ha actualizado la Contraseña");
        this.router.navigate(['/login']);
      },
      error: error => {
        alert("Error al actualizar contraseña");
      },
    });  
  }

  get password() { return this.passwordForm.get('password') }
  get confirmpass() { return this.passwordForm.get('confirmpass') }

}