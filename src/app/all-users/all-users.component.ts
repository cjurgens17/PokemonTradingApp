import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { AllUsersService } from './all-users.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllUsersComponent {

  pageTitle = 'All Pokemon Users';

  //handles all of our errors
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  allUsers$ = this.allUsersService.allUsers$;

  selectedUser$ = this.allUsersService.selectedUser$;

  constructor(private allUsersService: AllUsersService) { }

  //selected method to get a specific user
  onSelected(id: number | null): void {
    this.allUsersService.onSelected(id);
  }

}
