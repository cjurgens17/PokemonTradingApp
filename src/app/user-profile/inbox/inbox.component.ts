import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Message } from 'src/app/all-users/message';
import { TradeService } from 'src/app/all-users/trade.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { Inbox } from './inbox';
import { InboxService } from './inbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit, OnDestroy {
  userId!: number;
  userInbox: Inbox = {
    messages: [],
  };

  //subject to unsubscribe onDestroy
  private ngUnsubscribe = new Subject<void>();

  //User inbox stream
  private inboxSubject = new BehaviorSubject<Inbox>(this.userInbox);
  inbox$ = this.inboxSubject.asObservable();

  //Action Stream for handling errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  //Passes User Message Subject
  private userMessageSubject = new Subject<Message>();
  userMessage$ = this.userMessageSubject.asObservable();

  //Cold Observable that grabs the current Users information
  currentUser$ = this.userProfileService.currentUser$;

  constructor(
    private userProfileService: UserProfileService,
    private tradeService: TradeService,
    private snackBar: MatSnackBar,
    private inboxService: InboxService
  ) {}

  //------------------PASSING to subjects methods-----------------------
  onViewMessage(message: Message) {
    this.inboxService.passMessage(message);
  }
  //----------------HTTP CALLS---------------------------------------
  //deletes message from user inbox
  deleteMessage(message: Message): void {
    this.tradeService
      .deleteUserMessage(message)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => {
          //removing msg from inbox then pushing back to behaviorSubject
          if (resp) {
            this.userInbox.messages.forEach((msg, index) => {
              if (msg === message) {
                this.userInbox.messages.splice(index, 1);
              }
            });
            this.inboxSubject.next(this.userInbox);
          }
        },
        error: (err) => console.log('err', err),
      });

    this.deleteMsgSnackBar(`Message Deleted`, 'Close');
  }

  //----------------------------------SNACKBAR

  deleteMsgSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 3500,
    });
  }

  //------------------LifeCycle Hooks-----------------------
  ngOnInit(): void {
    //getting userId
    this.userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;

    this.userProfileService
      .getUserMessages(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (resp) => {
          this.userInbox.messages = resp;
          this.inboxSubject.next(this.userInbox);
        },
        error: (err) => console.log('err', err),
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
