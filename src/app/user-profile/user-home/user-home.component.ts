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
import { MatDialog } from '@angular/material/dialog';
import { InboxShellComponent } from '../inbox/inbox-shell.component';
import { ProfilePictureComponent } from './profile-picture.component';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHomeComponent implements OnInit, OnDestroy{

  signedIn!:boolean;
  imageUrl:string = 'assets/static/images/profileBackground.jpg';

  userId: number = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
  private _listFilter: string = '';


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

  //Observer of BS in userprofileService
  currentUserPokemon$ = this.userProfileService.getUserPokemon(this.userId) .pipe(
    map((pokemon) => {
      return pokemon.sort((a, b) => a.index - b.index);
    }));

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

  //Hot Observable that displays filtered pokemon based off user input
  filteredPokemon$ = combineLatest([
    this.currentUserPokemon$,
    this.filteredPokemonInput$,
  ]).pipe(
    map(([currentUserPokemon, filteredInput]) =>
      currentUserPokemon
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
    this.currentUserPokemon$,
    this.clickedPokemonInput$,
  ]).pipe(
    map(([pokemon, clicked]) => pokemon.find((poke) => poke.name === clicked)),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  //combining all Observables together for HTML ease
  userProfile$ = combineLatest([
    this.clickedPokemon$,
    this.currentUser$,
  ]).pipe(
    map(([clickedPokemon, currentUser]) => ({
      clickedPokemon,
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
  ) {
    //load background
    this.preload();
  }

  onFilterChange() {
    this.filteredPokemonInputSubject.next(this._listFilter);
  }

  getPokemon(name: string): void {
    this.clickedPokemonSubject.next(name);
  }

  openInboxDialog(): void {
    //had a dialogRef eariler
    this.dialog.open(InboxShellComponent, {
      width: '800px',
      height: '500px',
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

  //load background
  preload(): void {
    const bImage: HTMLImageElement = new Image();
    bImage.src = this.imageUrl;

    bImage.onload = () => {
      let bElement = document.querySelector('#bg') as HTMLElement;
      bElement.style.backgroundImage = `url(${bImage.src})`;
    }
  }
//---------------LIFECYCLE HOOKS--------------------

ngOnInit(): void {
    //getting userId
    //to address all of these subscriptions -> Need global state -> BehaviorSubject for UserId -> create http request dependent on the userid -> if userId is < 0, we just return, else we make the server call -> in this component we initialize our observable streams to these http calls -> combineLatest or however we want to handle that data -> in the template when we subscribe we will have all of the users data each time we load this component -> Only caveat is not having absolute real-time data, but this out of the scope of this project anyways -> so this is a solution we can implement soon.
    if(this.userId > 0){
    this.signedIn = true;
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
  }else{
    this.signedIn = false;
  }

    }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
