import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from './profile-card.component';
import { UserHomeComponent } from './user-home.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UserHomeGuard } from './user-home.guard';



@NgModule({
  declarations: [
    ProfileCardComponent,
    UserHomeComponent
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
