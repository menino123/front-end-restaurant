/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { format } from 'path';
import { environment } from 'src/environments/environment';
import { ModalDetallePage } from './modal-detalle/modal-detalle.page';

@Component({
  selector: 'app-historialv',
  templateUrl: './historialv.page.html',
  styleUrls: ['./historialv.page.scss'],
})
export class HistorialvPage implements OnInit {

  show1= false;
  show2 = false;
  token = localStorage.getItem('token');
  formFiltroH: FormGroup;
  public uToken: any;
  public garzones: any;
  public consumible: any;
  public carta: any;
  public resultado: any;
  public cajeros: any;

  public date_inicial: Date; //RECIEN AGREGADO
  public date_final: Date;    //RECIEN AGREGADO
  //dateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
  formattedString='';

  public subTotal: any;
  public propinaTotal: any;
  public totalTotal: any;
  public detail: any;
  public cPedidos: number;
  public cPedidosPend: number;
  public TEfectivo: number;
  public TDebito: number;
  public TTransferencia: number;
  public TCredito: number;
  public TDevuelto: number;
  public TDsc: number;
  public TT: number;
  public paginas=[];
  public pagina: number;

  constructor(private modalCtrl: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    public router: Router) {

      this.formFiltroH = this.fb.group({
        formFechaI: new FormControl(),
        formFechaF: new FormControl(),
        formTipoCons: new FormControl(),
        formCons: new FormControl(),
        formEncargado: new FormControl(),
        formTipoPed: new FormControl(),
        formUltCaja: new FormControl(),
        formEstado: new FormControl(),
        formNVip: new FormControl()
      });
      this.uToken = {
        token: this.token
      };

      this.pagina = 1;
      //this.setToday();
      this.formFiltroH.controls['formUltCaja'].setValue(true);
     }

  ngOnInit() {
    this.getCarta();
    this.getGarzon();
    this.getCajero();
    this.buscar(this.pagina);
    this.resultado = {};
    this.resultado.json = [];

  }

  getFechaOrdenada(fecha){

    const fexa = fecha.split(' ')[1];
    const fexa2 = fecha.split(' ')[0];
    const hora = fexa.split(':')[0];
    const minuto = fexa.split(':')[1];

    return (fexa2.split('-')[2]+'/'+fexa2.split('-')[1]+'/'+fexa2.split('-')[0]+' '+hora+':'+minuto);

  }

  async getGarzon(){
    this.http.post(environment.apiGetGarzon, this.uToken).subscribe( async (res: any) =>{
      this.garzones = res.json.garzones;
    });
  }

  async getCajero(){
    this.http.post(environment.apiGetCajero, this.uToken).subscribe( async (res: any) =>{
      this.cajeros = res.json.cajeros;
    });
  }

  getConsumible(){
    const indexTipo = this.formFiltroH.value.formTipoCons;
    this.consumible = this.carta[indexTipo].consumibles;
  }

  async getCarta(){
    this.http.post(environment.apiGetCarta, this.uToken).subscribe( async (res: any) =>{
      this.carta = res.json.carta;
    });
  }

