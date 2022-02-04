import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleOrdenComponent } from './pages/catalogo/detalle-orden/detalle-orden.component';
import { LoginComponent } from './pages/login/login.component';
import { RestrablecerContrasenaComponent } from './pages/login/restrablecer-contrasena/restrablecer-contrasena.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full',
  },
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'recuperar-contrasena', component: RestrablecerContrasenaComponent
  },
  {
    path: 'catalogo', component: CatalogoComponent,
    children: [
      { path: 'detalle', component: DetalleOrdenComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
