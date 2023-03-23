import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private userUrl = "http://localhost:8080/user";

  constructor(private http: HttpClient) {}

  getUserPokemon(id: number): Observable<Pokemon[]> {
    const path = `${this.userUrl}/${id}/userPokemon`;
    return this.http.get<Pokemon[]>(path).pipe(
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
