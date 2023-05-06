import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

  export const confirmPasswordValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === control.parent?.get('password')?.value ? null : { passwordMismatch: true }
  };
}
