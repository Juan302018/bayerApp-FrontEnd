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
  private REINTENTOS: 5;

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
        console.log('data: ', data);
        environment.token = data.token;
        console.log('token: ', environment.token);
        this.loginStoreService.guardarToken(environment.token);
        this.obtLogin.mensaje = data.mensaje;
        this.obtLogin.token = environment.token;
        this.obtLogin.user = data.user;
        console.log('obtLogin: ', this.obtLogin);
        this.loginStoreService.guardarLogin(this.obtLogin);
        //sessionStorage.setItem('token',environment.token);

        this.loginService.loginCambio.next(data.mensaje);
        this.loginService.mensajeCambio.next('Inicio de sesión correctamente!');
        setTimeout(() => {
          this.router.navigate(['catalogo']);
        }, 2000);
      
    },
      err => {
        console.error('Error: ', err);
        swal.fire(
          'Error',
          '<span><b><div class="alert alert-danger" role="alert">' +
          `${err.error.mensaje}` +
          '</div></b></span>',
          'error'
        )
        this.interceptorConexion()
      },
    );
  }

  interceptorConexion() {
    var request: HttpRequest<any>
    var next: HttpHandler
    //console.log('handle: ',next.handle)
    return next.handle(request).pipe(retry(this.REINTENTOS)).
      pipe(tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.error === true && event.body.errorMessage) {
            throw new Error(event.body.errorMessage);
          }
        }
      })).pipe(catchError((err) => {
        console.log(err.error.status);
        if (err.error.status === 400) {
          setTimeout(() => {
            this.toastrService.error(err.error.message, 'ERROR 400')
          }, 2000);
        }
        else if (err.error.status === 401) {
          setTimeout(() => {
            this.toastrService.error(err.error.message, 'ERROR 401')
          }, 2000);
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
        else if (err.error.status === 403) {
          setTimeout(() => {
            this.toastrService.error(err.error.message, 'ERROR 403')
          }, 2000);
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
        else if (err.error.status === 500) {
          setTimeout(() => {
            this.toastrService.error(err.error.mensaje, 'ERROR 500')
          }, 2000);
        } else {
          setTimeout(() => {
            this.toastrService.error(err.error.mensaje, 'ERROR')
          }, 2000);
        }
        console.log('EMPTY: ', EMPTY);
        return EMPTY;
      }));
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

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }



}
