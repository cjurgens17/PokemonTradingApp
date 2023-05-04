import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Message } from 'src/app/all-users/message';
import { TradeService } from 'src/app/all-users/trade.service';
import { InboxService } from './inbox.service';

@Component({
  selector: 'app-inbox-message',
  templateUrl: './inbox-message.component.html',
  styleUrls: ['./inbox-message.component.css'],
})
export class InboxMessageComponent implements OnInit, OnDestroy {

  //unsubscribes to all called observables onDestroy
  private ngUnsubscribe = new Subject<void>();

  //this shows the clicked message
  message$ = this.inboxService.message$;

  //Action Stream for handling errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private tradeService: TradeService,
    private snackBar: MatSnackBar,
    private inboxService: InboxService
  ) {}

  //----------------------------HTTP CALLS------------------------
  //declines the trade
  decline(message: Message): void {
    //this changes the usernames so decline msg displays proper names in view/client side
    let to = message.currentUsername;
    let from = message.username;
    //swap pokemon images
    let toPokemon = message.tradePokemonImage
    let fromPokemon = message.userPokemonImage;
    let toPokemonName = message.tradePokemon;
    let fromPokemonName = message.userPokemon;

    //update original message so trade status is true
    let updateCurrentMessageIsTraded = {
      ...message,
      traded: true,
    };

    this.inboxService.passMessage(updateCurrentMessageIsTraded);

    //update msg object to reflect changes
    let declineMessage = {
      ...message,
      text: `${message.username} has declined your trade.`,
      userPokemonImage: toPokemon,
      tradePokemonImage: fromPokemon,
      userPokemon: toPokemonName,
      tradePokemon: fromPokemonName,
      username: to,
      currentUsername: from,
      traded: true,
    };

    this.tradeService
      .updateIsTraded(updateCurrentMessageIsTraded)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: resp => console.log('Updated Message: ', resp),
        error: err => console.log('Error', err)
      });

    //sends the actual decline msg
    this.tradeService
      .addDeclineMessage(declineMessage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: resp => console.log('resp', resp),
        error: err => console.log('err', err)
      });

    this.declineSnackBar('Trade declined', 'close');
  }

  //accepts the trade between 2 users
  accept(message: Message): void {
    console.log('In accept mesage is traded', message.traded);
    //currentUsername == from
    //username == to(so us)
    //userPokemon == our pokemon
    //tradePokemon == their pokemon

    let username = message.username;
    let currentUsername = message.currentUsername;
    let userPokemon = message.userPokemon;
    let tradePokemon = message.tradePokemon;

    //update original message so trade status is true
    let updateCurrentMessageIsTraded = {
      ...message,
      traded: true,
    };

    this.inboxService.passMessage(updateCurrentMessageIsTraded);

    //Checking if users have pokemon avaiable to trade
    this.tradeService
      .checkUsersPokemon(username, currentUsername, userPokemon, tradePokemon)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => {
          let hasPokemon = resp;
          //users have pokemon available to trade
          if (hasPokemon) {
            this.tradeService
              .completeTrade(
                username,
                currentUsername,
                userPokemon,
                tradePokemon
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: resp => console.log('Trade: ', resp),
                error: err => console.log('error: ', err)
              });
            //success snackbar
            this.acceptSuccessSnackBar(
              'Trade Successful, check your PokeIndex',
              'Close'
            );
          } else {
            //fail snackbar
            this.acceptFailSnackBar(
              'Pokemon for trade are no longer available',
              'Close'
            );
          }
        },
        error: err =>  console.log('error: ', err)
      });

    this.tradeService
      .updateIsTraded(updateCurrentMessageIsTraded)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => console.log('Updated Message: ', resp),
        error: (err) => console.log('Error', err),
      });
  }

  //---------------------------------------SNACKBARS---------------------------
  declineSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  acceptSuccessSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  acceptFailSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  alreadyTradedSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
  //----------------------Lifecycle Hooks------------------------

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
