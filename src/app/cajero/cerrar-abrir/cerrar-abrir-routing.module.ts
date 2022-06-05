import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CerrarAbrirPage } from './cerrar-abrir.page';

const routes: Routes = [
  {
    path: '',
    component: CerrarAbrirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CerrarAbrirPageRoutingModule {}
