import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesasPage } from './mesas.page';

const routes: Routes = [
  {
    path: '',
    component: MesasPage
  },
  {
    path: 'cerrar-mesa',
    loadChildren: () => import('./cerrar-mesa/cerrar-mesa.module').then( m => m.CerrarMesaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesasPageRoutingModule {}
