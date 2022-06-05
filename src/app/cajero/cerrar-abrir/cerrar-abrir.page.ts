/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ServicioMesaService } from 'src/app/service/servicio-mesa.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-cerrar-abrir',
  templateUrl: './cerrar-abrir.page.html',
  styleUrls: ['./cerrar-abrir.page.scss'],
})
export class CerrarAbrirPage implements OnInit {

  token = localStorage.getItem('token');
  formMesa: FormGroup;
  public mesas: any;
  public caja: any;
  arrayMesas: Array<any>;

  constructor(private SMS: ServicioMesaService, private modalCtrl: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    public router: Router) {
    this.formMesa = this.fb.group({
      nMesaA: new FormControl(),
      nMesaE: new FormControl()
    });

    this.arrayMesas = [];

    for (let index = 1; index < 15; index++) {
      this.arrayMesas.push({cod:index,
        disabled: false});

    }

  }

  ngOnInit() {

    this.SMS.getMesas$().subscribe(m => {
      this.mesas = m;
    });
    if(this.mesas === undefined) {
      console.log('MESA INDEFINIDAAAAAA');
      this.SMS.getMesas();
    }
    this.SMS.getCaja$().subscribe(c => {
      this.caja = c;
    });


    //this.actualizaMesa();

  }

  /*actualizaMesa(){



    let i = 0;
    this.mesas.forEach(e => {
        i = this.arrayMesas.findIndex(a => Number(e.cod_mesas) === a.cod);
        this.arrayMesas[i].disabled = true;
    });


  }*/


  async agregaMesa(){
    const uToken = {
      token: this.token,
      cod_mesa: this.formMesa.value.nMesaA
    };

    console.log('Se solicita agregar la mesa: ', uToken);

    const loading = await this.loadingController.create({
      message: 'Procesando....'
    });

    await loading.present();

    this.http.post(environment.apiAgMesa, uToken).subscribe(async (res: any) =>{

      await loading.dismiss();

      const alert = await this.alertController.create({
        header:'Informe',
        message: res.message,
        buttons: [{text:'Aceptar',
        handler: ()=> {
          this.SMS.getMesas();
          }
        }
            ]
      });
      await alert.present();

    }, async err => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: JSON.stringify(err),
        buttons: ['ok']
      });

      await alert.present();
    });

  }

  async getMesa(){
    const Token = {
      token: this.token
    };
    this.http.post(environment.apiGetMesa, Token).subscribe(async (res: any) =>{
      this.mesas = res.mesas;
      console.log('Se obtienen las siguientes mesas: ', this.mesas);
    });
  }

  async eliminaMesa(){

    const uToken = {
      token: this.token,
      cod_mesa: this.formMesa.value.nMesaE
    };

    console.log('Se solicita eliminar la mesa: ', uToken);

    const loading = await this.loadingController.create({
      message: 'Procesando....'
    });

    await loading.present();

    this.http.post(environment.apiDelMesa, uToken).subscribe(async (res: any) => {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header:'Informe',
        message: res.message,
        buttons: [{text:'Aceptar',
        handler: ()=> {
          this.SMS.getMesas();
          }
        }
            ]
      });
      await alert.present();

    }, async err => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: JSON.stringify(err),
        buttons: ['ok']
      });

      await alert.present();
    });
  }

  async cerrarCaja(){
    const uToken = {
      token: this.token,
      cod_mesa: this.formMesa.value.nMesaE
    };
    console.log('Se solicita cerrar la caja');

    const alert = await this.alertController.create({
      header:'Confirmación',
      message:'¿Desea cerrar la caja?',
      buttons: [
                {text:'Aceptar',
                handler: async ()=> {
                  await alert.dismiss();
                  const loading = await this.loadingController.create({
                  message: 'Procesando...',
                  });
                  await loading.present();
                  this.http.post(environment.apiCerrarCaja, uToken).subscribe(async (res: any) => {

                    await loading.dismiss();

                    const alert2 = await this.alertController.create({
                      header:'Estado',
                      message: res.message,
                      buttons: [{text:'Ir a resumen de ventas',
                              handler: ()=> {
                                this.router.navigate(['./cajero/historialv']);
                                }
                              }]
                      });
                    await alert2.present();

                  }, async err => {
                    const alert2 = await this.alertController.create({
                      header: 'Error',
                      message: JSON.stringify(err),
                      buttons: ['ok']
                    });

                    await alert2.present();
                  });
                  await loading.dismiss();
                  }
                }
              ]
    });
    await alert.present();

  }


  async abrirCaja(){
    const uToken = {
      token: this.token,
      cod_mesa: this.formMesa.value.nMesaE
    };

    console.log('Se solicita ABRIR la caja');

    const alert = await this.alertController.create({
      header:'Confirmación',
      message:'¿Desea abrir la caja?',
      buttons: [
                {text:'Aceptar',
                handler: async ()=> {
                  await alert.dismiss();
                  const loading = await this.loadingController.create({
                  message: 'Procesando...',
                  });
                  await loading.present();
                  console.log('Enviando petición');
                  this.http.post(environment.apiAbrirCaja, uToken).subscribe(async (res: any) => {
                    await loading.dismiss();

                    const alert2 = await this.alertController.create({
                      header:'Estado',
                      message: res.message,
                      buttons: [
                        {text:'Aceptar',
                        handler: ()=> {
                          this.SMS.getMesas();
                          }
                        }
                      ]
                    });
                    await alert2.present();


                  }, async err => {
                    const alert2 = await this.alertController.create({
                      header: 'Error',
                      message: JSON.stringify(err),
                      buttons: ['ok']
                    });

                    await alert2.present();
                  });
                  await loading.dismiss();
                  }
                }
              ]
    });
    await alert.present();


  }

  cosito(){

  }

}
