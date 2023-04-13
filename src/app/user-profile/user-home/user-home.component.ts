import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, catchError, combineLatest, filter, map, startWith, tap } from 'rxjs';
import { UserProfileService } from '../user-profile.service';


@Component({
  selector: 'app-user-home',
  templateUrl: "./user-home.component.html",
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent {

  showPokemon: boolean = false;
  errorMessage: string = '';

  private _listFilter: string = '';

  get listFilter(): string{
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log(this.listFilter);
  }

  //find out how to pass listfilter into action stream to filtered products updates

  //Action stream for getting user input to search for a pokemon
  private filteredPokemonInputSubject = new Subject<string>();
  filteredPokemonInput$ = this.filteredPokemonInputSubject.asObservable();

  //Action Stream for handling errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  currentUser$ = this.userProfileService.currentUser$;
  userPokemon$ = this.userProfileService.userPokemon$;

//start with operator????
  filteredPokemon$ = combineLatest([
    this.userPokemon$,
    this.filteredPokemonInput$
  ]).pipe(
    map(([userPokemon, filteredInput]) =>
    userPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(filteredInput))),
    tap(data => console.log('Filrtered POkemon: ', data)),
    catchError( err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  constructor(private userProfileService: UserProfileService) { }

  togglePokemon(): void {
    this.showPokemon = !this.showPokemon;
  }

  onFilterChange() {
    this.filteredPokemonInputSubject.next(this._listFilter);
  }
}



