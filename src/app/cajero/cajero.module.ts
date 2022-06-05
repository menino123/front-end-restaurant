import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CajeroPageRoutingModule } from './cajero-routing.module';

import { CajeroPage } from './cajero.page';
import { MesasPage } from './mesas/mesas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CajeroPageRoutingModule,
  ],
  declarations: [CajeroPage]
})
export class CajeroPageModule {}
