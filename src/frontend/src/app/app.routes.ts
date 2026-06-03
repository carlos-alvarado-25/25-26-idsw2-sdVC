import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ListarGradosComponent } from './features/admin/grados/listar-grados/listar-grados.component';
import { GradoFormComponent } from './features/admin/grados/grado-form/grado-form.component';
import { ImportarGradosComponent } from './features/admin/grados/importar-grados/importar-grados.component';
import { ListarAsignaturasComponent } from './features/admin/asignaturas/listar-asignaturas/listar-asignaturas.component';
import { AsignaturaFormComponent } from './features/admin/asignaturas/asignatura-form/asignatura-form.component';
import { ImportarAsignaturasComponent } from './features/admin/asignaturas/importar-asignaturas/importar-asignaturas.component';
import { ListarAulasComponent } from './features/admin/aulas/listar-aulas/listar-aulas.component';
import { AulaFormComponent } from './features/admin/aulas/aula-form/aula-form.component';
import { ImportarAulasComponent } from './features/admin/aulas/importar-aulas/importar-aulas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin/grados', component: ListarGradosComponent },
  { path: 'admin/grados/crear', component: GradoFormComponent },
  { path: 'admin/grados/editar/:id', component: GradoFormComponent },
  { path: 'admin/grados/importar', component: ImportarGradosComponent },
  { path: 'admin/asignaturas', component: ListarAsignaturasComponent },
  { path: 'admin/asignaturas/crear', component: AsignaturaFormComponent },
  { path: 'admin/asignaturas/editar/:id', component: AsignaturaFormComponent },
  { path: 'admin/asignaturas/importar', component: ImportarAsignaturasComponent },
  { path: 'admin/aulas', component: ListarAulasComponent },
  { path: 'admin/aulas/crear', component: AulaFormComponent },
  { path: 'admin/aulas/editar/:id', component: AulaFormComponent },
  { path: 'admin/aulas/importar', component: ImportarAulasComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
