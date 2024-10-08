import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timer } from '../interfaces/timer';
import { BehaviorSubject, Observable, Subject, catchError, map, shareReplay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PokeballsService {
  private readonly apiUrl = 'https://pokemon-trading-backend-dd013c59e9a7.herokuapp.com/timer';

  constructor(private http: HttpClient) {}

  //gets the currentUsers Timer
  getUserTimer(id: number): Observable<Timer> {
    return this.http
      .get<Timer>(`${this.apiUrl}/${id}/getTimer`, {headers: environment.headers})
      .pipe(
        map( timer => ({
          id: id,
          prevDate: new Date(timer.prevDate)
        })),shareReplay({bufferSize: 1, refCount: true}),
        catchError(this.handleError),
        );
  }

  //this reupdates the timer if we passed 24 hours from the last day
  updateTimer24(id: number, nextResetTime: Date): Observable<Timer> {
    return this.http
      .post<Timer>(
        `${this.apiUrl}/${id}/updateTimer`,
        { prevDate: nextResetTime.toISOString() },
        { headers: environment.headers }
      )
      .pipe(catchError(this.handleError));
  }

  //update current Users current PokeBalls
  updateUserPokeBalls(id: number, pokeBalls: number): Observable<Number> {
    return this.http
      .post<Number>(`${this.apiUrl}/${id}/addPokeBalls`, pokeBalls, {
        headers: environment.headers,
      })
      .pipe(catchError(this.handleError));
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
