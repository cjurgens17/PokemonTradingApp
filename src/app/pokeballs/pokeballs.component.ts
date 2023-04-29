import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, share, takeUntil, timer } from 'rxjs';
import { PokeballsService } from './pokeballs.service';
import { Timer } from './timer';

@Component({
  selector: 'app-pokeballs',
  templateUrl: './pokeballs.component.html',
  styleUrls: ['./pokeballs.component.css']
})
export class PokeballsComponent implements OnInit, OnDestroy {


  getPokemonBalls!: boolean;
  currentTime = new Date();
  initTimer: Timer = {
    id: 1,
    prevDate: new Date()
  };


  timer$ = this.pokeBallsService.timer$;

  private ngUnsubscribe = new Subject<void>();

  constructor(private pokeBallsService: PokeballsService) { }

  //here we need to get current user and update users pokeballs
  //then we need to reset the getPokemonBalls back to false
  resetPokemonBalls(): void {
    let newPokeBalls = 10;
    let userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
    //Add to the users pokemonBalls
     this.pokeBallsService.updateUserPokeBalls(userId, newPokeBalls)
     .pipe(
      takeUntil(this.ngUnsubscribe)
     )
     .subscribe({
      next: resp => console.log(`New pokeBall Count: `, resp),
      error : err => console.log(`Error: `, err)
  })
  //update the timer to be the current time from which we updated
  //this ensures the user has to wait 24 hours after they rececive every 10 pokemon balls;
  // let newTimer: Timer = {
  //   id: 1,
  //   prevDate: new Date().getDate();
  // }
  let nextAvaiablePokemonDate = new Date();
  nextAvaiablePokemonDate.setDate(this.currentTime.getDate() + 1);


  this.pokeBallsService.updateTimer(nextAvaiablePokemonDate)
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
          resp => console.log(`Updated Timer: `, resp)
        );
        
  this.initTimer.prevDate = nextAvaiablePokemonDate;
  this.getPokemonBalls = false;

  }

  ngOnInit(): void {

      //Subscribing to get the previous time
      this.timer$.pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        //adding one day to previous time--we want to reset ability to get pokemon balls every 24 hours
          next: resp => {
            let returnedDate = new Date(resp.prevDate);
            console.log(typeof returnedDate);
            console.log(' returned Date: ', returnedDate);
            this.initTimer.prevDate.setDate(returnedDate.getDate());
            console.log('current Date plus one day', this.initTimer.prevDate);
          },
          error: err => console.log(`Error: `, err)
      })

    //getting current time and comparing to previous time
    timer(0,1000)
    .pipe(
      map(() => new Date()),
      share(),
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(time => {
      this.currentTime = time
      if(this.initTimer.prevDate.getDate() <= this.currentTime.getDate()){
        this.getPokemonBalls = true;
        //take this service out of ngOnInIt
      }else{
        this.getPokemonBalls = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
