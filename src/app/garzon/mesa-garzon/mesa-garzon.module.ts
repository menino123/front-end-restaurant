import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaGarzonPageRoutingModule } from './mesa-garzon-routing.module';

import { MesaGarzonPage } from './mesa-garzon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaGarzonPageRoutingModule
  ],
  declarations: [MesaGarzonPage]
})
export class MesaGarzonPageModule {}
