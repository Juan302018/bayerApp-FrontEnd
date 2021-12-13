import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BayerService {

  private url = environment.API;
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) { }

  public listarEspecies(): Observable<any> {
    return this.http.get<any>(this.url + 'especie-semilla', this.httpOptions).pipe(
      tap(() => { }),
      catchError(this.handleError<any>())
    );
  }

  public listarTipos(): Observable<any> {
    return this.http.get<any>(this.url + 'tipo-semilla', this.httpOptions).pipe(
      tap(() => { }),
      catchError(this.handleError<any>())
    );
  }

  public listarVariedades(): Observable<any> {
    return this.http.get<any>(this.url + 'variedad-semilla', this.httpOptions).pipe(
      tap(() => { }),
      catchError(this.handleError<any>())
    );
  }

  public listarTodoProducto(): Observable<any> {
    return this.http.get<any>(this.url + 'filtro/todos', this.httpOptions).pipe(
      tap(() => { }),
      catchError(this.handleError<any>())
    );
  }

  public filtraListaProducto(idEspecie: number, idTipo: number, idVariedad): Observable<any>{
    return this.http.post<any>(this.url + 'filtro/lista-filtro/' + idEspecie +'/'+ idTipo +'/'+ idVariedad, this.httpOptions).pipe(
      tap(() => {}),
      catchError(this.handleError<any>())      
    );
  }

  public filtraPorIdEspecie(idEspecie: number): Observable<any>{
    return this.http.post<any>(this.url + 'tipo-semilla/por-especie/' + idEspecie, this.httpOptions).pipe(
      tap(() => {}),
      catchError(this.handleError<any>())      
    );
  }

  public filtraPorIdTipo(idTipo: number): Observable<any>{
    return this.http.post<any>(this.url + 'variedad-semilla/por-tipo/' + idTipo, this.httpOptions).pipe(
      tap(() => {}),
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
