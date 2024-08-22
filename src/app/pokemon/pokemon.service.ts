import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  catchError,
  finalize,
  forkJoin,
  of,
  share,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private productUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private apiUrl = 'https://pokemon-trading-backend-dd013c59e9a7.herokuapp.com/pokemon';

  //this is for a progress bar if we want to use it -> the fetch goes by so quick, probably not worth it.
  counter: number = 0;
  progress!: number;

  private nextUrlSubject = new BehaviorSubject<string>(this.productUrl + 1);
  nextUrl$ = this.nextUrlSubject.asObservable();

  getAllPokemon$: Observable<any[]> = this.getAllPokemon();

  constructor(private http: HttpClient) {}

  //Get and Cache 200 pokemon in parallel
  getAllPokemon(): Observable<any[]> {
    if (!this.getAllPokemon$) {
      console.log("We are getting all Pokemon right Now")
      this.getAllPokemon$ = forkJoin(
        Array.from({ length: 200 }, (_, index) => index + 1).map((id) =>
          this.http.get(`${this.productUrl}${id}`)
        )
      ).pipe(
        catchError((errors) => of(errors)),
        finalize(() => {
          this.progress = (++this.counter / 200) * 100;
        })
      ),
        share({
          connector: () => new ReplaySubject(1),
          resetOnRefCountZero: true,
          resetOnComplete: true,
          resetOnError: true,
        });
    }
    return this.getAllPokemon$;
  }

  //Adds Pokemon to users PokeIndex-----------------------
  updatePokemon(pokemon: any, id: number | null): Observable<any> {
    const url = `${this.apiUrl}/${id}/addPokemon`;
    return this.http
      .post<any>(url, pokemon, { headers: environment.headers })
      .pipe(catchError(this.handleError));
  }

  deleteUserPokeBalls(
    pokeBalls: number,
    userId: number | null
  ): Observable<Number> {
    return this.http
      .post<Number>(
        `https://pokemon-trading-backend-dd013c59e9a7.herokuapp.com/timer/${userId}/deletePokeBalls`,
        pokeBalls,
        { headers: environment.headers }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occured: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}


