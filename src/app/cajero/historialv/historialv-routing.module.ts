import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialvPage } from './historialv.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialvPage,
  },
  {
    path: 'modal-detalle',
    loadChildren: () => import('./modal-detalle/modal-detalle.module').then( m => m.ModalDetallePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialvPageRoutingModule {}
