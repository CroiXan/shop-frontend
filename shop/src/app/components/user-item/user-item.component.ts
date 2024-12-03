import { Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css'
})
export class UserItemComponent {

  @Input() userData!: User;
  roles = ['user', 'admin', 'editor'];
  showConfirm: boolean = false;
  formUser!: FormGroup;

  constructor(private formBuilder: FormBuilder, private userservice: UserService) { }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      selector: [this.userData.role]
    });
  }
  
  updateRole(): void {
    this.userservice.changeRole(this.userData.id_user,this.formUser.get('selector')?.value).subscribe({
      next: response2 => {
        alert("Se ha actualizado el usuario");
        this.showConfirm = false;
      },
      error: error => {
        alert("Error al actualizar usuario");
        this.formUser.get('selector')?.setValue(this.userData.role);
      },
    });
  }

  onValueChange() {
    this.showConfirm = this.formUser.get('selector')?.value != this.userData.role && this.userservice.getCurrentUser().role == "admin";
  }
}
