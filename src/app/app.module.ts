import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ResMesaComponent } from './cajero/mesas/res-mesa/res-mesa.component';
import { CerrarMesaPage } from './cajero/mesas/cerrar-mesa/cerrar-mesa.page';
import { ServicioMesaService } from './service/servicio-mesa.service';

import { SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ResdeliveryComponent } from './cajero/para-llevar/resdelivery/resdelivery.component';
import { CommonModule } from '@angular/common';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

const config: SocketIoConfig = {url: environment.apiSocket, options:{}};


@NgModule({
  declarations: [AppComponent, ResMesaComponent, ResdeliveryComponent],
  entryComponents: [],
  imports: [CommonModule, BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule,
  SocketIoModule.forRoot(config)],
  providers: [LocalNotifications, HttpClient, ServicioMesaService,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
