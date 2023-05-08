import { AbstractControl, ValidationErrors } from "@angular/forms";

export function wordLengthValidator(control: AbstractControl): ValidationErrors | null {
const words = control?.value.split(' ');
return words.length > 75 ? {wordLength: true} : null;



}
