import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Shared/home/home.component';
import { LoginComponent } from './Autenticacion/components/login/login.component';
import { RolesGuard } from './Autenticacion/roles.guard';
import { BolsaComponent } from './Prudcto/Bolsa/bolsa/bolsa.component';
import { FormBolsaComponent } from './Prudcto/Bolsa/form-bolsa/form-bolsa.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'producto/bolsa', component: BolsaComponent },
  { path: 'producto/bolsa/nuevo', component: FormBolsaComponent },
  { path: 'producto/bolsa/editar/:id', component: FormBolsaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
