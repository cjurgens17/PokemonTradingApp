// import { TestBed } from '@angular/core/testing';

// import { SignUpService } from './sign-up.service';

// describe('SignUpService', () => {
//   let service: SignUpService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(SignUpService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });


import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SignUpService } from './sign-up.service';
import { Register } from './register';
import { User } from './user-info';

describe('SignUpService', () => {
  let service: SignUpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignUpService],
    });
    service = TestBed.inject(SignUpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postUser', () => {
    it('should send a POST request to create a new user', () => {
      const registerUser: Register = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        birthDate: new Date(),
        username: 'johndoe',
        password: 'password',
      };

      const expectedUser: User = {
        id: 1, ...registerUser,
        phoneNumber: null,
        profilePicture: null,
        pokeBalls: null,
        timer: null
      };

      service.postUser(registerUser).subscribe((user) => {
        expect(user).toEqual(expectedUser);
      });

      const req = httpTestingController.expectOne('http://localhost:8080/user/new');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerUser);
      req.flush(expectedUser);
    });
  });

  describe('emailExist', () => {
    it('should send a GET request to check if an email exists', () => {
      const email = 'john.doe@example.com';

      service.emailExist(email).subscribe((exists) => {
        expect(exists).toBeTrue();
      });

      const req = httpTestingController.expectOne(`http://localhost:8080/user/${email}/checkEmail`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });

  describe('usernameExist', () => {
    it('should send a GET request to check if a username exists', () => {
      const username = 'johndoe';

      service.usernameExist(username).subscribe((exists) => {
        expect(exists).toBeFalse();
      });

      const req = httpTestingController.expectOne(`http://localhost:8080/user/${username}/checkUsername`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });
});
