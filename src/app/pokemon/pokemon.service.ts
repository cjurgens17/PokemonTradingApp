import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, map, mergeMap, scan, takeWhile, tap, throwError } from "rxjs";
import { Pokemon } from "./pokemon";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})

export class PokemonService {

    private productUrl = "https://pokeapi.co/api/v2/pokemon/";
    private apiUrl = "http://localhost:8080/pokemon";
    private limit: number = 20;
    private start: number = 1;

  private nextUrlSubject = new BehaviorSubject<string>(this.productUrl+this.start);
  nextUrl$ = this.nextUrlSubject.asObservable();

  getAllPokemon$ = this.nextUrl$
    .pipe(
       mergeMap(url => this.http.get(url)),
       takeWhile(() => this.start <= this.limit),
       tap(() => this.nextUrlSubject.next(this.productUrl + this.start++)),
      scan((item, pokemon) => [...item, pokemon], [] as any[]),
    );

  constructor (private http: HttpClient) { }

    //Adds Pokemon to users PokeIndex-----------------------
    updatePokemon(pokemon: any, id: number): Observable<any>{
        const url = `${this.apiUrl}/${id}/addPokemon`;
        return this.http.post<any>(url, pokemon, {headers: environment.headers}).pipe(
            catchError(this.handleError)
        )
    }
    //---------------------------------------------------------------------------------------------

    private handleError(err: HttpErrorResponse){

        let errorMessage = '';
        if(err.error instanceof ErrorEvent){
            errorMessage = `An error occured: ${err.error.message}`;
        }else{
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(() => errorMessage);
    }

}
