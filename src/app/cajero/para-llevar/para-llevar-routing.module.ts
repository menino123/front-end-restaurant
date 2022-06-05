import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParaLlevarPage } from './para-llevar.page';

const routes: Routes = [
  {
    path: '',
    component: ParaLlevarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParaLlevarPageRoutingModule {}
