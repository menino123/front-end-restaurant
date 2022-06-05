import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoGarzonPage } from './pedido-garzon.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoGarzonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoGarzonPageRoutingModule {}
