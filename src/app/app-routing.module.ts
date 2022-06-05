import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cajero',
    loadChildren: () => import('./cajero/cajero.module').then( m => m.CajeroPageModule)
  },
  {
    path: 'garzon',
    loadChildren: () => import('./garzon/garzon.module').then( m => m.GarzonPageModule)
  },
  {
    path: 'gerente',
    loadChildren: () => import('./gerente/gerente.module').then( m => m.GerentePageModule)
  },
  {
    path: 'cocina',
    loadChildren: () => import('./cocina/cocina.module').then( m => m.CocinaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
