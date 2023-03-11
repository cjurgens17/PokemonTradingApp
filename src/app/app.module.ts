import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PokemonCardsComponent } from './pokemoncards/pokemoncards.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokemonCardComponent } from './pokemon/pokemon-card.component';
import { PokemonCardGuard } from './pokemon/pokemon-card.guard';


@NgModule({
  declarations: [
    AppComponent,
    PokemonCardsComponent, 
    HomeComponent,
    PokemonCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'pokemon', component: PokemonCardsComponent},
      {
        path: 'pokemonCard/:name',
        canActivate: [PokemonCardGuard],
        component: PokemonCardComponent
        },
      {path: '', redirectTo: 'home', pathMatch:'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
