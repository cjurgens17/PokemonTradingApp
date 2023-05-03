import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timer } from './timer';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokeballsService {
  private apiUrl = 'http://localhost:8080/timer';
  private userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;

  //Bs for timer
  private timerSubject = new BehaviorSubject<Timer>({
    id: 0,
    prevDate: new Date()
  });

  timerSubject$ = this.timerSubject.asObservable();

  constructor(private http: HttpClient) {}

  //gets the currentUsers Timer
  getTimer(): Observable<Timer> {
    return this.http
      .get<Timer>(`${this.apiUrl}/${this.userId}/getTimer`, {headers: environment.headers})
      .pipe(
        map( timer => {
          timer.prevDate = new Date(timer.prevDate);
          return timer;
        }),
        catchError(this.handleError),
        );
  }

  //this reupdates the timer if we passed 24 hours from the last day
  updateTimer(nextAvailableDate: Date): Observable<Timer> {
    const stringDate: string = nextAvailableDate.toISOString();

    return this.http
      .post<Timer>(
        `${this.apiUrl}/${this.userId}/updateTimer?date=${stringDate}`,
        { headers: environment.headers }
      )
      .pipe(
        map(timer => {
          timer.prevDate = new Date(timer.prevDate);
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
