/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { ResMesaGarzonPage } from '../res-mesa-garzon/res-mesa-garzon.page';

@Component({
  selector: 'app-mesa-garzon',
  templateUrl: './mesa-garzon.page.html',
  styleUrls: ['./mesa-garzon.page.scss'],
})
export class MesaGarzonPage implements OnInit {

  token = localStorage.getItem('token');
  public mesas: any;
  public caja: any;
  public carta: any;
  public estadoCaja: any;

  constructor(private SMS: ServicioMesaService, private modalCtrl: ModalController,public alertController: AlertController,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,
    private router: Router,
    public http: HttpClient) { }

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

  getFecha(cod_mesa){
    const index = this.mesas.findIndex(mesa => mesa.cod_mesa === cod_mesa);
    const res_mesa = this.mesas[index];
    return (this.getHora(res_mesa.pedido.detalle[0].inicio));
  }

  nada(){
    console.log('..');
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
    this.router.navigate(['garzon/pedido-garzon']);
    localStorage.setItem('cod_mesa', res_mesa.cod_mesa);
    //localStorage.setItem('desde', '2'); // 1 -> Agregar un nuevo pedido
    //|2 -> Agregar un nuevo pedido en una mesa disponible
    //| 3 -> Agregar un pedido en una mesa ocupada
  }

  async detalleMesa(cod_mesa){
    const index = this.mesas.findIndex(mesa => mesa.cod_mesa === cod_mesa);
    const res_mesa = this.mesas[index];
    this.modalResMesas(res_mesa);
  }

  async modalResMesas(res_mesa){

    const modal = await this.modalCtrl.create({
      component: ResMesaGarzonPage,
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.2,
      componentProps:{
        nombre: 'Resumen de mesa',
        pedidosDeMesa: res_mesa,
        carta: this.carta
        }

    });

    await modal.present();

  }

}
