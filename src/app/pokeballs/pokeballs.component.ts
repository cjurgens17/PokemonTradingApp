import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, share, takeUntil, timer } from 'rxjs';
import { PokeballsService } from './pokeballs.service';
import { Timer } from './timer';

@Component({
  selector: 'app-pokeballs',
  templateUrl: './pokeballs.component.html',
  styleUrls: ['./pokeballs.component.css'],
})
export class PokeballsComponent implements OnInit, OnDestroy {
  getPokemonBalls!: boolean;
  currentTime = new Date();
  initTimer: Timer = {
    id: 1,
    prevDate: new Date(),
  };

  //Timer from backend--subscribing in OnInit
  timer$ = this.pokeBallsService.timer$;

  //For unsubscribing
  private ngUnsubscribe = new Subject<void>();

  constructor(private pokeBallsService: PokeballsService) {}

  //-------------------Functions----------------------------------------------------------------------
  //adds pokeBalls to user and takes away button from the DOM with structural directive in template
  resetPokemonBalls(): void {
    let newPokeBalls = 10;
    let userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
    //Add to the users pokemonBalls
    this.pokeBallsService
      .updateUserPokeBalls(userId, newPokeBalls)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => console.log(`New pokeBall Count: `, resp),
        error: (err) => console.log(`Error: `, err),
      });
    //setting new date to 24 hours ahead of currentDate so button to get pokeBalls resets every 24 hours
    let nextAvaiablePokemonDate = new Date();
    nextAvaiablePokemonDate.setDate(this.currentTime.getDate() + 1);

    //updating the timer
    this.pokeBallsService
      .updateTimer(nextAvaiablePokemonDate)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((resp) => console.log(`Updated Timer: `, resp));

    //updating initTimer so if clause in OnInit is read properly
    this.initTimer.prevDate = nextAvaiablePokemonDate;

    this.getPokemonBalls = false;
  }

  //------------------------LifeCycle Hooks-------------------------------------
  ngOnInit(): void {
    //Subscribing to get time until next pokeballs can be added again
    this.timer$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (resp) => (this.initTimer.prevDate = new Date(resp.prevDate)),
      error: (err) => console.log(`Error: `, err),
    });

    //getting current time and comparing to last updated time(last time pokeballs were added)
    timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (time) => {
          this.currentTime = time;
          if (this.initTimer.prevDate.toISOString() <= time.toISOString()) {
            this.getPokemonBalls = true;
          } else {
            this.getPokemonBalls = false;
          }
        },
        error: (err) => console.log('Error: ', err),
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
