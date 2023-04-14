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

//Catch errors
private errorMessageSubject = new Subject<string>();
errorMessage$ = this.errorMessageSubject.asObservable();

  //Cold Observable that loads all the pokemon from the pokeApi to this page
  apiPokemon$ = this.pokemonService.getAllPokemon$
  .pipe(
    tap(data => console.log('Api Pokemon: ', data)),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private pokemonService: PokemonService, private userProfileService: UserProfileService, private userLoginService: UserLoginService) { }

  passPokemon(pokemon: any){
    const newPoke: Pokemon = {
      name: pokemon.name,
      weight: pokemon.weight,
      image: pokemon.sprites.front_shiny,
      index: pokemon.index,
      backImage: pokemon.sprites.back_shiny,
      abilities: pokemon.abilities,
      stats: pokemon.stats
    }

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
      index: pokemon.index,
      backImage: pokemon.sprites.back_shiny,
      abilities: abNames,
      stats: statNames
    }

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
