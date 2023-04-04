import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AllUsersService } from './all-users.service';
import { EMPTY, Subject, catchError, combineLatest, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokeDetailComponent  {
src = 'https:encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu30k6P3xZgweDq8xtx3ZV1j9wKLqm_8ycbg&usqp=CAU';
//pagetitle
//Hot Observable for error messages
private errorMessageSubject = new Subject<string>();
errorMessage$ = this.errorMessageSubject.asObservable();

clickedPokemon$ = this.allUsersService.clickedPokemon$
.pipe(
  tap(data => console.log(`CLicked Pokemon: `, JSON.stringify(data))),
  catchError( err => {
    this.errorMessageSubject.next(err);
    return EMPTY;
  })
);

//Reacting to title Page for HTML
pageTitle$ = this.clickedPokemon$
.pipe(
  map(p => p ? `${p.name}` : null),
  catchError( err => {
    this.errorMessageSubject.next(err);
    return EMPTY;
  })
);

//Combines all observables for ease of flow into HTML
pokeDetail$ = combineLatest([
  this.clickedPokemon$,
  this.pageTitle$
])
.pipe(
  filter(p => Boolean(p)),
  map(([clickedPokemon, pageTitle]) =>
  ({clickedPokemon,pageTitle})),
  catchError( err => {
    this.errorMessageSubject.next(err);
    return EMPTY;
  })
)

  constructor(private allUsersService: AllUsersService) { }

  replaceImage(event: any): void{
    if(event){
      event.target.src = this.src
    }
  }

}
