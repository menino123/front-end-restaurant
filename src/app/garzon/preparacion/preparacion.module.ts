import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreparacionPageRoutingModule } from './preparacion-routing.module';

import { PreparacionPage } from './preparacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreparacionPageRoutingModule
  ],
  declarations: [PreparacionPage]
})
export class PreparacionPageModule {}
