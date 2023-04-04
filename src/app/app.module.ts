import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserInfoModule } from './user-info/user-info.module';
import { UserLoginModule } from './user-login/user-login.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { AllUsersShellComponent } from './all-users/all-users-shell.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AllUsersDetailsComponent } from './all-users/all-users-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AllUsersShellComponent,
    AllUsersComponent,
    AllUsersDetailsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'users', component: AllUsersShellComponent},
      {path: '', redirectTo: 'home', pathMatch:'full'},
      {path: '**', redirectTo: 'home', pathMatch: 'full'},
      {path: 'usersignup', loadChildren: () => import('./user-info/user-info.module').then(m => m.UserInfoModule)},
      {path: 'userlogin', loadChildren: () => import('./user-login/user-login.module').then(m => m.UserLoginModule)},
      {path: 'userprofile', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)},
      {path: 'usersignup', loadChildren: () => import('./pokemon/pokemon.module').then(m => m.PokemonModule)}
    ]),
    PokemonModule,
    UserInfoModule,
    UserLoginModule,
    UserProfileModule,
    SharedModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
