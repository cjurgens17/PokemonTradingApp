import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from './message';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private apiUrl = "http://localhost:8080/user"

  constructor(private http: HttpClient) { }

  addToUserInbox(message: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${message.username}/addMessage`, message, {headers: environment.headers})
    .pipe(
      catchError(this.handleError)
    )
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
