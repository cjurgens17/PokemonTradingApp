import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Message } from './message';
import { UserProfileService } from '../user-profile/user-profile.service';
import { EMPTY, Subject, catchError, map, takeUntil } from 'rxjs';
import { TradeService } from './trade.service';
import { FormControl } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit, OnDestroy {
  text = new FormControl('');
  username = new FormControl('');
  message!: Message;

  private ngUnsubscribe = new Subject<void>();

  //This gets all currentUsers pokemon so we can select to trade
  userPokemon$ = this.userProfileService.userPokemon$.pipe(
    map((pokemon) => {
      return pokemon.sort((a, b) => a.name.localeCompare(b.name));
    }),
    catchError((err) => {
      console.log('error: ', err);
      return EMPTY;
    })
  );
  //used to get username
  currentUser$ = this.userProfileService.currentUser$;

  constructor(
    private dialogRef: MatDialogRef<TradeComponent>,
    private userProfileService: UserProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tradeService: TradeService,
    private snackBar: MatSnackBar
  ) {}

  getImage(image: string) {
    this.message.tradePokemonImage = image;
  }

  trade(): void {
    this.message.tradePokemon = this.data.passedPokemonName;
    this.message.text = this.text.value || '{}';
    this.message.username = this.data.passedUsername;
    this.message.userPokemonImage = this.data.passedUserPokemon;
    this.message.currentUsername = this.username.value || '{}';

    this.tradeService
      .addToUserInbox(this.message)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => console.log('response: ', response),
        error: (err) => console.log('Error: ', err),
      });
    this.tradeSentSnackBar('Message Sent', 'Close');
  }

  tradeSentSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 5000,
      data: this.dialogRef,
    });
    this.dialogRef.close();
    return snackBarRef;
  }

  ngOnInit(): void {
    console.log(this.data);
    let tradeMsg: Message = {
      text: '',
      userPokemon: '',
      userPokemonImage: '',
      tradePokemon: '',
      tradePokemonImage: '',
      username: '',
      currentUsername: '',
      traded: false,
    };

    this.message = tradeMsg;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
