import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Message } from './message';
import { UserProfileService } from '../user-profile/user-profile.service';
import { EMPTY, catchError, map } from 'rxjs';
import { AllUsersService } from './all-users.service';
import { inject } from '@angular/core/testing';
import { TradeService } from './trade.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {


  text = new FormControl('');
  username = new FormControl('');

  message!:Message;

  //This gets all currentUsers pokemon so we can select to trade
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
    //used to get username
  currentUser$ = this.userProfileService.currentUser$;

  constructor(
  private dialogRef: MatDialogRef<TradeComponent>,
  private userProfileService: UserProfileService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private tradeService: TradeService) {}


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

  trade(): void {
    this.message.tradePokemon = this.data.passedPokemonName;
    this.message.text = this.text.value || '{}';
    this.message.username = this.username.value || '{}';
    console.log(this.message);

    this.tradeService.addToUserInbox(this.message).subscribe({
      next: response => {
        console.log('response: ', response);
      },

      error: err => {
        console.log('Error: ', err)
      },

      complete: () => {

      }

    });
  }

}
