import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GarzonPage } from './garzon.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mesa-garzon',
    pathMatch:'full'
  },
  {
    path: '',
    component: GarzonPage,
    children:[{
      path: 'pedido-garzon',
      loadChildren: () => import('./pedido-garzon/pedido-garzon.module').then( m => m.PedidoGarzonPageModule)
    },
    {
      path: 'res-mesa-garzon',
      loadChildren: () => import('./res-mesa-garzon/res-mesa-garzon.module').then( m => m.ResMesaGarzonPageModule)
    },
    {
      path: 'mesa-garzon',
      loadChildren: () => import('./mesa-garzon/mesa-garzon.module').then( m => m.MesaGarzonPageModule)
    },
    {
      path: 'notificacion',
      loadChildren: () => import('./notificacion/notificacion.module').then( m => m.NotificacionPageModule)
    },
    {
      path: 'preparacion',
      loadChildren: () => import('./preparacion/preparacion.module').then( m => m.PreparacionPageModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GarzonPageRoutingModule {}
