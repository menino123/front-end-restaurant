import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResMesaGarzonPageRoutingModule } from './res-mesa-garzon-routing.module';

import { ResMesaGarzonPage } from './res-mesa-garzon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResMesaGarzonPageRoutingModule
  ],
  declarations: [ResMesaGarzonPage]
})
export class ResMesaGarzonPageModule {}
