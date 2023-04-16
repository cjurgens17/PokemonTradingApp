import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AllUsersService } from './all-users.service';
import { EMPTY, Subject, catchError, combineLatest, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-all-users-details',
  templateUrl: './all-users-details.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllUsersDetailsComponent {

  //for error handling: Hot Observable
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  //Hot Observable which will update on every new selected User
  user$ = this.allUsersService.selectedUser$
  .pipe(
    catchError( err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

    //Cold Observabel that retireves users first last name
  pageTitle$ = this.user$
  .pipe(
    map(u => u ? `${u.firstName} ${u.lastName} Profile Page` : null)
  )

    //Hot Observable that gets users pokemon based on the user which is selected
  userPokemon$ = this.allUsersService.userPokemon$
  .pipe(
    tap(data => console.log(`User pokemon: `, JSON.stringify(data))),
    catchError( err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
    //Combining all observables together for better flow in HTML
  userDetails$ = combineLatest([
    this.user$,
    this.pageTitle$,
    this.userPokemon$
  ])
  .pipe(
    filter(([user]) => Boolean(user)),
    map(([user,pageTitle,userPokemon]) =>
    ({user,pageTitle,userPokemon})),
    catchError( err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private allUsersService: AllUsersService) { }

    //function to pass pokemon to service function which will update a subject to pass to poke-detail component
    onTap(name: string): void {
      this.allUsersService.onTap(name);
    }

}
