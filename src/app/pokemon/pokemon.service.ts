import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  mergeMap,
  scan,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private productUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private apiUrl = 'http://localhost:8080/pokemon';
  private start: number = 2;
  private limit: number = 101;

  private nextUrlSubject = new BehaviorSubject<string>(this.productUrl + 1);
  nextUrl$ = this.nextUrlSubject.asObservable();

  private pokemonSubject = new BehaviorSubject<any[]>([]);
  loadedPokemon$ = this.pokemonSubject.asObservable();

  getAllPokemon$ = this.nextUrl$.pipe(
    mergeMap((url) => this.http.get(url)),
    takeWhile(() => this.start <= this.limit),
    tap(() => this.nextUrlSubject.next(this.productUrl + this.start++)),
    scan((item, pokemon) => [...item, pokemon], [] as any[])
  );

  constructor(private http: HttpClient) {}

  //passPokemon to BS
  passPokemon(pokemon: any[]){
    this.pokemonSubject.next(pokemon);
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
        `http://localhost:8080/timer/${userId}/deletePokeBalls`,
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


