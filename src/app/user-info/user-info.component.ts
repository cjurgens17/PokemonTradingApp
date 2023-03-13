import { Component, OnInit } from '@angular/core';
import { User } from './user-info';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  originalUserInfo: User = {
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

  constructor() { }

  onSubmit(form: NgForm) {
    console.log('In onSubmit: ', form.valid);

    if(form.valid){
      //do some data service to post the user info to backend api
    }else{
      this.postError = true;
      this.postErrorMessage = "Please fix the above errors";
    }
  }


  ngOnInit(): void {
  }

}
