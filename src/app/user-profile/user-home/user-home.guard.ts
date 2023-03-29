import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfileService } from '../user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class UserHomeGuard implements CanActivate {

  constructor(private router: Router, private userProfileService: UserProfileService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.userProfileService.isLoggedIn()){
        alert("You must sign in or create an account");
        this.router.navigate(['/usersignup']);
        return false;
      }
    return true;
  }

}
