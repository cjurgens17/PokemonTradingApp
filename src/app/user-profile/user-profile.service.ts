import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';
import { User } from '../user-info/user-info';

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
//-----------------------------------------------------this is to get user info
//-----------------right now we are using the local storage
  getUserInformation(id: number): Observable<User> {
    const path = `${this.userUrl}/${id}/userInfo`;
    return this.http.get<User>(path).pipe(
      catchError(this.handleError)
    )
  }
//-------------------------------------------------------------------------

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

  //auth service for user-profile guard, if user is signed it will retrun true
  //else it will return false;
  //update this when we implement a behavior subject??
   isLoggedIn(): boolean {
    let user = JSON.parse(localStorage.getItem('userLoginInfo') || '{}');
    const id = user.id;

    if(id >= 1){
      return true;
    }
    return false;
  }
}
