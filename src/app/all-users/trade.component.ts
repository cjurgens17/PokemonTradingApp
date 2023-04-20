import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Message } from './message';
import { UserProfileService } from '../user-profile/user-profile.service';
import { EMPTY, catchError, map } from 'rxjs';
import { AllUsersService } from './all-users.service';
import { inject } from '@angular/core/testing';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  message!:Message;

  userPokemon$ = this.userProfileService.userPokemon$
  .pipe(
    map((pokemon) => {
     return pokemon.sort((a,b) => a.name.localeCompare(b.name));
    }),
    catchError(err => {
      console.log('error: ', err);
      return EMPTY;
    })
  );

  currentUser$ = this.userProfileService.currentUser$;

  constructor(
  private dialogRef: MatDialogRef<TradeComponent>,
  private userProfileService: UserProfileService,
  @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(): void {
    console.log(this.data);
    let tradeMsg: Message = {
      text: '',
      userPokemon: '',
      tradePokemon: '',
      username: ''
    }

    this.message = tradeMsg;

  }

}
