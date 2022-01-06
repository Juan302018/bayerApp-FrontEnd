import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ServerErrorsInterceptorService implements HttpInterceptor {

private REINTENTOS: 5;

  constructor(
    private toastrService: ToastrService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
}
