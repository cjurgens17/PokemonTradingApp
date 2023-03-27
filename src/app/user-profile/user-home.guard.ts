import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHomeGuard implements CanActivate {

  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //working just need to find way to see if logged in or not
      // const reroute = true;
      // if(reroute){
      //   alert("You need to sign in or create a profile first");
      //   this.router.navigate(['/usersignup']);
      //   return false;
      // }
    return true;
  }

}
