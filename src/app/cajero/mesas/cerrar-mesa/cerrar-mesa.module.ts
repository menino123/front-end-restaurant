import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CerrarMesaPageRoutingModule } from './cerrar-mesa-routing.module';

import { CerrarMesaPage } from './cerrar-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CerrarMesaPageRoutingModule,

  ],
  declarations: [CerrarMesaPage]
})
export class CerrarMesaPageModule {}
