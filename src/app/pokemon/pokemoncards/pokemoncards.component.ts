import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { BehaviorSubject, EMPTY, Subject, Subscription, catchError, combineLatest, map, scan, tap } from 'rxjs';
import { Pokemon } from '../pokemon';
import { UserProfileService } from 'src/app/user-profile/user-profile.service';
import { UserLoginService } from 'src/app/user-login/user-login-service';



@Component({
  selector: 'app-practice',
  templateUrl: './pokemoncards.component.html',
  styleUrls: ['./pokemoncards.component.css']
})
export class PokemonCardsComponent {

  private _searchFilter = '';
  numColumns: number = 5;
  numRows!: number;

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

  //Cold Observable that loads all the pokemon from the pokeApi to this page
  apiPokemon$ = this.pokemonService.getAllPokemon$
  .pipe(
    tap(data => console.log('Api Pokemon: ', data)),
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
    tap(pokemon => this.numColumns = pokemon.length < 5 ? pokemon.length : 5),
    tap(pokemon => this.numRows = this.numColumns > 1 ? Math.ceil(pokemon.length/this.numColumns) : 1),
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
