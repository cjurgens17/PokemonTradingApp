import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject, map } from 'rxjs';
import { AllUsersService } from './all-users.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllUsersComponent {
  pageTitle = 'All Pokemon Users';
  currentUsername: string = JSON.parse(
    localStorage.getItem('userLoginInfo') || '{}'
  ).username;

  //handles all of our errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  allUsers$ = this.allUsersService.allUsers$.pipe(
    //So Current User doesnt show up in trade view; Current User cant trade with themselves
    map((users) => {
      users.forEach((user, index) => {
        if (user.username === this.currentUsername) {
          users.splice(index, 1);
        }
      });
      return users;
    })
  );

  selectedUser$ = this.allUsersService.selectedUser$;

  constructor(private allUsersService: AllUsersService) {}
  //selected method to get a specific user
  onSelected(id: number | null): void {
    this.allUsersService.onSelected(Number(id));
  }
}
