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
    const savedUser = localStorage.getItem('userLoginInfo');
    const stringUser = JSON.stringify(savedUser);
    const parsedUser = JSON.parse(stringUser);
    const userId = parsedUser.id;

    this.sub = this.userService.getUserPokemon(userId).subscribe({
      next: data => {
        for(var i = 0;i<data.length;i++){
          this.userPokemon.push(data[i]);
        }
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
