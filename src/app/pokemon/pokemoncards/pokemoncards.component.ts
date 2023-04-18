import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { BehaviorSubject, EMPTY, Subject, catchError, combineLatest, map, tap } from 'rxjs';
import { Pokemon } from '../pokemon';




@Component({
  selector: 'app-practice',
  templateUrl: './pokemoncards.component.html',
  styleUrls: ['./pokemoncards.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonCardsComponent {

  private _searchFilter = '';
  // Loading after Search
  // numColumns!: number;
  // numRows!: number;

  get searchFilter(): string {
    return this._searchFilter;
  }

  set searchFilter(value: string) {
    this._searchFilter = value;
    console.log(this.searchFilter);
  }
//Catch errors
private errorMessageSubject = new Subject<string>();
errorMessage$ = this.errorMessageSubject.asObservable();

//Filter Pokemon from Search Bar
private onSearchSubject = new BehaviorSubject<string>('');
searchInput$ = this.onSearchSubject.asObservable();

  //Cold Observable that loads all the pokemon from the pokeApi to this page and sorts by name
  apiPokemon$ = this.pokemonService.getAllPokemon$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
//Hot Observable that filters api pokemon based on user input
  searchedPokemon$ = combineLatest([
    this.apiPokemon$,
    this.searchInput$,
  ])
  .pipe(
    map(([apiPokemon,searchInput]) =>
    apiPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(searchInput))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  constructor(private pokemonService: PokemonService) { }

  onSearchChange(): void {
    this.onSearchSubject.next(this._searchFilter);
  }

//----------------------add pokemon to an existing users pokeIndex----------------
  updatePokemon(pokemon: any): void{
    const abNames: string[] = [];
    const statNames: string[] =[];
    let savedUser = JSON.parse(localStorage.getItem('userLoginInfo') || '{}');
    const userId = savedUser.id;

  for(var i = 0; i < pokemon.abilities.length; i++) {
    abNames.push(pokemon.abilities[i].ability.name);
  }

  for(var i = 0;i< pokemon.stats.length;i++){
    statNames.push(pokemon.stats[i].stat.name);
  }
    const newPoke: Pokemon = {
      name: pokemon.name,
      weight: pokemon.weight,
      image: pokemon.sprites.front_shiny,
      index: pokemon.id,
      backImage: pokemon.sprites.back_shiny,
      abilities: abNames,
      stats: statNames
    }
    console.log(newPoke.index);
    console.log(newPoke);

    this.pokemonService.updatePokemon(newPoke, userId).subscribe({

      next: response => {
        console.log('Respons: ', response);
      },

      error: err => {
        console.log('Error: ', err);
      }
    });
  }

}
