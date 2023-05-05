import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/password.validator';
import { usernameValidator } from '../validators/username.validator';





@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  hide:boolean = true;
  hide2:boolean = true;
  postError:boolean = false;


  signUpForm = new FormGroup ({
    firstName: new FormControl('', [Validators.required,Validators.maxLength(15), Validators.pattern('^[a-zA-Z]+$')]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), usernameValidator]),
    password: new FormControl('', [Validators.required, passwordValidator]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor() { }

  register(): void {
    //check for validity
    if(this.signUpForm.invalid){
      this.postError = true;
      return;
    }


  }

  ngOnInit(): void {
  }

}
