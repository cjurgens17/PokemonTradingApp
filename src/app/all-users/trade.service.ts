import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from './message';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  private apiUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}
  //adding messages to users inbox
  addToUserInbox(message: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${message.username}/addMessage`, message, {
        headers: environment.headers,
      })
      .pipe(catchError(this.handleError));
  }

  //adding decline message  to users inbox
  addDeclineMessage(message: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${message.username}/addMessage`, message, {
        headers: environment.headers,
      })
      .pipe(catchError(this.handleError));
  }

  //update isTraded on message
  updateIsTraded(message: Message): Observable<Message> {
    return this.http
      .post<Message>(
        `${this.apiUrl}/${message.username}/updateIsTraded`,
        message,
        { headers: environment.headers }
      )
      .pipe(catchError(this.handleError));
  }

  //deleting messages from users inbox
  deleteUserMessage(message: Message): Observable<Boolean> {
    const options = { headers: environment.headers, body: message };
    return this.http
      .delete<Boolean>(`${this.apiUrl}/deleteMessage`, options)
      .pipe(catchError(this.handleError));
  }

  //checking if users have current pokemon
  checkUsersPokemon(
    username: string,
    currentUsername: string,
    userPokemon: string,
    tradePokemon: string
  ): Observable<Boolean> {
    return this.http
      .get<Boolean>(
        `${this.apiUrl}/${username}/${currentUsername}/${userPokemon}/${tradePokemon}/checkPokemon`,
        { headers: environment.headers }
      )
      .pipe(catchError(this.handleError));
  }
  //adds and deletes pokemon to each users pokeIndex
  completeTrade(
    username: string,
    currentUsername: string,
    userPokemon: string,
    tradePokemon: string
  ): Observable<Boolean> {
    //data object to be received on backend
    const trade = {
      username: username,
      currentUsername: currentUsername,
      userPokemon: userPokemon,
      tradePokemon: tradePokemon,
    };

    return this.http
      .post<Boolean>(`${this.apiUrl}/tradePokemon`, trade, {
        headers: environment.headers,
      })
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
