import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, share, takeUntil, timer } from 'rxjs';
import { PokeballsService } from './pokeballs.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pokeballs',
  templateUrl: './pokeballs.component.html',
  styleUrls: ['./pokeballs.component.css'],
})
export class PokeballsComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  userId: number = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;

  //updated Timer from subject in pokeball service
  timer$ = this.pokeBallsService.timerSubject$;

  //For unsubscribing
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private pokeBallsService: PokeballsService,
    private snackBar: MatSnackBar) {}

  //-------------------Functions----------------------------------------------------------------------
  //adds pokeBalls to user and takes away button from the DOM with structural directive in template
  resetPokemonBalls(): void {
    let newPokeBalls = 10;
    //Add to the users pokemonBalls
    this.pokeBallsService
      .updateUserPokeBalls(this.userId, newPokeBalls)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => console.log(`New pokeBall Count: `, resp),
        error: (err) => console.log(`Error: `, err),
      });

    //updating the timer
    this.pokeBallsService
      .updateTimer(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((timer) => this.pokeBallsService.updateTimerSubject(timer));
    this.confirmPokeBallsSnackBar('10 Poke Balls acquired!', 'Close');
  }

  //-----------------------SNACKBAR-----------------------

  confirmPokeBallsSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  //------------------------LifeCycle Hooks-------------------------------------
  ngOnInit(): void {
    //setting behaviorSubject for timer
    this.pokeBallsService.getTimer(this.userId)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe({
      next: timer => this.pokeBallsService.updateTimerSubject(timer),
      error: err => console.log('Error: ', err)
    })


    //getting current time and comparing to last updated time(last time pokeballs were added)
    timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (time) => this.currentTime = time,
        error: (err) => console.log('Error: ', err),
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
