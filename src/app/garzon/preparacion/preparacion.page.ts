/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preparacion',
  templateUrl: './preparacion.page.html',
  styleUrls: ['./preparacion.page.scss'],
})
export class PreparacionPage implements OnInit {

  token = localStorage.getItem('token');
  public valueSelected: any;
  public platos: any;
  public mesas: any;
  public delivery: any;

  constructor(public alertController: AlertController,
    public router: Router,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,public http: HttpClient,
    public SMS: ServicioMesaService) {

      this.mesas = [];
      this.delivery = [];

      this.SMS.getMesas().then(x =>{

        console.log('Desde preparación', x);

        this.SMS.getMesas$().subscribe(m => {
          this.mesas = m;
        });

        this.SMS.getDelivery$().subscribe(d => {
          this.delivery = d;
          this.getPlatos();
          //setTimeout(() => {this.getPlatos();}, 500);
        });

      });
     }

  ngOnInit() {
  }

  cambio(event: any){
    this.valueSelected = event.target.value;
  }

  filter_estado(estado){

    return this.platos.filter(plato => plato.estado === estado).sort((a, b) =>
    (estado === 'Listo' || estado === 'Cancelado' ? Date.parse(b.fin) - Date.parse(a.fin) : Date.parse(a.inicio) - Date.parse(b.inicio)));

  }

  getTipo(tipo){
    return (Number(tipo) === 1 ? 'Mesa' : 'Delivery');
  }

  getHora(fecha){

    return (fecha.split(' ')[1]);

  }

  getPlatos(){

    this.platos = [];

      let index = -1;
      try{
      this.mesas.forEach(mesa => {
          this.platos = [...this.platos, ...(mesa.pedido.detalle === undefined ? [] : mesa.pedido.detalle.map(
            function(plato) {
                index++;
                return ({   tipo: 1,
                            cantidad: plato.cantidad,
                            cod_mesa: mesa.cod_mesa,
                            cod_pedido: mesa.cod_pedido,
                            id_detalle: index,
                            nombre: plato.nombre,
                            inicio: plato.inicio,
                            fin: plato.fin,
                            estado: plato.estado,
                            responsable: plato.responsable,
                            detalle: (plato.detalle === null ? 'Sin detalle de preparación.' : plato.detalle)
                        });
            })
          )];

          index = -1;
      });

      index = -1;

      this.delivery.forEach(deli => {
        this.platos = [...this.platos, ...(deli.pedido.detalle === undefined ? [] : deli.pedido.detalle.map(
          function(plato) {
              index++;
              return ({   tipo: 2,
                          cantidad: plato.cantidad,
                          cod_mesa: deli.cod_mesa,
                          cod_pedido: deli.cod_pedido,
                          id_detalle: index,
                          nombre: plato.nombre,
                          inicio: plato.inicio,
                          fin: plato.fin,
                          estado: plato.estado,
                          responsable: plato.responsable,
                          detalle: (plato.detalle === null ? 'Sin detalle de preparación.' : plato.detalle)
                      });
          })
        )];

        index = -1;
    });

    this.platos = this.platos.filter(x => x.responsable === 6); // Filtra platos que se preparen en cocina
      console.log('Tamaño plato: ', this.platos.length);

    }
    catch(err){
      console.log('....', err);
    }
  }

  async modPedido(num, tipo_p, id_pedido, indice, estado, plato){

    if(estado === 'En preparación'){

      const data = {
        token: this.token,
        tipo: tipo_p,
        cod_pedido: Number(id_pedido),
        index_detalle: Number(indice),
        status: Number(num)
      };

      console.log('Se envía desde CHEF: ', data);

      const alert = await this.alertController.create({
        header:'Confirmación',
        message: 'Desea cambiar de estado a '+(num === 1 ? 'Listo' : 'Cancelado')+
        ' el pedido ['+id_pedido+'] <br><br>'+'x'+plato.cantidad+' '+plato.nombre,
        buttons: [
          {text:'Cancelar'},
          {text:'Confirmar',
          handler: async ()=> {
            const loading = await this.loadingController.create({
              message: 'Enviando...'
            });

            await loading.present();

            console.log('Se envía desde CHEF: ', data);

            this.http.post(environment.apiSetStatus, data).subscribe(async (res: any)=>{

              await loading.dismiss();

              if(res.status){
                console.log('TERMINADO');
              }
              else{
                console.log('ERROR: ', res);
              }

            });
            }
          }
        ]
      });

      await alert.present();

    }

  }

}
