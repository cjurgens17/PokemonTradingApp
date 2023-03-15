import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from "rxjs";
import { Pokemon } from "./pokemon";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})

export class PokemonService {

    private productUrl = "https://pokeapi.co/api/v2/pokemon/";
    private userUrl = "http://localhost:8080/pokemon";

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

    addPokemon(name: String, weight: number, index: number, abilities: string[]): Observable<any> {
        const payload = {name: name, weight: weight, index: index, abilities: abilities};
        return this.http.post<any>(`${this.userUrl}/addPokemon`, payload, {headers: environment.headers}).pipe(
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