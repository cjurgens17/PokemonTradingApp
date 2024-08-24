import { Component, OnDestroy } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, of, takeUntil, tap } from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css'],
})
export class ProfilePictureComponent implements OnDestroy {
  reactivePicture!: string;

  private ngUnsubscribe = new Subject<void>();

  private staticProfilePictures: string[] = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_KaFyA-TtPrTCvgk8q0pENl8s-1p7xkrQbQ&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWiPo3r0e_dKyc7bOEEnoPeba3qr192FzglA&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShKaHnive_AZlTROwK4iN_dO4sZg7EMD4mx8g7whZueNHTHw8sFm_zQzGjJhvutiSiyOU&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsv6R7eGkka776QF82jdyYEumBP1TxKCxq8w&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm7pvYTWej-HA-conc54lKZ96Bx3ghbmOwIg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1_qa0481nEWJQKfrY-aUHKISLPafFZQPzSQ&usqp=CAU',
  ];

  profilePictures$: Observable<string[]> = of(this.staticProfilePictures);

  constructor(
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProfilePictureComponent>
  ) {}
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  //---------------Functions----------------------------------
  changeProfilePicture(selectedPicture: string): void {
    let userId = JSON.parse(localStorage.getItem('userLoginInfo') || '{}').id;
    this.userProfileService
      .updateUserProfilePicture(userId, selectedPicture)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => {
          this.pictureChangedSnackBar('Profile Picture Changed!', 'Close');
          this.userProfileService.updateProfilePictureSubject(selectedPicture);
        }),
        catchError((error) => {
          console.error('Error updating profile picture:', error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  transferPicture(picture: string): void {
    this.reactivePicture = picture;
  }

  //-------------------SNACKBAR------------------
  pictureChangedSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 5000,
      data: this.dialogRef,
    });
    this.dialogRef.close();
    return snackBarRef;
  }
}
