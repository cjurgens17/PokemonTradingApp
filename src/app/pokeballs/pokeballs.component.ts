import { Component, OnInit } from '@angular/core';
import {  BehaviorSubject, combineLatest, map, Observable, share, Subject, switchMap, timer } from 'rxjs';
import { PokeballsService } from './pokeballs.service';
import { UserLoginService } from '../user-login/user-login-service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Timer } from './timer';

@Component({
  selector: 'app-pokeballs',
  templateUrl: './pokeballs.component.html',
  styleUrls: ['./pokeballs.component.css'],
})
export class PokeballsComponent implements OnInit {
  currentTime: Date = new Date();
  userId: number = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
  clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  collectImage: string = 'assets/static/images/collectBackground.jpg';

  private currentUserTimer$ = this.pokeBallsService.getUserTimer(this.userId);

  //updated Timer from subject in pokeball service
  timerFormat$ = this.currentUserTimer$
  .pipe(
    map((timer) => {
      const formattedDateTime = timer.prevDate.toLocaleString('en-US', { timeZone: this.clientTimeZone })
      return formattedDateTime;
    })
  );
  constructor(
    private pokeBallsService: PokeballsService,
    private userLoginService: UserLoginService,
    private snackBar: MatSnackBar) {}

  //-------------------Functions----------------------------------------------------------------------
  //adds pokeBalls to user and takes away button from the DOM with structural directive in template
  resetPokemonBalls(): void {
    let newPokeBalls = 10;
    //Add to the users pokemonBalls
    this.pokeBallsService.updateUserPokeBalls(this.userId, newPokeBalls)

    //updating the timer -> change to do in the template
    this.pokeBallsService
      .updateTimer24(this.userId)
      .subscribe({
        next: (timer) => {
        this.pokeBallsService.updateTimer(timer)},
        error: (err) => console.log('Error: ', err)
      });
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

  //------------------------LifeCycle Hooks-------------------------------------
  ngOnInit(): void {

    //set background Image
    this.preloadImage();

    //getting current time and comparing to last updated time(last time pokeballs were added)
    timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share(),
      )
      .subscribe({
        next: (time) => this.currentTime = time,
        error: (err) => console.log('Error: ', err),
      });
  }
}
