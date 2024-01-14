import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap } from 'rxjs';
import { Register } from './register';
import { environment } from 'src/environments/environment';
import { User } from './user-info';
import { UserLoginService } from '../user-login/user-login-service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private userUrl = 'https://pokemon-trading-backend-dd013c59e9a7.herokuapp.com/';

  constructor(private http: HttpClient, private userLoginService: UserLoginService) {}

  postUser(registerUser: Register): Observable<User> {
    return this.http.post<User>(`${this.userUrl}/new`, registerUser, {
      headers: environment.headers,
    })
    .pipe(
      concatMap((user) => this.loginUser(user))
    )
  }
  //async validator call
  emailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userUrl}/${email}/checkEmail`, {
      headers: environment.headers,
    });
  }
  //async validator call
  usernameExist(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userUrl}/${username}/checkUsername`, {
      headers: environment.headers,
    });
  }
  //concating with post user
  loginUser(user: User): Observable<User> {
    let loginRequest = {
      username: user.username,
      password: user.password
    }
    return this.http.post<User>(`${this.userUrl}/login`, loginRequest,{
      headers: environment.headers
    });
  }

  setCurrentUser(user: User): void {
      this.userLoginService.setCurrentUser(user);
  }
}
