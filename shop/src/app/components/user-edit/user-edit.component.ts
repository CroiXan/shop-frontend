import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ActionResponse } from '../../models/actionresponse';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {

  @Input() userData!: User;
  @Output() buttonSaveEdit = new EventEmitter<void>();
  userForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private userservice: UserService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: [this.userData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [this.userData.email, [Validators.required, Validators.email]],
      phone: [this.userData.phone, [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  onSubmit(): void {
    let updateUser: User = {
      id_user: this.userData.id_user,
      name: this.userForm.get('name')?.value,
      email: this.userForm.get('email')?.value,
      phone: this.userForm.get('phone')?.value,
      password: "",
      role: ""
    }


    this.userservice.updateUser(updateUser).subscribe({
      next: response => {
        this.errorMessage = null;
        this.buttonSaveEdit.emit();
      },
      error: err => {
        this.errorMessage = err.message;
      }
    });

  }

  get name() { return this.userForm.get('name') }
  get email() { return this.userForm.get('email') }
  get phone() { return this.userForm.get('phone') }
}