  async buscar(p){

    if(p === 1)
    { this.subTotal = 0;
      this.propinaTotal = 0;
      this.totalTotal = 0;
      this.detail = 0;
      this.cPedidos = 0;
      this.cPedidosPend = 0;
      this.TEfectivo = 0;
      this.TDebito = 0;
      this.TTransferencia = 0;
      this.TCredito = 0;
      this.TDevuelto = 0;
      this.TDsc = 0;
      this.TT = 0;
    }

    let u_caja;
    if(this.formFiltroH.value.formUltCaja == null){
      u_caja = false;
    }
    else{
      u_caja = this.formFiltroH.value.formUltCaja;
    }
    const busqueda = {
      token: this.token,
      data: {
        fecha_caja:{
          inicio: (this.formFiltroH.value.formFechaI === null ?
            null : this.formFiltroH.value.formFechaI.split('T')[0]+' '+this.formFiltroH.value.formFechaI.split('T')[1].split('-')[0]),
          fin: (this.formFiltroH.value.formFechaF === null ?
            null : this.formFiltroH.value.formFechaF.split('T')[0]+' '+this.formFiltroH.value.formFechaF.split('T')[1].split('-')[0])
        },
        comensal_vip: this.formFiltroH.value.formNVip,
        estado_pedido: Number(this.formFiltroH.value.formEstado),
        encargado_id: (this.formFiltroH.value.formEncargado === null || this.formFiltroH.value.formEncargado === ''
          ? 0 : this.formFiltroH.value.formEncargado),
        pagina: Number(p),
        ultima_caja: u_caja,
        tipo_pedido: (this.formFiltroH.value.formTipoPed === null || this.formFiltroH.value.formTipoPed === ''
        ? 0 : this.formFiltroH.value.formTipoPed)
      }
    };

    const loading = await this.loadingController.create({
      message: 'Procesando...'
    });

    await loading.present();

    console.log('se envía: ', busqueda);

    this.http.post(environment.apiHistorial, busqueda).subscribe(async (res: any) => {

      this.resultado = res;
      console.log('Se recibe: ', res);
      this.pagina = p;
      this.setPaginas(res.paginas);
      if(!res.status){
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
      else if(res.json.length === 0){
        await loading.dismiss();
        const alert = await this.alertController.create({
          header:'Aviso',
          message: 'No hay resultados para esta busqueda.',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
      else{
        await loading.dismiss();
        if(p === 1) { this.getTotales(); };
        this.modalCtrl.dismiss('filter-modal');
      }
    }, async err =>{
      await loading.dismiss();
      const alert = await this.alertController.create({
        header:'Aviso',
        message: JSON.stringify(err),
        buttons: ['Aceptar']
      });
      await alert.present();
    });

  }

  async credencialInvalida(){
    await this.loadingController.dismiss('redireccion');
    localStorage.clear();
    this.router.navigate(['/login']);

  }

  setPaginas(paginas){
    this.paginas = [];

    for(let i=1;i<=Number(paginas);i++)
    {

        this.paginas.push(i);
    }
  }



  getTotales(){
    //const indexTotales = this.resultado.totales.findIndex(el => el.tipo_pago === null);
    const indexT = this.resultado.totales.length - 1;
    this.subTotal = (indexT === -1 ? 0 : this.resultado.totales[indexT].subtotal_pagado);
    this.propinaTotal = this.resultado.totales[indexT].propina_pagada;
    this.totalTotal = this.resultado.totales[indexT].total_pagado;
    this.cPedidosPend = (this.resultado.totales[0].tipo_pago === null ? this.resultado.totales[0].cantidad_pedidos : 0);
    this.cPedidos = this.resultado.totales[indexT].cantidad_pedidos;
    const indexTr = this.resultado.totales.findIndex(el => el.tipo_pago === 'Transferencia');
    const indexC = this.resultado.totales.findIndex(el => el.tipo_pago === 'Crédito');
    const indexD = this.resultado.totales.findIndex(el => el.tipo_pago === 'Débito');
    const indexE = this.resultado.totales.findIndex(el => el.tipo_pago === 'Efectivo');

    this.TTransferencia = (indexTr === -1 ?
    0 : this.resultado.totales[indexTr].subtotal_pagado);

    this.TCredito = (indexC === -1 ?
    0 : this.resultado.totales[indexC].subtotal_pagado);

    this.TDebito = (indexD === -1 ?
    0 : this.resultado.totales[indexD].subtotal_pagado);

    this.TEfectivo = (indexE === -1 ?
    0 : this.resultado.totales[indexE].subtotal_pagado);

    let DPagado = 0;
    let DTotal = 0;

    this.resultado.json.forEach(d => {

      DPagado = (d.estado_pedido === 'Devuelto' ? d.subtotal_pagado+DPagado : DPagado);
      DTotal = (d.estado_pedido === 'Devuelto' ? Number(d.subtotal_estimado)+DTotal : DTotal);

    });
    this.TDevuelto = DTotal - DPagado;
  }

  async getDetalle(pedid_id, estado_pedido){

    const solicitud ={
      token: this.token,
      pedido_id: pedid_id
    };

    const loading = await this.loadingController.create({
      message: 'Procesando...'
    });

    await loading.present();

    this.http.post(environment.apiGetOrderDetail, solicitud).subscribe(async (res: any) =>{

      console.log('se obtiene: ', res);

      if(res.status){
        await loading.dismiss();
        this.detail = res;
        this.modalDetalle(estado_pedido);

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

    }

    async modalDetalle(estado_pedido){

      const modal = await this.modalCtrl.create({
        component: ModalDetallePage,
        cssClass: 'modal-detalle',
        componentProps:{
          nombre: 'D E T A L L E   Y   R E S O L U C I O N',
          detalle: this.detail,
          estadopedido: estado_pedido
          }

      });

      await modal.present();

    }

  RestablecerForm() {
    this.formFiltroH.reset();
    this.formFiltroH.controls['formUltCaja'].setValue(true);
  }
}
