import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-home',
  template: `
    <h4>User Profile</h4>
    <hr>
    <button (click)="togglePokemon()">{{showPokemon ? 'Hide' : 'Show'}} Pokemon</button>
    <app-profile-card *ngIf="showPokemon"></app-profile-card>
    `,
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  showPokemon: boolean = false;

  constructor() { }

  togglePokemon(): void {
    this.showPokemon = !this.showPokemon;
  }

  ngOnInit(): void {
  }

}