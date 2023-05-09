import { NgModule } from '@angular/core';
import { PokemonCardsComponent } from './pokemoncards/pokemoncards.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PokemonguardComponent } from './pokemonguard/pokemonguard.component';


@NgModule({
  declarations: [
    PokemonCardsComponent,
    PokemonguardComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: 'pokemon', component: PokemonCardsComponent}
    ]),
    SharedModule,
  ]
})
export class PokemonModule { }
