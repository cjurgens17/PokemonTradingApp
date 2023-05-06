import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/sync-validators/password.validator';
import { confirmPasswordValidator } from '../validators/sync-validators/confirm-password.validator';
import { uniqueEmailValidator } from '../validators/async-validators/unique-email.validator';
import { uniqueUsernameValidator } from '../validators/async-validators/unique-username.validator';
import { Subject, takeUntil } from 'rxjs';
import { Register } from './register';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../user-login/user-login-service';
import { UserLogin } from '../user-login/user-login';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnDestroy {
  hide: boolean = true;
  hide2: boolean = true;
  postError: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  signUpForm = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]+$'),
      ],
    }),
    lastName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z]+$'),
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [uniqueEmailValidator(this.signUpService)],
      updateOn: 'blur',
    }),
    birthDate: new FormControl(null, {
      validators: [Validators.required],
    }),
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ],
      asyncValidators: [uniqueUsernameValidator(this.signUpService)],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.required, passwordValidator, confirmPasswordValidator()],
      updateOn: 'change'
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, confirmPasswordValidator()],
      updateOn: 'change'
    }),
  });

  constructor(
    private signUpService: SignUpService,
    private userLoginService: UserLoginService,
    private router: Router
  ) {}

  //Creates and signs in new user
  register(): void {
    //check for validity
    if (this.signUpForm.invalid) {
      this.postError = true;
      return;
    }
    //Newly Registered User
    let registerUser: Register = {
      firstName: this.signUpForm.controls.firstName.value || '',
      lastName: this.signUpForm.controls.lastName.value || '',
      email: this.signUpForm.controls.email.value || '',
      birthDate:
        this.signUpForm.controls.birthDate.value ||
        new Date(0, 0, 0, 0, 0, 0, 0),
      username: this.signUpForm.controls.username.value || '',
      password: this.signUpForm.controls.password.value || '',
    };
    //creating User
    this.signUpService
      .postUser(registerUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (user) => {
          //setCurrentUser and save to localStorage
          console.log('New User: ', user);
        },
        error: (err) => console.log('Error: ', err),
      });
    //Making User Login
    let userLoginInfo: UserLogin = {
      username: this.signUpForm.controls.username.value,
      password: this.signUpForm.controls.password.value,
    };

    //Signing Newly Created User In
    this.userLoginService
      .loginUser(userLoginInfo)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (user) => {
          this.userLoginService.setCurrentUser(userLoginInfo);
          localStorage.clear();
          console.log('Logged In User: ', user);
          this.router.navigate(['userprofile']);
          let json = JSON.stringify(user);
          localStorage.setItem('userLoginInfo', json);
        },
        error: (err) => console.log('error: ', err),
      });
  }
  //--------------------LIFECYCLE HOOKS-----------------------
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
