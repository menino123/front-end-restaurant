import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CerrarMesaPage } from './cerrar-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: CerrarMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CerrarMesaPageRoutingModule {}
