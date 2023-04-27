import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile/user-profile.service';
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
  prevTime = new Date();
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
     this.pokeBallsService.updateUserPokeBalls(userId, newPokeBalls)
     .pipe(
      takeUntil(this.ngUnsubscribe)
     )
     .subscribe({
      next: resp => console.log(`New pokeBall Count: `, resp),
      error : err => console.log(`Error: `, err)
  })

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
            this.prevTime.setDate(resp.prevDate.getDate() + 1),
            this.initTimer.prevDate = this.prevTime
          },
          error: err => console.log(`Error: `, err)
      })

      //getting current time and comparing to previous time
    timer(0,1000)
    .pipe(
      takeUntil(this.ngUnsubscribe),
      map(() => new Date()),
      share()
    )
    .subscribe(time => {
      this.currentTime = time
      if(this.prevTime.getDate() <= this.currentTime.getDate()){
        this.getPokemonBalls = true;
        this.pokeBallsService.updateTimer(this.initTimer);
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
