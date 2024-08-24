import { Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, Observable, shareReplay, Subject, switchMap, tap, timer } from 'rxjs';
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
  currentTime$: Observable<Date> = timer(0, 1000).pipe(
    map(() => new Date()),
    shareReplay({bufferSize: 1, refCount: true}),
  );

  userId: number = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
  clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  collectImage: string = 'assets/static/images/collectBackground.jpg';

  private resetPokemonBallsSubject = new Subject<void>();

  currentUserTime$ = this.pokeBallsService.getUserTimer(this.userId).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  resetPokemonBalls$ = this.resetPokemonBallsSubject.pipe(
    switchMap(() => {
      const newPokeBalls = 10;
      const now = new Date();
      const nextResetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      return this.pokeBallsService.updateUserPokeBalls(this.userId, newPokeBalls).pipe(
        switchMap(() => this.pokeBallsService.updateTimer24(this.userId, nextResetTime)),
        tap(() => {
          this.currentUserTime$ = this.pokeBallsService.getUserTimer(this.userId).pipe(
            shareReplay({ bufferSize: 1, refCount: true })
          );
          this.confirmPokeBallsSnackBar('10 Poke Balls acquired!', 'Close');
        }),
        catchError((error) => {
          console.error('Error updating pokeballs or timer:', error);
          return EMPTY;
        })
      );
    })
  );

  isPokeballs$ = combineLatest([this.currentUserTime$, this.currentTime$]).pipe(
    map(([currentUserTime, currentTime]) => {
      if (!currentUserTime || !currentUserTime.prevDate) return false;
      return new Date(currentUserTime.prevDate) <= currentTime;
    })
  );

  constructor(
    private pokeBallsService: PokeballsService,
    private userLoginService: UserLoginService,
    private snackBar: MatSnackBar
  ) {
    this.preloadImage();
  }

  resetPokemonBalls(): void {
    this.resetPokemonBallsSubject.next();
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

  confirmPokeBallsSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
