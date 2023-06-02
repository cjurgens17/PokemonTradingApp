import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../user-login/user-login-service';
import { UserLogin } from '../user-login/user-login';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  title = 'Pokemon Trading';

  constructor(private userLoginService: UserLoginService) { }

  logout(): void {
    console.log(localStorage);
    localStorage.clear();
    console.log(localStorage);
    const logOutUser: UserLogin = {
      username: '',
      password: ''
    }
    this.userLoginService.setCurrentUser(logOutUser);
  }

  ngOnInit(): void {
  }

}
