import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesaGarzonPage } from './mesa-garzon.page';

const routes: Routes = [
  {
    path: '',
    component: MesaGarzonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesaGarzonPageRoutingModule {}
