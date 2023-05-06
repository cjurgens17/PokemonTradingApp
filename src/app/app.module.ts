import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserLoginModule } from './user-login/user-login.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { AllUsersShellComponent } from './all-users/all-users-shell.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AllUsersDetailsComponent } from './all-users/all-users-details.component';
import { PokeDetailComponent } from './all-users/poke-detail.component';
import { FooterComponent } from './footer/footer.component';
import { TradeComponent } from './all-users/trade.component';
import { PokeballsModule } from './pokeballs/pokeballs.module';
import { SignUpComponent } from './sign-up/sign-up.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AllUsersShellComponent,
    AllUsersComponent,
    AllUsersDetailsComponent,
    PokeDetailComponent,
    FooterComponent,
    TradeComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'users', component: AllUsersShellComponent},
      {path: 'signup', component: SignUpComponent},
      {path: '', redirectTo: 'home', pathMatch:'full'},
      {path: '**', redirectTo: 'home', pathMatch: 'full'},
      {path: 'userlogin', loadChildren: () => import('./user-login/user-login.module').then(m => m.UserLoginModule)},
      {path: 'userprofile', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)},
      {path: 'pokemon', loadChildren: () => import('./pokemon/pokemon.module').then(m => m.PokemonModule)},
      {path: 'pokeballs', loadChildren: ()=> import('./pokeballs/pokeballs.module').then(m => m.PokeballsModule)}
    ]),
    PokemonModule,
    UserLoginModule,
    UserProfileModule,
    PokeballsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
