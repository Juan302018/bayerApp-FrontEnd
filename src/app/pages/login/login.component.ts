import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EMPTY, Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormsModule, FormControl } from '@angular/forms';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Type } from '@angular/core';
import { LoginStoreService } from 'src/app/services/local-session/login-store.services';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/model/login';
import { ServerErrorsInterceptorService } from 'src/app/util/server-errors-interceptor.service';
import { catchError, retry, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private loginSubscription: Subscription;

  public flagRecuperaPass: boolean = false;
  public hide: boolean = false;
  public showEye: Boolean = false;
  public hideConf: boolean = false;
  public showEyeConf: Boolean = false;

  obtLogin: Login = new Login();
  username: string;
  password: string;

  ngForm: FormGroup;

  constructor(
    private serverErrorsInterceptorService: ServerErrorsInterceptorService,
    private loginStoreService: LoginStoreService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { this.createForm(); }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.username = this.ngForm.get('user').value;
    this.password = this.ngForm.get('password').value;
    console.log('Credenciales: ', this.username, this.password);
    this.loginService.login(this.username, this.password)
    this.loginSubscription = this.loginService.login(this.username, this.password).subscribe(data => {
      environment.token = data.token;
      this.loginStoreService.guardarToken(environment.token);

      this.loginService.loginCambio.next(data.mensaje);
      this.loginService.mensajeCambio.next('Inicio de sesión correctamente!');
      setTimeout(() => {
        this.router.navigate(['catalogo']);
      }, 2000);
      this.loginService.detalleUsuario(this.username).subscribe(detalleUser => {
        console.log('detalleUser: ', detalleUser);
        this.obtLogin.mensaje = data.mensaje;
        this.obtLogin.token = environment.token;
        this.obtLogin.user = data.user;
        this.obtLogin.email = detalleUser.emailUsuario;
        console.log('obtLogin: ', this.obtLogin);
        this.loginStoreService.guardarLogin(this.obtLogin);
      });
    },
      err => {
        swal.fire(
          'Error',
          '<span><b><div class="alert alert-danger" role="alert">' +
          `${err.error.mensaje}` +
          '</div></b></span>',
          'error'
        )
        //this.interceptorConexion()
      },
    );
  }

  mostrarPassword() {
    this.hide = !this.hide;
    this.showEye = !this.showEye;
  }

  createForm() {
    this.ngForm = new FormGroup({
      user: new FormControl("", [Validators.required, Validators.minLength(5)]),
      password: new FormControl("", [Validators.required, Validators.minLength(5)]),
    });

  }

  /*
  recuperarPassword() {
    setTimeout(() => {
    this.router.navigate(['recuperar-contrasena'])}, 2000);
  }
  */

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }



}
