import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, catchError, combineLatest, filter, find, map, startWith, tap } from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { InboxComponent } from '../inbox/inbox.component';
import { InboxShellComponent } from '../inbox/inbox-shell.component';


@Component({
  selector: 'app-user-home',
  templateUrl: "./user-home.component.html",
  styleUrls: ['./user-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserHomeComponent {

  private _listFilter: string = '';
  // Loading after search
  // numCols!: number;
  // numRows!:number;

  get listFilter(): string{
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log(this.listFilter);
  }

  //Action stream for getting user input to search for a pokemon
  private filteredPokemonInputSubject = new BehaviorSubject<string>('');
  filteredPokemonInput$ = this.filteredPokemonInputSubject.asObservable();

  //Action stream for getting clicked pokemons name
  private clickedPokemonSubject = new BehaviorSubject<string>('');
  clickedPokemonInput$ = this.clickedPokemonSubject.asObservable();

  //Action Stream for handling errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  //Cold Observable that grabs the current Users information
  currentUser$ = this.userProfileService.currentUser$;

  //Cold Observable that grabs all users pokemon and sorts them by name order
  userPokemon$ = this.userProfileService.userPokemon$
  .pipe(
    map((pokemon) => {
      return pokemon.sort((a,b) => a.index - b.index);
    }),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  //Hot Observable that displays filtered pokemon based off user input
  filteredPokemon$ = combineLatest([
    this.userPokemon$,
    this.filteredPokemonInput$
  ])
  .pipe(
    map(([userPokemon, filteredInput]) =>
    userPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(filteredInput)).sort()),
    catchError( err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )
    //Hot Observable that passes latest clicked pokemon
    clickedPokemon$ = combineLatest([
      this.userPokemon$,
      this.clickedPokemonInput$
    ])
    .pipe(
      map(([pokemon, clicked]) =>
      pokemon.find((poke)=>poke.name === clicked)),
      tap(data => console.log('Clicked Pokemon: ', data)),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

    //combining all Observables together for HTML ease
    userProfile$ = combineLatest([
      this.clickedPokemon$,
      this.filteredPokemon$,
      this.currentUser$
    ])
    .pipe(
      map(([clickedPokemon,filteredPokemon,currentUser]) =>
      ({clickedPokemon,filteredPokemon,currentUser})),
      catchError( err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private userProfileService: UserProfileService, private dialog: MatDialog) { }

  onFilterChange() {
    this.filteredPokemonInputSubject.next(this._listFilter);
  }

  getPokemon(name: string): void {
    this.clickedPokemonSubject.next(name);
    console.log('passed '+ name);
  }

  openInboxDialog(): void {
    //had a dialogRef eariler
  this.dialog.open(InboxShellComponent, {
      width: '900px',
      height: '900px'
    });
  }
}



