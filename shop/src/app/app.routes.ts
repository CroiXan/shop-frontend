import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ManagementComponent } from './components/management/management.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'perfil', component: ManagementComponent, canActivate: [authGuard] }
];
