import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./user-info";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private userUrl = 'http://localhost:8080/user';

    constructor (private http: HttpClient) {}


    postUser(user: User): Observable<any> {
        return this.http.post<any>(`${this.userUrl}/new`, user, {headers: environment.headers});
    }

    emailExist(email: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.userUrl}/${email}/checkEmail`, {headers: environment.headers});
    }

    usernameExist(username: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.userUrl}/${username}/checkUsername`, {headers: environment.headers});
    }


}
