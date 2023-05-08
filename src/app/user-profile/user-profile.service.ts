import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  filter,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';
import { User } from '../sign-up/user-info';
import { UserLoginService } from '../user-login/user-login-service';
import { Message } from '../all-users/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private userUrl = 'http://localhost:8080/user';

  private currentUserPokemonSubject = new BehaviorSubject<Pokemon[]>([]);
  currentUserPokemon$ = this.currentUserPokemonSubject.asObservable()
  .pipe(
    map((pokemon) => {
      return pokemon.sort((a, b) => a.index - b.index);
    })
  );

  private inboxSubject = new BehaviorSubject<Message[]>([]);
  inbox$ = this.inboxSubject.asObservable()
  .pipe(
    map((message) => {
      return message.sort((a, b) => a.id - b.id);
    })
  );

  private profilePictureSubject = new BehaviorSubject<string>('');
  profilePicture$ = this.profilePictureSubject.asObservable();

  currentUserLogin$ = this.userLoginService.getCurrentUser();

  currentUser$ = this.currentUserLogin$.pipe(
    filter((userLogin) => Boolean(userLogin)),
    switchMap((userLogin) => {
      if (userLogin?.username) {
        return this.http.get<User>(`${this.userUrl}/${userLogin.username}`);
      } else {
        return EMPTY;
      }
    }),
    tap((user) => console.log(`current User`, user))
  );

  constructor(
    private http: HttpClient,
    private userLoginService: UserLoginService
  ) {}
  //UPDATING SUBJECT METHODS---------------------------------------------------------
  passUserPokemon(pokemonArray: Pokemon[]) {
    this.currentUserPokemonSubject.next(pokemonArray);
  }

  updateInboxSubject(messages: Message[]): void {
    this.inboxSubject.next(messages);
  }

  updateProfilePictureSubject(picture: string): void {
    this.profilePictureSubject.next(picture);
  }

  //------------------------------------------HTTP CALLS---------------------------------------
  //gets users messages
  getUserMessages(id: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.userUrl}/${id}/userMessages`).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfilePicture(
    id: number,
    profilePicture: string
  ): Observable<Boolean> {
    return this.http
      .post<Boolean>(
        `${this.userUrl}/${id}/updateProfilePicture?profilePicture=${profilePicture}`,
        profilePicture,
        { headers: environment.headers }
      )
      .pipe(catchError(this.handleError));
  }

  getUserPokemon(id: number): Observable<Pokemon[]> {
    return this.http
      .get<Pokemon[]>(`${this.userUrl}/${id}/userPokemon`, {
        headers: environment.headers,
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  //------Error handler------------------------
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

  //auth service for user-profile guard, if user is signed it will retrun true
  //else it will return false;
  //update this when we implement a behavior subject??
  isLoggedIn(): boolean {
    let user = JSON.parse(localStorage.getItem('userLoginInfo') || '{}');
    const id = user.id;

    if (id >= 1) {
      return true;
    }
    return false;
  }
}
