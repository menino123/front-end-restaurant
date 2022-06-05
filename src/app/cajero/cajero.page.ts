/* eslint-disable no-trailing-spaces */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { ServicioMesaService } from '../service/servicio-mesa.service';

@Component({
  selector: 'app-cajero',
  templateUrl: './cajero.page.html',
  styleUrls: ['./cajero.page.scss'],
})
export class CajeroPage implements OnInit {


  nombre = localStorage.getItem('nombre');
  apellido = localStorage.getItem('apellido');
  cod_mesa = localStorage.getItem('cod_mesa');
  desde = Number(localStorage.getItem('desde'));
  token = localStorage.getItem('token');
  //todo = localStorage.getItem('todo');
  public items: any;
  public mesas: any;
  public caja: any;

  constructor(public alertController: AlertController,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,
    private router: Router,
    public http: HttpClient,
    public SMS: ServicioMesaService) {

     }

  ngOnInit() {

    //document.getElementById('cname').innerHTML = this.nombre+' '+this.apellido;
    //this.getMesas();
    //TODO: CORREGIR SOCKET AL INICiaR SESION TODO:
  }

  async logOut(){
    this.SMS.logOut();
    localStorage.clear();
    localStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /*async getMesas(){
    const uToken = {
      token: this.token,
    };
    this.http.post(environment.apiGetMesa, uToken).subscribe(async (res: any)=>{
      this.mesas = res.mesas;
    });
  }*/


}
