import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from './pokemon/pokemon.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
})

export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  constructor(private pokemonService: PokemonService) {}


  ngOnInit(): void {
    //loading Pokemon eagerly and passing to BS in pokemon service to fill
    //pokemon component
   this.pokemonService.getAllPokemon$.pipe(
    takeUntil(this.ngUnsubscribe)
   )
   .subscribe((data) =>  this.pokemonService.passPokemon(data));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

