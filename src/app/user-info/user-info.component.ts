import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './user-info';
import { NgForm } from '@angular/forms';
import { UserService } from './user-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  originalUserInfo: User = {
    id: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    birthDate: null,
    password: null,
    username: null,
    profilePicture: null,
    pokeBalls: null,
    timer: null
  };

  userInfo: User = { ...this.originalUserInfo };
  postError: boolean = false;
  postErrorMessage: string = '';

  private ngUnsubscribe = new Subject<void>();

  constructor(private userService: UserService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      //do some data service to post the user info to backend api
      this.userService
        .postUser(this.userInfo)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (data) => console.log('data: ', data),
          error: (err) => console.log('error: ', err),
        });
    } else {
      this.postError = true;
      this.postErrorMessage = 'Please fix the above errors';
    }
  }
  //------------------------LIFECYCLE HOOKS----------------------------------

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
