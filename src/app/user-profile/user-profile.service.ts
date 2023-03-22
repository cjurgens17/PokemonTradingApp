import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private userUrl = "http://localhost:8080/user";

  constructor(private http: HttpClient) {}

  getUserPokemon(id: number): Observable<any> {
    const path = `${this.userUrl}/${id}/userPokemon`;
    return this.http.get<any>(path).pipe(
      map(pokemon => pokemon.map((poke: { name: any; image: any; index: any; backImage: any; abilities: any; stats: any; weight: any }) => ({
        name: poke.name,
        weight: poke.weight,
        image: poke.image,
        index: poke.index,
        backImage: poke.backImage,
        abilities: poke.abilities,
        stats: poke.stats
      }))),
      catchError(this.handleError)
    )
  }

  private handleError(err: HttpErrorResponse){

    let errorMessage= '';
    if(err.error instanceof ErrorEvent){
      errorMessage = `An error occured: ${err.error.message}`;
    }else{
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
