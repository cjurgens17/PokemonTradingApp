import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../sign-up/user-info';
import { Observable, Subject, catchError, combineLatest, filter, map, switchMap, tap, throwError } from 'rxjs';
import { Pokemon } from '../pokemon/pokemon';

@Injectable({
  providedIn: 'root'
})
export class AllUsersService {


  private userUrl = 'https://pokemon-trading-backend-dd013c59e9a7.herokuapp.com/user';

  //cold observable which gets a list of users from database
  allUsers$ = this.http.get<User[]>(`${this.userUrl}/getAllUsers`)
  .pipe(
    tap(data => console.log(`All Users: `, JSON.stringify(data))),
    catchError(this.handleError)
  )

  //subject for selected User
  private userSelectedSubject = new Subject<number>();
  userSelectedAction$ = this.userSelectedSubject.asObservable();

  //Hot Observable that reacts to client side selected User
  selectedUser$ = combineLatest([
    this.allUsers$,
    this.userSelectedAction$
  ]).pipe(
    map(([allUsers,userSelected]) =>
    allUsers.find(user => user.id === userSelected)),
    tap(data => console.log(`User Selected: `, JSON.stringify(data))),
    catchError(this.handleError)
  );

  userPokemon$ = this.selectedUser$
  .pipe(
    filter(user => Boolean(user)),
    switchMap((user) => {
      return this.http.get<Pokemon[]>(`${this.userUrl}/${user?.id}/userPokemon`)
    })
  );

  private userSelectedPokemonSubject = new Subject<string>();
  userSelectedPokemonAction$ = this.userSelectedPokemonSubject.asObservable();

    //Hot Observable that returns a selected pokemon from user-detail component
  clickedPokemon$ = combineLatest([
    this.userPokemon$,
    this.userSelectedPokemonAction$
  ])
  .pipe(
    map(([userPokemon,userSelectedPokemon]) =>
    userPokemon.find(poke => poke.name === userSelectedPokemon)),
    tap(data => console.log(`Selected Pokemon: `, JSON.stringify(data))),
    catchError(this.handleError)
    );



  constructor(private http: HttpClient) { }


    //method for selected user that passes in an id
    onSelected(id:number): void {
      this.userSelectedSubject.next(id);
    }

    //method that passes pokemon name to subject
    onTap(name: string): void {
      this.userSelectedPokemonSubject.next(name);
    }

    //error handling
  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
