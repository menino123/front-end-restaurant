/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { CerrarMesaPage } from '../mesas/cerrar-mesa/cerrar-mesa.page';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  public carta: any;
  public consumible: any;
  public mesas: any;
  public pedidoForm: FormGroup;
  public newPedido: any;
  public pedido: any;
  public res_ped: any;
  public resumen: any;
  public uToken: any;
  public garzones: any;
  public pTotal: number;
  public gEncargado: string;
  public vacio: string;
  public id_gEncargado: number;
  public desde = localStorage.getItem('desde');
  public garzon = localStorage.getItem('garzon');
  public cod_mesa = localStorage.getItem('cod_mesa');
  token = localStorage.getItem('token');

  constructor(public alertController: AlertController,
    private http: HttpClient,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    public router: Router,
    private SMS: ServicioMesaService,
    private modalCtrl: ModalController) {
      this.pedidoForm = this.fb.group({
        formTipo: new FormControl('',Validators.required),
        formCons: new FormControl('',Validators.required),
        formMesa: new FormControl(),
        formCant: new FormControl('',Validators.required),
        formDet: new FormControl(),
        formGarzon: new FormControl()
      });

      this.pedido = {
        token: this.token,
        cod_mesa: '',
        garzon_id: '',
        rol_ui: 0, //0 cajero, 1 garzon
        pedido:[]
      };

      this.resumen ={
        resumen: []
      };

      this.uToken = {
        token: this.token
      };

      this.pTotal = 0;

    }

  async ngOnInit() {

    this.SMS.getMesas$().subscribe(m => {
      this.mesas = m;
    });


    if(this.mesas === undefined) {

      await this.SMS.getMesas();
    }

    this.getGarzon();
    this.getCarta();
    //document.getElementById('detP').setAttribute('value', '');

  }

  async getGarzon(){
    this.http.post(environment.apiGetGarzon, this.uToken).subscribe( async (res: any) =>{
      if(res.status){

        this.garzones = res.json.garzones;
        console.log('garzones: ',this.garzones);

        this.pedidoForm.controls['formMesa'].setValue(this.cod_mesa);
        if(this.desde === '3')
        { var index: number;

        index = this.garzones.findIndex(garzon => garzon.nombre === this.garzon);
        this.pedido.garzon_id = this.garzones[index].id;
        this.pedidoForm.controls['formGarzon'].setValue(this.pedido.garzon_id);
      }

      }
      else{
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

  async getCarta(){
    this.http.post(environment.apiGetCarta, this.uToken).subscribe( async (res: any) =>{
      console.log('RESPUESTA ',res);
      this.carta = res.json.carta;
    });
  }

  async getMesa(){
    this.http.post(environment.apiGetMesa, this.uToken).subscribe(async (res: any) =>{
      this.mesas = res.mesas;
    });
  }

  getConsumible(){
    const indexTipo = this.pedidoForm.value.formTipo;
    this.consumible = this.carta[indexTipo].consumibles;
  }

  async agregar(){

    if(this.pedidoForm.valid){

      const nda = this.pedidoForm.value.formCons;
      const nd = nda.split(',');

      const detalle =
      {
      id: Number(nd[0]),
      cantidad: Number(this.pedidoForm.value.formCant),
      detalle: (this.pedidoForm.value.formDet === null ? '' : this.pedidoForm.value.formDet)
      };

      var index = this.pedido.pedido.findIndex(x => x.id === detalle.id && x.detalle === detalle.detalle);
      if(index === -1)
      { this.pedido.pedido.push(detalle);
        const res ={
          nombre: nd[1],
          cantidad: detalle.cantidad,
          detalle: detalle.detalle,
          precio_u:nd[2],
          precio_t: detalle.cantidad*Number(nd[2])
        };

        this.resumen.resumen.push(res);
      }
      else
      {
        this.resumen.resumen[index].cantidad += Number(detalle.cantidad);
        this.resumen.resumen[index].precio_t += Number(detalle.cantidad)*Number(nd[2]);
        console.log(this.resumen.resumen[index], this.pedido.pedido[index]);
        this.pedido.pedido[index].cantidad += Number(detalle.cantidad);
      }

      this.res_ped = this.resumen.resumen;
      this.pTotal = 0;
      this.resumen.resumen.forEach(d => {

        this.pTotal = d.precio_t+this.pTotal;

      });
      document.getElementById('detP').setAttribute('value', '');
    }
    else{
      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'Rellena todos los campos obligatorios (*)!.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }


  }

  async realizaPedido(){

    this.pedido.cod_mesa = this.pedidoForm.value.formMesa;
    this.pedido.garzon_id = Number(this.pedidoForm.value.formGarzon);
    console.log('SE ENVIA PEDIDO: ', this.pedido);

    const loading = await this.loadingController.create({
      message: 'Enviando Pedido...'
    });

    await loading.present();
    if(this.pedido.pedido.length !== 0){


    this.http.post(environment.apiPedido, this.pedido).subscribe(async (res: any) => {

      if(res.status){
        await loading.dismiss();
        this.desde = '3';
        const alert = await this.alertController.create({
          header:'Listo',
          message: res.message,
          buttons: [
            {text:'Aceptar',
            handler: ()=> {
              this.SMS.getMesas();
              this.router.navigate(['/cajero/mesas']);
              }
            }
          ]
        });
        this.pedidoForm.reset();
        this.res_ped = [];
        this.pedido.pedido = [];
        this.resumen.resumen = [];
        this.getMesa();
        await alert.present();
      }else{
        await loading.dismiss();
        //TODO:TODO:TODO: COMPROBAR MENSAJE DE ERROR, APLICAR A TODAS LAS CONSULTAS TODO:TODO:TODO:
        if(res.message === 'Error de autentifiación de rol!'){
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

    }, async err =>{
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: JSON.stringify(err),
        buttons: ['ok']
      });

      await alert.present();
    });
    await loading.dismiss();
    }
    else{
      await loading.dismiss();
      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'Debes agregar al menos un pedido.',
        buttons: ['Aceptar']
      });

      await alert.present();

    }
  }

  async control(){
    const control = this.pedidoForm.value.formCant;
    const pattern = /^[1-9][0-9]?$|^100$/;
    try{const inputChar = String.fromCharCode(control.which ? control.which : control.keyCode);
      //console.log('entrada: ', inputChar);
    }
    catch(err){
      //error en which al leer null
    }
    //console.log('Comparación: ', pattern.test(control) );

    if (!pattern.test(control)) {
      /*const alert = await this.alertController.create({
        header:'Error',
        message: 'Seleccione la cantidad correcta!',
        buttons: ['Aceptar']
      });

      await alert.present();*/

      document.getElementById('modCant').setAttribute('value','');
    }

  }

  eliminaDetalle(a: any){
    this.pTotal = this.pTotal - this.resumen.resumen[a].precio_t;
    this.pedido.pedido.splice(a, 1);
    this.resumen.resumen.splice(a, 1);

    this.res_ped = this.resumen.resumen;

  }

  async agregarDelivery(){

    console.log('esto es un delivery');
    console.log('garzon: ', this.pedidoForm.value.formGarzon);
    console.log('Tipo: ', this.pedidoForm.value.formTipo);
    console.log('Consumible: ', this.pedidoForm.value.formCons);
    console.log('Cantidad: ', this.pedidoForm.value.formCant);
    console.log('mesa: ', this.pedidoForm.value.formMesa);
    if(this.pedidoForm.valid){



      const nda = this.pedidoForm.value.formCons;
      const nd = nda.split(',');

      const detalle =
      {
      id: Number(nd[0]),
      cantidad: Number(this.pedidoForm.value.formCant),
      detalle: (this.pedidoForm.value.formDet === null ? '' : this.pedidoForm.value.formDet)
      };

      var index = this.pedido.pedido.findIndex(x => x.id === detalle.id && x.detalle === detalle.detalle);
      if(index === -1)
      { this.pedido.pedido.push(detalle);
        const res ={
          nombre: nd[1],
          cantidad: detalle.cantidad,
          detalle: detalle.detalle,
          precio_u:nd[2],
          precio_t: detalle.cantidad*Number(nd[2])
        };

        this.resumen.resumen.push(res);
      }
      else
      {
        this.resumen.resumen[index].cantidad += Number(detalle.cantidad);
        this.resumen.resumen[index].precio_t += Number(detalle.cantidad)*Number(nd[2]);
        console.log(this.resumen.resumen[index], this.pedido.pedido[index]);
        this.pedido.pedido[index].cantidad += Number(detalle.cantidad);
      }

      this.res_ped = this.resumen.resumen;
      this.pTotal = 0;
      this.resumen.resumen.forEach(d => {

        this.pTotal = d.precio_t+this.pTotal;

      });
      document.getElementById('detP').setAttribute('value', '');
    }
    else{
      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'Rellena todos los campos obligatorios (*)!.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }


  }

  async credencialInvalida(){
    await this.loadingController.dismiss('redireccion');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async pedidoDelivery(){

    if(this.pedido.pedido.length !== 0){

      const pedidosMesa = [];
      console.log('esto es un delivery');
      console.log('delivery: ', this.pedido);
      const modal = await this.modalCtrl.create({
      component: CerrarMesaPage,
      cssClass: 'modal-cmesa',
      componentProps:{
        style:{
          animated: false,
        },
        nombre: 'Cerrar mesa',
        pedidosDeMesa: pedidosMesa,
        pedido: this.pedido,
        }

    });

    await modal.present();

    }
    else{
      const alert = await this.alertController.create({
        header:'Aviso',
        message: 'Debes agregar al menos un pedido.',
        buttons: ['Aceptar']
      });

      await alert.present();

    }

  }

}
