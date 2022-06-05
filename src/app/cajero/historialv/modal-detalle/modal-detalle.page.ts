/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { isNumeric } from 'jquery';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.page.html',
  styleUrls: ['./modal-detalle.page.scss'],
})
export class ModalDetallePage implements OnInit {

  formResolucion: FormGroup;
  token = localStorage.getItem('token');
  public detalle: any;
  public estadoP: string;
  public metodoPago: any;

  constructor(public actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private http: HttpClient,
    public alertController: AlertController,
    public router: Router,
    public fb: FormBuilder,
    public loadingController: LoadingController) {
      this.formResolucion = this.fb.group({
        devForm: new FormControl(''),
        pagoForm: new FormControl(''),
        obsForm: new FormControl(''),
        tpForm: new FormControl('')
      });
      this.detalle = this.navParams.get('detalle');
      this.estadoP = this.navParams.get('estadopedido');
      this.getMetodoPago();
    }

  ngOnInit() {

    console.log('DETALLE DE PEDIDO: ', this.detalle);
  }

  getObs1(){

      if(this.detalle.pedido[0].observacion === ''){
        return ('Sin observación.');
      }
      else{
        const obs1 = this.detalle.pedido[0].observacion.split(this.getSeparador(this.estadoP))[0];
        //console.log('osb1', obs1);
        if(obs1 === undefined){
          return (this.detalle.pedido[0].observacion);
        }
        else{
          return (obs1);
        }
      }
  }

  getObs2(){
    if(this.detalle.pedido[0].observacion === ''){
      return ('Sin observación.');
    }
    else{
      const obs2 = this.detalle.pedido[0].observacion.split(this.getSeparador(this.estadoP))[1];
      //console.log('osb2', obs2);
      if(obs2 === undefined){
        return ('Sin observación');
      }
      else{
        return (obs2);
      }
    }

  }

  getSeparador(estado){

    if(estado === 'Devuelto'){
      return ('__PEDIDO DEVUELTO__');
    }
    else if(estado === 'Cerrado'){
      return ('__PEDIDO CERRADO__');
    }
  }

  getFechaOrdenada(fecha){

    const fexa = fecha.split(' ')[1];
    const fexa2 = fecha.split(' ')[0];
    const hora = fexa.split(':')[0];
    const minuto = fexa.split(':')[1];

    return (fexa2.split('-')[2]+'/'+fexa2.split('-')[1]+'/'+fexa2.split('-')[0]+' '+hora+':'+minuto);

  }

  getMetodoPago(){
    const Tokencio = {
      token: this.token,
    };
    this.http.post(environment.apiGetPaidMethod, Tokencio).subscribe( async (res: any) =>{

      this.metodoPago = res.json.tipo_pago;
      console.log('metodos de pago: ', this.metodoPago);
    });
  }

