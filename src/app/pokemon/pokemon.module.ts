import { NgModule } from '@angular/core';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';
import { PokemonCardsComponent } from './pokemoncards/pokemoncards.component';
import { RouterModule } from '@angular/router';
import { PokemonCardGuard } from './pokemon-card/pokemon-card.guard';
import { SharedModule } from '../shared/shared.module';
import { UserInfoModule } from '../user-info/user-info.module';

@NgModule({
  declarations: [
    PokemonCardComponent,
    PokemonCardsComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: 'pokemon', component: PokemonCardsComponent},
      {
        path: 'pokemonCard/:name',
        canActivate: [PokemonCardGuard],
        component: PokemonCardComponent
        }
    ]),
    SharedModule,
    UserInfoModule
  ]
})
export class PokemonModule { }
