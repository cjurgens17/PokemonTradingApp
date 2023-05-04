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
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  tradeForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    selectedPokemon: new FormControl('', [Validators.required])
  });

  message!: Message;
  username!: string | null;
  selected!: boolean;
  postError: boolean = false;

  //Used to unSubscribe OnDestroy
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
//--------------------FUNCTIONS--------------------------------------
  getImage(image: string): void {
    this.message.tradePokemonImage = image;
  }

  pokemonSelected(): void {
    this.selected = true;
  }

  cancelTrade(): void {
    this.cancelTradeSnackBar('Trade Cancelled', 'Close');
  }
//-------------------------HTTP CALLS-----------------------------------
  trade(): void {

    if(this.tradeForm.invalid){
      this.postError = true;
      return;
    }

    this.message.tradePokemon = this.data.passedPokemonName;
    this.message.text = this.tradeForm.get('text')?.value || '{}';
    this.message.username = this.data.passedUsername;
    this.message.userPokemonImage = this.data.passedUserPokemon;
    this.message.currentUsername = this.username || '{}';

    this.tradeService
      .addToUserInbox(this.message)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => console.log('response: ', response),
        error: (err) => console.log('Error: ', err),
      });
    this.tradeSentSnackBar('Requested Trade', 'Close');
  }
//-----------------SNACKBARS----------------------------------------
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

  cancelTradeSnackBar(
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
//----------------Form Error Messages-------------------------------------------
  textErrorMessage() {
    if (this.tradeForm.controls.text.hasError('required')) {
      return 'You must enter a value';
    }

    return this.tradeForm.controls.text.hasError('Pokemon') ? 'Not a valid Pokemon' : '';
  }

  selectedPokemonErrorMessage() {
    if (this.tradeForm.controls.selectedPokemon.hasError('required')) {
      return 'You must enter a value';
    }

    return this.tradeForm.controls.selectedPokemon.hasError('Pokemon') ? 'Not a valid Pokemon' : '';
  }
//----------------------------LIFECYCLE HOOKS---------------------------------------
  ngOnInit(): void {


    this.currentUser$.pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe({
      next: resp => this.username = resp.username || '',
      error: err => console.log('Error: ', err)
    })

    let tradeMsg: Message = {
      id: 0,
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
