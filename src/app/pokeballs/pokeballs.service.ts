import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timer } from './timer';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokeballsService {
  private apiUrl = 'https://pokemon-trading-backend-dd013c59e9a7.herokuapp.com/timer';

  //Bs for timer
  private timerSubject = new BehaviorSubject<Timer>({
      id: 0,
      prevDate: new Date(),
  }
  );

  timerSubject$ = this.timerSubject.asObservable();

  constructor(private http: HttpClient) {}

  //gets the currentUsers Timer
  getTimer(id: number): Observable<Timer> {
    return this.http
      .get<Timer>(`${this.apiUrl}/${id}/getTimer`, {headers: environment.headers})
      .pipe(
        map( timer => {
          timer.prevDate = new Date(timer.prevDate);
          return timer;
        }),
        catchError(this.handleError),
        );
  }

  //this reupdates the timer if we passed 24 hours from the last day
  updateTimer(id: number): Observable<Timer> {
    return this.http
      .post<Timer>(
        `${this.apiUrl}/${id}/updateTimer`,
        { headers: environment.headers }
      )
      .pipe(
        map(timer => {
      const serverDateTime = new Date(timer.prevDate);
      // Convert the UTC date and time to the client's time zone
      const clientDateTime = new Date(serverDateTime.toLocaleString('en-US', { timeZone: 'UTC' }));
      timer.prevDate = clientDateTime;
      return timer;
        }),
        catchError(this.handleError)
        );
  }

  //update current Users current PokeBalls
  updateUserPokeBalls(id: number, pokeBalls: number): Observable<Number> {
    return this.http
      .post<Number>(`${this.apiUrl}/${id}/addPokeBalls`, pokeBalls, {
        headers: environment.headers,
      })
      .pipe(catchError(this.handleError));
  }

  //updates timer subject
  updateTimerSubject(timer: Timer){
    this.timerSubject.next(timer);
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
