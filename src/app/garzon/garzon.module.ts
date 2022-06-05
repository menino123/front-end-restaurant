import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GarzonPageRoutingModule } from './garzon-routing.module';

import { GarzonPage } from './garzon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GarzonPageRoutingModule
  ],
  declarations: [GarzonPage]
})
export class GarzonPageModule {}
