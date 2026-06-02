import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ListarGradosComponent } from './features/admin/grados/listar-grados/listar-grados.component';
import { CrearGradoComponent } from './features/admin/grados/crear-grado/crear-grado.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin/grados', component: ListarGradosComponent },
  { path: 'admin/grados/crear', component: CrearGradoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
