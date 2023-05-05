import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserLoginService } from './user-login-service';
import { UserLogin } from './user-login';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit, OnDestroy {
  userLogin: UserLogin = {
    username: null,
    password: null,
  };

  userLoginInfo: UserLogin = { ...this.userLogin };
  postError: boolean = false;
  postErrorMessage: string = '';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userLoginService: UserLoginService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    console.log('In onSubmit: ', form.valid);
    if (form.valid) {
      console.log(this.userLoginInfo);
      this.userLoginService.setCurrentUser(this.userLoginInfo);
      this.userLoginService
        .loginUser(this.userLoginInfo)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (data) => {
            localStorage.clear();
            console.log('Data: ', data);
            this.router.navigate(['home']);
            let json = JSON.stringify(data);
            localStorage.setItem('userLoginInfo', json);
          },
          error: (err) => console.log('error: ', err),
        });
      console.log('Login successful');
    } else {
      this.postError = true;
      this.postErrorMessage = 'Username or password does not exist.';
    }
  }
  //-------------------------------LIFECYCLE HOOKS---------------------------------------
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
