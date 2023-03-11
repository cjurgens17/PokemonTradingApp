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
        this.pokemon.abilities.push(data.abilities)
        this.pokemon.stats.push(data.stats)
        this.pokemons.push(this.pokemon);
  },
  error: error => {
      this.errorMessage = error.message;
      console.error('There was an error!', error);
    }
  })
}
     
  ngOnInit(): void {

  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

}
