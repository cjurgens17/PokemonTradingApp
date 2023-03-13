import { NgModule } from '@angular/core';
import { UserInfoComponent } from './user-info.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UserInfoComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {path: 'usersignup', component: UserInfoComponent}
    ])
  ]
})
export class UserInfoModule { }
