import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from './user-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../sign-up/user-info';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private userUrl = 'https://pokemon-server.herokuapp.com/user';

  private currentUser = new BehaviorSubject<UserLogin>({
    username: '',
    password: '',
  });

  private currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  loginUser(loginRequest: UserLogin): Observable<User> {
    console.log('in the login method');
    return this.http.post<User>(`${this.userUrl}/login`, loginRequest, {
      headers: environment.headers
    });
  }

  checkCredentials(loginRequest: UserLogin): Observable<boolean> {
    return this.http.post<boolean>(`${this.userUrl}/checkCredentials`, loginRequest, {headers: environment.headers})
  }

  setCurrentUser(user: UserLogin) {
    this.currentUser.next(user);
  }

  getCurrentUser(): Observable<UserLogin> {
    return this.currentUser$;
  }
}
