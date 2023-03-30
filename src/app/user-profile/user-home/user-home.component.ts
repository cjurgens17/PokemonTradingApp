import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user-info/user-info';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-user-home',
  templateUrl: "./user-home.component.html",
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent {

  showPokemon: boolean = false;
  errorMessage: string = '';


  currentUser$ = this.userProfileService.currentUser$;

  constructor(private userProfileService: UserProfileService) { }

  togglePokemon(): void {
    this.showPokemon = !this.showPokemon;
  }
}



