import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private body = new URLSearchParams();
  private url = environment.API;
  private httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}) };

  constructor(private http: HttpClient,
    private router: Router
    ) { }

  public login(username, password): Observable<any> {
    this.body.set('username', username);
    this.body.set('password', password);
    return this.http.post<any>(this.url + 'api/login', this.body.toString(), this.httpOptions).pipe(
      tap(() => {}),
      catchError(this.handleError<any>())      
    );
  }

  /*
  cerrarSesion() {
    let token = sessionStorage.getItem(environment.token);

    this.http.get(this.url + tokens/anular/environment.token).subscribe(() => {
      sessionStorage.clear();
      this.router.navigate(['login']);
    });
  }
  */

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
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error('ERROR', error); // log to console instead

    // TODO: better job of transforming error for user consumption
    console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
