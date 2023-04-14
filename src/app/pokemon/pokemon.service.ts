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
    private userUrl = "http://localhost:8080/pokemon";
    private apiUrl = "http://localhost:8080/pokemon";
    private limit: number = 20;
    start: number = 1;



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
//this gets pokemon from an offshore pokeAPI---------------------------------
    getPokemon(name: string): Observable<any> {
        return this.http.get<any>(this.productUrl + name.toLowerCase()).pipe(
            map((response => ({
              name: response.name,
              weight: response.weight,
              image: response.sprites.front_shiny,
              index: response.id,
              backImage: response.sprites.back_shiny,
              abilities: response.abilities,
              stats: response.stats
            }))),
            catchError(this.handleError)
        );
    }
    //--------------------------------------------------------------------------
//adds pokemon to database
    addPokemon(name: String, weight: number, index: number, abilities: string[], statNames: string[], stats: number[], image: string, backImage: string): Observable<any> {
        const payload = {name: name, weight: weight, index: index, abilities: abilities, statNames: statNames, baseStat: stats, image: image, backImage: backImage};
        return this.http.post<any>(`${this.userUrl}/addPokemon`, payload, {headers: environment.headers}).pipe(
            catchError(this.handleError)
        );
    }


    //Adds Pokemon to users PokeIndex-----------------------
    updatePokemon(pokemon: Pokemon, id: number): Observable<any>{
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
