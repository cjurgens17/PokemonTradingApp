import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from './pokemon.service';
import { Subscription } from 'rxjs';
import { Pokemon } from './pokemon';


@Component({
  selector: 'app-practice',
  templateUrl: './pokemoncards.component.html',
  styleUrls: ['./pokemoncards.component.css']
})
export class PokemonCardsComponent implements OnInit, OnDestroy {

  constructor(private pokemonService: PokemonService) { }

  pokemon!: Pokemon;
  pokemons: Pokemon[] = [];
  sub!: Subscription;
  errorMessage: string = '';
  pageTitle: string = 'Welcome'
  showImage: boolean = true;
  imageWidth: number = 100;
  imageMargin: number = 2;
  specificPokemon: string = '';
  find: boolean = true;
  show: boolean = true;
  hide: boolean = false;

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  onImageClicked(): void {

  }

  getPokemon(): void {
    this.sub = this.pokemonService.getPokemon(this.specificPokemon).subscribe({
      next: data => { 
        this.pokemon = data
        this.pokemon.name = data.name
        this.pokemon.weight = data.weight
        this.pokemon.index = data.index
        this.pokemon.image = data.image
        this.pokemon.backImage = data.backImage
        this.pokemon.abilities = data.abilities
        this.pokemon.stats = data.stats
        this.pokemons.push(this.pokemon);
  },
  error: error => {
      this.errorMessage = error.message;
      console.error('There was an error!', error);
    }
  })
}

addPokemon(name: string, weight: number, index: number, abilities: any[]): void {
  console.log(name + " " + weight + " " + index);
  console.log('abilities: ',abilities);
  //Here I need to map my any array into a string array of all the ability names
  const abNames: string[] = []; 
  
  for(var i = 0; i < abilities.length; i++) {
    abNames.push(abilities[i].ability.name);
}

console.log('abNames: ',abNames)


    this.pokemonService.addPokemon(name, weight, index, abNames).subscribe({
      next: response => {
        console.log('Response: ', response)
      },
      error: err  => {
        console.log('Error: ', err)
      }
    });
}
     
  ngOnInit(): void {

  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

}
