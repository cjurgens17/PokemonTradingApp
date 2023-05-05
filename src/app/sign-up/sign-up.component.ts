import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/sync-validators/password.validator';
import { confirmPasswordValidator } from '../validators/sync-validators/confirm-password.validator';
import { uniqueEmailValidator } from '../validators/async-validators/unique-email.validator';
import { uniqueUsernameValidator } from '../validators/async-validators/unique-username.validator';
import { Subject, delay, takeUntil } from 'rxjs';
import { Register } from './register';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';

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
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [uniqueEmailValidator(this.signUpService)],
      updateOn: 'blur',
    }),
    birthDate: new FormControl(null, [Validators.required]),
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ],
      asyncValidators: [uniqueUsernameValidator(this.signUpService)],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator]),
    confirmPassword: new FormControl('', [
      Validators.required,
      confirmPasswordValidator(),
    ]),
  });

  constructor(private signUpService: SignUpService, private router: Router) {}

  register(): void {
    //check for validity
    if (this.signUpForm.invalid) {
      this.postError = true;
      return;
    }

    let registerUser: Register = {
      firstName: this.signUpForm.controls.firstName.value || '',
      lastName: this.signUpForm.controls.lastName.value || '',
      email: this.signUpForm.controls.email.value || '',
      birthDate: this.signUpForm.controls.birthDate.value || new Date(0,0,0,0,0,0,0),
      username: this.signUpForm.controls.username.value || '',
      password: this.signUpForm.controls.password.value || ''
    }

    this.signUpService.postUser(registerUser)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe({
      next: user => {
        localStorage.clear();
        console.log('User: ', user);
        this.router.navigate(['home']);
        let json = JSON.stringify(user);
        localStorage.setItem('userLoginInfo', json);
      },
      error: err => console.log('Error: ', err)
  })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
