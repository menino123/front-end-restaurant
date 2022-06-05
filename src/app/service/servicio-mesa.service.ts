/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { NumberValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ServicioMesaService {

  token = localStorage.getItem('token');
  message = '' ;
  res: any;

  private mesas: any;
  private caja: any;
  private delivery: any;
  private notificacion = [];

  private notificacion$: BehaviorSubject<any>;
  private mesas$: BehaviorSubject<any>;
  private caja$: BehaviorSubject<any>;
  private delivery$: BehaviorSubject<any>; //Almacena temporalmente el ultimo dato almacenado en esta variable.

  private control_bool = true;

  constructor(public http: HttpClient, private socket: Socket, public alertController: AlertController,
    public localNotifications: LocalNotifications) {
    this.mesas$ = new BehaviorSubject(this.mesas);
    this.caja$ = new BehaviorSubject(this.caja);
    this.delivery$ = new BehaviorSubject(this.delivery);
    this.notificacion$ = new BehaviorSubject(this.notificacion);

    this.socketConn();
  }

  setToken(token){
    this.token = token;
  }



  async socketConn(){
    this.socket.connect();
    const idU = this.token;
    console.log('Token de Servicio: ', idU);

    //this.socket.emit('elemento a rellenar', this.token);

    this.socket.fromEvent('update-tables').subscribe(async (res: any) =>{

      console.log('SE RECIBE DESDE SOCKET: ', res);

      if(res.status){
        this.mesas = res.mesas;
        this.caja = res.caja;
        this.delivery = res.delivery;
        this.mesas$.next(this.mesas);
        this.caja$.next(this.caja);
        this.delivery$.next(this.delivery);
        if(localStorage.getItem('rol_en_uso') === '5')
        {   this.compNotif(res.mesas);
        }

        //console.log('MESAS DESDE SERVICIO: ', this.mesas);
      }
      else{
        console.log('Mensaje de error: ', res.message);
        const alert = await this.alertController.create({
          header:'ERROR',
          message: 'Error: '+ res.message,
          buttons: ['Aceptar']
        });

        await alert.present();
      }

    }, async err =>{
      console.log('Problemas de comunicación con el servidor. Error: ', err);


      const alert = await this.alertController.create({
        header:'ERROR',
        message: 'Problemas de comunicación con el servidor. Error: '+ err,
        buttons: ['Aceptar']
      });

      await alert.present();

    });

  }

  async getMesas(){
    const uToken = {
      token: this.token
    };

    //this.socket.emit('update-tables', this.token);
    return new Promise(resolve => {
        this.http.post(environment.apiGetMesa, uToken).subscribe(async (res: any)=>{


            this.mesas = res.mesas;
            this.caja = res.caja;
            this.delivery = res.delivery;
            this.mesas$.next(this.mesas);
            this.caja$.next(this.caja);
            this.delivery$.next(this.delivery);
            if(localStorage.getItem('rol_en_uso') === '5')
            {   this.compNotif(res.mesas);
            }
            console.log('MESAS DESDE SERVICIO: ', this.mesas);
            console.log('DELIVERY DESDE SERVICIO: ', this.delivery);
            resolve(res);

          }, async err =>{
            console.log('Fallo de conexión', err);

          });
    });
  }



  async generar_notificacion_entrante(mesas: any)
  { //let id_notificacion = 0;
    let notificacion_entrante =
    mesas.filter(x => x.garzon === `${localStorage.getItem('nombre')} ${localStorage.getItem('apellido')
                      }`).
                        map((x) => {
                          let index = 0;
                          return( x.pedido.detalle.map((c) => {
                            const json =
                              { cod_mesa: x.cod_mesa,
                                //id_notificacion,
                                garzon: x.garzon, // debería ser único
                                id_detalle: index,
                                estado: c.estado,
                                nombre: c.nombre,
                                cantidad: c.cantidad,
                                responsable: c.responsable,
                                agregado_por: c.agregado_por,
                                ultima_mod: c.ultima_mod,
                                inicio: c.inicio,
                                nueva: !this.control_bool,//true,
                                fin: c.fin
                              };
                              index++;
                              //id_notificacion++;
                              return ( json );
                          }).filter(json => json.estado !== 'En preparación' || json.garzon !== json.responsable));
                        });

    notificacion_entrante = [].concat.apply([], notificacion_entrante).sort((a, b) =>
      Date.parse(b.ultima_mod) - Date.parse(a.ultima_mod));

    if(this.control_bool)
    { this.control_bool = false;
      return( notificacion_entrante);
    }
    else
    { const nuevas_notificaciones = [];
      await new Promise (resolve => {
        for (let i = 0; i < notificacion_entrante.length; i++) {
          if(this.notificacion.findIndex(x =>
              x.ultima_mod === notificacion_entrante[i].ultima_mod &&
              x.cod_mesa === notificacion_entrante[i].cod_mesa &&
              notificacion_entrante[i].cod_pedido === x.cod_pedido) === -1
            )
          { console.log('entre ah', notificacion_entrante[i]);
            nuevas_notificaciones.push(notificacion_entrante[i]);
          }
          else
          { console.log('F', nuevas_notificaciones);
            resolve(nuevas_notificaciones);
            i = notificacion_entrante.length;
          }
        }
        /*
        notificacion_entrante.every(noti => {
          if(this.notificacion.findIndex(x =>
            x.ultima_mod === noti.ultima_mod && x.cod_mesa === noti.cod_mesa && noti.cod_pedido === x.cod_pedido) === -1)
          { console.log('entre ah', noti);
            nuevas_notificaciones.concat(noti);
            return true;
          }
          else
          { console.log('F', nuevas_notificaciones);
            resolve(nuevas_notificaciones);
            return false;
          }
        });
        */
      });
      console.log('nueva notif: ',nuevas_notificaciones);
      return nuevas_notificaciones;
    }

  }

  async compNotif(mesas){

    const notificacion_entrante = await this.generar_notificacion_entrante(mesas);
    Array.prototype.push.apply(notificacion_entrante, this.notificacion);
    this.notificacion = notificacion_entrante;
    console.log(this.notificacion);
    this.notificacion.forEach((noti, i) => {
      noti.id_notificacion = i;
    });
    console.log(this.notificacion);
    /*
      notificacion_entrante.forEach((x) => {
          this.notificacion.forEach(c => {
              if(x.cod_mesa === c.cod_mesa && x.id_detalle === c.id_detalle)
              { console.log(x.estado, c.estado);
                if(x.estado === c.estado)
                { x.nueva = false;
                }
              }
          });
      });
    */
    setTimeout(() => this.alerta(), 500);
    //this.notificacion = notificacion_entrante.sort((a, b) => Date.parse(b.ultima_mod) - Date.parse(a.ultima_mod));
    this.notificacion$.next(this.notificacion);
  }

  async alerta(){
    if(this.notificacion.filter(x => x.nueva === true).length > 0)
    { let index = 0;
      if(this.control_bool)
      { await this.asyncForEach((this.notificacion.filter(x => x.nueva === true && x.estado !== 'En preparación')), async () => {
          const x = index;
          console.log('noti antes: ', this.notificacion[x]);
          this.localNotifications.schedule({
            id: index,
            text: `Mesa ${this.notificacion[x].cod_mesa},  x${this.notificacion[x].cantidad} ${this.notificacion[x].nombre}
            ${this.notificacion[x].estado}`,
            sound: '../garzon/sonidos/bell.wav',
          });

          /*const alert = await this.alertController.create({
            header:'ALERTA',
            message: `Mesa ${this.notificacion[x].cod_mesa},  x${this.notificacion[x].cantidad} ${this.notificacion[x].nombre}
                      ${this.notificacion[x].estado}`,
            buttons:[{text:'Aceptar',
                      handler: () => {

                        //this.notificacion[x].nueva = false; TODO:TODO:
                        //console.log('noti dps: ',this.notificacion[x]);
                        }
                      }
                    ]
          });*/
          index++;
          //await alert.present();
        });
      }
      else
      { this.control_bool = false;
      }
    }
  }

  cambia_estado_notif(index){
    this.notificacion[index].nueva = false;
    //this.notificacion.unshift(this.notificacion.splice(index, 1));
  }



  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
  }

  logOut(){
    this.socket.disconnect();
  }

  getMesas$(): Observable<any>{
    return this.mesas$.asObservable();
  }

  getCaja$(): Observable<any>{
    return this.caja$.asObservable();
  }

  getDelivery$(): Observable<any>{
    return this.delivery$.asObservable();
  }

  getnotificacion$(): Observable<any>{
    return this.notificacion$.asObservable();
  }

}
