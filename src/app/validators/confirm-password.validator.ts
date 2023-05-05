import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


  // export function confirmPasswordValidator(group: AbstractControl): ValidationErrors | null {

  //   const originalPassword: string = group.get('password')?.value;
  //   const confirmPassword: string = group.get('confirmPassword')?.value;


  //   if(originalPassword && confirmPassword){
  //     const match: boolean = originalPassword === confirmPassword;

  //     return match ? null : {passwordMismatch : true};
  //   }

  //   return null;
  // }

  export const confirmPasswordValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === control.parent?.get('password')?.value ? null : { passwordMismatch: true }
    };
  };


