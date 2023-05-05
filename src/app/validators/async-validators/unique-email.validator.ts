import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, delay, map } from "rxjs";
import { UserService } from "src/app/user-info/user-service";


export const uniqueEmailValidator = (
  userService: UserService
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.emailExist(control?.value)
    .pipe(
      map(resp => {
        return resp ? {checkEmail: true} : null;
      }),
      delay(2200)
    )
  };
}
