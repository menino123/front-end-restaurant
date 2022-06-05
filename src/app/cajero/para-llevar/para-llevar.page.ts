/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { environment } from 'src/environments/environment';
import { ResdeliveryComponent } from './resdelivery/resdelivery.component';

@Component({
  selector: 'app-para-llevar',
  templateUrl: './para-llevar.page.html',
  styleUrls: ['./para-llevar.page.scss'],
})
export class ParaLlevarPage implements OnInit {

  token = localStorage.getItem('token');
  public delivery: any;
  public caja: any;
  public estadoCaja: any;
  public unCancelado: any;

  constructor(private SMS: ServicioMesaService, private modalCtrl: ModalController,public alertController: AlertController,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,
    private router: Router,
    public http: HttpClient) { }

  async ngOnInit() {

    if(this.delivery === undefined){
      await this.SMS.getMesas();
    }

    this.SMS.getCaja$().subscribe(c => {
      this.caja = c;
    });

    this.SMS.getDelivery$().subscribe( async d => {

      this.delivery = d;
      this.delivery.sort((a, b) => Date.parse(b.fecha_inicio) - Date.parse(a.fecha_inicio));
    });

  }

  getHora(fecha){


    const fexa = fecha.split(' ')[1];
    const fexa2 = fecha.split(' ')[0];
    const hora = fexa.split(':')[0];
    const minuto = fexa.split(':')[1];
    return (hora+':'+minuto+' - '+fexa2.split('-')[2]+'/'+fexa2.split('-')[1]+'/'+fexa2.split('-')[0]);

  }

  getEstado(count){

    this.unCancelado = count.cancelado;

    if(count.preparacion !== 0){
      return 'En preparación';
    }
    else{
      return 'Finalizado';
    }

  }

  /*getEstado(cod_pedido){

    const index = this.delivery.findIndex(d => d.cod_pedido === cod_pedido);
    const fecha_fin = this.delivery[index].fecha_fin;

    if(fecha_fin !== null){
      return this.estado = 'Finalizado';
    }
    else{
     return this.estado ='En preparación';
    }

  }*/

  async agregarPedido()
  {
    this.router.navigate(['/cajero/pedido']);
    localStorage.setItem('desde', '1');
  }

  async detalleDelivery(cod_pedido){
    const index = this.delivery.findIndex(d => d.cod_pedido === cod_pedido);
    const res_delivery = this.delivery[index];
    this.modalResDelivery(res_delivery);
  }

  async modalResDelivery(res_delivery){

    const modal = await this.modalCtrl.create({
      component: ResdeliveryComponent,
      cssClass: 'modal-rmesa',
      componentProps:{
        style:{
          animated: false,
        },
        nombre: 'Res Delivery',
        res_deli: res_delivery
        }

    });

    await modal.present();

  }


}
