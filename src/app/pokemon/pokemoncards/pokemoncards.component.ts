import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { PokemonService } from '../pokemon.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  throwError,
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
export class PokemonCardsComponent {
  private _searchFilter = '';
  get searchFilter(): string {
    return this._searchFilter;
  }
  set searchFilter(value: string) {
    this._searchFilter = value;
  }

  //Filter Pokemon from Search Bar
  private onSearchSubject = new BehaviorSubject<string>('');
  searchInput$ = this.onSearchSubject.asObservable();

  currentUser$ = this.userProfileService.currentUser$;
  allFetchedPokemon$ = this.pokemonService.getAllPokemon$;

  //Hot Observable that filters api pokemon based on user input
  searchedPokemon$ = combineLatest([this.allFetchedPokemon$, this.searchInput$]).pipe(
    map(([pokemon, searchInput]) =>
      pokemon.filter((pokemon: Pokemon) =>
        pokemon.name.toLowerCase().includes(searchInput)
      )
    ),
    catchError(() => {
      return throwError(() => new Error("Failed to search for pokemon"))
    })
  );

  //combine searchPokemon and currentUser to subscribe in template
  pokemonCardData$: Observable<any> = combineLatest({
    searchedPokemon: this.searchedPokemon$,
    user: this.currentUser$
  });

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
    this.dialog.open(PokemonguardComponent, {
      width: '450px'
    });
  }
  //adds poke if user signed in else calls pokemon guard to open dialog
  addToCollection(poke: any, userId: number, userPokeBalls: number): void {
    if(userId !== null && userId > 0){
      this.updatePokemon(poke, userId, userPokeBalls);
    }else{
      this.pokemonGuard();
    }
  }

  //----------------------add pokemon to an existing users pokeIndex----------------
  updatePokemon(pokemon: any, userPokeBalls: number, userId: number): void {
    //Trade can not be complete
    if (userPokeBalls != null && userPokeBalls < 5) {
      this.insufficientPokeBallsSnackBar(
        'You do not have enough Poke Balls at this time!',
        'Close'
      );
      return;
    }

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

    //Persists the clicked pokemon to the users pokemon collection
    this.pokemonService.updatePokemon(newPoke,userId)
    //updates users pokemonballs on the backend
    this.pokemonService.deleteUserPokeBalls(5,userId)

    //updating userPokeBalls in component variable
    if (userPokeBalls != null) {
        userPokeBalls -= 5;
    }

    //successful catch snackBar
    this.caughtPokemonSnackBar(
      `Success, Check your Poke Index. ${userPokeBalls} Poke Balls left`,
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
}
