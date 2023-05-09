import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AllUsersService } from './all-users.service';
import {
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  filter,
  map,
  takeUntil,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TradeComponent } from './trade.component';
import { TradeguardComponent } from './tradeguard/tradeguard.component';

export interface IpassDialog {
  image: string;
  name: string;
  username: string | null | undefined;
}

@Component({
  selector: 'app-all-users-details',
  templateUrl: './all-users-details.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllUsersDetailsComponent implements OnInit, OnDestroy {
  //dialog data pass
  pass: IpassDialog = {
    image: '',
    name: '',
    username: '',
  };
  userId!: number;

  //unsubscribe OnDestroy
  private ngUnsubscribe = new Subject<void>();

  //for error handling: Hot Observable
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  //Hot Observable which will update on every new selected User
  user$ = this.allUsersService.selectedUser$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  //Cold Observabel that retireves users first last name
  pageTitle$ = this.user$.pipe(
    map((u) => (u ? `${u.firstName} ${u.lastName} Profile Page` : null))
  );

  //Hot Observable that gets users pokemon based on the user which is selected
  userPokemon$ = this.allUsersService.userPokemon$.pipe(
    map((pokemon) => {
      return pokemon.sort((a, b) => a.index - b.index);
    }),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  //Combining all observables together for better flow in HTML
  userDetails$ = combineLatest([
    this.user$,
    this.pageTitle$,
    this.userPokemon$,
  ]).pipe(
    filter(([user]) => Boolean(user)),
    map(([user, pageTitle, userPokemon]) => ({ user, pageTitle, userPokemon })),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(
    private allUsersService: AllUsersService,
    private dialog: MatDialog
  ) {}
  //---------------------MatDialog for initiating a Trade--------------
  openTradeDialog(): void {
    let dialogRef = this.dialog.open(TradeComponent, {
      width: '450px',
      data: {
        //this is an image
        passedUserPokemon: this.pass.image,
        passedPokemonName: this.pass.name,
        passedUsername: this.pass.username,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result) => console.log('The dialog was closed', result),
        error: (err) => console.log('Error: ', err),
      });
  }

  //Guard Function if user is not signed in
  guardDialog():void {
    let dialogRef = this.dialog.open(TradeguardComponent, {
      width: '450px'
    })

    dialogRef
    .afterClosed()
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe({
      next: res => console.log('Dialog was closed', res),
      error: err => console.log('Error', err)
    });
  }
  //shows trade request or sign up/login guard dependent if user is signed in or not.
  initiate(): void {
    if(this.userId > 0){
      this.openTradeDialog();
    }else{
      this.guardDialog();
    }
  }
  //function to pass pokemon to service function which will update a subject to pass to poke-detail component
  onTap(name: string): void {
    this.allUsersService.onTap(name);
  }
  //passes info from dom child to IdomPokeon so we can get image and name of pokemon
  fillPokemon(
    image: string,
    name: string,
    username: string | null | undefined
  ): void {
    this.pass.image = image;
    this.pass.name = name;
    this.pass.username = username || null || undefined;
  }
  //--------------------------------LIFECYCLE HOOKS-----------------------------------

  ngOnInit(): void {
   this.userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
