import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/all-users/message';
import { Inbox } from './inbox';

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  //shows message for inbox-message component
  private messageSubject = new Subject<Message>();
  message$ = this.messageSubject.asObservable();

  constructor() { }

  passMessage(message: Message){
    this.messageSubject.next(message);
  }



}
