import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginStoreService } from './local-session/login-store.services';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginCambio = new Subject<any[]>();
  mensajeCambio = new Subject<string>();

  private body = new URLSearchParams();
  private url = environment.API;
  private httpOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
  private httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}) };

  constructor(private http: HttpClient,
    private router: Router,
    private loginStoreService: LoginStoreService
    ) { }

  public login(username, password): Observable<any> {
    this.body.set('username', username);
    this.body.set('password', password);
    return this.http.post<any>(this.url + 'api/login', this.body.toString(), this.httpOptions);
  }

  public detalleUsuario(username): Observable<any> {
    return this.http.post<any>(this.url + 'usuario/detallePorNombre/'+username, this.httpOption);
  }

  estaLogeado() {
    let token = sessionStorage.getItem(environment.token);
    return token != null;
  }

      /**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/

}
