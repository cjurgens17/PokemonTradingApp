import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserLoginService } from './user-login-service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserLogin } from './user-login';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit, OnDestroy {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('',[Validators.required])
});

  badCredentials!: boolean;
  hide: boolean = true;
  required!: boolean;


  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userLoginService: UserLoginService,
    private router: Router
  ) {}

  login() {
    //show error code if input fields are not entered on submit
    if(this.loginForm.invalid){
      this.required = true;
      return;
    }else{
      this.required = false;
    }

    //create a userLogin in here to pass into the function
    let userLoginInfo: UserLogin = {
      username: this.loginForm.controls.username?.value,
      password: this.loginForm.controls.password?.value
    }

    //checkCredentials Of User:
    this.userLoginService.checkCredentials(userLoginInfo)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe({
      next: resp => {
        if(!resp){
          this.badCredentials = true;
          console.log('Bad Credentials')
          return;
        }else{
          this.userLoginService.setCurrentUser(userLoginInfo);
          this.userLoginService
            .loginUser(userLoginInfo)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: (data) => {
                localStorage.clear();
                this.router.navigate(['userprofile']);
                let json = JSON.stringify(data);
                localStorage.setItem('userLoginInfo', json);
              },
              error: (err) => console.log('error: ', err),
            });
        }
      },
      error: err => console.log('Error: ', err)
    })

    }
  //-------------------------------LIFECYCLE HOOKS---------------------------------------
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

