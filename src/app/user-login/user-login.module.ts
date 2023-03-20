import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login.component';



@NgModule({
  declarations: [
    UserLoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: 'userlogin', component: UserLoginComponent}
  ])
  ]
})
export class UserLoginModule { }
