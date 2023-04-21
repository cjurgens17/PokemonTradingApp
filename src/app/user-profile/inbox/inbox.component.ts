import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from '../user-profile.service';
import { EMPTY, Subject, catchError } from 'rxjs';
import { Message } from 'src/app/all-users/message';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  //Action Stream for handling errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private userMessageSubject = new Subject<Message>();
  userMessage$ = this.userMessageSubject.asObservable();

    //Cold Observable that grabs the current Users information
    currentUser$ = this.userProfileService.currentUser$;

    userInbox$ = this.userProfileService.userMessages$
    .pipe(
      catchError( err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )


        //make a subject in service method that update when we select a message
        //then create a combined hot observable that use the subject and all the usersmessages
        //make a method so wehn we click a message it updates the Hot observabkle and dislpays in the html from a different component
  constructor(private dialogRef: MatDialogRef<InboxComponent>, private userProfileService: UserProfileService) { }

  onViewMessage(message: Message): void {
      this.userMessageSubject.next(message);
  }

  accept(): void {

  }

  decline(): void {
    
  }

  ngOnInit(): void {
  }

}
