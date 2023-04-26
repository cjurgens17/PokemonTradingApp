import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomeComponent } from './user-home/user-home.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UserHomeGuard } from './user-home/user-home.guard';
import { InboxComponent } from './inbox/inbox.component';
import { InboxMessageComponent } from './inbox/inbox-message.component';
import { InboxShellComponent } from './inbox/inbox-shell.component';



@NgModule({
  declarations: [
    UserHomeComponent,
    InboxComponent,
    InboxMessageComponent,
    InboxShellComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: 'userprofile',
      canActivate: [UserHomeGuard],
      component: UserHomeComponent}
    ])
  ],
  bootstrap: [UserHomeComponent]
})
export class UserProfileModule { }
