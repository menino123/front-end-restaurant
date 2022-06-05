import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResMesaGarzonPage } from './res-mesa-garzon.page';

const routes: Routes = [
  {
    path: '',
    component: ResMesaGarzonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResMesaGarzonPageRoutingModule {}
