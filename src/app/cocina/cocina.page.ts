/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ServicioMesaService } from '../service/servicio-mesa.service';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.page.html',
  styleUrls: ['./cocina.page.scss'],
})
export class CocinaPage implements OnInit {

  token = localStorage.getItem('token');
  public platos: any;
  public mesas: any;
  public delivery: any;
  public valueSelected;


  constructor(public alertController: AlertController,
    public router: Router,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,public http: HttpClient,
    public SMS: ServicioMesaService) {

      this.platos = [];
      this.mesas = [];
      this.delivery = [];
      this.valueSelected = '1';
      this.SMS.getMesas().then(x =>{

        console.log('asdsd', x);

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

  //Eliminar redundancia de atributos tipo_p, id_pedido, indice, estado
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
                //TODO:TODO:TODO: COMPROBAR MENSAJE DE ERROR, APLICAR A TODAS LAS CONSULTAS TODO:TODO:TODO:
                if(res.message === 'Rol no autorizado para la operación.'){
                  const redireccion = await this.loadingController.create({
                    id: 'redireccion',
                    message: `NO AUTORIZADO PARA LA OPERACIÓN<br><br>

                    Redireccionando....`
                  });

                  await redireccion.present();
                  setTimeout(() => this.credencialInvalida(), 1000);

                }
                else{
                  await loading.dismiss();
                  const alerta = await this.alertController.create({
                    header:'Aviso',
                    message: res.message,
                    buttons: ['Aceptar']
                  });

                  await alerta.present();
                }
                //TODO:TODO:TODO:
              }

            });
            }
          }
        ]
      });

      await alert.present();

    }

  }

  async credencialInvalida(){
    await this.loadingController.dismiss('redireccion');
    localStorage.clear();
    this.router.navigate(['/login']);
    //Refrescar página
  }

}
