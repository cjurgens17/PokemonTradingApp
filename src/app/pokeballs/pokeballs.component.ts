   import { Component } from '@angular/core';
import { combineLatest, map, Observable, share, shareReplay, timer } from 'rxjs';
import { PokeballsService } from './shared/services/pokeballs.service';
import { UserLoginService } from '../user-login/user-login-service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Timer } from './shared/interfaces/timer';

@Component({
  selector: 'app-pokeballs',
  templateUrl: './pokeballs.component.html',
  styleUrls: ['./pokeballs.component.css'],
})
export class PokeballsComponent {
  currentTime$: Observable<Date> = timer(0, 1000)
  .pipe(
    map(() => new Date()),
    shareReplay({bufferSize: 1, refCount: true}),
  )

  userId: number = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
  clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  collectImage: string = 'assets/static/images/collectBackground.jpg';
  //==> if currentTime > user timer get pokeball else display user timer
  currentUserTime$ = this.pokeBallsService.getUserTimer(this.userId);

  isPokeballs$ = combineLatest([this.currentUserTime$, this.currentTime$])
  .pipe(
    map(([currentUserTime, currentTime]) => (
      currentUserTime.prevDate >= new Date(currentTime.getTime())
    ))
  );

  constructor(
    private pokeBallsService: PokeballsService,
    private userLoginService: UserLoginService,
    private snackBar: MatSnackBar) {this.preloadImage();}

  //-------------------Functions----------------------------------------------------------------------
  //adds pokeBalls to user and takes away button from the DOM with structural directive in template
  resetPokemonBalls(): void {
    let newPokeBalls = 10;
    //Add to the users pokemonBalls
    this.pokeBallsService.updateUserPokeBalls(this.userId, newPokeBalls)

    //updating the timer -> change to do in the template
    this.pokeBallsService.updateTimer24(this.userId)
    this.currentUserTime$ = this.pokeBallsService.getUserTimer(this.userId);

    this.confirmPokeBallsSnackBar('10 Poke Balls acquired!', 'Close');
  }

  preloadImage(): void {
    const bImage: HTMLImageElement = new Image();
    bImage.src = this.collectImage;
    bImage.onload = () => {
      //if signed in bg
      let bElement = document.querySelector('#bg') as HTMLElement;
      bElement.style.backgroundImage = `url(${bImage.src})`;
    }
  }

  //-----------------------SNACKBAR-----------------------

  confirmPokeBallsSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
