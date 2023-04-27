import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timer } from './timer';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokeballsService {

  private apiUrl = 'http://localhost:8080/timer';
  private timerId = 1;



  timer$ = this.http.get<Timer>(`${this.apiUrl}/${this.timerId}/getTimer`)
  .pipe(
    catchError(this.handleError)
  )

  constructor(private http: HttpClient) { }

    //this reupdates the timer if we passed 24 hours from the last day
    updateTimer(timer: Timer): Observable<Timer> {
      return this.http.post<Timer>(`${this.apiUrl}/${this.timerId}/updateTimer`, timer, {headers: environment.headers})
      .pipe(
        catchError(this.handleError)
      )
    }

    //update current Users current PokeBalls
    updateUserPokeBalls(id: number, pokeBalls: number): Observable<Number>{
      return this.http.post<Number>(`${this.apiUrl}/${id}/addPokeBalls`, pokeBalls, {headers: environment.headers})
      .pipe(
        catchError(this.handleError)
      )
    }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
