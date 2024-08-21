import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PokemonService } from '../pokemon.service';
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
import { Pokemon } from '../pokemon';
import { UserProfileService } from 'src/app/user-profile/user-profile.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { PokemonguardComponent } from '../pokemonguard/pokemonguard.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-practice',
  templateUrl: './pokemoncards.component.html',
  styleUrls: ['./pokemoncards.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardsComponent implements OnInit, OnDestroy {
  private userPokeBalls!: number | null;
  private userId!: number | null;
  private _searchFilter = '';

  get searchFilter(): string {
    return this._searchFilter;
  }

  set searchFilter(value: string) {
    this._searchFilter = value;
    console.log(this.searchFilter);
  }

  private ngUnsubscribe = new Subject<void>();

  //Catch errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  //Filter Pokemon from Search Bar
  private onSearchSubject = new BehaviorSubject<string>('');
  searchInput$ = this.onSearchSubject.asObservable();

  //Cold Observable that gets the currentUser info
  currentUser$ = this.userProfileService.currentUser$;

  allFetchedPokemon$ = this.pokemonService.getAllPokemonTest$;


  //Hot Observable that filters api pokemon based on user input
  searchedPokemon$ = combineLatest([this.allFetchedPokemon$, this.searchInput$]).pipe(
    map(([pokemon, searchInput]) =>
      pokemon.filter((pokemon: Pokemon) =>
        pokemon.name.toLowerCase().includes(searchInput)
      )
    ),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(
    private pokemonService: PokemonService,
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  //------------------------Functions-----------------------------------
  onSearchChange(): void {
    this.onSearchSubject.next(this._searchFilter.toLowerCase());
  }
  //guard if no user signed in
  pokemonGuard(): void {
    let dialogRef = this.dialog.open(PokemonguardComponent, {
      width: '450px'
    })

    dialogRef
    .afterClosed()
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe({
      next: res => console.log('Dialog was closed', res),
      error: err => console.log('Error', err)
    });
  }
  //adds poke if user signed in else calls pokemon guard to open dialog
  addToCollection(poke: any): void {
    if(this.userId !== null && this.userId > 0){
      this.updatePokemon(poke);
    }else{
      this.pokemonGuard();
    }
  }

  //----------------------add pokemon to an existing users pokeIndex----------------
  updatePokemon(pokemon: any): void {
    //Trade can not be complete
    if (this.userPokeBalls != null && this.userPokeBalls < 5) {
      this.insufficientPokeBallsSnackBar(
        'You do not have enough Poke Balls at this time!',
        'Close'
      );
      return;
    }

    console.log("pokemon: ",pokemon);

    const abNames: string[] = [];
    const statNames: string[] = [];

    for (var i = 0; i < pokemon.abilities.length; i++) {
      abNames.push(pokemon.abilities[i].ability.name);
    }

    for (var i = 0; i < pokemon.stats.length; i++) {
      statNames.push(pokemon.stats[i].stat.name);
    }
    const newPoke: Pokemon = {
      name: pokemon.name,
      weight: pokemon.weight,
      image: pokemon.sprites.front_shiny,
      index: pokemon.id,
      //this should be sprites.official-artwork.front-default
      backImage: pokemon.sprites.other['official-artwork'].front_default,
      abilities: abNames,
      stats: statNames,
    };
    console.log(newPoke.index);
    console.log(newPoke);

    //Persists the clicked pokemon to the users pokemon collection
    this.pokemonService
      .updatePokemon(newPoke, this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => console.log('Response: ', response),
        error: (err) => console.log('Error: ', err),
      });

    //updates users pokemonballs on the backend
    this.pokemonService
      .deleteUserPokeBalls(5, this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (pokeBalls) => console.log('Remaining PokeBalls: ', pokeBalls),
        error: (err) => console.log('Error: ', err),
      });

    //updating userPokeBalls in component variable
    if (this.userPokeBalls != null) {
      this.userPokeBalls -= 5;
    }

    //successful catch snackBar
    this.caughtPokemonSnackBar(
      `Success, Check your Poke Index. ${this.userPokeBalls} Poke Balls left`,
      'Close'
    );
  }

  //------------------------SNACKBAR--------------------------
  insufficientPokeBallsSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  caughtPokemonSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  //-----------------------LifeCycle Hooks----------------------------------------------
  ngOnInit(): void {
    this.currentUser$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (user) => {
        (this.userPokeBalls = user.pokeBalls), (this.userId = user.id);
      },
      error: (err) => console.log('Error getting User: ', err),
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
