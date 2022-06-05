/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { isNumeric } from 'jquery';
import { element } from 'protractor';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cerrar-mesa',
  templateUrl: './cerrar-mesa.page.html',
  styleUrls: ['./cerrar-mesa.page.scss'],
})
export class CerrarMesaPage implements OnInit {
  cerrarForm: FormGroup;
  public pedidosMesa: any;
  token = localStorage.getItem('token');
  desde = localStorage.getItem('desde');
  public res_mesa: any;
  public metodoPago: any;
  public fexa: any;
  public vip: any;
  public vip2: boolean;
  public suma: number;
  public descuento: number;
  public newSubT: number;
  public newT: number;
  public today: any;
  public delivery: any;
  public detalleDelivery: any;
  public subtotalDeli: any;
  public personal: any;
  public colacion: any;

  constructor(public actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private http: HttpClient,
    public alertController: AlertController,
    public router: Router,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    private SMS: ServicioMesaService) {
      this.cerrarForm = this.fb.group({
        sbTPagado: new FormControl('', Validators.required),
        prpPagado: new FormControl(''),
        obsPagado: new FormControl(''),
        tpPagado: new FormControl('', Validators.required),
        vipPagado: new FormControl(),
        pndPagado: new FormControl(),
        dscPagado: new FormControl(),
        esVip: new FormControl(),
        vipardo: new FormControl(),
        esColacion: new FormControl(),
        nombrePersonal: new FormControl(),
      });

      this.vip2 = false;
      this.suma = 0;
      this.today = Date.now();
      this.subtotalDeli = 0;
     }

  async ngOnInit() {

    this.getPersonal();
    this.getMetodoPago();

    if(this.desde !== '1'){
      this.pedidosMesa = this.navParams.get('pedidosDeMesa');
      this.res_mesa = this.pedidosMesa.pedido.detalle;
      this.newT = this.pedidosMesa.pedido.subtotal + this.pedidosMesa.pedido.propina_sugerida;
    }

    else if(this.desde === '1') {
      this.delivery = this.navParams.get('pedido');
      await this.getDetalleDelivery();
    }

    this.cerrarForm.value.dscPagado = '0';
    this.modSubT();

  }

  async credencialInvalida(){
    await this.loadingController.dismiss('redireccion');
    await this.modalCtrl.dismiss();
    localStorage.clear();
    this.router.navigate(['/login']);

  }

  consultaVip(){
    console.log(this.vip2);
  }

