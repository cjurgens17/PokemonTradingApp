import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from './register';
import { environment } from 'src/environments/environment';
import { User } from '../user-info/user-info';


@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private userUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

   postUser(registerUser: Register): Observable<User> {
        return this.http.post<User>(`${this.userUrl}/new`, registerUser, {headers: environment.headers});
    }

    emailExist(email: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.userUrl}/${email}/checkEmail`, {headers: environment.headers});
    }

    usernameExist(username: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.userUrl}/${username}/checkUsername`, {headers: environment.headers});
    }
}
