import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/all-users/message';


@Injectable({
  providedIn: 'root'
})
export class InboxService {
  //shows message for inbox-message component
  private messageSubject = new Subject<Message | undefined>();
  message$ = this.messageSubject.asObservable();

  constructor() { }

  passMessage(message: Message){
    this.messageSubject.next(message);
  }

  //reassign messageSubject to new subject and reassign observable to the new subject
  //When user deletes a message in inbox, the message view will update to changes and show ng-template in inbox-message.html
  emptyMessage(): void {
    this.messageSubject.next(undefined);
  }
}
