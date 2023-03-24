import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon/pokemon';
import { UserProfileService } from './user-profile.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit, OnDestroy {

  constructor(private userService: UserProfileService) { }

  userPokemon!: Pokemon[];
  sub!: Subscription;
  errorMessage: string = '';

  ngOnInit(): void {
    console.log(localStorage);
    let savedUser = JSON.parse(localStorage.getItem('userLoginInfo') || '{}');

    const userId = savedUser.id;
    console.log(userId);

    this.sub = this.userService.getUserPokemon(userId).subscribe({
      next: data => {
        this.userPokemon = data;
        console.log(this.userPokemon);
      },
      error: error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
