import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Email } from '../model/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private url = environment.API;
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(
    private http: HttpClient
  ) { }

  public email(email: Email): Observable<any> {
    return this.http.post<any>(this.url + 'email/send', email, this.httpOptions).pipe(
      tap(() => { }),
      catchError(this.handleError<any>())
    );
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