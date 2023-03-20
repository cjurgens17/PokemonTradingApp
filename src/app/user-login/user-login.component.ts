import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserLoginService } from './user-login-service';
import { UserLogin } from './user-login';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  
  userLogin: UserLogin = {
    username: null,
    password: null
  }

  userLoginInfo: UserLogin = {...this.userLogin};
  postError: boolean = false;
  postErrorMessage: string = '';

  constructor(private userLoginService: UserLoginService) {}

  onSubmit(form: NgForm) {
    console.log('In onSubmit: ', form.valid);


}

ngOnInit(): void { 
}


}
  

