import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ManagementComponent } from './components/management/management.component';
import { authGuard } from './auth.guard';
import { PassResetRequestComponent } from './components/pass-reset-request/pass-reset-request.component';
import { PassResetComponent } from './components/pass-reset/pass-reset.component';

export const routes: Routes = [
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-contrasena', component: PassResetRequestComponent },
    { path: 'cambiar-contrasena', component: PassResetComponent },
    { path: 'perfil', component: ManagementComponent, canActivate: [authGuard] }
];
