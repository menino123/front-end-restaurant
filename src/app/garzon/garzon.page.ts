/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { ResMesaGarzonPage } from './res-mesa-garzon/res-mesa-garzon.page';

@Component({
  selector: 'app-garzon',
  templateUrl: './garzon.page.html',
  styleUrls: ['./garzon.page.scss'],
})
export class GarzonPage implements OnInit {

  nombre = localStorage.getItem('nombre');
  apellido = localStorage.getItem('apellido');
  notificacion: any;

  constructor(private SMS: ServicioMesaService,
    private router: Router) { }

  ngOnInit() {

    this.SMS.getnotificacion$().subscribe(n => {
      this.notificacion = n;
      if(this.notificacion === []){
        this.SMS.getMesas();
      }
    });

  }

  async logOut(){
    this.SMS.logOut();
    localStorage.clear();
    localStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  notif_nueva(){
    return this.notificacion.filter(x => x.nueva).length;
  }



}
