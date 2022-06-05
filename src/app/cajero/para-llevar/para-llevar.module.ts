import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParaLlevarPageRoutingModule } from './para-llevar-routing.module';

import { ParaLlevarPage } from './para-llevar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParaLlevarPageRoutingModule
  ],
  declarations: [ParaLlevarPage]
})
export class ParaLlevarPageModule {}
