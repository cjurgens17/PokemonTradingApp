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
//getPokemon---------------------------------------------
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
//addPokemon--------------------------------------
addPokemon(name: string, weight: number, index: number, abilities: any[], stats: any[], image: string, backImage: string): void {
  console.log(name + " " + weight + " " + index);
  console.log('abilities: ',abilities);
  console.log('stats', stats);
  //Here I need to map my any array into a string array of all the ability names
  const abNames: string[] = []; 
  const statNames: string[] =[];
  const baseStat: number[] = [];
  
for(var i = 0; i < abilities.length; i++) {
    abNames.push(abilities[i].ability.name);
}

for(var i = 0;i< stats.length;i++){
  statNames.push(stats[i].stat.name);
  baseStat.push(stats[i].base_stat);
}

console.log('abNames: ',abNames)
console.log('StatName: ', statNames);
console.log('BaseStat: ', baseStat);

    this.pokemonService.addPokemon(name, weight, index, abNames, statNames, baseStat, image, backImage).subscribe({
      next: response => {
        console.log('Response: ', response)
      },
      error: err  => {
        console.log('Error: ', err)
      }
    });
}
   //------------------------------  
  ngOnInit(): void {

  }
//-----------------------------------
  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

}
