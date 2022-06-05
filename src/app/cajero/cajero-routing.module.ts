import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CajeroPage } from './cajero.page';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'mesas',
    pathMatch:'full'
  },
  {
    path:'',
    component: CajeroPage,
    children:[
      {path: 'mesas',
      loadChildren: () => import('./mesas/mesas.module').then( m => m.MesasPageModule)
      },
      {
        path: 'historialv',
        loadChildren: () => import('./historialv/historialv.module').then( m => m.HistorialvPageModule)
      },
      {
        path: 'pedido',
        loadChildren: () => import('./pedido/pedido.module').then( m => m.PedidoPageModule)
      },
      {
        path: 'cerrar-abrir',
        loadChildren: () => import('./cerrar-abrir/cerrar-abrir.module').then( m => m.CerrarAbrirPageModule)
      },
      {
        path: 'para-llevar',
        loadChildren: () => import('./para-llevar/para-llevar.module').then( m => m.ParaLlevarPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajeroPageRoutingModule {}
