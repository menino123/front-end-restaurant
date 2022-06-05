import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreparacionPage } from './preparacion.page';

const routes: Routes = [
  {
    path: '',
    component: PreparacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreparacionPageRoutingModule {}
