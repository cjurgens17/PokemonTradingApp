import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user-info/user-info';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-user-home',
  templateUrl: "./user-home.component.html",
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit, OnDestroy {

  showPokemon: boolean = false;
  user!: User;
  sub!: Subscription;
  errorMessage: string = '';
  defaultUserPicture: string = 'https://freesvg.org/img/abstract-user-flat-4.png';
  constructor(private userProfileService: UserProfileService) { }

  togglePokemon(): void {
    this.showPokemon = !this.showPokemon;
  }

  handlePicture(data: string): void {
    this.user.profilePicture = data;
  }

  ngOnInit(): void {
    let getUser = JSON.parse(localStorage.getItem('userLoginInfo') || '{}');
    const userId = getUser.id;
    //getUserInformation
    this.sub = this.userProfileService.getUserInformation(userId).subscribe({
      next: data => {
        this.user = data;
        console.log('User Service Brought over: ',this.user);
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
