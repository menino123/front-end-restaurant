/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { environment } from 'src/environments/environment';
import { CerrarMesaPage } from '../cerrar-mesa/cerrar-mesa.page';

@Component({
  selector: 'app-res-mesa',
  templateUrl: './res-mesa.component.html',
  styleUrls: ['./res-mesa.component.scss'],
})
export class ResMesaComponent implements OnInit {

  public pedidosMesa: any;
  public valueSelected;
  public garzon: any;
  public res_mesa: any; //xd
  public comprobacion_pedido: any;
  public carta: any;
  token = localStorage.getItem('token');

  constructor(public actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private http: HttpClient, public alertController: AlertController,
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
    this.router.navigate(['/cajero/pedido']);
    localStorage.setItem('garzon', this.pedidosMesa.garzon);
    localStorage.setItem('cod_mesa',this.pedidosMesa.cod_mesa);
    localStorage.setItem('desde', '3'); // 1 -> Agregar un nuevo pedido
    //|2 -> Agregar un nuevo pedido en una mesa disponible | 3 -> Agregar un pedido en una mesa ocupada
    this.modalCtrl.dismiss();
  }

  cambio(event: any){
    this.valueSelected = event.target.value;
  }

  getEstado(estado){
    return this.res_mesa.filter(x => x.estado === estado);
  }

  async modalCerrarMesa(){

    localStorage.setItem('desde', '2');

    if(!this.comprobacion_pedido){
      this.modalCtrl.dismiss();

      const modal = await this.modalCtrl.create({
        component: CerrarMesaPage,
        cssClass: 'modal-cmesa',
        id:'modalCM',
        componentProps:{
          nombre: 'Cerrar mesa',
          pedidosDeMesa: this.pedidosMesa,
          }

      });

      await modal.present();

    }
    else{
      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'El pedido no tiene detalles de venta',
        buttons: [{text:'Liberar Mesa',
        handler: async ()=> {
          const data ={
            token: this.token,
            cod_mesa: this.pedidosMesa.cod_mesa
          };
          const loading = await this.loadingController.create({
            message: 'Liberando mesa...'
          });

          await loading.present();

          console.log('Se envía: ',data);

          this.http.post(environment.apiLiberaMesa, data).subscribe(async (res: any) =>{
            console.log('ingresa a funcion');
            await loading.dismiss();

            if(res.status){
              await loading.dismiss();
              this.modalCtrl.dismiss();
            }
            else{
              console.log('ERROR, SE RECIBE: ', res);
            }
          }, async err => {

            const asd = await this.alertController.create({
              header:'Error',
              message: 'Problemas de conexión'+err,
              buttons: ['Aceptar']});

              await asd.present();

          });

        }
      },
    {text:'Esperar'}]
      });
      await alert.present();
    }

  }



}
