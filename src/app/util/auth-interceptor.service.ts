import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginStoreService } from '../services/local-session/login-store.services';


@Injectable({
  providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor {

  constructor(private loginStoreService: LoginStoreService,) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Obtenemos el token del sessioStorage
    const token: string = this.loginStoreService.obtenerToken();

    let request = req;
	//Validamos si el token existe
    if (token) {
      //Clonamos el token y lo mandamos en la cabecera de todas las peticiones HTTP
      request = req.clone({
        setHeaders: {
          //Autorizaciòn de tipo Bearer + token
          //El tipo de autorizaciòn depende del back
          authorization: `Bearer ${ token }`
        }
      });
    }
    return next.handle(request);
  }
}
