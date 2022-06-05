/* eslint-disable no-underscore-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { ResMesaComponent } from './res-mesa/res-mesa.component';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {

  token = localStorage.getItem('token');
  public mesas: any;
  public caja: any;
  public carta: any;
  public estadoCaja: any;


  constructor(private SMS: ServicioMesaService, private modalCtrl: ModalController,public alertController: AlertController,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,
    private router: Router,
    public http: HttpClient) {

     }

  ngOnInit() {

    this.SMS.getMesas$().subscribe(m => {
      this.mesas = m;
    });

    if(this.mesas === undefined) {

      this.SMS.getMesas();
    }

    this.SMS.getCaja$().subscribe(c => {
      this.caja = c;});

  }

  async getMesas(){
    const uToken = {
      token: this.token,
    };
    this.http.post(environment.apiGetMesa, uToken).subscribe(async (res: any)=>{

      this.mesas = res.mesas;
    });
  }

  async detalleMesa(cod_mesa){
    const index = this.mesas.findIndex(mesa => mesa.cod_mesa === cod_mesa);
    const res_mesa = this.mesas[index];
    this.modalResMesas(res_mesa);
  }

  getFecha(cod_mesa){
    const index = this.mesas.findIndex(mesa => mesa.cod_mesa === cod_mesa);
    const res_mesa = this.mesas[index];
    return (this.getHora(res_mesa.pedido.detalle[0].inicio));
  }

  getHora(fecha){

    const fexa = fecha.split(' ')[1];
    const fexa2 = fecha.split(' ')[0];
    const hora = fexa.split(':')[0];
    const minuto = fexa.split(':')[1];

    return (hora+':'+minuto+' - '+fexa2.split('-')[2]+'/'+fexa2.split('-')[1]+'/'+fexa2.split('-')[0]);

  }

  async agregarPedido(cod_mesa)
  { const index = this.mesas.findIndex(mesa => mesa.cod_mesa === cod_mesa);
    const res_mesa = this.mesas[index];
    this.router.navigate(['/cajero/pedido']);
    localStorage.setItem('cod_mesa', res_mesa.cod_mesa);
    localStorage.setItem('desde', '2'); // 1 -> Agregar un nuevo pedido
    //|2 -> Agregar un nuevo pedido en una mesa disponible
    //| 3 -> Agregar un pedido en una mesa ocupada
  }

  async modalResMesas(res_mesa){

    const modal = await this.modalCtrl.create({
      component: ResMesaComponent,
      cssClass: 'modal-rmesa',
      componentProps:{
        style:{
          animated: false,
        },
        nombre: 'Resumen de mesa',
        pedidosDeMesa: res_mesa,
        carta: this.carta
        }

    });

    await modal.present();

  }

}
