import { Component, OnInit } from '@angular/core';
import { User } from './user-info';
import { NgForm } from '@angular/forms';
import { UserService } from './user-service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  originalUserInfo: User = {
    id: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    birthDate: null,
    password: null,
    username: null
  }

  userInfo: User = {...this.originalUserInfo};
  postError: boolean = false;
  postErrorMessage: string = '';

  constructor(private userService: UserService) {}

  onSubmit(form: NgForm) {
    console.log('In onSubmit: ', form.valid);

    if(form.valid){
      //do some data service to post the user info to backend api
      this.userService.postUser(this.userInfo).subscribe({
        next: data => {
          console.log('data: ', data);
        },

        error: err => {
          console.log('error: ', err)
        }

      });
      console.log('submit successfully');
    }else{
      this.postError = true;
      this.postErrorMessage = "Please fix the above errors";
    }
  }


  ngOnInit(): void {
  }

}
