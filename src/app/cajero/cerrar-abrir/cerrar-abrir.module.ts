import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CerrarAbrirPageRoutingModule } from './cerrar-abrir-routing.module';

import { CerrarAbrirPage } from './cerrar-abrir.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CerrarAbrirPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CerrarAbrirPage]
})
export class CerrarAbrirPageModule {}
