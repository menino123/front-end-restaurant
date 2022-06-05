/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
})
export class NotificacionPage implements OnInit {

  nombre = localStorage.getItem('nombre');
  apellido = localStorage.getItem('apellido');
  public valueSelected;
  public notificacion = [];


  constructor(private SMS: ServicioMesaService, private modalCtrl: ModalController,public alertController: AlertController,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,
    private router: Router,
    public http: HttpClient) {
      this.valueSelected = '1';

      this.SMS.getMesas().then(x =>{

        this.SMS.getnotificacion$().subscribe(d => {
          this.notificacion = d;
          //setTimeout(() => {this.getPlatos();}, 500);
        });

      });
  }

ngOnInit() {

}

cambiaEstado(id){
  this.SMS.cambia_estado_notif(id);
}



filter_notif(notificacion, nueva){
  return notificacion.filter(x => (nueva ? x.nueva : !x.nueva));
}

cambio(event: any){
  this.valueSelected = event.target.value;
  console.log(this.valueSelected);
}


}


