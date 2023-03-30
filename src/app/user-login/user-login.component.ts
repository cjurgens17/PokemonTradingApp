import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserLoginService } from './user-login-service';
import { UserLogin } from './user-login';
import { Router } from '@angular/router';


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

  constructor(private userLoginService: UserLoginService, private router: Router) {}

  onSubmit(form: NgForm) {
    console.log('In onSubmit: ', form.valid);
    if(form.valid){
      this.userLoginService.setCurrentUser(this.userLoginInfo);
      this.userLoginService.loginUser(this.userLoginInfo).subscribe({
        next: data => {
          console.log('data: ', data);
          this.router.navigate(['home']);
          let json = JSON.stringify(data);
          localStorage.setItem('userLoginInfo', json);
          console.log(localStorage.getItem('userLoginInfo'));
        },
        error: err => {
          console.log('error: ', err);
        }
     });
      console.log('Login successful');
    }else{
      this.postError = true;
      this.postErrorMessage = "Username or password does not exist."
    }
}

ngOnInit(): void {
}


}


