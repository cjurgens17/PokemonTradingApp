import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, delay, map } from "rxjs";
import { SignUpService } from "src/app/sign-up/sign-up.service";



export const uniqueUsernameValidator = (
  signUpService: SignUpService
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return signUpService.usernameExist(control?.value)
    .pipe(
      map(resp => {
        return resp ? {checkUsername: true} : null;
      }),
      delay(2200)
    )
  };
}
