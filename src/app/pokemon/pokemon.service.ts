import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class PokemonService {

    private productUrl = "https://pokeapi.co/api/v2/pokemon/";

    constructor (private http: HttpClient) {}

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