import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleOrdenComponent } from './pages/catalogo/detalle-orden/detalle-orden.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


const routes: Routes = [
  { // TODO Hasta que se implemente login para modificar el pathMatch: 'full
    path: '', redirectTo: 'catalogo', pathMatch: 'full'
  },
  {
    path: 'catalogo', component: CatalogoComponent,
    children: [
      { path: 'detalle', component: DetalleOrdenComponent}
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
