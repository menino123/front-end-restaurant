import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-resdelivery',
  templateUrl: './resdelivery.component.html',
  styleUrls: ['./resdelivery.component.scss'],
})
export class ResdeliveryComponent implements OnInit {

  public resDelivery: any;
  public valueSelected;

  constructor(public actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private http: HttpClient, public alertController: AlertController,
    public router: Router,
    public loadingController: LoadingController) {

      this.valueSelected = '1';
     }

  ngOnInit() {
    this.resDelivery = this.navParams.get('res_deli');
  }

  cambio(event: any){
    this.valueSelected = event.target.value;
  }

  getFechaOrdenada(fecha){

    const fexa = fecha.split(' ')[1];
    const fexa2 = fecha.split(' ')[0];
    const hora = fexa.split(':')[0];
    const minuto = fexa.split(':')[1];

    return (hora+':'+minuto+' - '+fexa2.split('-')[2]+'/'+fexa2.split('-')[1]+'/'+fexa2.split('-')[0]);

  }

  getEstado(estado){
    return this.resDelivery.pedido.detalle.filter(x => x.estado === estado);
  }

}
