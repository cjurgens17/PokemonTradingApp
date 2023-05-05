import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  title = 'Pokemon Trading';

  constructor() { }

  logout(): void {
    console.log(localStorage);
    localStorage.clear();
    console.log(localStorage);
  }

  ngOnInit(): void {
  }

}
