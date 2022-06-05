/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { ServicioMesaService } from '../service/servicio-mesa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(public alertController: AlertController,
    // eslint-disable-next-line max-len
    public loadingController: LoadingController,
    private router: Router,
    public fb: FormBuilder,
    public http: HttpClient,
    public SMS: ServicioMesaService) {

      this.loginForm = this.fb.group({
        rutlg: new FormControl('',Validators.required),
        passlg: new FormControl('',Validators.required),
      });

   }

  ngOnInit() {

  }

  enlentecedor(){

  }

  async ingresar(){

    console.log('función ingresar');
    const f = this.loginForm.value;

    if(this.loginForm.invalid){
      const alert = await this.alertController.create({
        header:'Error',
        message: 'Debes rellenar todos los campos',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }
    const usuario = {
      rut: f.rutlg,
      clave: f.passlg,
    };

    const loading = await this.loadingController.create({
      message: 'Validando....'
    });

    await loading.present();

    new Promise((resolve, reject) => {
      this.http.post(environment.apiLogin, usuario).subscribe(async (res: any)=>{
        console.log('desde login',res);
        localStorage.setItem('token',res.token);
        localStorage.setItem('todo',JSON.stringify(res));
        console.log('token guardado: '+res.token);
        localStorage.setItem('nombre',res.nombre);
        console.log('nombre guardado: '+res.nombre);
        localStorage.setItem('apellido',res.apellido);
        console.log('apellido guardado: '+res.apellido);
        localStorage.setItem('rol',JSON.stringify({roles: res.rol_id})); // Debería ser un arreglo
        console.log('rol guardado: '+ JSON.parse(localStorage.getItem('rol')));
        console.log(res.message);


        resolve(res);


      }, async err =>{

        await loading.dismiss();
        const alert = await this.alertController.create({
        header: 'Error',
        message: 'Problemas de conexión con el servidor: ',
        buttons: ['ok']
        });

        await alert.present();

      });
    }).then(async (res: any) =>{

      this.SMS.setToken(res.token);

      await loading.dismiss();

      if(res.status){
        if(res.rol_id.length > 1){
          console.log('Más de 1 rol');
        }
        switch(JSON.stringify(res.rol_id)) {
          case '[1]':
            console.log('sos director vos');
            localStorage.setItem('rol_en_uso','1');
            this.router.navigate(['/cajero']);
            break;
          case '[2]':
            console.log('sos gerente vos');
            localStorage.setItem('rol_en_uso','2');
            this.router.navigate(['/gerente']);
            break;
          case '[3]':
            console.log('sos supervisor / cajero vos');
            localStorage.setItem('rol_en_uso','3');
            this.router.navigate(['/cajero']);
            break;
          case '[4]':
            console.log('sos cajero vos');
            localStorage.setItem('rol_en_uso','4');
            this.router.navigate(['/cajero']);
            break;
          case '[5]':
            console.log('sos garzon vos');
            localStorage.setItem('rol_en_uso','5');
            this.router.navigate(['/garzon']);
            break;
            case '[6]':
            console.log('sos cocinero vos');
            localStorage.setItem('rol_en_uso','6');
            this.router.navigate(['/cocina']);
            break;
          default:
            const alertini = await this.alertController.create({
              header: 'Rol',
              message: res.rol_id,
              buttons: ['ok']
            });
            await alertini.present();
        }

        }
      else{

        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: res.message,
          buttons: ['ok']
        });

      await alert.present();
      }


    });

  }


}
