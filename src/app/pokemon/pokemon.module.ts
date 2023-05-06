import { NgModule } from '@angular/core';
import { PokemonCardsComponent } from './pokemoncards/pokemoncards.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PokemonCardsComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: 'pokemon', component: PokemonCardsComponent}
    ]),
    SharedModule,
  ]
})
export class PokemonModule { }
