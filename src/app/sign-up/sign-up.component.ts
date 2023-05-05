import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/sync-validators/password.validator';
import { confirmPasswordValidator } from '../validators/sync-validators/confirm-password.validator';
import { uniqueEmailValidator } from '../validators/async-validators/unique-email.validator';
import { UserService } from '../user-info/user-service';
import { uniqueUsernameValidator } from '../validators/async-validators/unique-username.validator';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  hide: boolean = true;
  hide2: boolean = true;
  postError: boolean = false;
  
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
      asyncValidators: [uniqueEmailValidator(this.userService)],
      updateOn: 'blur',
    }),
    birthDate: new FormControl('', [Validators.required]),
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ],
      asyncValidators: [uniqueUsernameValidator(this.userService)],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator]),
    confirmPassword: new FormControl('', [
      Validators.required,
      confirmPasswordValidator(),
    ]),
  });

  constructor(private userService: UserService) {}

  register(): void {
    //check for validity
    if (this.signUpForm.invalid) {
      this.postError = true;
      return;
    }
  }

}
