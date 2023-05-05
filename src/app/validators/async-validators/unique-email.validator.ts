import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, delay, map } from "rxjs";
import { SignUpService } from "src/app/sign-up/sign-up.service";


export const uniqueEmailValidator = (
  signUpService: SignUpService
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return signUpService.emailExist(control?.value)
    .pipe(
      map(resp => {
        return resp ? {checkEmail: true} : null;
      }),
      delay(2200)
    )
  };
}
