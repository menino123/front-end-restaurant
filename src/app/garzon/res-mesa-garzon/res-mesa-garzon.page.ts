/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-res-mesa-garzon',
  templateUrl: './res-mesa-garzon.page.html',
  styleUrls: ['./res-mesa-garzon.page.scss'],
})
export class ResMesaGarzonPage implements OnInit {

  public pedidosMesa: any;
  public valueSelected;
  public garzon: any;
  public res_mesa: any;
  public comprobacion_pedido: any;
  public carta: any;

  constructor(public actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public router: Router,
    public loadingController: LoadingController) {

      this.valueSelected = '1';

    }

  ngOnInit() {

    this.pedidosMesa = this.navParams.get('pedidosDeMesa');
    this.res_mesa = this.pedidosMesa.pedido.detalle;
    console.log('pedidosMesa', this.pedidosMesa);
    console.log('res_mesa', this.res_mesa);
    this.comprobacion_pedido = (this.res_mesa.length === this.res_mesa.filter(x => x.estado === 'Cancelado').length);

  }

  agregaPedido(){
    this.router.navigate(['/garzon/pedido-garzon']);
    localStorage.setItem('cod_mesa',this.pedidosMesa.cod_mesa);
    this.modalCtrl.dismiss();
  }

  cambio(event: any){
    this.valueSelected = event.target.value;
  }

  getEstado(estado){
    return this.res_mesa.filter(x => x.estado === estado);
  }

}
