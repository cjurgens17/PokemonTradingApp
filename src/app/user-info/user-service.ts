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

}