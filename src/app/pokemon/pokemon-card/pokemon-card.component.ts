import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent implements OnInit, OnDestroy {



  constructor(private router: Router, private route: ActivatedRoute, private pokemonService: PokemonService) {}

  pokemon!: Pokemon;
  sub!: Subscription;
  errorMessage: string = '';

  onBack(): void {
      this.router.navigate(['/pokemon']);
  }


  ngOnInit(): void {
      const name = String(this.route.snapshot.paramMap.get('name'));

         this.sub = this.pokemonService.getPokemon(name).subscribe({
          next: data => {
            this.pokemon = data
            this.pokemon.name = data.name
            this.pokemon.weight = data.weight
            this.pokemon.index = data.index
            this.pokemon.image = data.image
            this.pokemon.backImage = data.backImage
            this.pokemon.abilities = data.abilities
            this.pokemon.stats = data.stats
      },
      error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
  })
}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
