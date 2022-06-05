import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetallePage } from './modal-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetallePageRoutingModule {}
