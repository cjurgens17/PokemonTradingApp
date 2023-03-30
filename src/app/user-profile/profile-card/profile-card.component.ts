import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { User } from 'src/app/user-info/user-info';




@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {


  pokemon$ = this.userService.userPokemon$;

  constructor(private userService: UserProfileService ) { }

  errorMessage: string = '';








}
