// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { SignUpComponent } from './sign-up.component';

// describe('SignUpComponent', () => {
//   let component: SignUpComponent;
//   let fixture: ComponentFixture<SignUpComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ SignUpComponent ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(SignUpComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {  delay, of } from 'rxjs';
import { SignUpComponent } from './sign-up.component';
import { SignUpService } from './sign-up.service';
import { UserLoginService } from '../user-login/user-login-service';
import { User } from './user-info';
import { UserLogin } from '../user-login/user-login';
import { Register } from './register';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockSignUpService: jasmine.SpyObj<SignUpService>;
  let mockUserLoginService: jasmine.SpyObj<UserLoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
     mockSignUpService = jasmine.createSpyObj('SignUpService', ['postUser', 'emailExist', 'usernameExist']);
     mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['loginUser', 'setCurrentUser']);
     mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignUpComponent],
      providers: [
        { provide: SignUpService, useValue: mockSignUpService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: Router, useValue:  mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    // mockSignUpService = TestBed.inject(SignUpService) as jasmine.SpyObj<SignUpService>;
    // mockUserLoginService = TestBed.inject(UserLoginService) as jasmine.SpyObj<UserLoginService>;
    // mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a new user', () => {
    //Arrange
    const registerUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthDate: new Date(),
      username: 'johndoe',
      password: 'password',
      id: null,
      phoneNumber: null,
      profilePicture: null,
      pokeBalls: null,
      timer: null
    };

    const loginInfo: UserLogin = {
      username: '',
      password: '',
    };

    const postUser: Register = {
      firstName: '',
      lastName: '',
      email: '',
      birthDate: new Date(),
      username: '',
      password: ''
    }

    const userLoginInfo: User = {
      username: 'johndoe',
      password: 'password',
      id: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      birthDate: null,
      profilePicture: null,
      pokeBalls: null,
      timer: null
    };

    const email = true;
    const username = true;

    component.signUpForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthDate: new Date(),
      username: 'johndoe',
      password: 'password',
      confirmPassword: 'password'
    });

    //Act
    component.register();
    mockSignUpService.emailExist.and.returnValue(of(email));
    mockSignUpService.usernameExist.and.returnValue(of(username) as any)
    mockSignUpService.postUser.and.returnValue(of(registerUser));
    mockUserLoginService.loginUser.and.returnValue(of(userLoginInfo));



    //Assert
    expect(mockSignUpService.postUser).toHaveBeenCalledWith(postUser);
    expect(mockUserLoginService.loginUser).toHaveBeenCalledWith(loginInfo);
    expect(mockUserLoginService.setCurrentUser).toHaveBeenCalledWith(userLoginInfo);
    expect(mockSignUpService.emailExist).toHaveBeenCalledWith('john.doe@example.com')
    expect(mockSignUpService.usernameExist).toHaveBeenCalledWith('johndoe')
    expect(mockRouter.navigate).toHaveBeenCalledWith(['userprofile']);
  });

  // Add more tests for different scenarios, form validations, error handling, etc.
});