  getMetodoPago(){
    const Tokencio = {
      token: this.token,
    };
    this.http.post(environment.apiGetPaidMethod, Tokencio).subscribe( async (res: any) =>{

      if(res.status){
        this.metodoPago = res.json.tipo_pago;
        console.log('metodos de pago: ', this.metodoPago);
      }else{
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

  async getPersonal(){

    const Tokencio = {
      token: this.token,
    };
    this.http.post(environment.apiGetPersonal, Tokencio).subscribe( async (res: any) =>{
      this.personal = res.personal;
      console.log('getPersonal ', res.personal);
    }, err =>{
      console.log('errorsin en getPersonal');
    });
  }

  esColacion()
  { console.log(this.cerrarForm.value.esColacion, this.descuento);
    //const total = (this.desde === '1' ? this.detalleDelivery.subtotal : this.pedidosMesa.pedido.subtotal);
    //this.newSubT = total - total*this.descuento*0.01;
    //this.newT = (this.desde === '1' ? 0 : this.newSubT + this.pedidosMesa.pedido.propina_sugerida);
    if(!this.cerrarForm.value.esColacion)
    { this.descuento = 100;
      this.cerrarForm.controls['dscPagado'].setValue(100);
    }
    else
    { this.descuento = 0;
      this.cerrarForm.controls['dscPagado'].setValue(0);
    }
    this.modSubT();
  }

  async cerrarPedido(){
    const dsc = Number(this.cerrarForm.value.dscPagado)*0.01;
    const datos = (this.desde === '1' ? {
      token: this.token,
      pedido: (this.delivery === undefined ? [] : this.delivery.pedido),
      tipo_pago: Number(this.cerrarForm.value.tpPagado),
      subtotal_pagado: Number(this.cerrarForm.value.sbTPagado),
      observacion: this.cerrarForm.value.obsPagado,
      es_pago_pendiente: (!this.cerrarForm.value.pndPagado || this.cerrarForm.value.esColacion
                          ? false : this.cerrarForm.value.pndPagado),
      es_comensal_vip: this.cerrarForm.value.esVip,
      comensal_vip: this.cerrarForm.value.vipPagado,
      descuento: (this.cerrarForm.value.esColacion ? 1 : dsc),

    } : {token: this.token,
    cod_mesa: this.pedidosMesa.cod_mesa,
    tipo_pago: Number(this.cerrarForm.value.tpPagado),
    subtotal_pagado: Number(this.cerrarForm.value.sbTPagado),
    propina_pagada: (this.cerrarForm.value.esColacion ? 0 : Number(this.cerrarForm.value.prpPagado)),
    observacion: this.cerrarForm.value.obsPagado,
    es_pago_pendiente: (this.cerrarForm.value.pndPagado === null ? false : this.cerrarForm.value.pndPagado),
    es_comensal_vip: this.cerrarForm.value.esVip,
    comensal_vip: (this.cerrarForm.value.vipPagado === null ? false : this.cerrarForm.value.vipPagado),
    descuento: dsc,
    //estado_pedido: (this.cerrarForm.value.pndPagado === null || this.cerrarForm.value.pndPagado === false ? 1 : 3)
  });

    const controlVip = this.cerrarForm.value.vipPagado;

    /*if(this.cerrarForm.invalid){
      const alert = await this.alertController.create({
        header:'Error',
        message: 'Debes rellenar los campos obligatorios! (*)',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }*/

    console.log('Se Envía: ', datos);
    if(this.cerrarForm.value.esVip){
      //console.log('es vip');

      if(!controlVip){
        const alert = await this.alertController.create({
          header:'Aviso',
          message: 'Debes ingresar al menos el nombre de cliente.',
          buttons: ['Aceptar']
        });

        await alert.present();
      }else{
        console.log('Termina pedido CON VIP');
        console.log('Se envía: ', datos);
        const loading = await this.loadingController.create({
          message: 'Terminando pedido...'
        });

        await loading.present();
        //this.pedidosMesa.pedido.subtotal
        if(this.descuento !== 100 && this.cerrarForm.value.sbTPagado < this.newSubT){
          await loading.dismiss();
          const alert = await this.alertController.create({
            header:'Aviso',
            message: 'Estás ingresando una cantidad inferior al subtotal requerido.',
            buttons: [{text:'CONFIRMAR',
                    handler: async ()=> {
                      if(this.cerrarForm.value.obsPagado === undefined ||
                        this.cerrarForm.value.obsPagado === null ||
                        this.cerrarForm.value.obsPagado === ''){

                          await loading.dismiss();

                          const alerta = await this.alertController.create({
                            header: 'Aviso',
                            message: 'Debe rellenar con una observación.',
                            buttons: ['Aceptar']

                          });
                          await alerta.present();

                      }
                      else{this.http.post((this.desde === '1' ? environment.apiDoDelivery : environment.apiCerrarMesa),
                      datos).subscribe(async (res: any) =>{
                        //console.log('Se recibe del cierre: ', res);
                        if(res.status){
                          await loading.dismiss();
                          const alerta = await this.alertController.create({
                            header:'Listo',
                            message: res.message,
                            buttons: [{text:'Aceptar',
                              handler: ()=> {
                                //window.location.reload();
                                this.SMS.getMesas();
                                this.modalCtrl.dismiss();//:TODO:TODO:TODO:TODO:
                                if(this.desde === '1'){this.router.navigate(['/cajero/para-llevar']);}

                              }
                            }]
                          });
                          await alerta.present();
                        }else{
                          await loading.dismiss();
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
                  }]
          });

          await alert.present();

        }else{
          //console.log('valor de pedido: ', this.pedidosMesa.pedido.subtotal);
          console.log('valor del pedido con descuento: ', this.newSubT);
          this.http.post((this.desde === '1' ? environment.apiDoDelivery : environment.apiCerrarMesa),
          datos).subscribe(async (res: any) =>{
            //console.log('Se recibe del cierre: ', res);
            if(res.status){
              await loading.dismiss();
              const alert = await this.alertController.create({
                id:'alertini',
                header:'Listo',
                message: res.message,
                buttons: [{text:'Aceptar',
                  handler: ()=> {
                    //window.location.reload();
                    this.SMS.getMesas();
                    this.modalCtrl.dismiss('modalCM');
                    if(this.desde === '1'){this.router.navigate(['/cajero/para-llevar']);}
                  }
                }]
              });
              await alert.present();
            }else{
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
    }else{

      if(this.cerrarForm.invalid){
        const alert = await this.alertController.create({
          header:'Error',
          message: 'Debes rellenar los campos obligatorios! (*)',
          buttons: ['Aceptar']
        });

        await alert.present();
        return;
      }
      //console.log('valor de pedido: ', this.pedidosMesa.pedido.subtotal);
      console.log('valor del pedido con descuento: ', this.newSubT);
      if(this.descuento !== 100
        && this.cerrarForm.value.sbTPagado < (this.desde === '1' ? this.detalleDelivery.subtotal : this.pedidosMesa.pedido.subtotal)){
        const alertita = await this.alertController.create({
          header:'Aviso',
          message: 'Estás ingresando una cantidad inferior al subtotal.',
          buttons: [{text:'CONFIRMAR',
                    handler: async ()=> {
                      const loading = await this.loadingController.create({
                        message: 'Terminando pedido...'
                      });

                      await loading.present();

                      if(this.cerrarForm.value.obsPagado === undefined ||
                        this.cerrarForm.value.obsPagado === null ||
                        this.cerrarForm.value.obsPagado === ''){

                          await loading.dismiss();

                          const alert = await this.alertController.create({
                            header: 'Aviso',
                            message: 'Debe rellenar con una observación.',
                            buttons: ['Aceptar']

                          });
                          await alert.present();

                      }
                      else{
                        this.http.post((this.desde === '1' ? environment.apiDoDelivery : environment.apiCerrarMesa),
                        datos).subscribe(async (res: any) =>{
                          //console.log('Se recibe del cierre: ', res);
                          if(res.status){
                            await loading.dismiss();
                            const alerta = await this.alertController.create({
                              header:'Listo',
                              message: res.message,
                              buttons: [{text:'Aceptar',
                                          handler: ()=> {
                                            //window.location.reload();
                                            this.SMS.getMesas();
                                            this.modalCtrl.dismiss();
                                            if(this.desde === '1'){this.router.navigate(['/cajero/para-llevar']);}
                                          }
                              }]
                            });
                            await alerta.present();
                          }else{
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
                  }],

        });

        await alertita.present();
      }
      else{
        const loading = await this.loadingController.create({
          message: 'Terminando pedido...'
        });

        await loading.present();

        console.log('Se envía: ', datos);
        console.log('Termina pedido SIN VIP');
        await loading.dismiss();
        this.http.post((this.desde === '1' ? environment.apiDoDelivery : environment.apiCerrarMesa),
        datos).subscribe(async (res: any) =>{
          //console.log('Se recibe del cierre: ', res);
          if(res.status){
            await loading.dismiss();
            const alert = await this.alertController.create({
              header:'Listo',
              message: res.message,
              buttons: [{text:'Aceptar',
                          handler: ()=> {
                            this.modalCtrl.dismiss();
                            this.SMS.getMesas();
                            if(this.desde === '1'){this.router.navigate(['/cajero/para-llevar']);}
                            //window.location.reload();

                          }
              }]
            });
            await alert.present();
          }else{
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

  }

  async controlSBT(){
    const control = this.cerrarForm.value.sbTPagado;
    const total = (this.desde === '1' ? this.detalleDelivery.subtotal : this.pedidosMesa.pedido.subtotal);

    //const inputChar = String.fromCharCode(control.which ? control.which : control.keyCode);
    //console.log('entrada: ', inputChar);

    if (isNumeric(control)) {
      if(this.descuento > 0){
        if(control > this.newSubT){
          document.getElementById('sbT').setAttribute('value',this.newSubT.toString());
        }
      }
      else{
        if(control > total){
          /*const alert = await this.alertController.create({
            header:'Error',
            message: 'Cantidad ingresada supera al subtotal',
            buttons: ['Aceptar']
          });
          await alert.present();*/

          document.getElementById('sbT').setAttribute('value',total);
          }
      }
    }else {
      document.getElementById('sbT').setAttribute('value','');
    }
  }

  controlPROP(){
    const controlP = this.cerrarForm.value.prpPagado;

    if(!isNumeric(controlP)){
      document.getElementById('prp').setAttribute('value','');
    }
    else if(this.desde === '1'){
      document.getElementById('prp').setAttribute('value','');
    }
  }

  async esVip(){

    const controlVip = this.cerrarForm.value.vipPagado;

    if(this.cerrarForm.value.esVip){
      console.log('es vip');
      this.vip = true;
      if(!controlVip){
        const alert = await this.alertController.create({
          header:'Aviso',
          message: 'Debes ingresar al menos un nombre',
          buttons: ['Aceptar']
        });

        await alert.present();
      }
      else{
        console.log('Termina pedido CON VIP');
      }
    }else{
      this.vip = false;
      document.getElementById('VipPend').setAttribute('checked','false');
      document.getElementById('VipDsc').setAttribute('value','0');
      document.getElementById('VipNom').setAttribute('value',''); //No funciona
      console.log('Termina pedido SIN VIP');
    }

  }

  /*async terminarPedido(){
    this.esVip();
  }*/

  modSubT(){
    console.log('descuento: ',this.cerrarForm.value.dscPagado);
    this.descuento = this.cerrarForm.value.dscPagado;
    const control = this.cerrarForm.value.sbTPagado;
    const total = (this.desde === '1' ? this.detalleDelivery.subtotal : this.pedidosMesa.pedido.subtotal);
    if(this.descuento >= 0 && !this.cerrarForm.value.pndPagado){
      this.newSubT = total - total*this.descuento*0.01;
      console.log('nuevo sub total: ',this.newSubT);
      this.newT = (this.desde === '1' ? 0 : this.newSubT + this.pedidosMesa.pedido.propina_sugerida);
      //document.getElementById('sbT').setAttribute('value',this.newSubT.toString());

    }
    else{
      //console.log('nuevo sub total: ',this.newSubT);
        this.newT = (this.desde === '1' ? 0 :total + this.pedidosMesa.pedido.propina_sugerida);
        //document.getElementById('sbT').setAttribute('value',total);

    }

  }

  esPendPago(){
    console.log('pendiente de pago: ', this.cerrarForm.value.pndPagado);
    if(this.cerrarForm.value.pndPagado){
      //document.getElementById('VipDsc').setAttribute('value','100');
      //document.getElementById('VipDsc').setAttribute('disabled','true');
      this.descuento = 100;
      this.newT = ( this.pedidosMesa !== undefined ? this.pedidosMesa.pedido.propina_sugerida : 0);
      //this.modSubT();
      //document.getElementById('tipoPago').setAttribute('disabled','true');
      //document.getElementById('tipoPago').setAttribute('value', '');
      //document.getElementById('sbT').setAttribute('disabled','true');
    }
    else{
      this.descuento = 0;
      //document.getElementById('VipDsc').setAttribute('value','0');
      //document.getElementById('VipDsc').setAttribute('disabled','false');
      this.modSubT();
      //document.getElementById('tipoPago').setAttribute('disabled','false');
      //document.getElementById('tipoPago').setAttribute('value','');
      //document.getElementById('sbT').setAttribute('disabled','false');
    }
  }

  async getDetalleDelivery(){
    const detalle = {
      token: this.token,
      pedido: (this.desde === '1' ? this.delivery.pedido : [])
    };
    return new Promise(resolve => {
        this.http.post(environment.apiDetalleDelivery, detalle).subscribe(async (res: any) =>{

            this.detalleDelivery = res;

            this.subtotalDeli = this.detalleDelivery.subtotal;
            console.log('Detalle Delivery: ', this.detalleDelivery);
            resolve('a');
          });
    });
}


}
