import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { User } from 'src/app/user-info/user-info';
import { Pokemon } from 'src/app/pokemon/pokemon';



@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {


  pokemon$ = this.userService.userPokemon$;

  constructor(private userService: UserProfileService ) { }

  @Output() pictureEmitter = new EventEmitter();

  @Input() currentUser!: User
  updateProfilePicture: string = '';
  errorMessage: string = '';


  // ngOnInit(): void {
  //   console.log(localStorage);
  //   let savedUser = JSON.parse(localStorage.getItem('userLoginInfo') || '{}');

  //   const userId = savedUser.id;
  //   console.log(userId);

  //   this.sub = this.userService.getUserPokemon(userId).subscribe({
  //     next: data => {
  //       this.userPokemon = data;
  //       console.log(this.userPokemon);
  //     },
  //     error: error => {
  //       this.errorMessage = error.message;
  //       console.error('There was an error!', error);
  //     }
  //   })
  // }

  registerPicture(image: string): void{
    this.updateProfilePicture = image;
  }

  profilePicture(): void {
    return this.pictureEmitter.emit(this.updateProfilePicture);
  }



}
