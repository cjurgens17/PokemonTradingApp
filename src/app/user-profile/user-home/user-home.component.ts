import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  map,
  catchError,
  startWith,
  switchMap,
} from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { InboxShellComponent } from '../inbox/inbox-shell.component';
import { ProfilePictureComponent } from './profile-picture.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHomeComponent implements OnInit {
  imageUrl: string = 'assets/static/images/profileBackground.jpg';
  private _listFilter: string = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredPokemonInputSubject.next(value);
  }

  private filteredPokemonInputSubject = new BehaviorSubject<string>('');
  private clickedPokemonSubject = new BehaviorSubject<string>('');

  userProfile$: Observable<any>;

  constructor(
    private userProfileService: UserProfileService,
    private dialog: MatDialog
  ) {
    this.userProfile$ = this.initUserProfile();
  }

  initUserProfile(): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
    this.userProfileService.setUserId(userId);

    return this.userProfileService.userId$.pipe(
      switchMap(id => {
        if (id <= 0) {
          return EMPTY;
        }

        const currentUser$ = this.userProfileService.currentUser$;
        const userPokemon$ = this.userProfileService.getUserPokemon(id).pipe(
          map(pokemon => pokemon.sort((a, b) => a.index - b.index))
        );
        const userMessages$ = this.userProfileService.getUserMessages(id);

        return combineLatest([
          currentUser$,
          userPokemon$,
          userMessages$,
          this.filteredPokemonInputSubject.pipe(startWith('')),
          this.clickedPokemonSubject.pipe(startWith(''))
        ]).pipe(
          map(([currentUser, userPokemon, userMessages, filterInput, clickedPokemon]) => {
            const filteredPokemon = userPokemon.filter(pokemon =>
              pokemon.name.toLowerCase().includes(filterInput.toLowerCase())
            ).sort();

            const clickedPokemonDetails = userPokemon.find(poke => poke.name === clickedPokemon);

            return {
              signedIn: true,
              currentUser: currentUser,
              userPokemon: userPokemon,
              filteredPokemon: filteredPokemon,
              clickedPokemon: clickedPokemonDetails,
              userMessages: userMessages,
              profilePicture: currentUser.profilePicture || '{}'
            };
          }),
          catchError(err => {
            console.error('Error in userProfile$:', err);
            return EMPTY;
          })
        );
      })
    );
  }

  onFilterChange() {
    this.filteredPokemonInputSubject.next(this._listFilter);
  }

  getPokemon(name: string): void {
    this.clickedPokemonSubject.next(name);
  }

  openInboxDialog(): void {
    this.dialog.open(InboxShellComponent, {
      width: '800px',
      height: '500px',
    });
  }

  openProfilePictureDialog(): void {
    this.dialog.open(ProfilePictureComponent, {
      width: '500px',
      height: '500px'
    });
  }

  preload(): void {
    const bImage: HTMLImageElement = new Image();
    bImage.src = this.imageUrl;

    bImage.onload = () => {
      let bElement = document.querySelector('#bg') as HTMLElement;
      bElement.style.backgroundImage = `url(${bImage.src})`;
    }
  }

  ngOnInit(): void {
    this.preload();
  }
}
