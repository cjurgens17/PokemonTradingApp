import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InboxShellComponent } from '../inbox/inbox-shell.component';
import { Inbox } from '../inbox/inbox';
import { ProfilePictureComponent } from './profile-picture.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHomeComponent implements OnInit, OnDestroy{


  userId!: number;

  private _listFilter: string = '';
  // Loading after search
  // numCols!: number;
  // numRows!:number;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log(this.listFilter);
  }
//used to unsubscribe OnDestroy
  private ngUnsubscribe = new Subject<void>();

  //profilePicture Observable
  profilePicture$ = this.userProfileService.profilePicture$;

  //Action stream for getting user input to search for a pokemon
  private filteredPokemonInputSubject = new BehaviorSubject<string>('');
  filteredPokemonInput$ = this.filteredPokemonInputSubject.asObservable();

  //Action stream for getting clicked pokemons name
  private clickedPokemonSubject = new BehaviorSubject<string>('');
  clickedPokemonInput$ = this.clickedPokemonSubject.asObservable();

  //Action Stream for handling errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  inbox$ = this.userProfileService.inbox$;

  //Cold Observable that grabs the current Users information
  currentUser$ = this.userProfileService.currentUser$;

  //Cold Observable that grabs all users pokemon and sorts them by name order
  userPokemon$ = this.userProfileService.userPokemon$.pipe(
    map((pokemon) => {
      return pokemon.sort((a, b) => a.index - b.index);
    }),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  //Hot Observable that displays filtered pokemon based off user input
  filteredPokemon$ = combineLatest([
    this.userPokemon$,
    this.filteredPokemonInput$,
  ]).pipe(
    map(([userPokemon, filteredInput]) =>
      userPokemon
        .filter((pokemon) => pokemon.name.toLowerCase().includes(filteredInput))
        .sort()
    ),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  //Hot Observable that passes latest clicked pokemon
  clickedPokemon$ = combineLatest([
    this.userPokemon$,
    this.clickedPokemonInput$,
  ]).pipe(
    map(([pokemon, clicked]) => pokemon.find((poke) => poke.name === clicked)),
    tap((data) => console.log('Clicked Pokemon: ', data)),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  //combining all Observables together for HTML ease
  userProfile$ = combineLatest([
    this.clickedPokemon$,
    this.filteredPokemon$,
    this.currentUser$,
  ]).pipe(
    map(([clickedPokemon, filteredPokemon, currentUser]) => ({
      clickedPokemon,
      filteredPokemon,
      currentUser,
    })),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(
    private userProfileService: UserProfileService,
    private dialog: MatDialog
  ) {}

  onFilterChange() {
    this.filteredPokemonInputSubject.next(this._listFilter);
  }

  getPokemon(name: string): void {
    this.clickedPokemonSubject.next(name);
  }

  openInboxDialog(): void {
    //had a dialogRef eariler
    this.dialog.open(InboxShellComponent, {
      width: '900px',
      height: '900px',
    });
  }

  openProfilePictureDialog(): void{
    let dialogRef = this.dialog.open(ProfilePictureComponent, {
      width: '500px',
      height: '500px'
    });

    dialogRef
    .afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (result) => console.log('The dialog was closed', result),
      error: (err) => console.log('Error: ', err),
    });
  }
//---------------LIFECYCLE HOOKS--------------------

ngOnInit(): void {
    //getting userId
    this.userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
    //fix inbox length, create a subject and pass to it onIT, then when delete message pass inbox back to subject/or just the length?
    this.userProfileService
      .getUserMessages(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: resp => this.userProfileService.updateInboxSubject(resp),
        error: err => console.log('err', err),
      });

      this.currentUser$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: user => this.userProfileService.updateProfilePictureSubject(user.profilePicture || '{}'),
        error: err => console.log('Error: ', err)
      })
    }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
