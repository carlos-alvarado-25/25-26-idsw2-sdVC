import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ListarGradosComponent } from './features/admin/grados/listar-grados/listar-grados.component';
import { GradoFormComponent } from './features/admin/grados/grado-form/grado-form.component';
import { ImportarGradosComponent } from './features/admin/grados/importar-grados/importar-grados.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin/grados', component: ListarGradosComponent },
  { path: 'admin/grados/crear', component: GradoFormComponent },
  { path: 'admin/grados/editar/:id', component: GradoFormComponent },
  { path: 'admin/grados/importar', component: ImportarGradosComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
