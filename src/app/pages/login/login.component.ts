import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LoginStoreService } from 'src/app/services/local-session/login-store.services';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/model/login';
import { Usuario } from 'src/app/model/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private loginSubscription: Subscription;
  
  public hide: boolean = false;
  public showEye: Boolean = false;
  public hideConf: boolean = false;
  public showEyeConf: Boolean = false;

  obtLogin: Login = new Login();
  username: string;
  password: string;

  constructor(
    private loginStoreService: LoginStoreService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
  }

  iniciarSesion() {
    console.log('Credenciales: ',this.username, this.password);
    this.loginSubscription = this.loginService.login(this.username, this.password).subscribe(data => {
      console.log('data: ',data);
      environment.token = data.token;
      console.log('token: ',environment.token);
      this.obtLogin.mensaje = data.mensaje;
      this.obtLogin.token = environment.token;
      this.obtLogin.user = data.user;
      console.log('obtLogin: ',this.obtLogin);
      this.loginStoreService.guardarLogin(this.obtLogin);
      //sessionStorage.setItem('token',environment.token);

      this.loginService.loginCambio.next(data.mensaje);
      this.loginService.mensajeCambio.next('Inicio de sesión correctamente!');
      this.toastrService.success(data.mensaje, 'Atención');
      setTimeout(() => {
        this.router.navigate(['catalogo']);
      }, 2000);
    }, err => {
      console.error('Error: ',err.mensaje);
    });
  }

  mostrarPassword() {
    this.hide = !this.hide;
    this.showEye = !this.showEye;
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

}
