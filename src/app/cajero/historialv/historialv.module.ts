import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonicModule } from '@ionic/angular';

import { HistorialvPageRoutingModule } from './historialv-routing.module';

import { HistorialvPage } from './historialv.page';
import { ModalDetallePage } from './modal-detalle/modal-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialvPageRoutingModule,
    ReactiveFormsModule,
    ScrollingModule
  ],
  declarations: [HistorialvPage, ModalDetallePage]
})
export class HistorialvPageModule {}