  async terminaResolucion(){

    console.log('tpago, montodev, montopag, obs', this.formResolucion.value.tpForm,
    this.formResolucion.value.devForm, this.formResolucion.value.pagoForm, this.formResolucion.value.obsForm);

    const loading = await this.loadingController.create({
      message: 'Enviando resolución...'
    });

    await loading.present();

    if(this.estadoP==='Cerrado' && this.formResolucion.value.devForm !== '' && this.formResolucion.value.obsForm !== ''){

      await loading.dismiss();

      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'Harás una devolución de ($'+ this.formResolucion.value.devForm + ') sobre el pedido ('+
        this.detalle.pedido[0].pedido_id+')',
        buttons:[{text:'CONFIRMAR DEVOLUCIÓN',
                handler: ()=> {
                  this.devolucion();
                }
                }]
      });
      await alert.present();

    }

    else if(this.estadoP==='Pendiente de pago' && this.formResolucion.value.pagoForm !== '' &&
            this.formResolucion.value.obsForm !== '' && this.formResolucion.value.tpForm !== ''){

      await loading.dismiss();

      if(this.formResolucion.value.pagoForm < this.detalle.totales[0].subtotal){

        const alert = await this.alertController.create({
          header:'Aviso',
          message: 'Estás ingresando un monto de ($'+this.formResolucion.value.pagoForm+
          ') inferior al subtotal requerido ($'+this.detalle.totales[0].subtotal+').',
          buttons:[{text:'CONFIRMAR PAGO',
                  handler: ()=> {
                    this.pendiente();
                  }
                  }]
        });
        await alert.present();

      }
      else{
        await loading.dismiss();
        const alert = await this.alertController.create({
          header:'Aviso',
          message: 'Se realizará un pago de ($'+ this.formResolucion.value.pagoForm + ') sobre el pedido ('+
                    this.detalle.pedido[0].pedido_id+')',
          buttons:[{text:'CONFIRMAR',
                  handler: ()=> {
                    this.pendiente();
                  }
                  }]
        });
        await alert.present();
      }
    }

    else{
      await loading.dismiss();
      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'Rellena todos los campos obligatorios (*).',
        buttons:['Aceptar']
      });
      await alert.present();

    }
  }

  async devolucion(){
    const data={
      token: this.token,
      id_pedido: Number(this.detalle.pedido[0].pedido_id),
      json:{
        observacion: this.formResolucion.value.obsForm,
        tipo_pago_id: Number(this.formResolucion.value.tpForm),
        subtotal_descontado: Number(this.formResolucion.value.devForm)
      }
    };

    console.log('Se envía: ', data);

    this.http.post(environment.apiRefund, data).subscribe(async (res: any) =>{

      console.log('se recibe: ', res);

      if(res.status){
        const alert = await this.alertController.create({
          header:'Aviso',
          message: res.message,
          buttons:[{text:'Aceptar',
                  handler: ()=> {
                    window.location.reload();
                  }
                  }]
        });
        await alert.present();

      }
      else{

        const alert = await this.alertController.create({
          header:'Error',
          message: res.message,
          buttons:[{text:'Aceptar'}]
        });
        await alert.present();

      }
    }, async err =>{
        const alert = await this.alertController.create({
          header: 'Error',
          message: JSON.stringify(err),
          buttons: ['ok']
        });

        await alert.present();
    });
  }

  async pendiente(){
    const data={
      token: this.token,
      id_pedido: Number(this.detalle.pedido[0].pedido_id),
      json:{
        observacion: this.formResolucion.value.obsForm,
        tipo_pago_id: Number(this.formResolucion.value.tpForm),
        subtotal_pagado: Number(this.formResolucion.value.pagoForm)
      }
    };

    console.log('Se envía: ', data);

    this.http.post(environment.apiPend, data).subscribe(async (res: any) =>{

      console.log('se recibe: ', res);

      if(res.status){
        const alert = await this.alertController.create({
          header:'Aviso',
          message: res.message,
          buttons:[{text:'Aceptar',
                  handler: ()=> {
                    window.location.reload();
                  }
                  }]
        });
        await alert.present();

      }
      else{

        const alert = await this.alertController.create({
          header:'Error',
          message: res.message,
          buttons:[{text:'Aceptar'}]
        });
        await alert.present();

      }
    }, async err =>{
        const alert = await this.alertController.create({
          header: 'Error',
          message: JSON.stringify(err),
          buttons: ['ok']
        });

        await alert.present();
    });

  }

  async controlNumerico1(){
    const control = this.formResolucion.value.devForm;
    const totalP = this.detalle.pedido[0].sub_total_pagado;

    console.log(typeof control);

    if (isNumeric(control)) {
        if(Number(control) > Number(totalP)){

          document.getElementById('mDev').setAttribute('value',totalP);
        }
    }else {
      document.getElementById('mDev').setAttribute('value','');
    }
  }

  async controlNumerico2(){
    const control2 = this.formResolucion.value.pagoForm;
    const total = Number(this.detalle.totales[0].subtotal);

    if (isNumeric(control2)) {
        if(control2 > total){

          document.getElementById('mPend').setAttribute('value',total.toString());
        }
    }else {
      document.getElementById('mPend').setAttribute('value','');
    }
  }

}
