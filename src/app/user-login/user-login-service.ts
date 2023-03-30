import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserLogin } from "./user-login";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})

export class UserLoginService {

    private userUrl = 'http://localhost:8080/user';

    private currentUser = new BehaviorSubject<UserLogin>({
      username: '',
      password: ''
    })

    private currentUser$ = this.currentUser.asObservable();

    constructor (private http: HttpClient) {}

    loginUser(user: UserLogin): Observable<any> {
        return this.http.post<any>(`${this.userUrl}/login`, user, {headers: environment.headers});
    }

    setCurrentUser(user: UserLogin){
      this.currentUser.next(user);
    }

    getCurrentUser(): Observable<UserLogin> {
      return this.currentUser$;
    }




}
