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
  intercept(): Observable<HttpEvent<any>> {
    throw new Error('Method not implemented.');
  }


}
